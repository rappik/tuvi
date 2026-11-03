/**
 * SEO 知识页 — 数据 helper
 *
 * 14 主星 × 13 topic = 182 个独立 SEO URL
 * 每页都是 STAR_DB 中对应字段的 4 段 markers（一句话定调/核心论断/命盘依据/经典出处）
 */

import { STAR_DB } from '@/lib/ziwei/db-analysis';
import type { TopicKey } from '@/lib/ziwei/db-analysis';
import { TOPIC_PALACE_NAME, TOPIC_LABEL } from '@/lib/ziwei/db-analysis';
import { formatPalaceName } from '@/lib/ziwei/vietnamese';

export const ALL_STARS = [
  'Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh', 'Thiên Phủ',
  'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân',
];

// 主星名 ↔ 拼音 slug 映射（URL 用 slug，避免中文 URL 在 Vercel/CDN 上的边界问题）
export const STAR_TO_SLUG: Record<string, string> = {
  // Tiếng Việt
  'Tử Vi': 'ziwei',
  'Thiên Cơ': 'tianji',
  'Thái Dương': 'taiyang',
  'Vũ Khúc': 'wuqu',
  'Thiên Đồng': 'tiantong',
  'Liêm Trinh': 'lianzhen',
  'Thiên Phủ': 'tianfu',
  'Thái Âm': 'taiyin',
  'Tham Lang': 'tanlang',
  'Cự Môn': 'jumen',
  'Thiên Tướng': 'tianxiang',
  'Thiên Lương': 'tianliang',
  'Thất Sát': 'qisha',
  'Phá Quân': 'pojun',
  // Tiếng Trung tương thích ngược
  '紫微': 'ziwei',
  '天机': 'tianji',
  '太阳': 'taiyang',
  '武曲': 'wuqu',
  '天同': 'tiantong',
  '廉贞': 'lianzhen',
  '天府': 'tianfu',
  '太阴': 'taiyin',
  '贪狼': 'tanlang',
  '巨门': 'jumen',
  '天相': 'tianxiang',
  '天梁': 'tianliang',
  '七杀': 'qisha',
  '破军': 'pojun',
};

export const SLUG_TO_STAR: Record<string, string> = {
  ziwei: 'Tử Vi',
  tianji: 'Thiên Cơ',
  taiyang: 'Thái Dương',
  wuqu: 'Vũ Khúc',
  tiantong: 'Thiên Đồng',
  lianzhen: 'Liêm Trinh',
  tianfu: 'Thiên Phủ',
  taiyin: 'Thái Âm',
  tanlang: 'Tham Lang',
  jumen: 'Cự Môn',
  tianxiang: 'Thiên Tướng',
  tianliang: 'Thiên Lương',
  qisha: 'Thất Sát',
  pojun: 'Phá Quân',
};

export const ALL_TOPICS: TopicKey[] = [
  'overview', 'personality', 'love', 'career', 'wealth', 'health',
  'family', 'children', 'move', 'friends', 'home', 'spirit', 'parents',
];

interface StarContent {
  mingGong: string;
  personality: string;
  xiongDi?: string;
  fuQi: string;
  ziNv?: string;
  caiBo: string;
  jiE: string;
  qianYi?: string;
  jiaoYou?: string;
  guanLu: string;
  tianZhai?: string;
  fuDe?: string;
  fuMu?: string;
}

const TOPIC_TO_FIELD: Record<TopicKey, keyof StarContent> = {
  overview:    'mingGong',
  personality: 'personality',
  love:        'fuQi',
  career:      'guanLu',
  wealth:      'caiBo',
  health:      'jiE',
  family:      'xiongDi' as keyof StarContent,
  children:    'ziNv' as keyof StarContent,
  move:        'qianYi' as keyof StarContent,
  friends:     'jiaoYou' as keyof StarContent,
  home:        'tianZhai' as keyof StarContent,
  spirit:      'fuDe' as keyof StarContent,
  parents:     'fuMu' as keyof StarContent,
};

interface ParsedContent {
  dingdiao: string;
  lundian: string;
  yiju: string;
  chuchu: string;
  raw: string;
  hasMarkers: boolean;
}

function parseStarContent(content: string): ParsedContent {
  const out: ParsedContent = { dingdiao: '', lundian: '', yiju: '', chuchu: '', raw: content, hasMarkers: false };
  if (!content) return out;
  if (!content.includes('**【一句话定调】**') && !content.includes('**【核心论断】**')) {
    out.lundian = content;
    return out;
  }
  out.hasMarkers = true;
  const re = /\*\*【([^】]+)】\*\*/g;
  const parts: { name: string; markerEnd: number; start: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    parts.push({ name: m[1], start: m.index, markerEnd: m.index + m[0].length });
  }
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const end = i + 1 < parts.length ? parts[i + 1].start : content.length;
    const text = content.slice(p.markerEnd, end).trim();
    if (p.name === '一句话定调') out.dingdiao = text;
    else if (p.name === '核心论断') out.lundian = text;
    else if (p.name === '命盘依据') out.yiju = text;
    else if (p.name === '经典出处') out.chuchu = text;
  }
  return out;
}

