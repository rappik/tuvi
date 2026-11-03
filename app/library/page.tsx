/**
 * 古籍原典查询库 · 主页
 *
 * 列出所有收录古籍 + 全局搜索入口
 */

import Link from 'next/link';
import { ALL_BOOKS, TOTAL_PARAGRAPHS } from '@/lib/classics';
import LibrarySearch from './LibrarySearch';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata = {
  title: 'Thư Viện Cổ Tịch Nguyên Điển Tử Vi Đẩu Số · Toàn Tập / Toàn Thư / Cốt Tủy Phú',
  description: 'Tra cứu toàn văn các pho cổ thư Tử Vi Đẩu Số kinh điển: 《Tử Vi Đẩu Số Toàn Tập》, 《Tử Vi Đẩu Số Toàn Thư》, 《Cốt Tủy Phú》 — Xuất xứ các trích dẫn trong hệ thống 《Thiên Kỷ》 của Thầy Nghê Hải Hạ.',
};

export default function LibraryHomePage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* 顶栏 */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.1em', textDecoration: 'none' }}>
          ← Về Trang Chủ
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.15em' }}>
          THƯ VIỆN CỔ TỊCH · TỬ VI ĐẨU SỐ
        </div>
        <div className="flex items-center gap-3">
          <Link href="/chart" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.1em', textDecoration: 'none' }}>
            Lập Lá Số →
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Hero */}
      <div className="text-center px-6 py-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(184,146,42,0.4))' }} />
          <span style={{ fontSize: '11px', color: 'var(--ac)', letterSpacing: '0.3em' }}>NGHÊ HẢI HẠ · HỌC THUẬT</span>
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(184,146,42,0.4))' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.08em', marginBottom: '12px' }}>
          Thư Viện Cổ Tịch Nguyên Điển
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--tx-2)', letterSpacing: '0.04em', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          Tra cứu toàn văn cổ thư Tử Vi Đẩu Số kinh điển<br />
          Thu thập <strong style={{ color: 'var(--ac)' }}>{ALL_BOOKS.length}</strong> Pho cổ thư · Gồm <strong style={{ color: 'var(--ac)' }}>{TOTAL_PARAGRAPHS}</strong> Đoạn khảo cứu tinh hoa
        </p>
      </div>

      {/* 搜索 */}
      <div className="max-w-2xl mx-auto px-6 mb-12">
        <LibrarySearch />
      </div>

      {/* 古籍列表 */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_BOOKS.map(book => (
            <Link
              key={book.slug}
              href={`/library/${book.slug}`}
              style={{
                display: 'block',
                background: 'var(--bg-card)',
                border: '1px solid rgba(184,146,42,0.2)',
                borderRadius: '14px',
                padding: '24px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(184,146,42,0.06)',
              }}
              className="hover:shadow-lg"
            >
              <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.1em', marginBottom: '6px' }}>
                {book.dynasty} · {book.author.split(' ')[0]}
              </div>
              <div style={{ fontSize: '19px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '10px', letterSpacing: '0.05em' }}>
                《{book.title}》
              </div>
              <div style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '14px' }}>
                {book.intro}
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--tx-3)' }}>
                <span>{book.chapters.length} Chương</span>
                <span style={{ color: 'rgba(184,146,42,0.4)' }}>·</span>
                <span>{book.chapters.reduce((s, c) => s + c.paragraphs.length, 0)} Đoạn tinh hoa</span>
              </div>
              <div style={{
                display: 'inline-flex',
                marginTop: '14px',
                fontSize: '11px',
                color: 'var(--ac)',
                letterSpacing: '0.1em',
                fontWeight: 500,
              }}>
                Vào tra cứu →
              </div>
            </Link>
          ))}
        </div>

        {/* 底部说明 */}
        <div style={{ marginTop: '60px', padding: '24px', background: 'rgba(184,146,42,0.05)', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--ac-dim)', fontWeight: 600, letterSpacing: '0.15em', marginBottom: '8px' }}>
            VỀ THƯ VIỆN CỔ TỊCH
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
            Các văn bản cổ tịch được sưu tầm, đối chiếu từ các bản khắc cổ thời Minh.<br />
            Phục vụ nghiên cứu học thuật, đối chiếu nguồn gốc các khẩu quyết trong giáo trình 《Thiên Kỷ》 của Thầy Nghê Hải Hạ.<br />
            Nếu phát hiện điểm cần đính chính, xin vui lòng đóng góp cùng chúng tôi.
          </div>
        </div>
      </div>
    </div>
  );
}
