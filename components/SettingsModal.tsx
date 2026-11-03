'use client';
import { useState, useEffect, useRef } from 'react';
import {
  getUserApiConfig,
  saveUserApiConfig,
  clearUserApiConfig,
  clearAllStoredData,
  getStorageSummary,
  type UserApiConfig,
} from '@/lib/storage';

interface SettingsModalProps {
  buttonClassName?: string;
}

export default function SettingsModal({ buttonClassName }: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [provider, setProvider] = useState<'gemini' | 'openai' | 'deepseek'>('gemini');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [summary, setSummary] = useState(() => getStorageSummary());
  const [confirmClear, setConfirmClear] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Nạp cấu hình từ localStorage khi mở modal hoặc có event
  const reloadConfig = () => {
    const config = getUserApiConfig();
    if (config) {
      setApiKey(config.apiKey || '');
      setProvider(config.provider || 'gemini');
      setModel(config.model || '');
    } else {
      setApiKey('');
      setProvider('gemini');
      setModel('');
    }
    setSummary(getStorageSummary());
  };

  useEffect(() => {
    reloadConfig();
    const handleUpdate = () => reloadConfig();
    window.addEventListener('ziwei-storage-updated', handleUpdate);
    window.addEventListener('ziwei-storage-cleared', handleUpdate);
    return () => {
      window.removeEventListener('ziwei-storage-updated', handleUpdate);
      window.removeEventListener('ziwei-storage-cleared', handleUpdate);
    };
  }, []);

  // Xử lý phím Escape để đóng modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setConfirmClear(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleOpen = () => {
    reloadConfig();
    setSavedSuccess(false);
    setConfirmClear(false);
    setIsOpen(true);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      clearUserApiConfig();
    } else {
      saveUserApiConfig({
        provider,
        apiKey: apiKey.trim(),
        model: model.trim() || undefined,
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearApiKeyOnly = () => {
    clearUserApiConfig();
    setApiKey('');
    setModel('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearAll = () => {
    clearAllStoredData();
    setApiKey('');
    setModel('');
    setConfirmClear(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const defaultModels: Record<string, string[]> = {
    gemini: ['gemini-3.1-flash-lite (Siêu nhanh · Khuyên dùng)', 'gemini-3-flash-preview', 'gemini-2.5-flash'],
    openai: ['gpt-4o-mini (Khuyên dùng)', 'gpt-4o', 'gpt-3.5-turbo'],
    deepseek: ['deepseek-chat (Khuyên dùng)', 'deepseek-reasoner'],
  };

  return (
    <>
      {/* Nút bấm mở Settings trên Topbar */}
      <button
        type="button"
        onClick={handleOpen}
        title="Cài đặt API AI & Quản lý bộ nhớ Local Storage"
        className={buttonClassName ?? "flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border transition-all hover:opacity-85"}
        style={{
          borderColor: 'var(--bdr)',
          color: summary.hasApiKey ? 'var(--ac)' : 'var(--tx-2)',
          background: summary.hasApiKey ? 'var(--ac-dim)' : 'transparent',
        }}
      >
        <span style={{ fontSize: '13px' }}>⚙️</span>
        <span className="hidden sm:inline">Cài Đặt</span>
        {summary.hasApiKey && (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--ac)' }}
            title="Đang sử dụng API Key người dùng"
          />
        )}
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            ref={modalRef}
            className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--bdr)',
              color: 'var(--tx-0)',
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-5 py-3.5 border-b"
              style={{ borderColor: 'var(--bdr)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">⚙️</span>
                <h3 className="text-sm font-semibold tracking-wide">
                  Cài Đặt API & Dữ Liệu Bộ Nhớ
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-sm transition-colors hover:opacity-75"
                style={{ color: 'var(--tx-3)', background: 'var(--bg-2)' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-6 text-xs sm:text-sm">
              {/* Thông báo lưu thành công */}
              {savedSuccess && (
                <div
                  className="p-3 rounded-xl border text-xs flex items-center gap-2"
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                    color: '#22c55e',
                  }}
                >
                  <span>✓</span>
                  <span>Đã cập nhật dữ liệu bộ nhớ trình duyệt thành công!</span>
                </div>
              )}

              {/* PHẦN 1: API Key Luận Giải */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs tracking-wider uppercase" style={{ color: 'var(--ac)' }}>
                    1. Khóa AI Luận Giải Cá Nhân
                  </h4>
                  {summary.hasApiKey ? (
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                      Đang dùng Key cá nhân
                    </span>
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-2)', color: 'var(--tx-3)' }}>
                      Dùng Key hệ thống (nếu có)
                    </span>
                  )}
                </div>

                <p className="text-xs leading-relaxed" style={{ color: 'var(--tx-3)' }}>
                  Nếu máy chủ chưa cấu hình key hoặc gói chia sẻ bị giới hạn hạn ngạch (quota), bạn có thể nhập API Key riêng. Khóa được lưu trực tiếp trên <strong>Local Storage</strong> trình duyệt của bạn, hoàn toàn bảo mật và không bị lưu trên máy chủ khác.
                </p>

                <form onSubmit={handleSaveConfig} className="space-y-3 pt-1">
                  {/* Provider */}
                  <div>
                    <label className="block text-xs mb-1 font-medium" style={{ color: 'var(--tx-1)' }}>
                      Nhà Cung Cấp AI
                    </label>
                    <select
                      value={provider}
                      onChange={(e) => {
                        const newProv = e.target.value as any;
                        setProvider(newProv);
                        setModel('');
                      }}
                      className="w-full px-3 py-2 rounded-lg border text-xs outline-none transition-colors"
                      style={{
                        background: 'var(--bg-input)',
                        borderColor: 'var(--bdr)',
                        color: 'var(--tx-0)',
                      }}
                    >
                      <option value="gemini">Google Gemini (Miễn phí & Luận giải tốt nhất)</option>
                      <option value="deepseek">DeepSeek AI</option>
                      <option value="openai">OpenAI (ChatGPT)</option>
                    </select>
                  </div>

                  {/* API Key */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium" style={{ color: 'var(--tx-1)' }}>
                        API Key
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="text-[11px] hover:underline"
                        style={{ color: 'var(--ac)' }}
                      >
                        {showKey ? 'Ẩn Key' : 'Hiện Key'}
                      </button>
                    </div>
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={
                        provider === 'gemini'
                          ? 'AIzaSy...'
                          : provider === 'openai'
                          ? 'sk-...'
                          : 'sk-...'
                      }
                      className="w-full px-3 py-2 rounded-lg border text-xs font-mono outline-none"
                      style={{
                        background: 'var(--bg-input)',
                        borderColor: 'var(--bdr)',
                        color: 'var(--tx-0)',
                      }}
                    />
                    <div className="mt-1 flex items-center justify-between text-[11px]" style={{ color: 'var(--tx-3)' }}>
                      {provider === 'gemini' && (
                        <span>
                          Nhận key miễn phí tại{' '}
                          <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                            style={{ color: 'var(--ac)' }}
                          >
                            Google AI Studio
                          </a>
                        </span>
                      )}
                      {provider === 'openai' && (
                        <span>
                          Nhận key tại{' '}
                          <a
                            href="https://platform.openai.com/api-keys"
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                            style={{ color: 'var(--ac)' }}
                          >
                            OpenAI Dashboard
                          </a>
                        </span>
                      )}
                      {provider === 'deepseek' && (
                        <span>
                          Nhận key tại{' '}
                          <a
                            href="https://platform.deepseek.com"
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                            style={{ color: 'var(--ac)' }}
                          >
                            DeepSeek Platform
                          </a>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-xs mb-1 font-medium" style={{ color: 'var(--tx-1)' }}>
                      Tên Model (Để trống nếu dùng mặc định)
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder={provider === 'gemini' ? 'gemini-2.5-flash' : provider === 'openai' ? 'gpt-4o-mini' : 'deepseek-chat'}
                      className="w-full px-3 py-2 rounded-lg border text-xs font-mono outline-none"
                      style={{
                        background: 'var(--bg-input)',
                        borderColor: 'var(--bdr)',
                        color: 'var(--tx-0)',
                      }}
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {defaultModels[provider]?.map((m) => {
                        const actualModel = m.split(' ')[0];
                        return (
                          <button
                            key={actualModel}
                            type="button"
                            onClick={() => setModel(actualModel)}
                            className="text-[10px] px-2 py-0.5 rounded border transition-colors hover:opacity-80"
                            style={{
                              borderColor: model === actualModel ? 'var(--ac)' : 'var(--bdr)',
                              color: model === actualModel ? 'var(--ac)' : 'var(--tx-3)',
                              background: model === actualModel ? 'var(--ac-dim)' : 'transparent',
                            }}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ background: 'var(--ac)' }}
                    >
                      Lưu Cấu Hình Key
                    </button>
                    {summary.hasApiKey && (
                      <button
                        type="button"
                        onClick={handleClearApiKeyOnly}
                        className="py-2 px-3 rounded-lg text-xs border transition-colors hover:opacity-80"
                        style={{ borderColor: 'var(--bdr)', color: 'var(--tx-2)' }}
                      >
                        Bỏ Key Riêng
                      </button>
                    )}
                  </div>
                </form>
              </section>

              {/* PHẦN 2: Trạng thái và Xóa Local Storage */}
              <section className="space-y-3 pt-4 border-t" style={{ borderColor: 'var(--bdr)' }}>
                <h4 className="font-semibold text-xs tracking-wider uppercase" style={{ color: 'var(--ac)' }}>
                  2. Dữ Liệu Đang Lưu Trữ (Local Storage)
                </h4>

                <div
                  className="p-3.5 rounded-xl border space-y-2 text-xs"
                  style={{ background: 'var(--bg-input)', borderColor: 'var(--bdr)' }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--tx-2)' }}>API Key người dùng:</span>
                    <span className="font-mono font-medium">
                      {summary.hasApiKey ? `Đã lưu (${summary.apiKeyMasked})` : 'Chưa lưu'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--tx-2)' }}>Thông tin ngày giờ sinh:</span>
                    <span className="font-medium">
                      {summary.hasBirthForm ? '✓ Đang lưu tự động' : 'Chưa có'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--tx-2)' }}>Tinh bàn lá số hiện tại:</span>
                    <span className="font-medium">
                      {summary.hasChart ? '✓ Đang lưu trên trình duyệt' : 'Chưa có'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--tx-2)' }}>Dữ liệu Hợp Số:</span>
                    <span className="font-medium">
                      {summary.hasHemingData ? '✓ Đang lưu' : 'Chưa có'}
                    </span>
                  </div>
                </div>

                {!confirmClear ? (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="w-full py-2 px-3 rounded-lg text-xs font-medium border transition-colors hover:opacity-90 flex items-center justify-center gap-1.5"
                    style={{
                      borderColor: 'rgba(239, 68, 68, 0.4)',
                      background: 'rgba(239, 68, 68, 0.08)',
                      color: '#ef4444',
                    }}
                  >
                    <span>🗑️</span>
                    <span>Xóa Toàn Bộ Dữ Liệu Local Storage</span>
                  </button>
                ) : (
                  <div
                    className="p-3 rounded-xl border space-y-2.5 text-xs"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderColor: 'rgba(239, 68, 68, 0.4)',
                    }}
                  >
                    <p className="font-medium text-red-500">
                      ⚠️ Bạn có chắc chắn muốn xóa toàn bộ thông tin ngày giờ sinh, lá số đã an và API Key cá nhân khỏi trình duyệt này?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleClearAll}
                        className="flex-1 py-1.5 px-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                      >
                        Xác Nhận Xóa Hết
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmClear(false)}
                        className="py-1.5 px-3 rounded-lg border hover:opacity-80"
                        style={{ borderColor: 'var(--bdr)', color: 'var(--tx-2)' }}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Modal Footer */}
            <div
              className="px-5 py-3 border-t flex justify-end"
              style={{ borderColor: 'var(--bdr)', background: 'var(--bg-card)' }}
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium border hover:opacity-80 transition-colors"
                style={{ borderColor: 'var(--bdr)', color: 'var(--tx-1)' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
