import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'VIEWER' | 'OPERATOR';

interface RoleContextType {
  role: UserRole;
  isOperator: boolean;
  unlockWithPin: (pin: string) => boolean;
  lockToViewer: () => void;
  updatePin: (oldPin: string, newPin: string) => { success: boolean; message?: string };
  isPinModalOpen: boolean;
  openPinModal: (action?: () => void) => void;
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

  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const getStoredPin = (): string => {
    return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
  };

  const unlockWithPin = (pin: string): boolean => {
    const currentPin = getStoredPin();
    if (pin.trim() === currentPin.trim()) {
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

  const updatePin = (oldPin: string, newPin: string): { success: boolean; message?: string } => {
    const currentPin = getStoredPin();
    if (oldPin.trim() !== currentPin.trim()) {
      return { success: false, message: 'รหัสเดิมไม่ถูกต้อง' };
    }
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, message: 'รหัสใหม่ต้องมีอย่างน้อย 4 หลัก' };
    }

    try {
      localStorage.setItem(PIN_STORAGE_KEY, newPin.trim());
      return { success: true };
    } catch (e) {
      return { success: false, message: 'เกิดข้อผิดพลาดในการบันทึก' };
    }
  };

  const openPinModal = (action?: () => void) => {
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
