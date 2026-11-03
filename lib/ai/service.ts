/**
 * AI Streaming Service
 * Hỗ trợ đa nhà cung cấp: Google Gemini (ưu tiên), DeepSeek, OpenAI.
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function createSSEStream(
  generator: (push: (text: string) => void) => Promise<void>
): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const push = (text: string) => {
        if (!text) return;
        const payload = JSON.stringify({ delta: { text } });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      };

      try {
        await generator(push);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Đã có lỗi xảy ra trong quá trình kết nối AI.';
        push(`\n\n> ⚠️ **Lỗi kết nối AI**: ${errorMsg}\n`);
      } finally {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}

/**
 * Xử lý gọi stream tới AI provider thích hợp dựa vào biến môi trường
 */
export async function streamAIResponse(
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<Response> {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const mimoKey = process.env.MIMO_API_KEY;

  // ─── 1. GOOGLE GEMINI API (Ưu tiên hàng đầu) ─────────────────────
  if (geminiKey) {
    return createSSEStream(async (push) => {
      const configuredModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      // Danh sách các mô hình dự phòng thông minh khi gặp 503 (quá tải đột xuất) hoặc 429
      const candidateModels = Array.from(new Set([
        configuredModel,
        'gemini-2.0-flash',
        'gemini-2.5-flash',
        'gemini-3-flash-preview',
        'gemini-3.5-flash',
      ]));

      // Chuyển đổi hội thoại sang định dạng contents của Gemini
      const contents = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const body = {
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: 'Bắt đầu luận giải.' }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      };

      let lastError: Error | null = null;

      for (const model of candidateModels) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${geminiKey}`;
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });

          // Nếu model đang quá tải tạm thời (503) hoặc vượt quota/không hỗ trợ (429, 404)
          // tự động thử sang model dự phòng kế tiếp
          if (res.status === 503 || res.status === 429 || res.status === 404) {
            const errText = await res.text();
            lastError = new Error(`Mô hình ${model} báo lỗi HTTP ${res.status}: ${errText}`);
            continue;
          }

          if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(`Gemini API trả về lỗi HTTP ${res.status}: ${errorBody}`);
          }

          if (!res.body) {
            throw new Error('Gemini API không trả về luồng dữ liệu.');
          }

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data: ')) continue;
              const jsonStr = trimmed.slice(6);
              if (jsonStr === '[DONE]') break;
              try {
                const data = JSON.parse(jsonStr);
                const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (textChunk) {
                  push(textChunk);
                }
              } catch {
                // bỏ qua dòng json phân mảnh
              }
            }
          }

          // Phản hồi thành công trọn vẹn, kết thúc
          return;
        } catch (err: unknown) {
          lastError = err instanceof Error ? err : new Error(String(err));
          // Tiếp tục vòng lặp thử model dự phòng
        }
      }

      if (lastError) {
        throw lastError;
      }
    });
  }

  // ─── 2. DEEPSEEK / OPENAI / MIMO (OpenAI Compatible) ─────────────
  if (deepseekKey || openaiKey || mimoKey) {
    const isDeepSeek = !!deepseekKey;
    const isMimo = !!mimoKey && !isDeepSeek;

    const apiKey = isDeepSeek ? deepseekKey : (isMimo ? mimoKey : openaiKey);
    let baseUrl = isDeepSeek
      ? (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1')
      : isMimo
        ? (process.env.MIMO_BASE_URL || 'https://api.mimo.org/v1')
        : (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1');

    baseUrl = baseUrl.replace(/\/+$/, '');
    const endpoint = `${baseUrl}/chat/completions`;

    const model = isDeepSeek
      ? (process.env.DEEPSEEK_MODEL || 'deepseek-chat')
      : isMimo
        ? (process.env.MIMO_MODEL || 'mimo')
        : (process.env.OPENAI_MODEL || 'gpt-4o-mini');

    return createSSEStream(async (push) => {
      const openAiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ];

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: openAiMessages,
          stream: true,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`API trả về lỗi HTTP ${res.status}: ${errorBody}`);
      }

      if (!res.body) {
        throw new Error('API không trả về luồng dữ liệu.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const jsonStr = trimmed.slice(6);
          if (jsonStr === '[DONE]') break;
          try {
            const data = JSON.parse(jsonStr);
            const content = data.choices?.[0]?.delta?.content;
            if (content) {
              push(content);
            }
          } catch {
            // bỏ qua
          }
        }
      }
    });
  }

  // ─── 3. CHƯA CÓ API KEY: HƯỚNG DẪN CHI TIẾT ───────────────────────
  return createSSEStream(async (push) => {
    push(`### ✦ Kích Hoạt Tính Năng Luận Giải Tử Vi Bằng AI

Hệ thống chưa tìm thấy **API Key** trong cấu hình môi trường (\`.env.local\`).

---

#### 🌟 Hướng Dẫn Cấu Hình Miễn Phí Với Google Gemini:
1. Truy cập **[Google AI Studio](https://aistudio.google.com/)** và đăng nhập bằng tài khoản Google.
2. Bấm nút **"Create API key"** (hoàn toàn miễn phí, hạn mức sử dụng cá nhân thoải mái).
3. Mở tệp tin \`.env.local\` trong thư mục dự án và thêm dòng:
   \`\`\`env
   GEMINI_API_KEY=khoá_api_của_bạn_ở_đây
   \`\`\`
4. Lưu tệp và làm mới lại trang web hoặc khởi động lại server (\`npm run dev\`).

*(Ngoài ra hệ thống cũng hỗ trợ \`DEEPSEEK_API_KEY\` hoặc \`OPENAI_API_KEY\` nếu bạn có sẵn).*`);
  });
}
