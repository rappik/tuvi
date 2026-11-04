import type { BirthInfo, ZiweiChart } from '@/lib/ziwei/types';

export interface UserApiConfig {
  apiKey?: string;
  provider?: 'gemini' | 'openai' | 'deepseek';
  model?: string;
}

export interface SavedBirthFormData {
  name?: string;
  year?: string;
  month?: string;
  day?: string;
  clockHour?: string;
  clockMinute?: string;
  unknownTime?: boolean;
  province?: string;
  city?: string;
  longitude?: number;
  gender?: 'male' | 'female';
}

const STORAGE_KEYS = {
  API_KEY: 'ziwei_user_api_key',
  API_PROVIDER: 'ziwei_user_api_provider',
  API_MODEL: 'ziwei_user_api_model',
  BIRTH_FORM: 'ziwei_birth_form',
  CURRENT_CHART: 'ziwei_current_chart',
  HEMING_FORM_A: 'ziwei_heming_form_a',
  HEMING_FORM_B: 'ziwei_heming_form_b',
  HEMING_ANALYSIS: 'ziwei_heming_analysis',
} as const;

/**
 * Lấy cấu hình API cá nhân của người dùng từ localStorage
 */
export function getUserApiConfig(): UserApiConfig | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY)?.trim() || undefined;
    const provider = (localStorage.getItem(STORAGE_KEYS.API_PROVIDER) as UserApiConfig['provider']) || 'gemini';
    const model = localStorage.getItem(STORAGE_KEYS.API_MODEL)?.trim() || undefined;

    if (!apiKey) return undefined;
    return { apiKey, provider, model };
  } catch {
    return undefined;
  }
}

/**
 * Lưu cấu hình API cá nhân vào localStorage
 */
export function saveUserApiConfig(config: UserApiConfig): void {
  if (typeof window === 'undefined') return;
  try {
    if (config.apiKey) {
      localStorage.setItem(STORAGE_KEYS.API_KEY, config.apiKey.trim());
    } else {
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
    }

    if (config.provider) {
      localStorage.setItem(STORAGE_KEYS.API_PROVIDER, config.provider);
    }

    if (config.model) {
      localStorage.setItem(STORAGE_KEYS.API_MODEL, config.model.trim());
    } else {
      localStorage.removeItem(STORAGE_KEYS.API_MODEL);
    }

    window.dispatchEvent(new Event('ziwei-storage-updated'));
  } catch {
    // an toàn khi localStorage bị cấm (private mode)
  }
}

/**
 * Xóa riêng cấu hình API Key cá nhân
 */
export function clearUserApiConfig(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
    localStorage.removeItem(STORAGE_KEYS.API_PROVIDER);
    localStorage.removeItem(STORAGE_KEYS.API_MODEL);
    window.dispatchEvent(new Event('ziwei-storage-updated'));
  } catch {}
}

/**
 * Lưu dữ liệu biểu mẫu sinh
 */
export function saveBirthFormData(data: SavedBirthFormData, key: string = STORAGE_KEYS.BIRTH_FORM): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

/**
 * Lấy dữ liệu biểu mẫu sinh đã lưu
 */
export function getSavedBirthFormData(key: string = STORAGE_KEYS.BIRTH_FORM): SavedBirthFormData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Lưu tinh bàn hiện tại
 */
export function saveCurrentChart(chart: ZiweiChart | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (chart) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CHART, JSON.stringify(chart));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CHART);
    }
  } catch {}
}

/**
 * Lấy tinh bàn hiện tại đã lưu
 */
export function getSavedCurrentChart(): ZiweiChart | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_CHART);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Xóa sạch tất cả dữ liệu đã lưu trong localStorage (Key, Thông tin sinh, Tinh bàn, Luận giải)
 */
export function clearAllStoredData(): void {
  if (typeof window === 'undefined') return;
  try {
    // Xóa các key cố định
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    // Xóa các key cache luận giải
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ziwei_insights_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));

    window.dispatchEvent(new Event('ziwei-storage-cleared'));
    window.dispatchEvent(new Event('ziwei-storage-updated'));
  } catch {}
}

/**
 * Lưu cache luận giải các tab cho lá số
 */
export function saveChartInsights(chartKey: string, data: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`ziwei_insights_${chartKey}`, JSON.stringify(data));
  } catch {}
}

/**
 * Lấy cache luận giải các tab của lá số
 */
export function getSavedChartInsights(chartKey: string): Record<string, any> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`ziwei_insights_${chartKey}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Lấy tóm tắt trạng thái dữ liệu đang lưu trữ trong localStorage
 */
export function getStorageSummary() {
  if (typeof window === 'undefined') {
    return {
      hasApiKey: false,
      apiKeyMasked: '',
      provider: 'gemini',
      model: '',
      hasBirthForm: false,
      hasChart: false,
      hasHemingData: false,
    };
  }
  try {
    const rawKey = localStorage.getItem(STORAGE_KEYS.API_KEY)?.trim() || '';
    const maskedKey = rawKey.length > 8 ? `${rawKey.slice(0, 4)}...${rawKey.slice(-4)}` : (rawKey ? '••••••••' : '');
    const provider = localStorage.getItem(STORAGE_KEYS.API_PROVIDER) || 'gemini';
    const model = localStorage.getItem(STORAGE_KEYS.API_MODEL) || '';
    const hasBirthForm = !!localStorage.getItem(STORAGE_KEYS.BIRTH_FORM);
    const hasChart = !!localStorage.getItem(STORAGE_KEYS.CURRENT_CHART);
    const hasHemingData = !!(localStorage.getItem(STORAGE_KEYS.HEMING_FORM_A) || localStorage.getItem(STORAGE_KEYS.HEMING_FORM_B));

    return {
      hasApiKey: Boolean(rawKey),
      apiKeyMasked: maskedKey,
      provider,
      model,
      hasBirthForm,
      hasChart,
      hasHemingData,
    };
  } catch {
    return {
      hasApiKey: false,
      apiKeyMasked: '',
      provider: 'gemini',
      model: '',
      hasBirthForm: false,
      hasChart: false,
      hasHemingData: false,
    };
  }
}

