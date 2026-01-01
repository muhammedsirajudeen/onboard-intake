"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function AdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await api.post("/api/admin/auth", { password });

            if (response.data.success) {
                router.push("/admin");
                router.refresh();
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Invalid password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-6">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-[#00D084]/10 rounded-full mb-4">
                            <svg className="w-12 h-12 text-[#00D084]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h1>
                        <p className="text-gray-600">Enter password to continue</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent"
                                placeholder="Enter admin password"
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-6 py-4 bg-[#00D084] text-white rounded-full font-semibold hover:bg-[#00B872] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? "Verifying..." : "Access Admin Panel"}
                        </button>
                    </form>

                    {/* Back Link */}
                    <div className="mt-6 text-center">
                        <a href="/" className="text-sm text-gray-600 hover:text-[#00D084] transition-colors">
                            ← Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
