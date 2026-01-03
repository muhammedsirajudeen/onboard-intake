"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // Check auth status and redirect when user clicks CTA
  const handleGetStarted = async () => {
    setIsCheckingAuth(true);

    try {
      // Check if user is authenticated
      const response = await api.get("/api/user/profile");

      console.log('📊 Profile API Response:', response.data);

      if (response.data.success && response.data.user) {
        const { profileCompleted, videoRecorded, isBeginnerLevel } = response.data.user;

        console.log('✅ Profile completed:', profileCompleted);
        console.log('🎥 Video recorded:', videoRecorded);
        console.log('👶 Is beginner:', isBeginnerLevel);

        // If user is beginner level, redirect to beginner page
        if (isBeginnerLevel) {
          console.log('➡️ Redirecting to BEGINNER page');
          router.push("/beginner");
        }
        // If both completed, go to success page
        else if (profileCompleted && videoRecorded) {
          console.log('➡️ Redirecting to SUCCESS page');
          router.push("/success");
        }
        // If only profile completed, go to video recording
        else if (profileCompleted && !videoRecorded) {
          console.log('➡️ Redirecting to VIDEO RECORDING page');
          router.push("/video-recording");
        }
        // If neither completed, go to onboarding
        else if (!profileCompleted) {
          console.log('➡️ Redirecting to ONBOARDING page');
          router.push("/onboarding");
        }
      } else {
        // Not authenticated, go to sign in
        console.log('➡️ Not authenticated, redirecting to SIGNIN');
        router.push("/signin");
      }
    } catch (err) {
      // Not authenticated or error, go to sign in
      console.error('❌ Auth check error:', err);
      router.push("/signin");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-bold tracking-tighter">Intake</span>
            <span className="text-[10px] text-[#00D084] font-medium tracking-wide text-right -mt-1">by onboard</span>
          </div>
          <button
            onClick={handleGetStarted}
            disabled={isCheckingAuth}
            className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isCheckingAuth ? "Loading..." : "Get Started"}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
            This is a <span className="text-[#00D084]">mirror.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Most developers are unemployable because they don't know where they stand.
            We fix that.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              disabled={isCheckingAuth}
              className="px-10 py-4 bg-[#00D084] text-white rounded-full font-bold text-lg hover:bg-[#00B872] transition-all hover:scale-105 disabled:opacity-50 shadow-lg shadow-emerald-200"
            >
              {isCheckingAuth ? "Loading..." : "Start Free Assessment"}
            </button>
          </div>
        </div>
      </section>

      {/* How It Works & Pricing */}
      <section className="py-20 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We assess your actual engineering capability, not your resume.
              Based on your results, we provide a tailored pack to move you forward.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1: Unhireable */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-red-200 hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
              <div className="mb-6 relative z-10">
                <span className="text-4xl font-black text-gray-200 group-hover:text-red-100 transition-colors">01</span>
                <h3 className="text-xl font-bold mt-2">Unhireable?</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6 min-h-[40px]">
                If your fundamentals are shaky and you lack production mindset.
              </p>
              <div className="pt-6 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Foundation Architect</p>
                <p className="text-3xl font-bold text-gray-900">₹1299</p>
                <p className="text-xs text-gray-500 mt-2">Foundation repair & core concepts.</p>
              </div>
            </div>

            {/* Step 2: Near-Hireable */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-yellow-200 hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
              <div className="mb-6 relative z-10">
                <span className="text-4xl font-black text-gray-200 group-hover:text-yellow-100 transition-colors">02</span>
                <h3 className="text-xl font-bold mt-2">Near-Hireable?</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6 min-h-[40px]">
                You have the basics but miss the nuance of senior engineering.
              </p>
              <div className="pt-6 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Senior Engineer Mindset</p>
                <p className="text-3xl font-bold text-gray-900">₹999</p>
                <p className="text-xs text-gray-500 mt-2">Advanced patterns & system design.</p>
              </div>
            </div>

            {/* Step 3: Hireable */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-emerald-200 hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400"></div>
              <div className="mb-6 relative z-10">
                <span className="text-4xl font-black text-gray-200 group-hover:text-emerald-100 transition-colors">03</span>
                <h3 className="text-xl font-bold mt-2">Hireable?</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6 min-h-[40px]">
                You are ready. Now we amplify your signal to top companies.
              </p>
              <div className="pt-6 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">1% Engineer Club</p>
                <p className="text-3xl font-bold text-gray-900">₹799</p>
                <p className="text-xs text-gray-500 mt-2">Career acceleration & elite networking.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Disclaimer */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center border p-6 rounded-xl bg-gray-50/50">
          <p className="text-sm text-gray-500 leading-relaxed">
            <strong>Note:</strong> We do not offer job guarantees. Our assessments are strict,
            and our packs are designed to clear your blind spots. Your career trajectory is your responsibility.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white text-gray-400 text-center border-t border-gray-100">
        <p className="text-sm">© 2026 Intake. Powered by Beyond Technologies Private Limited.</p>
      </footer>

      {/* Sticky WhatsApp CTA - Professional */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* Subtle pulsing ring */}
        <div className="absolute -inset-2 bg-[#25D366]/20 rounded-full animate-pulse"></div>

        {/* Main button */}
        <a
          href="https://wa.me/9526965228?text=Join%20Exclusive%20Program"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center gap-3 px-6 py-3.5 bg-[#25D366] text-white rounded-full font-semibold text-sm shadow-lg hover:shadow-xl hover:shadow-[#25D366]/30 transition-all hover:scale-105 group"
        >
          {/* WhatsApp Icon */}
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>

          <span className="whitespace-nowrap">Join exclusive membership</span>

          {/* Arrow */}
          <svg className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
