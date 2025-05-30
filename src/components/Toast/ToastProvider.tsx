'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast from './Toast';

interface ToastData {
    id: number;
    type: 'danger' | 'success' | 'warning';
    title: string;
    message: string;
}

interface ToastContextProps {
    addToast: (toast: Omit<ToastData, 'id'>) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const addToast = (toast: Omit<ToastData, 'id'>) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, ...toast }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div>
                {toasts.map(({ id, type, title, message }) => (
                    <Toast
                        key={id}
                        type={type}
                        title={title}
                        message={message}
                        onClose={() => removeToast(id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextProps => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
