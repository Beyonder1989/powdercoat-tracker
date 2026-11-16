import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchCentralPin, updateCentralPin } from '../lib/supabase';

export type UserRole = 'VIEWER' | 'OPERATOR';

interface RoleContextType {
  role: UserRole;
  isOperator: boolean;
  unlockWithPin: (pin: string) => Promise<boolean>;
  lockToViewer: () => void;
  updatePin: (oldPin: string, newPin: string) => Promise<{ success: boolean; message?: string }>;
  isPinModalOpen: boolean;
  pinModalMode: 'enter' | 'change';
  setPinModalMode: (mode: 'enter' | 'change') => void;
  openPinModal: (action?: () => void, initialMode?: 'enter' | 'change') => void;
  closePinModal: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = 'powdercoat_user_role';
const PIN_STORAGE_KEY = 'powdercoat_dept_pin';
const DEFAULT_PIN = '1234';

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always initialize from localStorage (or default to VIEWER so shared links are safe!)
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(ROLE_STORAGE_KEY);
    return saved === 'OPERATOR' ? 'OPERATOR' : 'VIEWER';
  });

  const [centralPin, setCentralPin] = useState<string>(() => {
    return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
  });

  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pinModalMode, setPinModalMode] = useState<'enter' | 'change'>('enter');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // ดึงรหัส PIN ล่าสุดจาก Supabase เสมอเพื่อให้ทุกอุปกรณ์ ทุกคน ใช้รหัสตัวเดียวกันจริง
  const syncCentralPin = useCallback(async (): Promise<string> => {
    try {
      const pin = await fetchCentralPin();
      if (pin) {
        setCentralPin(pin);
        return pin;
      }
    } catch (e) {
      console.warn('Failed to sync central pin from Supabase:', e);
    }
    return centralPin;
  }, [centralPin]);

  useEffect(() => {
    syncCentralPin();
  }, [syncCentralPin]);

  const unlockWithPin = async (inputPin: string): Promise<boolean> => {
    // ดึงรหัสล่าสุดจาก Cloud ก่อนตรวจสอบเสมอ ป้องกันการใช้รหัสเก่าที่ถูกเปลี่ยนไปแล้ว
    const latestPin = await syncCentralPin();
    if (inputPin.trim() === latestPin.trim()) {
      setRole('OPERATOR');
      try {
        localStorage.setItem(ROLE_STORAGE_KEY, 'OPERATOR');
      } catch (e) {
        console.error('Failed to save role', e);
      }
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      setIsPinModalOpen(false);
      return true;
    }
    return false;
  };

  const lockToViewer = () => {
    setRole('VIEWER');
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, 'VIEWER');
    } catch (e) {
      console.error('Failed to save role', e);
    }
  };

  const updatePin = async (oldPin: string, newPin: string): Promise<{ success: boolean; message?: string }> => {
    // ตรวจสอบรหัสเดิมเทียบกับรหัสกลางใน Cloud ล่าสุด
    const latestPin = await syncCentralPin();
    if (oldPin.trim() !== latestPin.trim()) {
      return { success: false, message: 'รหัสเดิมไม่ถูกต้อง (รหัสกลางล่าสุดไม่ใช่รหัสนี้)' };
    }
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, message: 'รหัสใหม่ต้องมีอย่างน้อย 4 หลัก' };
    }

    const cleanPin = newPin.trim();
    setCentralPin(cleanPin);
    setRole('OPERATOR');
    localStorage.setItem(ROLE_STORAGE_KEY, 'OPERATOR');

    // บันทึกลง Cloud กลาง Supabase เพื่อให้อุปกรณ์ของทุกคนอัปเดตเป็นรหัสนี้ทันที
    const ok = await updateCentralPin(cleanPin);
    if (!ok) {
      return { success: false, message: 'ไม่สามารถบันทึกรหัสใหม่ไปยังระบบกลางได้ กรุณาตรวจสอบอินเทอร์เน็ต' };
    }

    return { success: true };
  };

  const openPinModal = (action?: () => void, initialMode: 'enter' | 'change' = 'enter') => {
    setPinModalMode(initialMode);
    syncCentralPin(); // ดึงรหัสล่าสุดจาก Cloud ทุกครั้งที่เปิดหน้าต่าง PIN
    if (action) {
      setPendingAction(() => action);
    } else {
      setPendingAction(null);
    }
    setIsPinModalOpen(true);
  };

  const closePinModal = () => {
    setPendingAction(null);
    setIsPinModalOpen(false);
  };

  const isOperator = role === 'OPERATOR';

  return (
    <RoleContext.Provider
      value={{
        role,
        isOperator,
        unlockWithPin,
        lockToViewer,
        updatePin,
        isPinModalOpen,
        pinModalMode,
        setPinModalMode,
        openPinModal,
        closePinModal,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
