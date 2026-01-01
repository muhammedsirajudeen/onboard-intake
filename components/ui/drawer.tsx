"use client";

import { useEffect } from "react";

interface DrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function Drawer({ open, onOpenChange, children }: DrawerProps) {
    // Prevent body scroll when drawer is open
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

            {/* Drawer */}
            <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
                <div className="bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
                    {/* Drag Handle */}
                    <div className="flex justify-center pt-4 pb-2">
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-8">{children}</div>
                </div>
            </div>
        </>
    );
}

interface DrawerContentProps {
    children: React.ReactNode;
}

export function DrawerContent({ children }: DrawerContentProps) {
    return <div className="space-y-4">{children}</div>;
}

interface DrawerHeaderProps {
    children: React.ReactNode;
}

export function DrawerHeader({ children }: DrawerHeaderProps) {
    return <div className="space-y-2">{children}</div>;
}

interface DrawerTitleProps {
    children: React.ReactNode;
}

export function DrawerTitle({ children }: DrawerTitleProps) {
    return <h2 className="text-2xl font-bold text-gray-900">{children}</h2>;
}

interface DrawerDescriptionProps {
    children: React.ReactNode;
}

export function DrawerDescription({ children }: DrawerDescriptionProps) {
    return <p className="text-gray-600">{children}</p>;
}
