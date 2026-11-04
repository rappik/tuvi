'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { TimeView } from './TimeNav';
import {
  formatPalaceShort,
  formatPalaceName,
  formatStarName,
  formatSiHua,
  getPalaceRole,
  BRANCHES_VI,
  STEMS_VI,
} from '@/lib/ziwei/vietnamese';
import {
  getUserApiConfig,
  saveChartInsights,
  getSavedChartInsights,
} from '@/lib/storage';

export interface SelectedSiHua {
  starName: string;
  siHua: string;
  view: TimeView;
}

interface InsightPanelProps {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
  selectedSiHua?: SelectedSiHua | null;
}

interface TabState {
  content: string;
  status: 'idle' | 'loading' | 'done' | 'error';
  error?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Danh sách các tab chuyên đề cố định cần phân tích
export const TOPICS = [
  { key: 'overview',     label: 'Mệnh Cách',   icon: '✦', desc: 'Bản Mệnh & Cốt Cách' },
  { key: 'love',        label: 'Tình Duyên',  icon: '♡', desc: 'Hôn Nhân & Phu Thê' },
  { key: 'career',      label: 'Sự Nghiệp',   icon: '💼', desc: 'Công Danh & Quan Lộc' },
  { key: 'wealth',      label: 'Tài Vận',     icon: '💰', desc: 'Tài Bạch & Kho Điền Sản' },
  { key: 'health',      label: 'Sức Khỏe',    icon: '🩺', desc: 'Tật Ách & Dưỡng Sinh' },
] as const;

export type TopicKey = typeof TOPICS[number]['key'];
export type ActiveTabKey = TopicKey | 'palace' | 'chat';

const AUTO_PRELOAD_KEYS: TopicKey[] = ['overview', 'love', 'career', 'wealth', 'health'];

const TOPIC_PROMPTS: Record<TopicKey, string> = {
  overview: `Xin vui lòng luận giải chuyên sâu MỆNH CÁCH tổng quan theo hệ thống Tử Vi Nghê Hải Hạ 《Thiên Kỷ》:

**【Định Tính Mệnh Cách】**
Đúc kết ngắn gọn cốt cách, phong thái và tầm vóc cuộc đời của đương số trong 1-2 câu.

**【Luận Giải Chính Tinh Thủ Mệnh】**
Phân tích chi tiết đặc tính chính tinh tọa Mệnh, ngũ hành, miếu hãm và khí chất bẩm sinh theo quan điểm Thầy Nghê Hải Hạ.

**【Tam Phương Tứ Chính Hội Chiếu】**
Khảo sát trục Mệnh - Di và thế chân vạc Tài - Quan. Tác động của các cát tinh, sát tinh và tứ hóa năm sinh.

**【Đại Hạn 10 Năm Hiện Tại】**
Định hướng vận thế 10 năm hiện tại, cơ hội lớn nhất và điểm then chốt cần nắm bắt.

**【Kim Chỉ Nam Xu Cát Tị Hung】**
Thiên phú cần phát huy và những bài học tu dưỡng rèn luyện để cuộc đời hanh thông.`,

  love: `Xin vui lòng phân tích chuyên sâu TÌNH DUYÊN & HÔN NHÂN theo hệ thống Tử Vi Nghê Hải Hạ:

**【Cốt Cách Tình Duyên】**
Định tính một câu về duyên nợ, tính chất tình cảm và đời sống hôn nhân của đương số.

**【Phân Tích Cung Phu Thê】**
Ý nghĩa chính tinh, phụ tinh và tứ hóa tại cung Phu Thê. Diện mạo, tính tình và hoàn cảnh của người bạn đời.

**【Tam Phương Liên Động (Phúc Đức - Thiên Di - Quan Lộc)】**
Phúc đức dòng họ và môi trường bên ngoài tác động thế nào tới hạnh phúc lứa đôi.

**【Vận Trình Tình Cảm & Thời Điểm Cát Lành】**
Xu hướng tình duyên trong đại hạn hiện nay; thời vận thích hợp để kết duyên hoặc thắt chặt gia đạo.

**【Lời Khuyên Hóa Giải Bền Vững】**
Bí quyết ứng xử thực tế theo tư tưởng Nghê Sư để giữ gìn hòa khí, tránh khắc khẩu chia ly.`,

  career: `Xin vui lòng phân tích chuyên sâu SỰ NGHIỆP & CÔNG DANH theo hệ thống Tử Vi Nghê Hải Hạ:

**【Cốt Cách Sự Nghiệp】**
Định tính xu hướng: thích hợp làm chuyên môn kỹ thuật, công chức lãnh đạo hay tự lập kinh doanh đầu tư.

**【Phân Tích Cung Quan Lộc】**
Vị thế của các sao thủ Quan Lộc, mức độ hanh thông trên nấc thang danh vọng.

**【Liên Động Tài Bạch & Khả Năng Thăng Tiến】**
Sự gắn kết giữa uy quyền công việc và thành quả thu nhập thực tế.

**【Vận Trình Công Việc Trong Đại Hạn】**
Thời cơ bứt phá, thay đổi bước ngoặt hoặc nguy cơ biến động trong giai đoạn này.

**【Chiến Lược Hành Động Tối Ưu】**
Ngành nghề phù hợp nhất với bản mệnh và chiến lược phát triển sự nghiệp lâu dài.`,

  wealth: `Xin vui lòng phân tích chuyên sâu TÀI VẬN & TÍCH LŨY TÀI SẢN theo hệ thống Tử Vi Nghê Hải Hạ:

**【Hình Thái Nguồn Tài Lộc】**
Tài lộc chủ yếu đến từ chính tài (chuyên môn, lương bổng) hay thiên tài (đầu tư, kinh doanh mạo hiểm).

**【Phân Tích Cung Tài Bạch】**
Phương thức tụ tài, mức độ hanh thông của dòng tiền và thói quen chi dùng.

**【Cung Điền Trạch - Kho Cất Giữ Tài Sản】**
Cơ duyên bất động sản, đất đai, nhà cửa và khả năng tích lũy của cải thực tế về hậu vận.

**【Điểm Lưu Ý Rủi Ro Về Tiền Bạc】**
Những cạm bẫy tài chính, nguy cơ hao tán hoặc thời điểm cần thận trọng trong đầu tư.

**【Chiến Lược Quản Lý & Gia Tăng Tài Sản】**
Lời khuyên phân bổ tài chính thông minh để tài lộc tụ vững vàng.`,

  health: `Xin vui lòng phân tích chuyên sâu SỨC KHỎE & DƯỠNG SINH theo y lý Thầy Nghê Hải Hạ:

**【Chính Tinh Cung Tật Ách & Thể Chất Tiên Thiên】**
Đặc điểm thể trạng bẩm sinh và điểm mạnh yếu của cơ thể đương số.

**【Ngũ Hành Tạng Phủ Cần Lưu Tâm】**
Chiếu theo y lý Hoàng Đế Nội Kinh và quan điểm Thầy Nghê Hải Hạ (tạng phủ, khí huyết, kinh lạc dễ bị tổn thương).

**【Lưu Ý Vận Hạn Sức Khỏe】**
Những giai đoạn hoặc năm tháng cần đặc biệt chú ý giữ gìn thân thể, phòng ngừa tai ách.

**【Phương Pháp Dưỡng Sinh Thực Tế】**
Lời khuyên ăn uống, điều hòa nhịp sinh học, rèn luyện thể chất và tâm thái an lạc.`,
};

/** Render nội dung markdown Tử Vi chuẩn mực */
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        // Tiêu đề mục lớn: **【Tiêu Đề】**
        const sectionMatch = trimmed.match(/^\*\*【(.+?)】\*\*$/) || trimmed.match(/^###?\s*【?(.+?)】?$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-1 first:pt-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--t-gold)' }} />
                <span className="text-[12px] font-bold tracking-wide uppercase" style={{ color: 'var(--t-gold)' }}>
                  【{sectionMatch[1].replace(/【|】/g, '')}】
                </span>
              </div>
            </div>
          );
        }

        // Dòng gạch ngang
        if (trimmed === '---') {
          return <div key={i} className="my-2 border-t" style={{ borderColor: 'var(--t-border)' }} />;
        }

        if (trimmed === '') return <div key={i} className="h-1.5" />;

        // Danh sách gạch đầu dòng (* hoặc -)
        const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ');
        const cleanLine = isBullet ? trimmed.slice(2) : line;

        const parts = cleanLine.split(/\*\*(.+?)\*\*/);

        return (
          <div
            key={i}
            className={`text-[11.5px] leading-relaxed ${isBullet ? 'pl-3 relative' : ''}`}
            style={{ color: 'var(--t-text2)' }}
          >
            {isBullet && (
              <span className="absolute left-0 text-[10px]" style={{ color: 'var(--t-gold)' }}>
                •
              </span>
            )}
            {parts.map((part, j) =>
              j % 2 === 0 ? (
                part
              ) : (
                <strong key={j} className="font-semibold" style={{ color: 'var(--t-text)' }}>
                  {part}
                </strong>
              )
            )}
          </div>
        );
      })}
      {streaming && (
        <span
          className="inline-block w-1.5 h-3 ml-1 animate-pulse rounded-sm align-middle"
          style={{ background: 'var(--t-gold)', opacity: 0.7 }}
        />
      )}
    </div>
  );
}

