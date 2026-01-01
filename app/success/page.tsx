"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface UserData {
    name: string;
    email: string;
    hireableStatus?: 'hireable' | 'near_hireable' | 'unhireable' | 'not_assessed';
    strengths?: string[];
    weaknesses?: string[];
}

export default function SuccessPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/api/user/profile");
                if (response.data.success && response.data.user) {
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'hireable': return 'text-emerald-600';
            case 'near_hireable': return 'text-amber-600';
            case 'unhireable': return 'text-rose-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusBg = (status?: string) => {
        switch (status) {
            case 'hireable': return 'bg-emerald-50 border-emerald-100 shadow-emerald-100/50';
            case 'near_hireable': return 'bg-amber-50 border-amber-100 shadow-amber-100/50';
            case 'unhireable': return 'bg-rose-50 border-rose-100 shadow-rose-100/50';
            default: return 'bg-gray-50 border-gray-100';
        }
    };

    const getStatusGradient = (status?: string) => {
        switch (status) {
            case 'hireable': return 'from-emerald-500 to-teal-500';
            case 'near_hireable': return 'from-amber-400 to-orange-500';
            case 'unhireable': return 'from-rose-500 to-pink-500';
            default: return 'from-gray-500 to-slate-500';
        }
    };

    const getStatusText = (status?: string) => {
        switch (status) {
            case 'hireable': return 'Hireable';
            case 'near_hireable': return 'Near Hireable';
            case 'unhireable': return 'Unhireable';
            default: return 'Pending Review';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00D084]"></div>
            </div>
        );
    }

    // Default Success View (Not Assessed)
    if (!user?.hireableStatus || user.hireableStatus === 'not_assessed') {
        return (
            <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#00D084]/5 to-transparent pointer-events-none" />

                <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
                    <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex flex-col leading-none">
                            <span className="text-2xl font-bold tracking-tighter">Intake</span>
                            <span className="text-[10px] text-[#00D084] font-medium tracking-wide text-right -mt-1">by onboard</span>
                        </div>
                    </div>
                </nav>

                <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-12 relative z-10">
                    <div className="max-w-xl w-full text-center">
                        <div className="mb-8 flex justify-center">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg shadow-emerald-100">
                                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold mb-4 tracking-tight text-gray-900">
                            Submission Received
                        </h1>

                        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                            We at Intake are reviewing your profile and video. Please come back and check the platform to see your results. We will also share the detailed report to your email.
                        </p>

                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 mb-8 text-left">
                            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6 border-b border-gray-100 pb-2">
                                Next Steps
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Signal Analysis</h3>
                                        <p className="text-sm text-gray-500 mt-1">Our team reviews your code, profile, and video communication.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">2</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Result Notification</h3>
                                        <p className="text-sm text-gray-500 mt-1">Come back and check the platform to see your detailed report and hireability status.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/")}
                            className="px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all hover:shadow-lg"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Results View (Assessed)
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
            <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex flex-col leading-none">
                        <span className="text-2xl font-bold tracking-tighter">Intake</span>
                        <span className="text-[10px] text-[#00D084] font-medium tracking-wide text-right -mt-1">by onboard</span>
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                        {user.name}
                    </div>
                </div>
            </nav>

            <div className="flex-1 px-6 py-12">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                            Signal Report
                        </h1>
                        <p className="text-gray-500">Generated for {user.email}. Also sent to your inbox.</p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Status Card */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className={`relative overflow-hidden rounded-3xl p-8 border shadow-xl transition-all duration-500 ${getStatusBg(user.hireableStatus)}`}>
                                {/* Abstract Geometric Background */}
                                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 rounded-full bg-gradient-to-br from-white/40 to-white/0 blur-3xl" />
                                <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 rounded-full bg-gradient-to-tr from-white/40 to-white/0 blur-3xl" />

                                <div className="relative z-10 text-center">
                                    <div className="inline-flex items-center justify-center p-1 rounded-full bg-white/50 backdrop-blur-sm border border-white/50 mb-6">
                                        <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-gray-700">Official Status</span>
                                    </div>

                                    <div className={`text-5xl md:text-6xl font-black mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r ${getStatusGradient(user.hireableStatus)}`}>
                                        {getStatusText(user.hireableStatus)}
                                    </div>

                                    <div className="w-16 h-1 mx-auto rounded-full bg-gray-900/10 mb-6" />

                                    <p className="text-sm font-medium text-gray-600 leading-relaxed max-w-xs mx-auto">
                                        Based on our rigorous assessment of your technical capabilities, problem-solving skills, and communication.
                                    </p>
                                </div>
                            </div>

                            {/* CTA Card */}
                            <div className="bg-gray-900 rounded-3xl p-8 text-center text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-50" />
                                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#00D084]/20 border border-[#00D084]/30 text-[#00D084] text-xs font-bold uppercase tracking-wider">
                                        Recommended Program
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2">
                                        {user.hireableStatus === 'unhireable' && "Foundation Architect"}
                                        {user.hireableStatus === 'near_hireable' && "Senior Engineer Mindset"}
                                        {user.hireableStatus === 'hireable' && "1% Engineer Club"}
                                    </h3>

                                    <div className="text-4xl font-black text-white mb-6">
                                        {user.hireableStatus === 'unhireable' && "₹1299"}
                                        {user.hireableStatus === 'near_hireable' && "₹999"}
                                        {user.hireableStatus === 'hireable' && "₹799"}
                                    </div>

                                    <div className="bg-white/10 rounded-xl p-4 mb-8 w-full backdrop-blur-sm border border-white/5">
                                        <p className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-2 text-xs">The Outcome</p>
                                        <p className="text-white text-base leading-snug">
                                            {user.hireableStatus === 'unhireable' && "Master the basics and build your first real project. Stop copying tutorials."}
                                            {user.hireableStatus === 'near_hireable' && "Learn system design, advanced patterns, and how to unblock yourself."}
                                            {user.hireableStatus === 'hireable' && "Direct referrals, salary negotiation, and access to elite networking."}
                                        </p>
                                    </div>

                                    <a
                                        href="https://wa.me/9526965228"
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
                            {/* Strengths */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                                <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 rotate-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Identified Strengths</h3>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {user.strengths && user.strengths.length > 0 ? (
                                        user.strengths.map((strength, index) => (
                                            <div key={index} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 transition-colors border border-transparent hover:border-emerald-100 group">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                                                <span className="text-sm font-medium text-gray-700 leading-snug">{strength}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-center py-8 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                            No strengths recorded yet.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Weaknesses */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                                <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 -rotate-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Critical Gaps</h3>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {user.weaknesses && user.weaknesses.length > 0 ? (
                                        user.weaknesses.map((weakness, index) => (
                                            <div key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-rose-50/50 transition-colors border border-transparent hover:border-rose-100">
                                                <div className="mt-1 flex-shrink-0">
                                                    <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 leading-snug">{weakness}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                            No gaps recorded yet.
                                        </div>
                                    )}
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