export interface KnowledgeData {
  star: string;
  topic: TopicKey;
  topicLabel: string;
  palaceName: string;
  parsed: ParsedContent;
  exists: boolean;
}

export function getKnowledge(star: string, topic: TopicKey): KnowledgeData {
  const profile = STAR_DB[star] as StarContent | undefined;
  const field = TOPIC_TO_FIELD[topic];
  const content = profile && field ? (profile[field] as string | undefined) ?? '' : '';
  return {
    star,
    topic,
    topicLabel: TOPIC_LABEL[topic],
    palaceName: formatPalaceName(TOPIC_PALACE_NAME[topic]),
    parsed: parseStarContent(content),
    exists: Boolean(content),
  };
}

/** 生成所有 14×13 组合（用于 generateStaticParams） */
export function getAllKnowledgeRoutes() {
  const routes: { star: string; slug: string; topic: TopicKey }[] = [];
  for (const star of ALL_STARS) {
    for (const topic of ALL_TOPICS) {
      const data = getKnowledge(star, topic);
      if (data.exists) routes.push({ star, slug: STAR_TO_SLUG[star], topic });
    }
  }
  return routes;
}

/** 主星属性简介（用于 SEO 页"了解 XX 星"section） */
export const STAR_BRIEF_SEO: Record<string, string> = {
  'Tử Vi': 'Tử Vi là Đế Tinh, chủ tôn quý, hóa khí vi Tôn. Tọa Mệnh có khí chất lãnh đạo uy nghiêm, thích hợp vị trí cao trên vũ đài lớn.',
  'Thiên Cơ': 'Thiên Cơ là Trí Tuệ Tinh, chủ quyền biến linh hoạt, hóa khí vi Thiện. Tọa Mệnh thông minh cơ trí, thích hợp mưu lược, cố vấn, kỹ thuật.',
  'Thái Dương': 'Thái Dương là Quý Tinh quang minh, chủ danh dự công quyền, hóa khí vi Quý. Tọa Mệnh đàng hoàng lỗi lạc, thích hợp công chức, danh tiếng hiển đạt.',
  'Vũ Khúc': 'Vũ Khúc là Tài Tinh, chủ cương nghị quyết đoán, hóa khí vi Tài. Tọa Mệnh năng lực tài chính nhạy bén, thích hợp tài chính, thực nghiệp.',
  'Thiên Đồng': 'Thiên Đồng là Phúc Tinh, chủ hòa nhã hưởng lạc, hóa khí vi Phúc. Tọa Mệnh tính tình ôn nhu, giàu phúc khí và nhân duyên tốt đẹp.',
  'Liêm Trinh': 'Liêm Trinh là Thứ Đào Hoa, văn võ kiêm toàn, hóa khí vi Tù. Tọa Mệnh đa tài đa nghệ, tình cảm sâu sắc, quyền biến sắc sảo.',
  'Thiên Phủ': 'Thiên Phủ là Nam Đế Tài Khố, chủ điềm đạm cẩn trọng, hóa khí vi Lệnh. Tọa Mệnh đức độ chính trực, giỏi quản lý ngân khố và tích lũy.',
  'Thái Âm': 'Thái Âm là Phú Quý Tinh, chủ điền trạch của cải, hóa khí vi Phú. Nữ mệnh đắc cách, tình cảm nhu thuận tinh tế, hậu vận phú túc.',
  'Tham Lang': 'Tham Lang là Đào Hoa Tinh, chủ dục vọng, giao thiệp rộng, hóa khí vi Đào Hoa. Tọa Mệnh đa tài nghệ, quảng giao, bén nhạy cơ hội.',
  'Cự Môn': 'Cự Môn là Ám Tinh chủ khẩu tài hùng biện, tư duy phản biện, hóa khí vi Ám. Tọa Mệnh giỏi ăn nói, biện luận, hợp luật sư, truyền thông.',
  'Thiên Tướng': 'Thiên Tướng là Ấn Tinh phò tá, chủ trung hậu thành tín, hóa khí vi Ấn. Tọa Mệnh giữ đúng quy chuẩn, hợp hành chính, pháp lý, trợ lý cấp cao.',
  'Thiên Lương': 'Thiên Lương là Lão Nhân Tinh/Ấm Tinh, phùng hung hóa cát, hóa khí vi Ấm. Tọa Mệnh từ bi thanh cao, có duyên với y học, giáo dục, tôn giáo.',
  'Thất Sát': 'Thất Sát là Tướng Tinh, chủ quả cảm quyết liệt mạo hiểm, hóa khí vi Quyền Dũng. Tọa Mệnh cương nghị quả cảm, hợp quân cảnh, khởi nghiệp tiên phong.',
  'Phá Quân': 'Phá Quân là Tinh Diệu Tiên Phong Khai Phá, chủ biến động đổi mới, hóa khí vi Hao. Tọa Mệnh dũng cảm tiên phong, hợp ngành kỹ thuật đột phá.',
};
