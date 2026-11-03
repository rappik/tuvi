'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { TimeView } from './TimeNav';
import {
  formatPalaceShort,
  formatStarName,
  formatSiHua,
  PALACE_VI_MAP,
} from '@/lib/ziwei/vietnamese';
import { getUserApiConfig } from '@/lib/storage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean; // don't show user bubble for auto/topic messages
}

interface SelectedSiHua {
  starName: string;
  siHua: string;
  view: TimeView;
}

interface InsightPanelProps {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
  selectedSiHua?: SelectedSiHua | null;
}

const TOPICS = [
  { key: 'overview',     label: 'Mệnh Cách' },
  { key: 'love',        label: 'Tình Duyên' },
  { key: 'career',      label: 'Sự Nghiệp' },
  { key: 'wealth',      label: 'Tài Vận' },
  { key: 'health',      label: 'Sức Khỏe' },
  { key: 'personality', label: 'Tính Cách' },
] as const;

const TOPIC_PROMPTS: Record<string, string> = {
  overview: `Xin vui lòng tổng quan luận giải mệnh cách theo hệ thống Tử Vi Nghê Hải Hạ:

**【Định Tính Mệnh Cách】**
Đúc kết ngắn gọn cốt cách và phong thái của đương số trong một câu.

**【Luận Giải Chính Tinh】**
Phân tích đặc tính chính tinh thủ Mệnh, đối chiếu quan điểm của Thầy Nghê Hải Hạ.

**【Tam Phương Tứ Chính】**
Liên kết Mệnh - Tài - Quan - Di, đánh giá mức độ hội tụ cát tinh và sát tinh.

**【Đại Hạn Hiện Tại】**
Định hướng vận thế 10 năm hiện tại và điểm then chốt cần chú ý.

**【Ưu Thế & Lời Khuyên】**
Thiên phú bẩm sinh và bài học cuộc đời cần tôi luyện.`,

  love: `Xin vui lòng phân tích chuyên sâu vận tình duyên hôn nhân:

**【Cốt Cách Tình Duyên】**
Định tính một câu về đường tình cảm, hôn nhân.

**【Phân Tích Cung Phu Thê】**
Chính tinh, phụ tinh, tứ hóa tại Phu Thê theo hệ thống Nghê Hải Hạ.

**【Tam Phương Liên Động】**
Tác động từ Phúc Đức, Thiên Di, Quan Lộc đến đời sống tình cảm.

**【Vận Hạn Hôn Nhân】**
Xu hướng tình cảm trong 10 năm đại hạn hiện tại và thời điểm cát lành.

**【Lời Khuyên Hóa Giải】**
Lời khuyên thực tế để giữ gìn hòa khí và hạnh phúc gia đạo.`,

  career: `Xin vui lòng phân tích sự nghiệp và công danh:

**【Cốt Cách Sự Nghiệp】**
Định tính xu hướng: thích hợp làm công chức, chuyên môn kỹ thuật hay tự lập kinh doanh.

**【Phân Tích Cung Quan Lộc】**
Chính tinh, tứ hóa và vị thế sao tại Quan Lộc.

**【Liên Động Tài Bạch】**
Mối quan hệ giữa sự nghiệp và nguồn tiền tài, đường phát triển lâu dài.

**【Đại Hạn Sự Nghiệp】**
Xu hướng phát triển công việc trong đại hạn hiện tại.

**【Chiến Lược Hành Động】**
Ngành nghề phù hợp nhất và chiến lược hành động hiệu quả.`,

  wealth: `Xin vui lòng phân tích chuyên sâu tài vận:

**【Hình Thái Tài Vận】**
Nguồn tài lộc chủ động (chuyên môn, làm việc) hay thụ động (đầu tư, tài sản).

**【Phân Tích Cung Tài Bạch】**
Chính tinh, tứ hóa tại Tài Bạch, phương thức tụ tài và tiêu tài.

**【Cung Điền Trạch (Kho Tài)】**
Khả năng tích lũy tài sản thực tế và cơ duyên bất động sản.

**【Đại Hạn Tài Vận】**
Xu hướng tài chính 10 năm hiện nay và điểm lưu ý rủi ro.

**【Lời Khuyên Quản Lý Tài Chính】**
Chiến lược phân bổ và giữ gìn tài sản.`,

  health: `Xin vui lòng phân tích sức khỏe và tạng phủ:

**【Chính Tinh Cung Tật Ách】**
Ý nghĩa các sao tại Tật Ách đối với thể chất và tạng phủ bẩm sinh.

**【Nguy Cơ Tiềm Ẩn】**
Kết hợp lý thuyết ngũ hành tạng phủ và Tý Ngọ Lưu Chú của Thầy Nghê Hải Hạ.

**【Xu Hướng Vận Hạn】**
Điểm cần lưu ý về sức khỏe trong đại hạn hiện tại.

**【Phương Pháp Dưỡng Sinh】**
Lời khuyên ăn uống, điều hòa lối sống và phòng ngừa thực tế.`,

  personality: `Xin vui lòng phân tích tính cách và nội tâm:

**【Tính Cách Bản Ngã】**
Đặc trưng tâm lý cốt lõi từ chính tinh Mệnh Cung.

**【Tam Phương Đa Chiều】**
Ảnh hưởng qua lại từ Tài, Quan, Di tạo nên bức tranh toàn cảnh tính cách.

**【Phương Thức Xã Giao】**
Cách tương tác với thế giới bên ngoài, ưu và khuyết điểm trong giao tiếp.

**【Bài Học Tu Dưỡng】**
Thiên phú cần phát huy và những góc khuất cần điều chỉnh.`,
};

