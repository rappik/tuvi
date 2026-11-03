/**
 * /knowledge — 知识库主页
 * 列出 14 主星，每星可看其在 13 宫位的解读
 */

import Link from 'next/link';
import { ALL_STARS, ALL_TOPICS, getKnowledge, STAR_BRIEF_SEO, STAR_TO_SLUG } from '@/lib/seo/knowledge';
import { TOPIC_LABEL } from '@/lib/ziwei/db-analysis';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata = {
  title: 'Kho Tri Thức Tử Vi Đẩu Số · 14 Chính Tinh × 12 Cung Vị · Chính Tông Nghê Hải Hạ',
  description: 'Kho tri thức Tử Vi Đẩu Số biên soạn dựa trên hệ thống Thiên Kỷ của Thầy Nghê Hải Hạ và cổ thư Tử Vi Đẩu Số Toàn Tập, Cốt Tủy Phú. Luận giải chi tiết 14 chính tinh tại các cung vị.',
  keywords: ['tử vi đẩu số', 'nghê hải hạ', 'tử vi đẩu số toàn tập', 'tử vi đẩu số toàn thư', 'cốt tủy phú', '14 chính tinh', '12 cung'],
};

export default function KnowledgeHomePage() {
  const STAR_DESCRIPTIONS_QUICK = STAR_BRIEF_SEO;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* 顶栏 */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.1em', textDecoration: 'none' }}>
          ← Trang Chủ
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.1em' }}>
          Phương Pháp Luận Nghê Hải Hạ · Kho Tri Thức
        </div>
        <div className="flex items-center gap-3">
          <Link href="/library" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.1em', textDecoration: 'none' }}>
            Cổ Tịch →
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Hero */}
      <div className="text-center px-6 py-14">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(184,146,42,0.4))' }} />
          <span style={{ fontSize: '11px', color: 'var(--ac)', letterSpacing: '0.3em' }}>KHO TRI THỨC TỬ VI</span>
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(184,146,42,0.4))' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.08em', marginBottom: '12px' }}>
          Kho Tri Thức Tử Vi Đẩu Số
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--tx-2)', letterSpacing: '0.02em', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          14 Chính Tinh × 12 Cung Vị = <strong style={{ color: 'var(--ac)' }}>{ALL_STARS.length * ALL_TOPICS.length}</strong> Chuyên đề khảo luận<br />
          Biên soạn theo hệ thống 《Thiên Kỷ》 Thầy Nghê Hải Hạ · Khảo chứng cổ thư truyền thống
        </p>
      </div>

      {/* 14 主星卡片 */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.2em', textAlign: 'center', marginBottom: '24px' }}>
          THẬP TỨ CHÍNH TINH
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {ALL_STARS.map(star => (
            <Link
              key={star}
              href={`/knowledge/${STAR_TO_SLUG[star]}/overview`}
              style={{
                display: 'block',
                padding: '14px 10px',
                background: 'var(--bg-card)',
                border: '1px solid rgba(184,146,42,0.2)',
                borderRadius: '10px',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
              className="hover:shadow-md hover:border-amber-400"
            >
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.05em' }}>
                {star}
              </div>
            </Link>
          ))}
        </div>

        {/* 详细列表（每个主星 + 简介 + 进入按钮） */}
        <div className="mt-14 space-y-4">
          {ALL_STARS.map(star => (
            <div key={star} style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(184,146,42,0.18)',
              borderRadius: '12px',
              padding: '18px 22px',
            }}>
              <div className="flex items-baseline gap-3 mb-2">
                <span style={{ fontSize: '19px', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.05em' }}>
                  Sao {star}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.1em' }}>
                  TỬ VI · 14 CHÍNH TINH
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '12px' }}>
                {STAR_DESCRIPTIONS_QUICK[star] || ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_TOPICS.map(t => {
                  const k = getKnowledge(star, t);
                  if (!k.exists) return null;
                  return (
                    <Link
                      key={t}
                      href={`/knowledge/${STAR_TO_SLUG[star]}/${t}`}
                      style={{
                        fontSize: '11px',
                        padding: '4px 10px',
                        background: 'rgba(184,146,42,0.06)',
                        border: '1px solid rgba(184,146,42,0.15)',
                        borderRadius: '999px',
                        color: 'var(--tx-2)',
                        textDecoration: 'none',
                      }}
                    >
                      Nhập {k.palaceName} · {TOPIC_LABEL[t]}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
