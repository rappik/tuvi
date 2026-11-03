'use client';
import { motion } from 'framer-motion';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { detectPatterns, getMingGongSummary } from '@/lib/ziwei/patterns';
import {
  formatPalaceShort,
  formatStarName,
  formatSiHua,
  formatJuName,
  formatBranch,
  formatStem,
  formatPatternName,
  SIHUA_VI_MAP,
} from '@/lib/ziwei/vietnamese';

interface ChartSummaryProps {
  chart: ZiweiChart;
}

const PatternLevelStyle = {
  excellent: { dot: 'bg-amber-400', label: 'text-amber-500', badge: 'text-amber-500 bg-amber-500/10 border-amber-500/25' },
  good: { dot: 'bg-sky-400', label: 'text-sky-500', badge: 'text-sky-500 bg-sky-500/10 border-sky-500/25' },
  neutral: { dot: 'bg-slate-400', label: 'text-slate-400', badge: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
  caution: { dot: 'bg-orange-500', label: 'text-orange-500', badge: 'text-orange-500 bg-orange-500/10 border-orange-500/25' },
};

export default function ChartSummary({ chart }: ChartSummaryProps) {
  const patterns = detectPatterns(chart);
  const { stars: mingStars, keywords, nature } = getMingGongSummary(chart);
  const currentDx = chart.daXians[chart.currentDaXianIndex];

  const siHuaSummary: { name: string; siHua: string; palaceName: string }[] = [];
  for (const palace of chart.palaces) {
    for (const star of palace.stars) {
      if (star.siHua) {
        siHuaSummary.push({ name: star.name, siHua: star.siHua, palaceName: palace.name });
      }
    }
  }
  const siHuaOrder = ['禄', '权', '科', '忌'];
  siHuaSummary.sort((a, b) => siHuaOrder.indexOf(a.siHua) - siHuaOrder.indexOf(b.siHua));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="space-y-4"
    >
      {/* ── Tổng quan mệnh cách ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      >
      <div className="card-glass rounded-xl p-5">
        <div className="text-[10px] tracking-widest mb-4 flex items-center gap-2 font-medium" style={{ color: 'var(--t-faint)' }}>
          <span style={{ color: 'var(--t-gold)', opacity: 0.8 }}>✦</span>
          TỔNG QUAN MỆNH CÁCH
        </div>

        <div className="flex flex-wrap items-start gap-4">
          <div>
            <div className="text-[9px] mb-1.5" style={{ color: 'var(--t-faint)', opacity: 0.85 }}>Chính Tinh Mệnh Cung</div>
            <div className="flex items-center gap-1.5">
              {mingStars.length > 0 ? (
                mingStars.map(s => (
                  <span key={s} className="font-bold text-lg" style={{ color: 'var(--t-gold)' }}>
                    {formatStarName(s)}
                  </span>
                ))
              ) : (
                <span className="text-sm font-medium italic" style={{ color: 'var(--t-faint)' }}>Vô Chính Diệu</span>
              )}
            </div>
            {nature && (
              <div className="text-[10px] mt-1 font-medium" style={{ color: 'var(--t-gold)', opacity: 0.7 }}>{nature}</div>
            )}
          </div>

          {keywords.length > 0 && (
            <div>
              <div className="text-[9px] mb-1.5" style={{ color: 'var(--t-faint)', opacity: 0.85 }}>Đặc Chất & Tính Cách</div>
              <div className="flex flex-wrap gap-1.5">
                {keywords.map(k => (
                  <span key={k} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      color: 'var(--t-gold)',
                      background: 'rgba(212,168,67,0.08)',
                      border: '1px solid rgba(212,168,67,0.2)',
                    }}>
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="ml-auto text-right">
            <div className="text-[9px] mb-1" style={{ color: 'var(--t-faint)', opacity: 0.85 }}>Ngũ Hành Cục · Đại Hạn Hiện Tại</div>
            <div className="text-[11px] font-semibold" style={{ color: 'var(--t-text2)' }}>{formatJuName(chart.wuxingJuName)}</div>
            {currentDx && (
              <div className="text-[11px] text-purple-400 font-medium mt-0.5">
                {currentDx.startAge}~{currentDx.endAge} tuổi · {formatPalaceShort(currentDx.palaceName)} Cung
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[10px]"
          style={{ borderTop: '1px solid var(--t-border)', color: 'var(--t-faint)' }}>
          <span>Dương lịch: {chart.birthInfo.year}-{chart.birthInfo.month}-{chart.birthInfo.day}</span>
          <span>
            Âm lịch: Năm {formatStem(chart.lunarInfo.yearStem)} {formatBranch(chart.lunarInfo.yearBranch)} · {chart.lunarInfo.isLeapMonth ? 'Nhuận ' : ''}
            Tháng {chart.lunarInfo.lunarMonth} Ngày {chart.lunarInfo.lunarDay}
          </span>
          <span>Giờ {formatBranch(chart.birthInfo.hour)} ({chart.birthInfo.hour * 2 - 1 < 0 ? 23 : chart.birthInfo.hour * 2 - 1}:00–{chart.birthInfo.hour * 2 + 1}:00)</span>
          <span>Mệnh tại {formatBranch(chart.mingGongBranch)} · Thân cư {formatBranch(chart.shenGongBranch)}</span>
        </div>
      </div>
      </motion.div>

      {/* ── Tứ Hóa Năm Sinh ── */}
      {siHuaSummary.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
        <div className="card-glass rounded-xl p-4">
          <div className="text-[10px] tracking-widest mb-3 flex items-center gap-2 font-medium" style={{ color: 'var(--t-faint)' }}>
            <span style={{ color: 'var(--t-gold)', opacity: 0.8 }}>◆</span>
            TỨ HÓA NĂM SINH (BẢN MỆNH TỨ HÓA)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {siHuaSummary.map(({ name, siHua, palaceName }) => {
              const colors: Record<string, { text: string; bg: string; border: string }> = {
                '禄': { text: '#4ade80', bg: 'rgba(74,222,128,0.06)', border: 'rgba(74,222,128,0.2)' },
                '权': { text: '#60a5fa', bg: 'rgba(96,165,250,0.06)', border: 'rgba(96,165,250,0.2)' },
                '科': { text: '#facc15', bg: 'rgba(250,204,21,0.06)', border: 'rgba(250,204,21,0.2)' },
                '忌': { text: '#f87171', bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.2)' },
              };
              const c = colors[siHua] || colors['禄'];
              const info = SIHUA_VI_MAP[siHua];

              return (
                <div key={name + siHua}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[10.5px]"
                  style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                >
                  <div>
                    <span className="font-semibold text-white/90">{formatStarName(name)}</span>
                    <span className="font-bold ml-1.5">Hóa {formatSiHua(siHua, true)}</span>
                    {info && (
                      <span className="text-[9px] opacity-75 ml-1 hidden sm:inline">({info.meaning})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-right">
                    <span style={{ opacity: 0.8 }} className="text-[9.5px]">tại {formatPalaceShort(palaceName)} Cung</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </motion.div>
      )}

      {/* ── Nhận Diện Cách Cục ── */}
      {patterns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
        <div className="card-glass rounded-xl p-4">
          <div className="text-[10px] tracking-widest mb-3 flex items-center gap-2 font-medium" style={{ color: 'var(--t-faint)' }}>
            <span style={{ color: 'var(--t-gold)', opacity: 0.8 }}>◉</span>
            NHẬN DIỆN CÁCH CỤC (TIÊU CHUẨN CỔ THƯ)
            <span className="text-[9px] ml-auto" style={{ color: 'var(--t-faint)', opacity: 0.75 }}>{patterns.length} cách cục thành lập</span>
          </div>
          <div className="space-y-2">
            {patterns.map((p, i) => {
              const st = PatternLevelStyle[p.level];
              const pNameVi = formatPatternName(p.name);

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.08 }}
                  className="card-inner rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`} />
                    <span className={`text-[11.5px] font-semibold ${st.label}`}>{pNameVi}</span>
                    <div className="flex gap-1 ml-auto">
                      {p.palaces.slice(0, 2).map(pa => (
                        <span key={pa} className={`text-[8.5px] px-1.5 py-px rounded-full border ${st.badge}`}>
                          {formatPalaceShort(pa)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10.5px] leading-relaxed pl-3.5" style={{ color: 'var(--t-text2)' }}>
                    {p.description}
                  </p>

                  {p.conditions && (
                    <div className="mt-2 pl-3.5 space-y-0.5">
                      {p.conditions.required.length > 0 && (
                        <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                          <span className="font-semibold" style={{ color: 'var(--t-gold)' }}>Bắt buộc</span>
                          <span style={{ opacity: 0.6 }}> · </span>
                          {p.conditions.required.join(', ')}
                        </div>
                      )}
                      {p.conditions.bonus && p.conditions.bonus.length > 0 && (
                        <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                          <span className="font-semibold text-emerald-500">Cát lợi gia tăng</span>
                          <span style={{ opacity: 0.6 }}> · </span>
                          {p.conditions.bonus.join(', ')}
                        </div>
                      )}
                      {p.conditions.breaking && p.conditions.breaking.length > 0 && (
                        <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                          <span className="font-semibold text-orange-500">Lưu ý phá cách</span>
                          <span style={{ opacity: 0.6 }}> · </span>
                          {p.conditions.breaking.join(', ')}
                        </div>
                      )}
                    </div>
                  )}

                  {p.source && (
                    <div className="text-[9px] mt-1.5 pl-3.5" style={{ color: 'var(--t-faint)', opacity: 0.6 }}>
                      Xuất xứ cổ thư · {p.source}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        </motion.div>
      )}

      {/* ── Vận trình đại hạn ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.88, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
      <div className="card-glass rounded-xl p-4">
        <div className="text-[10px] tracking-widest mb-3 flex items-center gap-2 font-medium" style={{ color: 'var(--t-faint)' }}>
          <span className="text-purple-500/80">◎</span>
          VẬN TRÌNH ĐẠI HẠN (10 NĂM MỖI CUNG)
        </div>
        <div className="grid grid-cols-3 gap-2">
          {chart.daXians.slice(0, 9).map((dx, i) => {
            const isCurrent = i === chart.currentDaXianIndex;
            return (
              <div
                key={i}
                className="text-[10px] px-2 py-2 rounded-lg text-center transition-colors"
                style={{
                  border: isCurrent
                    ? '1px solid rgba(147,51,234,0.5)'
                    : '1px solid var(--t-border)',
                  background: isCurrent ? 'rgba(147,51,234,0.12)' : 'transparent',
                  color: isCurrent ? '#c4b5fd' : 'var(--t-faint)',
                }}
              >
                <div className="font-mono tabular-nums font-semibold">{dx.startAge}~{dx.endAge} tuổi</div>
                <div className="text-[9.5px] mt-0.5 font-medium" style={{ opacity: 0.85 }}>{formatPalaceShort(dx.palaceName)} Cung</div>
              </div>
            );
          })}
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
}
