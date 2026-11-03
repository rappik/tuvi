import { NextRequest } from 'next/server';
import { formatHemingToText } from '@/lib/ai/formatter';
import { SYSTEM_PROMPT_HEMING } from '@/lib/ai/prompts';
import { streamAIResponse, type ChatMessage } from '@/lib/ai/service';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chartA, chartB, question } = body;

    if (!chartA || !chartB) {
      return new Response(JSON.stringify({ error: 'Cần cung cấp đủ 2 lá số để đối chiếu hợp số.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const hemingContext = formatHemingToText(chartA, chartB, question);
    const systemPrompt = `${SYSTEM_PROMPT_HEMING}\n\n### BỐI CẢNH TINH BÀN HAI ĐƯƠNG SỐ CẦN ĐỐI CHIẾU:\n${hemingContext}`;

    const userPrompt = question && String(question).trim().length > 0
      ? `Kính xin Đại Sư luận giải chi tiết sự tương hợp giữa hai lá số và giải đáp trọng tâm câu hỏi: "${question}"`
      : 'Kính xin Đại Sư luận giải tổng thể sự tương hợp duyên phận, khí chất, sự nghiệp và gia đạo giữa hai đương số.';

    const messages: ChatMessage[] = [
      { role: 'user', content: userPrompt },
    ];

    return streamAIResponse(systemPrompt, messages);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Dữ liệu yêu cầu không hợp lệ.';
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
