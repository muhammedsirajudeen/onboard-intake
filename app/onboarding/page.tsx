"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface SocialLinks {
    github: string;
    gitlab?: string;
    medium?: string;
    devto?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
}

export default function OnboardingPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({
        github: "",
        gitlab: "",
        medium: "",
        devto: "",
        twitter: "",
        linkedin: "",
        website: "",
    });

    useEffect(() => {
        // Check if user is authenticated and fetch profile
        const checkAuthAndFetchProfile = async () => {
            try {
                const response = await api.get("/api/user/profile");
                if (response.data.success && response.data.user) {
                    const { socialLinks, profileCompleted, videoRecorded } = response.data.user;

                    // If both profile and video completed, redirect to success
                    if (profileCompleted && videoRecorded) {
                        router.push("/success");
                        return;
                    }

                    // If profile is completed, pre-populate the form
                    if (profileCompleted && socialLinks) {
                        // Extract handles from URLs
                        const extractHandle = (url: string, platform: string) => {
                            if (!url) return "";
                            try {
                                const urlObj = new URL(url);
                                const pathname = urlObj.pathname;

                                switch (platform) {
                                    case 'github':
                                    case 'gitlab':
                                    case 'devto':
                                        return pathname.split('/').filter(Boolean)[0] || "";
                                    case 'medium':
                                        return pathname.replace('/@', '').split('/')[0] || "";
                                    case 'twitter':
                                    case 'linkedin':
                                        const parts = pathname.split('/').filter(Boolean);
                                        return parts[parts.length - 1] || "";
                                    case 'website':
                                        return url;
                                    default:
                                        return "";
                                }
                            } catch {
                                return "";
                            }
                        };

                        setSocialLinks({
                            github: extractHandle(socialLinks.github || "", 'github'),
                            gitlab: extractHandle(socialLinks.gitlab || "", 'gitlab'),
                            medium: extractHandle(socialLinks.medium || "", 'medium'),
                            devto: extractHandle(socialLinks.devto || "", 'devto'),
                            twitter: extractHandle(socialLinks.twitter || "", 'twitter'),
                            linkedin: extractHandle(socialLinks.linkedin || "", 'linkedin'),
                            website: extractHandle(socialLinks.website || "", 'website'),
                        });
                    }
                }
            } catch (err) {
                router.push("/signin");
            }
        };
        checkAuthAndFetchProfile();
    }, [router]);

    const handleInputChange = (field: keyof SocialLinks, value: string) => {
        setSocialLinks((prev) => ({
            ...prev,
            [field]: value,
        }));
        setError(null);
    };

    const validateForm = (): boolean => {
        if (!socialLinks.github.trim()) {
            setError("GitHub username is required");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Construct full URLs from handles
            const constructUrl = (platform: string, handle: string) => {
                if (!handle || !handle.trim()) return undefined;
                const cleanHandle = handle.trim().replace(/^@/, ''); // Remove @ if present

                switch (platform) {
                    case 'github':
                        return `https://github.com/${cleanHandle}`;
                    case 'gitlab':
                        return `https://gitlab.com/${cleanHandle}`;
                    case 'medium':
                        return `https://medium.com/@${cleanHandle}`;
                    case 'devto':
                        return `https://dev.to/${cleanHandle}`;
                    case 'twitter':
                        return `https://twitter.com/${cleanHandle}`;
                    case 'linkedin':
                        return `https://linkedin.com/in/${cleanHandle}`;
                    case 'website':
                        // For website, expect full URL
                        return handle.trim().startsWith('http') ? handle.trim() : `https://${handle.trim()}`;
                    default:
                        return undefined;
                }
            };

            await api.put("/api/user/profile", {
                socialLinks: {
                    github: constructUrl('github', socialLinks.github),
                    gitlab: constructUrl('gitlab', socialLinks.gitlab || ''),
                    medium: constructUrl('medium', socialLinks.medium || ''),
                    devto: constructUrl('devto', socialLinks.devto || ''),
                    twitter: constructUrl('twitter', socialLinks.twitter || ''),
                    linkedin: constructUrl('linkedin', socialLinks.linkedin || ''),
                    website: constructUrl('website', socialLinks.website || ''),
                },
            });

            // Redirect to video recording after successful submission
            router.push("/video-recording");
            router.refresh();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to save profile. Please try again.");
            console.error("Profile save error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex flex-col leading-none">
                        <span className="text-2xl font-bold tracking-tighter">Intake</span>
                        <span className="text-[10px] text-[#00D084] font-medium tracking-wide text-right -mt-1">by onboard</span>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-12">
                <div className="max-w-3xl w-full">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-block mb-4 px-4 py-2 bg-[#00D084]/10 rounded-full text-sm font-medium text-[#00D084]">
                            Step 2: Complete Your Profile
                        </div>
                        <h1 className="text-5xl font-bold mb-4 leading-tight">
                            <span className="text-[#00D084]">Developer</span> Presence
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Share your developer community profiles. GitHub is required.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-200">
                        <div className="space-y-6">
                            {/* GitHub - Required */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                                    GitHub Username
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        <span className="text-gray-400 text-sm whitespace-nowrap">github.com/</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={socialLinks.github}
                                        onChange={(e) => handleInputChange("github", e.target.value)}
                                        placeholder="yourusername"
                                        className="w-full pl-[140px] pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-4 bg-gray-50 text-sm text-gray-500">Optional Platforms</span>
                                </div>
                            </div>

                            {/* GitLab */}
                            <div>
                                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                                    GitLab Username
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.955 13.587l-1.342-4.135-2.664-8.189a.455.455 0 0 0-.867 0L16.418 9.45H7.582L4.919 1.263a.455.455 0 0 0-.867 0L1.388 9.452.045 13.587a.924.924 0 0 0 .331 1.023L12 23.054l11.624-8.443a.92.92 0 0 0 .331-1.024" />
                                        </svg>
                                        <span className="text-gray-400 text-sm whitespace-nowrap">gitlab.com/</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={socialLinks.gitlab}
                                        onChange={(e) => handleInputChange("gitlab", e.target.value)}
                                        placeholder="yourusername"
                                        className="w-full pl-[135px] pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Medium */}
                            <div>
                                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                                    Medium Username
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                                        </svg>
                                        <span className="text-gray-400 text-sm whitespace-nowrap">medium.com/@</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={socialLinks.medium}
                                        onChange={(e) => handleInputChange("medium", e.target.value)}
                                        placeholder="yourusername"
                                        className="w-full pl-[155px] pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Dev.to */}
                            <div>
                                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                                    Dev.to Username
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z" />
                                        </svg>
                                        <span className="text-gray-400 text-sm whitespace-nowrap">dev.to/</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={socialLinks.devto}
                                        onChange={(e) => handleInputChange("devto", e.target.value)}
                                        placeholder="yourusername"
                                        className="w-full pl-[105px] pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Twitter */}
                            <div>
                                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                                    Twitter/X Username
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                        <span className="text-gray-400 text-sm whitespace-nowrap">x.com/</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={socialLinks.twitter}
                                        onChange={(e) => handleInputChange("twitter", e.target.value)}
                                        placeholder="yourusername"
                                        className="w-full pl-[100px] pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* LinkedIn */}
                            <div>
                                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                                    LinkedIn Username
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                        <span className="text-gray-400 text-sm whitespace-nowrap">linkedin.com/in/</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={socialLinks.linkedin}
                                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                                        placeholder="yourusername"
                                        className="w-full pl-[170px] pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Personal Website */}
                            <div>
                                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                                    Personal Website
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                        <span className="text-gray-400 text-sm whitespace-nowrap">https://</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={socialLinks.website}
                                        onChange={(e) => handleInputChange("website", e.target.value)}
                                        placeholder="yourwebsite.com"
                                        className="w-full pl-[110px] pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D084] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit/Next Button */}
                        <div className="mt-8 pt-6 border-t border-gray-300">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full px-8 py-4 bg-[#00D084] text-white rounded-full font-semibold hover:bg-[#00B872] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isLoading ? "Saving..." : "Next: Record Video"}
                            </button>
                        </div>
                    </form>


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
