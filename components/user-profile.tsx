"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";
import { LogOut, User as UserIcon } from "lucide-react";
import api from "@/lib/api";

interface UserProfileProps {
    name: string;
    email?: string;
    picture?: string;
}

export default function UserProfile({ name, email, picture }: UserProfileProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await api.post("/api/auth/logout");
            router.push("/signin");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 outline-none"
                    aria-label="User menu"
                >
                    {picture ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                            <img
                                src={picture}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-[#00D084]/10 text-[#00D084] flex items-center justify-center font-bold text-xs ring-2 ring-white">
                            {getInitials(name)}
                        </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[150px] truncate">
                        {name}
                    </span>
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    className="z-50 w-56 rounded-xl bg-white p-2 shadow-xl ring-1 ring-gray-200 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                    sideOffset={8}
                    align="end"
                >
                    <div className="px-2 py-3 border-b border-gray-100 mb-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                        {email && <p className="text-xs text-gray-500 truncate">{email}</p>}
                    </div>

                    <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                        <LogOut className="w-4 h-4" />
                        {isLoading ? "Logging out..." : "Log out"}
                    </button>

                    <Popover.Arrow className="fill-white" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
