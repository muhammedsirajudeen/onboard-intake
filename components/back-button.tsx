"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
    href?: string;
    className?: string;
}

export default function BackButton({ href, className = "" }: BackButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (href) {
            router.push(href);
        } else {
            router.back();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900 ${className}`}
            aria-label="Go back"
        >
            <ChevronLeft className="w-6 h-6" />
        </button>
    );
}
