"use client";

import { useEffect } from "react";

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    // Prevent body scroll when dialog is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
                onClick={() => onOpenChange(false)}
            />

            {/* Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in">
                    {children}
                </div>
            </div>
        </>
    );
}

interface DialogContentProps {
    children: React.ReactNode;
}

export function DialogContent({ children }: DialogContentProps) {
    return <div className="p-6 space-y-4">{children}</div>;
}

interface DialogHeaderProps {
    children: React.ReactNode;
    onClose?: () => void;
}

export function DialogHeader({ children, onClose }: DialogHeaderProps) {
    return (
        <div className="relative space-y-2">
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}
            {children}
        </div>
    );
}

interface DialogTitleProps {
    children: React.ReactNode;
}

export function DialogTitle({ children }: DialogTitleProps) {
    return <h2 className="text-2xl font-bold text-gray-900">{children}</h2>;
}

interface DialogDescriptionProps {
    children: React.ReactNode;
}

export function DialogDescription({ children }: DialogDescriptionProps) {
    return <p className="text-gray-600">{children}</p>;
}
