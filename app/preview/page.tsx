'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScrollIntro from '@/components/ScrollIntro';

export default function PreviewPage() {
  const router = useRouter();
  // replayKey 用于强制重置 ScrollIntro（用户点"再播放一次"时）
  const [replayKey, setReplayKey] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <>
      {/* 卷轴开场动画 */}
      <ScrollIntro key={replayKey} onComplete={() => setDone(true)} />

      {/* 动画结束后的「样片说明 + 操作按钮」面板 */}
      {done && (
        <main style={{
          minHeight: '100vh',
          background: '#0d0a08',
          color: '#e8dcc4',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '48px 24px',
          fontFamily: '"STSong", "Songti SC", serif',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.4em', color: '#c89647', marginBottom: '16px' }}>
            SCROLL · INTRO · PREVIEW
          </div>
          <h1 style={{
            fontSize: 'clamp(26px, 3.5vw, 38px)',
            letterSpacing: '0.12em',
            color: '#e8dcc4',
            marginBottom: '16px',
            fontWeight: 600,
          }}>
            Cuộn Tranh Thư Họa · Mở Màn Lá Số
          </h1>
          <p style={{
            fontSize: '14px', color: '#a89878',
            maxWidth: '520px', lineHeight: 1.8,
            letterSpacing: '0.05em',
            marginBottom: '40px',
            fontFamily: '"STKaiti", "Kaiti SC", serif',
          }}>
            Hiệu ứng cuộn tranh thư họa cổ phong tái hiện khoảnh khắc mở màn của một lá số Tử Vi.<br />
            Mang phong vị hoài cổ, trang trọng và đậm đà triết lý văn hóa Á Đông.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => { setDone(false); setReplayKey(k => k + 1); }}
              style={{
                background: '#a8302a',
                color: '#f5ecd7',
                padding: '14px 28px',
                fontSize: '14px',
                fontFamily: '"STSong", serif',
                letterSpacing: '0.15em',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              PHÁT LẠI LẦN NỮA
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                background: 'transparent',
                color: '#e8dcc4',
                padding: '14px 28px',
                fontSize: '14px',
                fontFamily: '"STSong", serif',
                letterSpacing: '0.15em',
                border: '1px solid rgba(232,220,196,0.25)',
                cursor: 'pointer',
              }}
            >
              VÀO TRANG CHỦ
            </button>
          </div>

          <div style={{
            marginTop: '40px', fontSize: '12px', color: '#6e6048',
            letterSpacing: '0.1em',
            display: 'flex', gap: '20px',
          }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Trang Chủ ↗</Link>
            <span>·</span>
            <Link href="/chart" style={{ color: 'inherit', textDecoration: 'none' }}>Lập Lá Số</Link>
            <span>·</span>
            <Link href="/heming" style={{ color: 'inherit', textDecoration: 'none' }}>Hợp Số</Link>
          </div>

          {/* 时间轴说明 */}
          <div style={{
            marginTop: '64px',
            padding: '24px 32px',
            border: '1px solid rgba(232,220,196,0.12)',
            maxWidth: '500px',
            fontSize: '12px',
            color: '#a89878',
            lineHeight: 1.9,
            letterSpacing: '0.05em',
            fontFamily: '"STKaiti", serif',
            textAlign: 'left',
          }}>
            <div style={{ color: '#c89647', marginBottom: '12px', letterSpacing: '0.15em', fontSize: '11px' }}>TIẾN TRÌNH HOẠT HỌA</div>
            <div>· 0.0 ~ 1.7 s &nbsp;&nbsp;Cuộn tranh từ từ mở sang hai phía</div>
            <div>· 1.9 ~ 2.7 s &nbsp;&nbsp;Họa phẩm và chữ thư pháp dần hiện ra (Đề từ + Tiêu đề + Chu sa ấn)</div>
            <div>· 2.7 ~ 3.5 s &nbsp;&nbsp;Dừng lại để chiêm ngưỡng</div>
            <div>· 3.5 ~ 4.2 s &nbsp;&nbsp;Toàn cảnh mờ dần và dẫn vào trang chính</div>
            <div style={{ marginTop: '12px', color: '#6e6048', fontSize: '11px' }}>
              Người xem có thể bấm &ldquo;BỎ QUA&rdquo; ở góc dưới bên phải bất cứ lúc nào.
            </div>
          </div>
        </main>
      )}
    </>
  );
}
