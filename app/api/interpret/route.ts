import { NextRequest } from 'next/server';
import { formatChartToText } from '@/lib/ai/formatter';
import { SYSTEM_PROMPT_INTERPRET } from '@/lib/ai/prompts';
import { streamAIResponse, type ChatMessage } from '@/lib/ai/service';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chart, messages, userConfig } = body;

    let systemPrompt = SYSTEM_PROMPT_INTERPRET;

    if (chart) {
      const chartContext = formatChartToText(chart);
      systemPrompt += `\n\n### BỐI CẢNH TINH BÀN ĐƯƠNG SỐ ĐANG LUẬN GIẢI:\n${chartContext}`;
    }

    const chatMessages: ChatMessage[] = Array.isArray(messages) && messages.length > 0
      ? messages.map((m: { role?: string; content?: string }) => ({
          role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
          content: String(m.content || ''),
        }))
      : [{ role: 'user' as const, content: 'Kính xin Đại Sư luận giải tổng quan mệnh cách lá số này.' }];

    return streamAIResponse(systemPrompt, chatMessages, userConfig);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Dữ liệu yêu cầu không hợp lệ.';
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
