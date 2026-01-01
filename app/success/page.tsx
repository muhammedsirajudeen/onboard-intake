"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
    const router = useRouter();

    useEffect(() => {
        // Optional: Auto-redirect to home after 10 seconds
        const timer = setTimeout(() => {
            router.push("/");
        }, 10000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#00D084]/10 to-white flex flex-col">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img
                            src="/onboard.png"
                            alt="Intake Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <span className="font-bold text-xl">Intake</span>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-12">
                <div className="max-w-2xl w-full text-center">
                    {/* Success Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="w-24 h-24 bg-[#00D084] rounded-full flex items-center justify-center animate-bounce">
                            <svg
                                className="w-12 h-12 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        <span className="text-[#00D084]">Submission</span> Complete!
                    </h1>

                    <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                        Thank you for completing your profile and video introduction.
                    </p>

                    {/* Assessment Notice */}
                    <div className="bg-white rounded-3xl p-8 md:p-10 border-2 border-[#00D084]/20 shadow-lg mb-8">
                        <div className="mb-6">
                            <div className="inline-block px-4 py-2 bg-[#00D084]/10 rounded-full text-sm font-semibold text-[#00D084] mb-4">
                                What's Next?
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            We're Assessing Your Capabilities
                        </h2>

                        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                            Our team is carefully reviewing your profile and video introduction to evaluate your technical skills and experience.
                        </p>

                        <div className="space-y-4 text-left">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-[#00D084] rounded-full flex items-center justify-center mt-1">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Check Your Email</p>
                                    <p className="text-gray-600 text-sm">We'll send you the assessment results and next steps</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-[#00D084] rounded-full flex items-center justify-center mt-1">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Review Timeline</p>
                                    <p className="text-gray-600 text-sm">Expect to hear from us within 3-5 business days</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-[#00D084] rounded-full flex items-center justify-center mt-1">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Stay Tuned</p>
                                    <p className="text-gray-600 text-sm">Come back later to check your application status</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => router.push("/")}
                        className="px-8 py-4 bg-[#00D084] text-white rounded-full font-semibold hover:bg-[#00B872] transition-all hover:scale-105"
                    >
                        Return to Home
                    </button>

                    <p className="text-sm text-gray-500 mt-6">
                        You'll be automatically redirected in 10 seconds
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="py-8 px-6 bg-gray-900 text-white text-center">
                <p className="text-sm opacity-80">
                    Built for engineers who respect reality.
                </p>
            </div>
        </div>
    );
}
