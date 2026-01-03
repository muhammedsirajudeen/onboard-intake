"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/back-button";
import UserProfile from "@/components/user-profile";
import api from "@/lib/api";

export default function BeginnerPage() {
    const router = useRouter();
    const [userName, setUserName] = useState<string>("User");
    const [userPicture, setUserPicture] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get("/api/user/profile");
                if (response.data.success && response.data.user) {
                    const { name, picture, isBeginnerLevel } = response.data.user;
                    if (name) setUserName(name);
                    if (picture) setUserPicture(picture);

                    // If not beginner level, redirect appropriately
                    if (!isBeginnerLevel) {
                        router.push("/onboarding");
                        return;
                    }
                }
                setIsLoading(false);
            } catch (err) {
                router.push("/signin");
            }
        };
        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00D084]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
            <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <BackButton />
                    <div className="flex flex-col leading-none">
                        <span className="text-2xl font-bold tracking-tighter">Intake</span>
                        <span className="text-[10px] text-[#00D084] font-medium tracking-wide text-right -mt-1">by onboard</span>
                    </div>
                    <UserProfile name={userName} picture={userPicture} />
                </div>
            </nav>

            <div className="flex-1 px-6 py-12">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                            Your Starting Point
                        </h1>
                        <p className="text-gray-500">We've identified your current level and the path forward.</p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Status Card */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="relative overflow-hidden rounded-3xl p-8 border shadow-xl transition-all duration-500 bg-amber-50 border-amber-100 shadow-amber-100/50">
                                {/* Abstract Geometric Background */}
                                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 rounded-full bg-gradient-to-br from-white/40 to-white/0 blur-3xl" />
                                <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 rounded-full bg-gradient-to-tr from-white/40 to-white/0 blur-3xl" />

                                <div className="relative z-10 text-center">
                                    <div className="inline-flex items-center justify-center p-1 rounded-full bg-white/50 backdrop-blur-sm border border-white/50 mb-6">
                                        <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-gray-700">Current Level</span>
                                    </div>

                                    <div className="text-5xl md:text-6xl font-black mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                                        Beginner
                                    </div>

                                    <div className="w-16 h-1 mx-auto rounded-full bg-gray-900/10 mb-6" />

                                    <p className="text-sm font-medium text-gray-600 leading-relaxed max-w-xs mx-auto">
                                        You're at the start of your developer journey. That's perfectly fine—everyone starts here.
                                    </p>
                                </div>
                            </div>

                            {/* CTA Card */}
                            <div className="bg-gray-900 rounded-3xl p-8 text-center text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-50" />

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#00D084]/20 border border-[#00D084]/30 text-[#00D084] text-xs font-bold uppercase tracking-wider">
                                        Recommended Program
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2">
                                        Foundation Architect
                                    </h3>

                                    <div className="text-4xl font-black text-white mb-6">
                                        ₹1299
                                    </div>

                                    <div className="bg-white/10 rounded-xl p-4 mb-8 w-full backdrop-blur-sm border border-white/5">
                                        <p className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-2 text-xs">The Outcome</p>
                                        <p className="text-white text-base leading-snug">
                                            Build your developer presence, master fundamentals, and create your first real project. Stop copying tutorials.
                                        </p>
                                    </div>

                                    <a
                                        href="https://wa.me/9526965228?text=I%20want%20to%20join%20the%20Foundation%20Architect%20Program%20(Beginner%20Level%20-%20%E2%82%B91299)"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#00D084] text-white rounded-full font-bold text-base tracking-wide hover:bg-[#00B872] transition-all shadow-lg shadow-[#00D084]/25"
                                    >
                                        Join Exclusive Program
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="lg:col-span-7 space-y-8">
                            {/* What This Means */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                                <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 rotate-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">What Beginner Level Means</h3>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-amber-50/50 transition-colors border border-transparent hover:border-amber-100 group">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                                        <span className="text-sm font-medium text-gray-700 leading-snug">No developer presence (GitHub, portfolio)</span>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-amber-50/50 transition-colors border border-transparent hover:border-amber-100 group">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                                        <span className="text-sm font-medium text-gray-700 leading-snug">Limited understanding of market expectations</span>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-amber-50/50 transition-colors border border-transparent hover:border-amber-100 group">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                                        <span className="text-sm font-medium text-gray-700 leading-snug">Need structured guidance to build foundations</span>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-amber-50/50 transition-colors border border-transparent hover:border-amber-100 group">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                                        <span className="text-sm font-medium text-gray-700 leading-snug">Ready to commit to structured learning</span>
                                    </div>
                                </div>
                            </div>

                            {/* What You'll Get */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                                <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 -rotate-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">What You'll Get</h3>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 transition-colors border border-transparent hover:border-emerald-100">
                                        <div className="mt-1 flex-shrink-0">
                                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Market Reality Check</h4>
                                            <p className="text-xs text-gray-600">Understand what companies actually look for in developers</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 transition-colors border border-transparent hover:border-emerald-100">
                                        <div className="mt-1 flex-shrink-0">
                                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Structured Learning Path</h4>
                                            <p className="text-xs text-gray-600">Step-by-step roadmap from beginner to job-ready</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 transition-colors border border-transparent hover:border-emerald-100">
                                        <div className="mt-1 flex-shrink-0">
                                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Developer Presence Setup</h4>
                                            <p className="text-xs text-gray-600">Build your GitHub, portfolio, and online presence</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 transition-colors border border-transparent hover:border-emerald-100">
                                        <div className="mt-1 flex-shrink-0">
                                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Core Fundamentals</h4>
                                            <p className="text-xs text-gray-600">Master the essential concepts every developer must know</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 transition-colors border border-transparent hover:border-emerald-100">
                                        <div className="mt-1 flex-shrink-0">
                                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Exclusive Community Access</h4>
                                            <p className="text-xs text-gray-600">Join our WhatsApp community for guidance and support</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 mb-2">Important Notice</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            This is <strong>not a job guarantee program</strong>. We provide resources, structure, and guidance. Your success depends on your commitment to learning and building. This is the foundation—you must do the work.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="py-6 text-center text-xs text-gray-400 border-t border-gray-100 mt-auto">
                <p>&copy; 2026 Intake. All rights reserved.</p>
            </footer>
        </div>
    );
}