export default function InsightPanel({ chart, selectedPalace, selectedSiHua }: InsightPanelProps) {
  const [activeTab, setActiveTab] = useState<ActiveTabKey>('overview');
  const [tabStates, setTabStates] = useState<Record<string, TabState>>(() => ({
    overview:     { content: '', status: 'idle' },
    love:         { content: '', status: 'idle' },
    career:       { content: '', status: 'idle' },
    wealth:       { content: '', status: 'idle' },
    health:       { content: '', status: 'idle' },
  }));

  // Cache phân tích cho 12 cung vị
  const [palaceCache, setPalaceCache] = useState<Record<number, string>>({});
  const [activePalace, setActivePalace] = useState<Palace | null>(null);
  const [palaceLoading, setPalaceLoading] = useState(false);

  // Tab Hỏi Đáp
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Controller để abort stream khi cần chuyển ưu tiên
  const abortControllerRef = useRef<AbortController | null>(null);
  const isFetchingRef = useRef(false);
  const lastPalaceBranch = useRef<number | undefined>(undefined);
  const lastSiHuaKey = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Tạo khóa nhận diện duy nhất cho lá số hiện tại
  const chartKey = `${chart.birthInfo.year}_${chart.birthInfo.month}_${chart.birthInfo.day}_${chart.birthInfo.hour}_${chart.birthInfo.gender}`;

  // ─── 1. Khôi phục dữ liệu đã lưu từ LocalStorage khi mount hoặc đổi lá số ───
  useEffect(() => {
    const saved = getSavedChartInsights(chartKey);
    if (saved && typeof saved === 'object') {
      setTabStates(prev => {
        const next = { ...prev };
        AUTO_PRELOAD_KEYS.forEach(key => {
          if (saved[key]?.content) {
            next[key] = {
              content: saved[key].content,
              status: 'done',
            };
          }
        });
        return next;
      });
      if (saved.__palaces) {
        setPalaceCache(saved.__palaces);
      }
    }
  }, [chartKey]);

  // ─── 2. Lắng nghe sự kiện xóa bộ nhớ từ SettingsModal ───
  useEffect(() => {
    const handleClear = () => {
      setTabStates({
        overview:     { content: '', status: 'idle' },
        love:         { content: '', status: 'idle' },
        career:       { content: '', status: 'idle' },
        wealth:       { content: '', status: 'idle' },
        health:       { content: '', status: 'idle' },
      });
      setPalaceCache({});
      setChatMessages([]);
    };
    window.addEventListener('ziwei-storage-cleared', handleClear);
    return () => window.removeEventListener('ziwei-storage-cleared', handleClear);
  }, []);

  // ─── 3. Hàm gọi stream luận giải cho 1 Tab cụ thể ───
  const fetchTopicContent = useCallback(async (
    topicKey: TopicKey,
    forceRefresh = false
  ) => {
    if (isFetchingRef.current) return;

    // Cập nhật trạng thái loading cho tab
    isFetchingRef.current = true;
    setTabStates(prev => ({
      ...prev,
      [topicKey]: { content: forceRefresh ? '' : (prev[topicKey]?.content || ''), status: 'loading' }
    }));

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const prompt = TOPIC_PROMPTS[topicKey];
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chart,
          messages: [{ role: 'user', content: prompt }],
          userConfig: getUserApiConfig(),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.delta?.text ?? '';
            fullText += delta;
            setTabStates(prev => ({
              ...prev,
              [topicKey]: { content: fullText, status: 'loading' }
            }));
          } catch {}
        }
      }

      // Đánh dấu tab đã tải xong và lưu vào localStorage
      setTabStates(prev => {
        const updated: Record<string, TabState> = {
          ...prev,
          [topicKey]: { content: fullText, status: 'done' }
        };
        saveChartInsights(chartKey, updated);
        return updated;
      });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Tác vụ bị hủy có chủ đích để ưu tiên tab khác
        setTabStates(prev => ({
          ...prev,
          [topicKey]: { ...prev[topicKey], status: 'idle' }
        }));
      } else {
        setTabStates(prev => ({
          ...prev,
          [topicKey]: {
            content: prev[topicKey]?.content || '',
            status: 'error',
            error: 'Không thể kết nối AI hoặc hết hạn ngạch. Vui lòng thử lại.'
          }
        }));
      }
    } finally {
      isFetchingRef.current = false;
      abortControllerRef.current = null;
    }
  }, [chart, chartKey]);

  // ─── 4. Vòng lặp tải dần các tab trong nền (Background Sequential Preloader) ───
  useEffect(() => {
    // Nếu đang có tab nào đang tải dở thì chờ
    if (isFetchingRef.current) return;

    // Tìm tab tiếp theo trong danh sách chưa tải (idle)
    const nextKey = AUTO_PRELOAD_KEYS.find(key => tabStates[key]?.status === 'idle');

    if (nextKey) {
      // Giãn cách nhẹ 350ms giữa các request để bảo vệ quota rate limit
      const timer = setTimeout(() => {
        if (!isFetchingRef.current) {
          fetchTopicContent(nextKey);
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [tabStates, fetchTopicContent]);

  // ─── 5. Khi người dùng click chọn Tab ───
  const handleTabSelect = (tabKey: ActiveTabKey) => {
    setActiveTab(tabKey);

    // Nếu người dùng chọn một tab chuyên đề chưa tải xong (idle), ưu tiên tải ngay
    if (AUTO_PRELOAD_KEYS.includes(tabKey as TopicKey)) {
      const topicKey = tabKey as TopicKey;
      if (tabStates[topicKey]?.status === 'idle') {
        // Hủy tác vụ ngầm hiện tại (nếu có) để dồn ưu tiên cho tab người dùng vừa chọn
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        // Gọi tải ngay
        setTimeout(() => fetchTopicContent(topicKey), 50);
      }
    }
  };

  // ─── 6. Xử lý khi click vào Cung Vị trên tinh bàn (`selectedPalace`) ───
  const fetchPalaceAnalysis = useCallback(async (palace: Palace) => {
    if (palaceCache[palace.branch]) {
      setActivePalace(palace);
      setActiveTab('palace');
      return;
    }

    setActivePalace(palace);
    setActiveTab('palace');
    setPalaceLoading(true);

    const majorStars = palace.stars.filter(s => s.type === 'major');
    const starDesc = majorStars.length > 0
      ? majorStars.map(s => `${formatStarName(s.name)}${s.siHua ? ' Hóa ' + formatSiHua(s.siHua, true) : ''}`).join('、')
      : 'Vô Chính Diệu (mượn sao từ Đối Cung)';
    const palaceNameVi = formatPalaceShort(palace.name);
    const role = getPalaceRole(palace.name);
    const branchName = BRANCHES_VI[palace.branch];
    const stemName = STEMS_VI[palace.stem];

    const prompt = `Xin vui lòng phân tích chuyên sâu trọng điểm【${palaceNameVi} Cung】tọa tại ${stemName} ${branchName} (Chức vị: ${role}), chính tinh tọa thủ là ${starDesc}:

**【Ý Nghĩa Cung Vị Trong Tinh Bàn】**
Vị thế của ${palaceNameVi} Cung và đánh giá tổng quan sự hội tụ của tổ hợp tinh diệu này.

**【Luận Giải Chính Tinh & Phụ Tinh】**
Phân tích cốt cách các sao tại cung theo giáo trình 《Thiên Kỷ》 Thầy Nghê Hải Hạ.

**【Tam Phương Tứ Chính Chiếu Xung】**
Tác động tương hỗ từ cung đối diện và hai cung tam hợp.

**【Lời Khuyên Xu Cát Tị Hung】**
Hành động thực tế để phát huy ưu thế và hóa giải trở ngại liên quan đến cung này.`;

    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chart,
          messages: [{ role: 'user', content: prompt }],
          userConfig: getUserApiConfig(),
        }),
      });

      if (!res.ok || !res.body) throw new Error('Yêu cầu thất bại');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            text += parsed.delta?.text ?? '';
            setPalaceCache(prev => ({ ...prev, [palace.branch]: text }));
          } catch {}
        }
      }

      setPalaceCache(prev => {
        const updated = { ...prev, [palace.branch]: text };
        // Lưu kèm vào cache lá số
        const existing = getSavedChartInsights(chartKey) || {};
        saveChartInsights(chartKey, { ...existing, __palaces: updated });
        return updated;
      });
    } catch {
      setPalaceCache(prev => ({
        ...prev,
        [palace.branch]: 'Không thể kết nối máy chủ AI để luận giải cung vị này. Vui lòng thử lại.'
      }));
    } finally {
      setPalaceLoading(false);
    }
  }, [chart, chartKey, palaceCache]);

  useEffect(() => {
    if (!selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;
    fetchPalaceAnalysis(selectedPalace);
  }, [selectedPalace, fetchPalaceAnalysis]);

  // ─── 7. Xử lý khi click vào Sao Tứ Hóa (`selectedSiHua`) ───
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

    const question = `Phân tích tác động phi hóa của ${viewLabel} ${starNameVi} ${siHuaNameVi} tại ${palaceNameVi} Cung?`;
    setActiveTab('chat');
    sendChatMessage(question);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSiHua]);

  // ─── 8. Xử lý gửi tin nhắn trong Tab Hỏi Đáp ───
  const sendChatMessage = async (text: string) => {
    if (!text.trim() || chatLoading) return;
    const userMsg: ChatMessage = { role: 'user', content: text };
    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chart,
          messages: newHistory,
          userConfig: getUserApiConfig(),
        }),
      });

      if (!res.ok || !res.body) throw new Error('Yêu cầu thất bại');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setChatMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            assistantText += parsed.delta?.text ?? '';
            setChatMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: assistantText };
              return updated;
            });
          } catch {}
        }
      }
    } catch {
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Quá trình phản hồi gặp sự cố, vui lòng thử lại sau.' }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCopyContent = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Tính số lượng tab đã hoàn tất tải
  const completedCount = AUTO_PRELOAD_KEYS.filter(k => tabStates[k]?.status === 'done').length;
  const isPreloadingAny = AUTO_PRELOAD_KEYS.some(k => tabStates[k]?.status === 'loading');

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border shadow-sm transition-all card-glass"
      style={{
        background: 'var(--t-card)',
        borderColor: 'var(--t-border)',
        minHeight: '620px',
      }}
    >
      {/* ── TOP HEADER: Tiêu đề + Thanh Tiến Trình Tải Dần ── */}
      <div className="flex-shrink-0 px-3.5 pt-3 pb-2.5 border-b" style={{ borderColor: 'var(--t-border)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm" style={{ color: 'var(--t-gold)' }}>✦</span>
            <h3 className="text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--t-gold)' }}>
              Luận Giải Tử Vi Đẩu Số AI
            </h3>
          </div>

          {/* Trạng thái tải ngầm tổng quan */}
          <div className="flex items-center gap-1.5 text-[10px]">
            {isPreloadingAny ? (
              <span className="flex items-center gap-1 font-medium animate-pulse" style={{ color: 'var(--t-gold)' }}>
                <span className="inline-block w-2 h-2 rounded-full border border-current border-t-transparent animate-spin" />
                <span>Đang tải dần các mục ({completedCount}/5)...</span>
              </span>
            ) : completedCount === 5 ? (
              <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <span>✓</span>
                <span>Đã nạp đủ 5 chuyên mục</span>
              </span>
            ) : (
              <span style={{ color: 'var(--t-faint)' }}>
                Sẵn sàng {completedCount}/5 mục
              </span>
            )}
          </div>
        </div>

        {/* ── THANH TAB PHÂN CHỦ ĐỀ (Responsive Navigation) ── */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {TOPICS.map(t => {
            const state = tabStates[t.key];
            const isActive = activeTab === t.key;
            const isDone = state?.status === 'done';
            const isLoading = state?.status === 'loading';
            const isError = state?.status === 'error';

            return (
              <button
                key={t.key}
                type="button"
                onClick={() => handleTabSelect(t.key)}
                className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 whitespace-nowrap flex-shrink-0 cursor-pointer ${
                  isActive ? 'shadow-sm font-semibold' : 'hover:opacity-85'
                }`}
                style={{
                  background: isActive ? 'rgba(212,168,67,0.18)' : 'var(--t-surface)',
                  border: `1px solid ${isActive ? 'rgba(212,168,67,0.45)' : 'var(--t-border)'}`,
                  color: isActive ? 'var(--t-gold)' : 'var(--t-text2)',
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>

                {/* Badge trạng thái tải trên tab */}
                {isLoading && (
                  <span
                    className="w-2 h-2 rounded-full border border-amber-500 border-t-transparent animate-spin ml-0.5"
                    title="Đang tải luận giải trong lúc bạn xem..."
                  />
                )}
                {isDone && !isLoading && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5"
                    title="Đã tải xong, xem ngay lập tức"
                  />
                )}
                {isError && (
                  <span className="text-[10px] text-red-500 ml-0.5" title="Gặp lỗi tải">!</span>
                )}
              </button>
            );
          })}

          {/* Tab Cung Vị (Tự động kích hoạt khi chọn cung trên tinh bàn) */}
          {activePalace && (
            <button
              type="button"
              onClick={() => handleTabSelect('palace')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'palace' ? 'shadow-sm font-semibold' : 'hover:opacity-85'
              }`}
              style={{
                background: activeTab === 'palace' ? 'rgba(56,189,248,0.16)' : 'var(--t-surface)',
                border: `1px solid ${activeTab === 'palace' ? 'rgba(56,189,248,0.45)' : 'var(--t-border)'}`,
                color: activeTab === 'palace' ? '#0284c7' : 'var(--t-text2)',
              }}
            >
              <span>🎯</span>
              <span>Cung {formatPalaceShort(activePalace.name)}</span>
              {palaceLoading && (
                <span className="w-2 h-2 rounded-full border border-sky-500 border-t-transparent animate-spin ml-0.5" />
              )}
            </button>
          )}

          {/* Tab Hỏi Đáp (Chat tự do) */}
          <button
            type="button"
            onClick={() => handleTabSelect('chat')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'chat' ? 'shadow-sm font-semibold' : 'hover:opacity-85'
            }`}
            style={{
              background: activeTab === 'chat' ? 'rgba(212,168,67,0.18)' : 'var(--t-surface)',
              border: `1px solid ${activeTab === 'chat' ? 'rgba(212,168,67,0.45)' : 'var(--t-border)'}`,
              color: activeTab === 'chat' ? 'var(--t-gold)' : 'var(--t-text2)',
            }}
          >
            <span>💬</span>
            <span>Hỏi Đáp</span>
            {chatMessages.length > 0 && (
              <span className="text-[9px] px-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                {chatMessages.filter(m => m.role === 'user').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── NỘI DUNG TỪNG TAB ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        <AnimatePresence mode="wait">
          {/* 1. NẾU ĐANG CHỌN CÁC TAB CHUYÊN ĐỀ (Mệnh, Tình duyên, Sự nghiệp...) */}
          {AUTO_PRELOAD_KEYS.includes(activeTab as TopicKey) && (() => {
            const currentKey = activeTab as TopicKey;
            const currentTabState = tabStates[currentKey];
            const topicInfo = TOPICS.find(t => t.key === currentKey)!;

            if (currentTabState.status === 'idle') {
              return (
                <motion.div
                  key={`idle-${currentKey}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-center space-y-3"
                >
                  <div className="text-3xl" style={{ color: 'var(--t-gold)', opacity: 0.3 }}>
                    {topicInfo.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold mb-1" style={{ color: 'var(--t-text)' }}>
                      Chuyên mục: {topicInfo.label}
                    </h4>
                    <p className="text-[11px] max-w-xs mx-auto" style={{ color: 'var(--t-faint)' }}>
                      Hệ thống đang xếp hàng tải ngầm mục này trong lúc bạn đọc các phần khác.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchTopicContent(currentKey, true)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                    style={{ background: 'var(--t-gold)' }}
                  >
                    ⚡ Luận Giải Ngay Mục Này
                  </button>
                </motion.div>
              );
            }

            if (currentTabState.status === 'error') {
              return (
                <motion.div
                  key={`err-${currentKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-xl border text-center space-y-2.5"
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <div className="text-red-500 font-semibold text-xs">⚠️ {currentTabState.error}</div>
                  <button
                    type="button"
                    onClick={() => fetchTopicContent(currentKey, true)}
                    className="px-3 py-1 text-xs rounded-lg border font-medium hover:opacity-80"
                    style={{ borderColor: 'var(--t-border)', color: 'var(--t-text)' }}
                  >
                    Thử Lại
                  </button>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={`content-${currentKey}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {/* Thanh công cụ phụ của từng tab */}
                <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--t-border)' }}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs" style={{ color: 'var(--t-gold)' }}>{topicInfo.icon}</span>
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--t-gold)' }}>
                      LUẬN {topicInfo.label.toUpperCase()} · {topicInfo.desc}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Nút Copy */}
                    <button
                      type="button"
                      onClick={() => handleCopyContent(currentTabState.content, currentKey)}
                      disabled={!currentTabState.content}
                      className="px-2 py-0.5 rounded text-[10px] border transition-colors hover:opacity-80"
                      style={{ borderColor: 'var(--t-border)', color: 'var(--t-faint)' }}
                      title="Sao chép bài luận giải"
                    >
                      {copiedKey === currentKey ? '✓ Đã chép' : '📋 Chép'}
                    </button>

                    {/* Nút Làm Mới */}
                    <button
                      type="button"
                      onClick={() => fetchTopicContent(currentKey, true)}
                      disabled={currentTabState.status === 'loading'}
                      className="px-2 py-0.5 rounded text-[10px] border transition-colors hover:opacity-80 disabled:opacity-40"
                      style={{ borderColor: 'var(--t-border)', color: 'var(--t-faint)' }}
                      title="Luận giải lại góc nhìn mới"
                    >
                      🔄 Tạo lại
                    </button>
                  </div>
                </div>

                {/* Nội dung bài phân tích */}
                <div className="py-1">
                  <AiContent
                    text={currentTabState.content}
                    streaming={currentTabState.status === 'loading'}
                  />
                </div>

                {/* Gợi ý hỏi thêm về chuyên mục này */}
                {currentTabState.status === 'done' && (
                  <div
                    className="p-2.5 rounded-xl border mt-4 flex items-center justify-between gap-2"
                    style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
                  >
                    <span className="text-[10.5px]" style={{ color: 'var(--t-faint)' }}>
                      Có câu hỏi riêng về {topicInfo.label.toLowerCase()} của lá số?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('chat');
                        setChatInput(`Tôi muốn hỏi sâu thêm về phương diện ${topicInfo.label.toLowerCase()}: `);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold border hover:opacity-85 whitespace-nowrap"
                      style={{
                        background: 'rgba(212,168,67,0.12)',
                        borderColor: 'rgba(212,168,67,0.3)',
                        color: 'var(--t-gold)'
                      }}
                    >
                      💬 Hỏi AI Ngay
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })()}

          {/* 2. NẾU ĐANG CHỌN TAB CUNG VỊ (Click từ tinh bàn 12 cung) */}
          {activeTab === 'palace' && activePalace && (
            <motion.div
              key={`palace-${activePalace.branch}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--t-border)' }}>
                <div>
                  <span className="text-[11.5px] font-bold text-sky-600 dark:text-sky-400">
                    CUNG {formatPalaceName(activePalace.name).toUpperCase()}
                  </span>
                  <span className="text-[10px] ml-2" style={{ color: 'var(--t-faint)' }}>
                    (Cung Vị: {BRANCHES_VI[activePalace.branch]})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchPalaceAnalysis(activePalace)}
                  disabled={palaceLoading}
                  className="px-2 py-0.5 rounded text-[10px] border hover:opacity-80"
                  style={{ borderColor: 'var(--t-border)', color: 'var(--t-faint)' }}
                >
                  🔄 Luận lại cung này
                </button>
              </div>

              <AiContent
                text={palaceCache[activePalace.branch] || ''}
                streaming={palaceLoading}
              />
            </motion.div>
          )}

          {/* 3. NẾU ĐANG CHỌN TAB HỎI ĐÁP (Chat tự do) */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {chatMessages.length === 0 ? (
                <div className="py-6 text-center space-y-3">
                  <div className="text-3xl" style={{ color: 'var(--t-gold)', opacity: 0.25 }}>💬</div>
                  <div>
                    <h4 className="text-xs font-semibold" style={{ color: 'var(--t-text)' }}>
                      Trò Chuyện Hỏi Đáp Lá Số
                    </h4>
                    <p className="text-[11px] max-w-xs mx-auto mt-1" style={{ color: 'var(--t-faint)' }}>
                      Bạn có thể đặt bất kỳ câu hỏi nào về tình duyên, sự nghiệp, các đại hạn lưu niên hoặc phong thủy nơi ở.
                    </p>
                  </div>

                  {/* Các câu hỏi mẫu */}
                  <div className="flex flex-col gap-1.5 pt-2 max-w-xs mx-auto text-left">
                    {[
                      'Năm nay tôi có cơ duyên thay đổi việc làm hoặc khởi nghiệp không?',
                      'Đặc trưng người bạn đời tương lai của tôi như thế nào?',
                      'Về phương diện đầu tư tài chính và mua nhà đất thời điểm nào thuận lợi?',
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => sendChatMessage(q)}
                        className="text-[11px] p-2 rounded-lg border text-left transition-colors hover:opacity-85"
                        style={{
                          background: 'var(--t-surface)',
                          borderColor: 'var(--t-border)',
                          color: 'var(--t-text2)',
                        }}
                      >
                        👉 {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div ref={chatScrollRef} className="space-y-3">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-xl px-3 py-2 text-[11px] ${
                          msg.role === 'user' ? 'font-medium' : ''
                        }`}
                        style={{
                          background: msg.role === 'user' ? 'rgba(212,168,67,0.12)' : 'var(--t-surface)',
                          border: `1px solid ${msg.role === 'user' ? 'rgba(212,168,67,0.3)' : 'var(--t-border)'}`,
                          color: msg.role === 'user' ? 'var(--t-gold)' : 'var(--t-text2)',
                        }}
                      >
                        {msg.role === 'user' ? (
                          msg.content
                        ) : (
                          <AiContent
                            text={msg.content}
                            streaming={chatLoading && i === chatMessages.length - 1}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FOOTER INPUT: Hộp gõ câu hỏi luôn sẵn sàng ── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t" style={{ borderColor: 'var(--t-border)' }}>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (activeTab !== 'chat') setActiveTab('chat');
            sendChatMessage(chatInput);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder={
              activeTab === 'chat'
                ? 'Nhập câu hỏi bạn muốn hỏi AI...'
                : 'Hỏi thêm điều gì về lá số này...'
            }
            disabled={chatLoading}
            className="flex-1 rounded-lg px-3 py-2 text-[11px] focus:outline-none transition-colors border"
            style={{
              background: 'var(--t-surface)',
              borderColor: 'var(--t-border)',
              color: 'var(--t-text)',
            }}
          />
          <button
            type="submit"
            disabled={chatLoading || !chatInput.trim()}
            className="px-3.5 py-2 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-40"
            style={{
              background: 'rgba(212,168,67,0.18)',
              border: '1px solid rgba(212,168,67,0.3)',
              color: 'var(--t-gold)',
            }}
          >
            {chatLoading ? '…' : 'Gửi'}
          </button>
        </form>
      </div>
    </div>
  );
}
