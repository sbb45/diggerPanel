'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast from './Toast';
import Modal from '@/components/UI/Modal'; // Твой универсальный модал (Radix + Framer Motion)

interface ToastData {
    id: number;
    type: 'danger' | 'success' | 'warning';
    title: string;
    message: string;
}

interface UIContextProps {
    // Toasts
    addToast: (toast: Omit<ToastData, 'id'>) => void;

    // Modals
    openModal: (content: ReactNode, title?: string) => void;
    closeModal: () => void;
    isModalOpen: boolean;
    modalContent: ReactNode | null;
    modalTitle?: string;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const addToast = (toast: Omit<ToastData, 'id'>) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, ...toast }]);
    };
    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const [modalContent, setModalContent] = useState<ReactNode | null>(null);
    const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (content: ReactNode, title?: string) => {
        setModalContent(content);
        setModalTitle(title);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setModalContent(null), 300);
        setModalTitle(undefined);
    };

    return (
        <UIContext.Provider
            value={{
                addToast,
                openModal,
                closeModal,
                isModalOpen,
                modalContent,
                modalTitle,
            }}
        >
            {children}

            <div style={{
                position: 'fixed',
                top: 30,
                right: 94,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                zIndex: 1000,
                maxWidth: '300px',
            }}>
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

            <Modal
                open={isModalOpen}
                onOpenChangeAction={setIsModalOpen}
                title={modalTitle}
            >
                {modalContent}
            </Modal>
        </UIContext.Provider>
    );
};

export const useUI = (): UIContextProps => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
