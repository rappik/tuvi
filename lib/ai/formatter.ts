import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import {
  formatPalaceName,
  formatStarName,
  formatSiHua,
  formatBrightness,
  formatJuName,
  formatPatternName,
  STEMS_VI,
  BRANCHES_VI,
  JU_VI_MAP,
} from '@/lib/ziwei/vietnamese';
import { detectPatterns } from '@/lib/ziwei/patterns';

/**
 * Chuyển đổi tinh bàn Tử Vi thành văn bản cấu trúc chi tiết
 * để làm bối cảnh phân tích chuẩn mực cho AI.
 */
export function formatChartToText(chart: ZiweiChart): string {
  const { birthInfo, lunarInfo, wuxingJuName, mingGongBranch, shenGongBranch, palaces } = chart;

  const stemVi = lunarInfo?.yearStem !== undefined ? (STEMS_VI[lunarInfo.yearStem] ?? '') : '';
  const branchVi = lunarInfo?.yearBranch !== undefined ? (BRANCHES_VI[lunarInfo.yearBranch] ?? '') : '';
  const yearCanChi = `${stemVi} ${branchVi}`.trim();
  const juVi = formatJuName(wuxingJuName);

  const mingBranchVi = BRANCHES_VI[mingGongBranch] ?? `Chi ${mingGongBranch}`;
  const shenBranchVi = BRANCHES_VI[shenGongBranch] ?? `Chi ${shenGongBranch}`;

  const mingPalace = palaces.find(p => p.branch === mingGongBranch);
  const shenPalace = palaces.find(p => p.branch === shenGongBranch);

  const genderStr = birthInfo.gender === 'male' ? 'Nam Mệnh (Dương/Âm Nam)' : 'Nữ Mệnh (Dương/Âm Nữ)';

  // Nhận diện cách cục đặc biệt
  let patternsText = 'Không phát hiện cách cục đặc thù theo chuẩn cổ thư.';
  try {
    const patterns = detectPatterns(chart);
    if (patterns.length > 0) {
      patternsText = patterns
        .map(p => {
          const nameVi = formatPatternName(p.name);
          const req = p.conditions?.required?.length ? ` [Điều kiện: ${p.conditions.required.join(', ')}]` : '';
          const bonus = p.conditions?.bonus?.length ? ` [Cát lợi gia tăng: ${p.conditions.bonus.join(', ')}]` : '';
          const breaking = p.conditions?.breaking?.length ? ` [Lưu ý phá cách: ${p.conditions.breaking.join(', ')}]` : '';
          return `• ${nameVi}: ${p.description}${req}${bonus}${breaking}`;
        })
        .join('\n');
    }
  } catch {
    // an toàn nếu môi trường không tương thích
  }

  // Chi tiết 12 cung
  const palacesDetails = palaces
    .map(p => {
      const pNameVi = formatPalaceName(p.name);
      const pBranchVi = BRANCHES_VI[p.branch] ?? '';
      const pStemVi = STEMS_VI[p.stem] ?? '';
      const flags: string[] = [];
      if (p.isMingGong) flags.push('MỆNH CUNG');
      if (p.isShenGong) flags.push('THÂN CUNG');
      const flagStr = flags.length > 0 ? ` ★【${flags.join(' & ')}】` : '';

      const daXianStr = p.daXianAge ? ` (Đại Hạn: ${p.daXianAge[0]}-${p.daXianAge[1]} tuổi)` : '';

      // Tinh diệu
      const majorStars = p.stars.filter(s => s.type === 'major');
      const otherStars = p.stars.filter(s => s.type !== 'major');

      const majorStr = majorStars.length > 0
        ? majorStars.map(s => {
            const name = formatStarName(s.name);
            const bright = s.brightnessRaw ? ` (${formatBrightness(s.brightnessRaw)})` : '';
            const sihua = s.siHua ? ` [Hóa ${formatSiHua(s.siHua)}]` : '';
            return `${name}${bright}${sihua}`;
          }).join(', ')
        : 'Vô Chính Diệu (Không có chính tinh tọa thủ)';

      const otherStr = otherStars.length > 0
        ? otherStars.map(s => {
            const name = formatStarName(s.name);
            const sihua = s.siHua ? ` [Hóa ${formatSiHua(s.siHua)}]` : '';
            return `${name}${sihua}`;
          }).join(', ')
        : 'Không có';

      // Tự hóa cung
      const selfSihuaStr = p.selfSihua && p.selfSihua.length > 0
        ? p.selfSihua.map(sh => `${formatStarName(sh.starName)} Tự Hóa ${formatSiHua(sh.siHua)}`).join(', ')
        : 'Không có';

      return `[Cung ${pBranchVi} - Can Chi: ${pStemVi} ${pBranchVi}] ${pNameVi}${flagStr}${daXianStr}
  - Chính Tinh: ${majorStr}
  - Phụ Tinh / Cát Tinh / Sát Tinh: ${otherStr}
  - Tự Hóa: ${selfSihuaStr}`;
    })
    .join('\n\n');

  return `=== THÔNG TIN BẢN MỆNH ĐƯƠNG SỐ ===
- Giới Tính: ${genderStr}
- Dương Lịch: Ngày ${birthInfo.day}/${birthInfo.month}/${birthInfo.year}
- Giờ Sinh (Âm lịch): Can Chi Giờ ${BRANCHES_VI[birthInfo.hour] ?? ''}
- Năm Sinh Âm Lịch: ${yearCanChi} (Tháng ${lunarInfo.lunarMonth}, Ngày ${lunarInfo.lunarDay})
- Ngũ Hành Cục: ${juVi}
- Cung Mệnh Tọa Thủ Tại: Cung ${mingBranchVi} (${formatPalaceName(mingPalace?.name ?? 'Mệnh')})
- Cung Thân Cư Tại: Cung ${shenBranchVi} (${formatPalaceName(shenPalace?.name ?? 'Thân')})

=== CÁCH CỤC PHÁT HIỆN THEO CỔ THƯ ===
${patternsText}

=== TINH BÀN 12 CUNG VỊ CHI TIẾT ===
${palacesDetails}`;
}

/**
 * Chuyển đổi 2 tinh bàn Tử Vi để làm bối cảnh so khớp hợp số (Tử Vi Hợp Số)
 */
export function formatHemingToText(chartA: ZiweiChart, chartB: ZiweiChart, question?: string): string {
  const textA = formatChartToText(chartA);
  const textB = formatChartToText(chartB);

  return `### LÁ SỐ ĐƯƠNG SỐ A (Chủ Thể 1):
${textA}

----------------------------------------------------
### LÁ SỐ ĐƯƠNG SỐ B (Chủ Thể 2):
${textB}

${question ? `\n### YÊU CẦU / THẮC MẮC CỤ THỂ CỦA NGƯỜI XEM:\n${question}` : ''}`;
}
