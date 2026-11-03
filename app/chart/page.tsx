'use client';
import { useState } from 'react';
import Link from 'next/link';
import BirthForm from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import TimeNav, { type TimeView } from '@/components/TimeNav';
import ThemeToggle from '@/components/ThemeToggle';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';

export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [view, setView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState(() => new Date().getFullYear());

  return (
    <div style={{ background: 'var(--bg-0)', minHeight: '100vh', transition: 'background 0.35s ease' }}>
      {/* ── Topbar chung ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 h-13 border-b backdrop-blur-md"
        style={{
          background: 'color-mix(in srgb, var(--bg-0) 90%, transparent)',
          borderColor: 'var(--bdr)',
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--ac)' }}
          >
            <span>‹</span>
            <span>Trang Chủ</span>
          </Link>
          <div className="w-px h-4" style={{ background: 'var(--bdr-med)' }} />
          <span className="text-xs tracking-wider font-semibold" style={{ color: 'var(--tx-0)' }}>
            {chart ? 'Lá Số Tử Vi Đẩu Số' : 'Khởi Bàn Tử Vi'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/heming"
            className="text-[11px] sm:text-xs px-2.5 py-1 rounded-full border transition-all hover:opacity-80"
            style={{ borderColor: 'var(--bdr)', color: 'var(--tx-2)' }}
          >
            Hợp Số
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Chưa khởi bàn: Biểu mẫu nhập ngày giờ sinh ── */}
      {!chart ? (
        <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="text-center mb-8">
            <div className="text-3xl mb-2" style={{ color: 'var(--ac)', opacity: 0.3 }}>✦</div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2" style={{ color: 'var(--tx-0)' }}>
              Lập Lá Số Tử Vi Đẩu Số
            </h1>
            <p className="text-xs sm:text-sm max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--tx-2)' }}>
              Nhập ngày tháng năm và giờ sinh, hệ thống an sao tức thời khởi tạo lá số bản mệnh chuẩn xác theo truyền thừa chính tông Thầy Nghê Hải Hạ.
            </p>
          </div>

          <div
            className="rounded-2xl p-5 sm:p-7 shadow-sm border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--bdr)',
            }}
          >
            <BirthForm onSubmit={(info: BirthInfo) => setChart(generateChart(info))} />
          </div>
        </main>
      ) : (
        /* ── Đã khởi bàn: Tinh bàn 12 cung + Bảng luận giải ── */
        <main className="max-w-[1360px] mx-auto px-3 sm:px-6 py-5 sm:py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => { setChart(null); setSelectedPalace(null); }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 hover:opacity-80"
              style={{
                borderColor: 'var(--t-border)',
                background: 'var(--t-surface)',
                color: 'var(--t-gold)',
              }}
            >
              ← Lập Lại Lá Số Khác
            </button>
          </div>

          <div
            className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,390px)] gap-5 items-start"
          >
            <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
            <InsightPanel chart={chart} selectedPalace={selectedPalace} />
          </div>
        </main>
      )}
    </div>
  );
}