/** Render AI markdown: **【Title】** → gold header, **bold** → strong */
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-0.5 first:pt-0">
              <span className="text-[11.5px] font-semibold tracking-wide" style={{ color: 'var(--t-gold)' }}>
                【{sectionMatch[1]}】
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>
            {parts.map((part, j) =>
              j % 2 === 0
                ? part
                : <strong key={j} className="font-semibold" style={{ color: 'var(--t-text)' }}>{part}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span
          className="inline-block w-1.5 h-3 ml-0.5 animate-pulse rounded-sm align-middle"
          style={{ background: 'var(--t-gold)', opacity: 0.6 }}
        />
      )}
    </div>
  );
}

export default function InsightPanel({ chart, selectedPalace, selectedSiHua }: InsightPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('overview');
  const messagesRef = useRef<Message[]>([]); // always-current copy for closures
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastPalaceBranch = useRef<number | undefined>(undefined);
  const lastSiHuaKey = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep refs in sync
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-generate 命格总览 on mount
  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    sendMessage(TOPIC_PROMPTS.overview, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject palace analysis when palace selected
  useEffect(() => {
    if (!selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;

    const majorStars = selectedPalace.stars.filter(s => s.type === 'major');
    const starDesc = majorStars.length > 0
      ? majorStars.map(s => `${formatStarName(s.name)}${s.siHua ? ' Hóa ' + formatSiHua(s.siHua, true) : ''}`).join('、')
      : 'Vô Chính Diệu (mượn sao từ Đối Cung)';
    const palaceNameVi = formatPalaceShort(selectedPalace.name);
    const role = PALACE_VI_MAP[selectedPalace.name]?.meaning ?? '';

    const prompt = `Xin vui lòng phân tích trọng điểm【${palaceNameVi} Cung】(Chủ quản: ${role}), chính tinh tọa thủ là ${starDesc}:

**【Định Tính Cung Vị】**
Ý nghĩa của ${palaceNameVi} Cung trong toàn bàn và đánh giá tổ hợp tinh diệu này.

**【Luận Giải Chính Tinh】**
Chính tinh tại cung này theo quan điểm của Thầy Nghê Hải Hạ 《Thiên Kỷ》.

**【Tam Phương Tứ Chính Hội Chiếu】**
Tác động tương hỗ từ các cung vị đối xung và tam hợp.

**【Lời Khuyên Thực Tế】**
Lời khuyên cụ thể để đương số phát huy cát lợi và hóa giải hung hiểm.`;

    sendMessage(prompt, true);
  }, [selectedPalace]); // eslint-disable-line react-hooks/exhaustive-deps

  // 注入四化飞化分析
  useEffect(() => {
    if (!selectedSiHua) return;
    const key = `${selectedSiHua.starName}-${selectedSiHua.siHua}-${selectedSiHua.view}`;
    if (key === lastSiHuaKey.current) return;
    lastSiHuaKey.current = key;

    const palaceOfStar = chart.palaces.find(p =>
      p.stars.some(s => s.name === selectedSiHua.starName)
    );
    const palaceNameVi = palaceOfStar ? formatPalaceShort(palaceOfStar.name) : 'Cung Vị';
    const viewLabel = selectedSiHua.view === 'daxian' ? 'Đại Hạn' : 'Lưu Niên';
    const starNameVi = formatStarName(selectedSiHua.starName);
    const siHuaNameVi = formatSiHua(selectedSiHua.siHua);

    const prompt = `Xin phân tích tác động phi hóa của【${viewLabel} ${starNameVi} ${siHuaNameVi}】:

**【Ý Nghĩa Cốt Lõi】**
Ý nghĩa cơ bản của ${siHuaNameVi} và trường hợp cụ thể khi đi cùng ${starNameVi}.

**【Tác Động Nhập Cung】**
${starNameVi} ${siHuaNameVi} đóng tại【${palaceNameVi} Cung】, tác động thế nào đến lĩnh vực chủ quản của cung này.

**【Tam Phương Tứ Chính】**
Đường bay phi hóa tác động đến đối cung và hai cung tam hợp.

**【Ảnh Hưởng Vận Khí Hiện Tại】**
Dưới góc độ ${viewLabel}, ảnh hưởng cụ thể tới đương số trong giai đoạn này.

**【Lời Khuyên Ứng Biến】**
Hành động thực tế phù hợp để đón lộc hoặc phòng ngừa trở ngại.`;

    sendMessage(prompt, true);
  }, [selectedSiHua]); // eslint-disable-line react-hooks/exhaustive-deps

  const streamResponse = async (apiMessages: { role: 'user' | 'assistant'; content: string }[]) => {
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chart,
          messages: apiMessages,
          userConfig: getUserApiConfig(),
        }),
      });
      if (res.status === 404) throw new Error('api-missing');
      if (!res.ok) throw new Error('Yêu cầu thất bại');
      if (!res.body) throw new Error('Không có luồng phản hồi');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const delta = JSON.parse(data).delta?.text ?? '';
            assistantText += delta;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: assistantText };
              return updated;
            });
          } catch { /* skip */ }
        }
      }
    } catch (e) {
      const missing = e instanceof Error && e.message === 'api-missing';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: missing
          ? 'Phiên bản mã nguồn mở không kèm sẵn API AI (/api/interpret). Bạn có thể cấu hình API key cá nhân theo hướng dẫn trong README. Bản thân công cụ lập lá số tử vi chạy hoàn toàn offline không cần API key.'
          : 'Quá trình luận giải gặp lỗi, vui lòng thử lại sau.'
      }]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const sendMessage = (text: string, hidden = false) => {
    if (!text.trim() || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const userMsg: Message = { role: 'user', content: text, hidden };
    const apiMessages = [...messagesRef.current, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    streamResponse(apiMessages);
  };

  const handleTopicClick = (topicKey: string) => {
    if (loadingRef.current) return;
    setActiveTopic(topicKey);
    sendMessage(TOPIC_PROMPTS[topicKey], true);
  };

  const handleSend = () => {
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden card-glass">

      {/* ── Topic buttons ── */}
      <div className="flex-shrink-0 px-2 pt-2.5 pb-2" style={{ borderBottom: '1px solid var(--t-border)' }}>
        <div className="grid grid-cols-6 gap-1">
          {TOPICS.map(t => {
            const isActive = activeTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => handleTopicClick(t.key)}
                disabled={loading}
                className="py-1.5 text-[10px] font-medium rounded-lg transition-all duration-150 disabled:opacity-40"
                style={{
                  background: isActive ? 'rgba(212,168,67,0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(212,168,67,0.3)' : 'var(--t-border)'}`,
                  color: isActive ? 'var(--t-gold)' : 'var(--t-faint)',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">

        {/* Loading state before first message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3" style={{ color: 'var(--t-gold)', opacity: 0.15 }}>✦</div>
            <p className="text-[11px] animate-pulse" style={{ color: 'var(--t-faint)' }}>Đang khởi tạo luận giải mệnh cách…</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            if (msg.role === 'user' && msg.hidden) return null;

            if (msg.role === 'user') {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div
                    className="max-w-[85%] rounded-xl px-3 py-2 text-[11px]"
                    style={{
                      background: 'rgba(212,168,67,0.08)',
                      border: '1px solid rgba(212,168,67,0.18)',
                      color: 'var(--t-gold)',
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              );
            }

            // Assistant message
            const isLastMsg = i === messages.length - 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className="text-[9.5px] tracking-widest mb-2 flex items-center gap-1.5 font-medium"
                  style={{ color: 'var(--t-faint)' }}
                >
                  <span style={{ color: 'var(--t-gold)', opacity: 0.6 }}>✦</span>
                  LUẬN GIẢI MỆNH LÝ
                </div>
                <AiContent text={msg.content} streaming={loading && isLastMsg} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2" style={{ borderTop: '1px solid var(--t-border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Hỏi thêm về lá số, ví dụ: Năm nay có nên đổi việc không?..."
            disabled={loading}
            className="flex-1 rounded-lg px-3 py-2 text-[11px] focus:outline-none transition-colors"
            style={{
              background: 'var(--t-card)',
              border: '1px solid var(--t-border)',
              color: 'var(--t-text)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3.5 py-2 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(212,168,67,0.15)',
              border: '1px solid rgba(212,168,67,0.25)',
              color: 'var(--t-gold)',
            }}
          >
            {loading ? '…' : 'Hỏi thêm'}
          </button>
        </div>
      </div>

    </div>
  );
}
