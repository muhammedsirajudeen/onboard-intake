"use client";

import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function SignInPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        setIsLoading(true);
        setError(null);

        try {
            const { data } = await api.post("/api/auth/google", {
                credential: credentialResponse.credential,
            });

            if (data.success) {
                console.log('✅ Authentication successful!');
                console.log('📝 Token received:', data.token);
                console.log('👤 User:', data.user);
                console.log('✓ Profile completed:', data.profileCompleted);

                // Check if profile is completed
                if (data.profileCompleted) {
                    // Profile complete, go to home
                    router.push("/");
                } else {
                    // Profile incomplete, go to onboarding
                    router.push("/onboarding");
                }
                router.refresh();
            }
        } catch (err) {
            setError("Failed to sign in. Please try again.");
            console.error("Sign in error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError("Google sign-in was cancelled or failed. Please try again.");
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <a href="/" className="flex items-center gap-2">
                        <img
                            src="/onboard.png"
                            alt="Intake Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <span className="font-bold text-xl">Intake</span>
                    </a>
                    <a
                        href="/"
                        className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                        Back to Home
                    </a>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-12">
                <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Messaging */}
                    <div className="space-y-6">
                        <div className="inline-block px-4 py-2 bg-[#00D084]/10 rounded-full text-sm font-medium text-[#00D084]">
                            Step 1 of Your Journey
                        </div>
                        <h1 className="text-5xl font-bold leading-tight">
                            Ready to Build Your{" "}
                            <span className="text-[#00D084]">Signal</span>?
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            This isn't just another sign-up. This is your commitment to
                            building real engineering signal that gets you noticed.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00D084] flex items-center justify-center mt-1">
                                    <span className="text-white text-sm font-bold">✓</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Honest Assessment
                                    </h3>
                                    <p className="text-gray-600">
                                        Get real feedback on where you stand
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00D084] flex items-center justify-center mt-1">
                                    <span className="text-white text-sm font-bold">✓</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Structured Framework
                                    </h3>
                                    <p className="text-gray-600">
                                        Clear path to building signal that matters
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00D084] flex items-center justify-center mt-1">
                                    <span className="text-white text-sm font-bold">✓</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        No Shortcuts
                                    </h3>
                                    <p className="text-gray-600">
                                        Just execution and accountability
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Sign In */}
                    <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-200">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2">Start Your Journey</h2>
                            <p className="text-gray-600">
                                Sign in with Google to begin building your signal
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            {error && (
                                <div className="w-full p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="w-full flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    text="continue_with"
                                    size="large"
                                    theme="outline"
                                    shape="pill"
                                />
                            </div>

                            {isLoading && (
                                <div className="text-sm text-gray-600">
                                    Signing you in...
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center leading-relaxed">
                                By continuing, you agree to take full responsibility for your
                                results. No guarantees. No shortcuts. Just signal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="py-8 px-6 bg-gray-900 text-white text-center">
                <p className="text-sm opacity-80">
                    Built for engineers who respect reality.
                </p>
            </div>
        </div>
    );
}
