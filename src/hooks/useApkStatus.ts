import { useState, useEffect, useCallback } from 'react';

export interface ApkInfo {
  exists: boolean;
  fileName?: string;
  size?: number;
  sizeFormatted?: string;
  version?: string;
  package?: string;
  sha256?: string;
  verified?: boolean;
  downloadUrl?: string;
  error?: string;
}

export function useApkStatus() {
  const [apkInfo, setApkInfo] = useState<ApkInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/apk-status', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (res.ok) {
        const data: ApkInfo = await res.json();
        setApkInfo(data);
      } else {
        setApkInfo({ exists: false, error: `HTTP ${res.status}` });
      }
    } catch (err: any) {
      setApkInfo({ exists: false, error: err?.message || 'Network error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return {
    apkInfo,
    exists: Boolean(apkInfo?.exists),
    isLoading,
    checkStatus,
  };
}
