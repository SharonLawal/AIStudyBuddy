import React, { createContext, useContext, useState, useCallback } from 'react';
import { NotificationModal } from '../components/ui/NotificationModal';

type NotificationType = 'success' | 'error';

interface NotificationContextType {
  showNotification: (type: NotificationType, title: string, message: string, onContinue?: () => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<NotificationType>('success');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [onCloseAction, setOnCloseAction] = useState<(() => void) | undefined>(undefined);

  const showNotification = useCallback((type: NotificationType, title: string, message: string, onContinue?: () => void) => {
    setType(type);
    setTitle(title);
    setMessage(message);
    setOnCloseAction(() => onContinue);
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    if (onCloseAction) {
      onCloseAction();
    }
    setOnCloseAction(undefined);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationModal 
        visible={visible}
        type={type}
        title={title}
        message={message}
        onClose={handleClose}
      />
    </NotificationContext.Provider>
  );
}