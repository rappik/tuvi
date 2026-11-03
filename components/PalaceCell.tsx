'use client';
import { motion } from 'framer-motion';
import type { Palace, Star } from '@/lib/ziwei/types';
import {
  formatPalaceShort,
  formatStarName,
  formatSiHua,
  formatGanZhi,
  formatBrightness,
  PALACE_VI_MAP,
  SIHUA_VI_MAP,
} from '@/lib/ziwei/vietnamese';
import clsx from 'clsx';

interface PalaceCellProps {
  palace: Palace;
  onClick?: () => void;
  onStarClick?: (star: Star) => void;
  isSelected?: boolean;
  isSanFang?: boolean;
  delay?: number;
  /** 叠加四化：星名 → 四化类型（'禄'/'权'/'科'/'忌'） */
  overlayStarSiHua?: Record<string, string>;
  /** 叠加标签：'年'（流年）或 '限'（大限） */
  overlayLabel?: string;
  /** 点击叠加四化 badge 回调 */
  onSiHuaClick?: (starName: string, siHua: string) => void;
}

const SIHUA_STYLES: Record<string, string> = {
  '禄': 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  '权': 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/30',
  '科': 'text-amber-700 dark:text-yellow-400 bg-amber-500/10 border-amber-500/30',
  '忌': 'text-rose-700 dark:text-red-400 bg-rose-500/10 border-red-500/30',
};

