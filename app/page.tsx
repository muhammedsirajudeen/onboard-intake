"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00D084] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl">Signal</span>
          </div>
          <a
            href="#opt-in"
            className="px-6 py-2 bg-[#00D084] text-white rounded-full font-medium hover:bg-[#00B872] transition-colors"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
            Not a course. Not a bootcamp. Not a placement program.
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            This is a <span className="text-[#00D084]">mirror</span>.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Most developers remain unemployable despite learning stacks.
            <br />
            This platform shows you why—and what to do about it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#opt-in"
              className="px-8 py-4 bg-[#00D084] text-white rounded-full font-semibold hover:bg-[#00B872] transition-all hover:scale-105"
            >
              See Your Signal
            </a>
            <a
              href="#reality"
              className="px-8 py-4 border-2 border-gray-300 rounded-full font-semibold hover:border-[#00D084] transition-colors"
            >
              Read the Truth
            </a>
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="py-12 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
              <span className="text-red-600 text-sm font-bold">!</span>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">No Job Guarantee</h3>
              <p className="text-gray-700">
                This platform does <strong>not</strong> guarantee employment, referrals, or shortcuts.
                Your results depend entirely on your execution. We provide structure, feedback, and
                signal amplification—nothing more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Why Most Developers Remain Unemployable */}
      <section id="reality" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">
            Why Most Developers Remain Unemployable
          </h2>
          <div className="space-y-8">
            <div className="border-l-4 border-[#00D084] pl-6">
              <h3 className="text-2xl font-semibold mb-3">They confuse learning with building</h3>
              <p className="text-gray-700 text-lg">
                Completing tutorials feels productive. But hiring managers don't care about courses
                completed. They care about problems solved. If your GitHub shows only cloned repos
                and tutorial projects, you're invisible.
              </p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-6">
              <h3 className="text-2xl font-semibold mb-3">They optimize for credentials, not signal</h3>
              <p className="text-gray-700 text-lg">
                Certificates, bootcamp badges, LinkedIn endorsements—these are noise. Signal is what
                you've shipped, debugged, and maintained. If you can't explain a hard technical
                decision you made, you have no signal.
              </p>
            </div>
            <div className="border-l-4 border-red-500 pl-6">
              <h3 className="text-2xl font-semibold mb-3">They lack self-awareness</h3>
              <p className="text-gray-700 text-lg">
                Most developers overestimate their readiness. They apply to roles they're not
                qualified for, then blame the market. The market is fine. Your signal is weak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: What Hiring Managers Actually Evaluate */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">
            What Hiring Managers Actually Evaluate
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="text-3xl mb-4">❌</div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Ignored</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Number of courses completed</li>
                <li>• Certifications from online platforms</li>
                <li>• Years of "experience" without proof</li>
                <li>• Generic project descriptions</li>
                <li>• Buzzword-heavy resumes</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="text-3xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-3 text-[#00D084]">Evaluated</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Code quality in public repos</li>
                <li>• Ability to explain technical decisions</li>
                <li>• Evidence of debugging complex issues</li>
                <li>• Consistency in shipping work</li>
                <li>• Communication clarity</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 p-8 bg-[#00D084]/10 rounded-2xl border-2 border-[#00D084]">
            <p className="text-lg font-semibold text-gray-900">
              Signal beats credentials. Every. Single. Time.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Self-Assessment Framework */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Brutal Self-Assessment
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Answer honestly. No one is watching. This is for you.
          </p>
          <div className="space-y-6">
            <AssessmentTier
              tier="Tier 1: Invisible"
              color="bg-red-100 border-red-300"
              criteria={[
                "No public GitHub activity in the last 3 months",
                "Can't explain a technical decision you made",
                "Most projects are tutorial clones",
                "Haven't debugged a production issue",
                "Resume is full of buzzwords, light on specifics",
              ]}
              verdict="You are not ready. Start building."
            />
            <AssessmentTier
              tier="Tier 2: Weak Signal"
              color="bg-yellow-100 border-yellow-300"
              criteria={[
                "Some original projects, but incomplete",
                "Can explain what you built, not why",
                "No consistent commit history",
                "Haven't contributed to open source",
                "Can't articulate your learning process",
              ]}
              verdict="You're close, but not there yet. Focus on depth."
            />
            <AssessmentTier
              tier="Tier 3: Strong Signal"
              color="bg-green-100 border-green-300"
              criteria={[
                "Shipped and maintained at least 2 real projects",
                "Can explain trade-offs in your technical decisions",
                "Active GitHub with meaningful commits",
                "Have debugged complex, non-trivial issues",
                "Can communicate technical concepts clearly",
              ]}
              verdict="You're ready. Now amplify your signal."
            />
          </div>
        </div>
      </section>

      {/* Section 4: Real-World Engineering Tasks */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Tasks That Expose Gaps
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            These aren't trick questions. They're reality checks.
          </p>
          <div className="space-y-6">
            <TaskCard
              number={1}
              title="Debug a failing API integration"
              description="You're given a Node.js app that's supposed to fetch data from a third-party API. It's failing silently. Find the issue, fix it, and explain what went wrong."
              exposedGap="Can you read error logs? Do you understand async/await? Can you debug without Stack Overflow?"
            />
            <TaskCard
              number={2}
              title="Optimize a slow database query"
              description="A query is taking 8 seconds to return results. Identify the bottleneck and reduce it to under 500ms. Document your approach."
              exposedGap="Do you understand indexing? Can you read query execution plans? Do you know when to denormalize?"
            />
            <TaskCard
              number={3}
              title="Refactor a messy codebase"
              description="You inherit a 500-line function with no tests. Break it into smaller, testable units without changing behavior."
              exposedGap="Can you write clean code? Do you understand separation of concerns? Can you write tests?"
            />
            <TaskCard
              number={4}
              title="Design a rate limiter"
              description="Implement a simple rate limiter that allows 10 requests per minute per user. Explain your design choices."
              exposedGap="Do you understand algorithms? Can you think about edge cases? Can you justify trade-offs?"
            />
            <TaskCard
              number={5}
              title="Write a technical explanation"
              description="Explain how JWT authentication works to a junior developer. Be precise, not verbose."
              exposedGap="Can you communicate clearly? Do you actually understand the concepts you use?"
            />
          </div>
        </div>
      </section>

      {/* Section 5: Roadmap */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">
            The Roadmap: Ignore, Build, Demonstrate
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <RoadmapColumn
              title="Ignore"
              icon="🚫"
              items={[
                "More tutorials",
                "More certificates",
                "Networking events",
                "Resume templates",
                "LinkedIn optimization",
                "Coding challenges without context",
              ]}
            />
            <RoadmapColumn
              title="Build"
              icon="🔨"
              items={[
                "2-3 real projects you'd actually use",
                "Features that solve real problems",
                "Clean, documented code",
                "Tests for critical paths",
                "A consistent commit history",
                "Technical writing about your work",
              ]}
            />
            <RoadmapColumn
              title="Demonstrate"
              icon="📡"
              items={[
                "Public GitHub repos",
                "Technical blog posts",
                "Open source contributions",
                "Code reviews on your work",
                "Explanations of hard decisions",
                "Proof of debugging skills",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Explicit Disclaimer Section */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">
            What This Platform Is (and Isn't)
          </h2>
          <div className="space-y-6 text-lg">
            <div className="flex items-start gap-4">
              <span className="text-2xl">❌</span>
              <div>
                <strong>This is NOT:</strong>
                <ul className="mt-2 space-y-1 text-gray-300">
                  <li>• A job placement program</li>
                  <li>• A referral network</li>
                  <li>• A guarantee of employment</li>
                  <li>• A shortcut to interviews</li>
                  <li>• A hand-holding service</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">✅</span>
              <div>
                <strong>This IS:</strong>
                <ul className="mt-2 space-y-1 text-gray-300">
                  <li>• A structured framework for building signal</li>
                  <li>• Honest feedback on your current level</li>
                  <li>• Guidance on what to build and why</li>
                  <li>• A system to amplify your existing work</li>
                  <li>• A reality check, not a comfort zone</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 p-6 bg-white/10 rounded-xl border border-white/20">
            <p className="text-xl font-semibold">
              Your results depend entirely on your execution.
              <br />
              We provide the map. You walk the path.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="opt-in" className="py-20 px-6 bg-[#00D084]">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to See Your Signal?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Opt in only if you:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-3 mb-12 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Accept there is no job guarantee</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Are willing to be evaluated honestly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Want signal, not validation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Take full responsibility for your results</span>
            </li>
          </ul>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="flex-1 px-6 py-4 rounded-full text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all hover:scale-105"
                >
                  Get Access
                </button>
              </div>
              <p className="mt-4 text-sm opacity-80">
                No spam. No sales calls. Just the framework.
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto p-8 bg-white/10 rounded-2xl backdrop-blur">
              <p className="text-2xl font-bold mb-2">Check your email.</p>
              <p className="opacity-90">
                We've sent you the framework. Now it's on you to execute.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400 text-center">
        <p>© 2026 Signal. Built for engineers who respect reality.</p>
      </footer>
    </div>
  );
}

// Component: Assessment Tier
function AssessmentTier({
  tier,
  color,
  criteria,
  verdict,
}: {
  tier: string;
  color: string;
  criteria: string[];
  verdict: string;
}) {
  return (
    <div className={`p-6 rounded-xl border-2 ${color}`}>
      <h3 className="text-xl font-bold mb-4">{tier}</h3>
      <ul className="space-y-2 mb-4">
        {criteria.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-gray-600 mt-1">•</span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
      <p className="font-semibold text-gray-900 mt-4 pt-4 border-t border-gray-300">
        {verdict}
      </p>
    </div>
  );
}

// Component: Task Card
function TaskCard({
  number,
  title,
  description,
  exposedGap,
}: {
  number: number;
  title: string;
  description: string;
  exposedGap: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-[#00D084] text-white rounded-full flex items-center justify-center font-bold text-xl">
          {number}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-700 mb-4">{description}</p>
          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-[#00D084]">
            <p className="text-sm font-semibold text-gray-600 mb-1">What this exposes:</p>
            <p className="text-gray-700">{exposedGap}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component: Roadmap Column
function RoadmapColumn({
  title,
  icon,
  items,
}: {
  title: string;
  icon: string;
  items: string[];
}) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-200">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-6">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-[#00D084] mt-1">•</span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
