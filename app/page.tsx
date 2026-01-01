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
        const { profileCompleted, videoRecorded } = response.data.user;

        console.log('✅ Profile completed:', profileCompleted);
        console.log('🎥 Video recorded:', videoRecorded);

        // If both completed, go to success page
        if (profileCompleted && videoRecorded) {
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
    </div>
  );
}