const SiHuaBadge = ({
  siHua,
  overlay,
  label,
  onClick,
}: {
  siHua: string;
  overlay?: boolean;
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const shortSiHua = formatSiHua(siHua, true);
  const cleanKey = siHua.replace('化', '');
  const titleText = SIHUA_VI_MAP[cleanKey]
    ? `${SIHUA_VI_MAP[cleanKey].name} (${SIHUA_VI_MAP[cleanKey].meaning})`
    : siHua;

  const translatedLabel = label === '年' ? 'Niên' : label === '限' ? 'Hạn' : label;

  return (
    <span
      title={titleText}
      className={clsx(
        'inline-flex items-center text-[8px] px-1 rounded-full border leading-none py-px font-bold ml-1 flex-shrink-0',
        SIHUA_STYLES[cleanKey] || 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        overlay && 'border-dashed opacity-80',
        onClick && 'cursor-pointer hover:opacity-100',
      )}
      onClick={onClick}
    >
      {overlay && translatedLabel && <span className="mr-px opacity-70">{translatedLabel}</span>}
      {shortSiHua}
    </span>
  );
};

export default function PalaceCell({
  palace, onClick, onStarClick, isSelected, isSanFang, delay = 0,
  overlayStarSiHua, overlayLabel, onSiHuaClick,
}: PalaceCellProps) {
  const { branch, stem, name, stars, daXianAge, isCurrentDaXian, isMingGong, isShenGong } = palace;
  const ganzhiVi = formatGanZhi(stem, branch);
  const palaceNameVi = formatPalaceShort(name);
  const palaceFullInfo = PALACE_VI_MAP[name.endsWith('宫') ? name : `${name}宫`];

  const majorStars = stars.filter(s => s.type === 'major');
  const luckyStars = stars.filter(s => s.type === 'lucky');
  const shaStars = stars.filter(s => s.type === 'sha');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      onClick={onClick}
      title={palaceFullInfo ? `${palaceFullInfo.fullText}: ${palaceFullInfo.role}` : name}
      className="relative flex flex-col p-1.5 cursor-pointer transition-all duration-200 h-full"
      style={{
        minHeight: '90px',
        background: isCurrentDaXian
          ? 'rgba(147,51,234,0.08)'
          : isSelected
          ? 'rgba(37,99,235,0.18)'
          : isSanFang
          ? 'rgba(37,99,235,0.09)'
          : isMingGong
          ? 'rgba(212,168,67,0.04)'
          : 'var(--t-bg)',
        boxShadow: isCurrentDaXian
          ? 'inset 3px 0 0 rgba(147,51,234,0.5)'
          : isSelected
          ? 'inset 0 0 0 1.5px rgba(37,99,235,0.7)'
          : isSanFang
          ? 'inset 0 0 0 1px rgba(37,99,235,0.4)'
          : 'none',
      }}
    >
      {/* Đại hạn tuổi */}
      {daXianAge && (
        <div
          title={`Đại hạn ${daXianAge[0]} - ${daXianAge[1]} tuổi`}
          className={clsx(
            'absolute top-1 right-1 text-[9px] font-mono tabular-nums',
            isCurrentDaXian ? 'text-purple-400 font-semibold' : ''
          )}
          style={!isCurrentDaXian ? { color: 'var(--t-faint)', opacity: 0.75 } : undefined}
        >
          {daXianAge[0]}–{daXianAge[1]}
        </div>
      )}

      {/* Tên Cung */}
      <div className="flex items-center gap-1 mb-0.5 pr-8">
        <span className={clsx('text-[10.5px] font-semibold tracking-wide',
          isMingGong ? 'text-amber-700 dark:text-amber-500' : isShenGong ? 'text-sky-700 dark:text-sky-500' : ''
        )}
          style={!isMingGong && !isShenGong ? { color: 'var(--t-text2)' } : undefined}
        >
          {palaceNameVi}
        </span>
        {isMingGong && (
          <span title="Mệnh Cung - Bản Mệnh Tiên Thiên" className="text-[7.5px] text-amber-800 dark:text-amber-400 font-bold border border-amber-600/40 dark:border-amber-500/40 px-0.5 rounded leading-tight bg-amber-500/10">Mệnh</span>
        )}
        {isShenGong && (
          <span title="Thân Cung - Hậu Vận Hành Động" className="text-[7.5px] text-sky-800 dark:text-sky-400 font-bold border border-sky-600/40 dark:border-sky-500/40 px-0.5 rounded leading-tight bg-sky-500/10">Thân</span>
        )}
      </div>

      {/* Can Chi của cung */}
      <div className="text-[9px] font-mono mb-1" style={{ color: 'var(--t-faint)', opacity: 0.85 }}>{ganzhiVi}</div>

      {/* Chính tinh (14 Chính Tinh) */}
      <div className="flex flex-col gap-0.5 flex-1">
        {majorStars.length === 0 && (
          <span className="text-[10px] italic font-medium" style={{ color: 'var(--t-faint)', opacity: 0.65 }}>
            Vô Chính Diệu
          </span>
        )}
        {majorStars.map((star) => {
          const overlaySiHua = overlayStarSiHua?.[star.name];
          const starNameVi = formatStarName(star.name);
          const brightVi = star.brightnessRaw ? formatBrightness(star.brightnessRaw, true) : '';

          return (
            <div
              key={star.name}
              className="flex items-center flex-wrap"
              onClick={e => { e.stopPropagation(); onStarClick?.(star); }}
              title={`${starNameVi} ${brightVi ? `(${brightVi})` : ''}`}
            >
              <span className={clsx(
                'text-[12px] leading-tight font-bold tracking-tight cursor-pointer hover:brightness-110 transition-all',
                star.brightness === 'bright'
                  ? 'text-amber-800 dark:text-amber-300'
                  : star.brightness === 'dim'
                  ? 'text-amber-950/70 dark:text-amber-700/80'
                  : 'text-amber-700 dark:text-amber-500',
              )}>
                {starNameVi}
              </span>
              {star.brightnessRaw && (
                <span
                  className="text-[8px] opacity-80 ml-0.5 font-normal"
                  style={{
                    color: star.brightness === 'bright'
                      ? 'var(--t-gold)'
                      : star.brightness === 'dim'
                      ? '#dc2626'
                      : 'var(--t-faint)'
                  }}
                >
                  ({formatBrightness(star.brightnessRaw)})
                </span>
              )}
              {star.siHua && <SiHuaBadge siHua={star.siHua} />}
              {overlaySiHua && (
                <SiHuaBadge
                  siHua={overlaySiHua}
                  overlay
                  label={overlayLabel}
                  onClick={e => {
                    e.stopPropagation();
                    onSiHuaClick?.(star.name, overlaySiHua);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Cát tinh & Phụ tá tinh */}
      {luckyStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 mt-0.5">
          {luckyStars.map(s => {
            const overlaySiHua = overlayStarSiHua?.[s.name];
            const starNameVi = formatStarName(s.name);
            return (
              <span key={s.name} className="inline-flex items-center text-[8.5px] text-blue-700 dark:text-sky-400 font-medium leading-tight">
                {starNameVi}
                {s.brightnessRaw && (
                  <span className="text-[7.5px] opacity-60 ml-px">
                    ({formatBrightness(s.brightnessRaw)})
                  </span>
                )}
                {s.siHua && <SiHuaBadge siHua={s.siHua} />}
                {overlaySiHua && (
                  <SiHuaBadge
                    siHua={overlaySiHua}
                    overlay
                    label={overlayLabel}
                    onClick={e => {
                      e.stopPropagation();
                      onSiHuaClick?.(s.name, overlaySiHua);
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* Sát tinh & Bại tinh */}
      {shaStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 mt-0.5">
          {shaStars.map(s => {
            const starNameVi = formatStarName(s.name);
            return (
              <span key={s.name} className="inline-flex items-center text-[8.5px] text-rose-700 dark:text-red-400/80 font-medium leading-tight">
                {starNameVi}
                {s.brightnessRaw && (
                  <span className="text-[7.5px] opacity-60 ml-px">
                    ({formatBrightness(s.brightnessRaw)})
                  </span>
                )}
                {s.siHua && <SiHuaBadge siHua={s.siHua} />}
              </span>
            );
          })}
        </div>
      )}

    </motion.div>
  );
}

