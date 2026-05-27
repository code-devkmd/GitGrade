import { useState } from "react";
import {
  Search,
  Star,
  GitFork,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Link as LinkIcon,
  Zap,
  ChevronRight,
  Activity,
  Code,
  Briefcase,
  Calendar,
} from "lucide-react";
import { FiGithub } from 'react-icons/fi';
import { CiTwitter } from 'react-icons/ci';

const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

// --- UTILITIES ---

const fetchWithRetry = async (url, options, retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, i)));
    }
  }
};

const getScoreColor = (score) => {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-rose-400";
};

const getPriorityColor = (priority = "low") => {
  const p = priority.toLowerCase();
  if (p === "high") return "bg-rose-500/10 text-rose-400 border-rose-500/30";
  if (p === "medium") return "bg-amber-500/10 text-amber-400 border-amber-500/30";
  return "bg-sky-500/10 text-sky-400 border-sky-500/30";
};

// --- SUB-COMPONENTS ---

const ScoreCard = ({ score, readinessLevel }) => {
  const scoreColor = getScoreColor(score);
  const strokeColor = score >= 80 ? "#10b981" : score >= 60 ? "#eab308" : "#ef4444";

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-3xl p-10 text-center relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />
      <h3 className="uppercase tracking-[3px] text-sm text-slate-500 mb-6">
        GitHub Profile Score
      </h3>
      <div className="relative w-48 h-48 mx-auto mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="72" fill="none" stroke="#1f2937" strokeWidth="14" />
          <circle
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke={strokeColor}
            strokeWidth="14"
            strokeDasharray={452}
            strokeDashoffset={452 - (452 * score) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-7xl font-black ${scoreColor}`}>{score}</span>
          <span className="text-slate-500 text-sm -mt-2">/100</span>
        </div>
      </div>
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800 rounded-2xl border border-slate-700 shadow-inner">
        <Briefcase className="w-5 h-5 text-indigo-400" />
        <span className="font-semibold text-lg">{readinessLevel}</span>
      </div>
    </div>
  );
};

const ProfileCard = ({ profileData }) => (
  <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
    <div className="flex gap-5">
      <img
        src={profileData.avatar_url}
        alt={profileData.login}
        className="w-20 h-20 rounded-2xl border-4 border-slate-800 shadow-xl"
      />
      <div className="flex-1 pt-1">
        <h2 className="text-2xl font-bold text-slate-100">
          {profileData.name || profileData.login}
        </h2>
        <a
          href={profileData.html_url}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-lg transition-colors"
        >
          @{profileData.login} <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
    {profileData.bio && (
      <p className="mt-6 text-slate-300 italic border-l-4 border-slate-700 pl-4">
        "{profileData.bio}"
      </p>
    )}
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
      {profileData.location && (
        <div className="flex items-center gap-3 text-slate-400">
          <MapPin className="w-5 h-5" /> {profileData.location}
        </div>
      )}
      {profileData.blog && (
        <div className="flex items-center gap-3 text-slate-400">
          <LinkIcon className="w-5 h-5" />
          <a
            href={
              profileData.blog.startsWith("http")
                ? profileData.blog
                : `https://${profileData.blog}`
            }
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-400 truncate transition-colors"
          >
            Website
          </a>
        </div>
      )}
      {profileData.twitter_username && (
        <div className="flex items-center gap-3 text-slate-400">
          <CiTwitter className="w-5 h-5" />
          <a
            href={`https://x.com/${profileData.twitter_username}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-400 transition-colors"
          >
            @{profileData.twitter_username}
          </a>
        </div>
      )}
    </div>
    <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-slate-800">
      <div className="text-center bg-slate-950/70 rounded-2xl p-4 border border-slate-800/50">
        <div className="text-3xl font-bold text-emerald-400">
          {profileData.followers}
        </div>
        <div className="text-xs uppercase tracking-widest text-slate-500 mt-1">
          Followers
        </div>
      </div>
      <div className="text-center bg-slate-950/70 rounded-2xl p-4 border border-slate-800/50">
        <div className="text-3xl font-bold text-cyan-400">
          {profileData.public_repos}
        </div>
        <div className="text-xs uppercase tracking-widest text-slate-500 mt-1">
          Repositories
        </div>
      </div>
    </div>
  </div>
);

const AnalysisSummary = ({ summary, strengths }) => (
  <div className="bg-slate-900 border border-slate-700 rounded-3xl p-9 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex items-center gap-3 mb-6">
      <Zap className="w-7 h-7 text-yellow-400" />
      <h3 className="text-2xl font-bold">Executive Summary</h3>
    </div>
    <p className="text-slate-300 text-lg leading-relaxed">{summary}</p>
    <h4 className="mt-10 mb-5 text-sm font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-2">
      <TrendingUp className="w-4 h-4" /> Key Strengths
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {strengths.length > 0 ? (
        strengths.map((strength, i) => (
          <div
            key={i}
            className="flex gap-4 bg-slate-800/50 border border-slate-700 p-5 rounded-2xl hover:bg-slate-800 transition-colors"
          >
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300">{strength}</p>
          </div>
        ))
      ) : (
        <p className="text-slate-500 italic">No strengths identified.</p>
      )}
    </div>
  </div>
);

const ActionPlan = ({ improvements }) => (
  <div className="bg-slate-900 border border-slate-700 rounded-3xl p-9 animate-in fade-in slide-in-from-bottom-6 duration-500">
    <div className="flex items-center gap-3 mb-8">
      <Activity className="w-7 h-7 text-cyan-400" />
      <h3 className="text-2xl font-bold">Action Plan</h3>
    </div>
    <div className="space-y-6">
      {improvements.length > 0 ? (
        improvements.map((item, i) => (
          <div
            key={i}
            className="group bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-3xl p-7 transition-all hover:shadow-lg hover:shadow-slate-900/50"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-semibold text-xl text-slate-100 pr-4">
                {item.title}
              </h4>
              <span
                className={`px-4 py-1 text-xs font-bold rounded-full border whitespace-nowrap ${getPriorityColor(
                  item.priority
                )}`}
              >
                {item.priority.toUpperCase()}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">{item.description}</p>
          </div>
        ))
      ) : (
        <p className="text-slate-500 italic p-8 text-center">
          No improvement suggestions available.
        </p>
      )}
    </div>
  </div>
);

const RecentRepos = ({ repos }) => (
  <div className="bg-slate-900 border border-slate-700 rounded-3xl p-9 animate-in fade-in slide-in-from-bottom-8 duration-500">
    <div className="flex items-center gap-3 mb-8">
      <Code className="w-7 h-7 text-indigo-400" />
      <h3 className="text-2xl font-bold">Recent Repositories</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {repos.slice(0, 6).map((repo) => (
        <a
          key={repo.name}
          href={repo.html_url || `https://github.com/${repo.name}`}
          target="_blank"
          rel="noreferrer"
          className="group block p-6 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-3xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
        >
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-lg group-hover:text-indigo-400 transition-colors line-clamp-1">
              {repo.name}
            </h4>
            <div className="flex items-center gap-1 text-amber-400 text-sm">
              <Star className="w-4 h-4" /> {repo.stars}
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-3 line-clamp-2 min-h-[2.75rem]">
            {repo.description || "No description provided."}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                {repo.language}
              </div>
            )}
            <div className="flex items-center gap-1">
              <GitFork className="w-4 h-4" /> {repo.forks}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(repo.updated).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </a>
      ))}
    </div>
  </div>
);

const LoadingScreen = ({ step }) => (
  <div className="py-24 md:py-32 flex-col flex items-center justify-center overflow-hidden animate-in fade-in duration-300">
    <div className="relative flex flex-col items-center text-center z-10">
      <div className="relative w-40 h-40 mb-10">
        <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
        <div className="absolute inset-4 border-4 border-indigo-400/40 rounded-full animate-[spin_2.2s_linear_infinite_reverse]"></div>
        <div className="absolute inset-8 border-4 border-emerald-400/50 rounded-full animate-[spin_1.6s_linear_infinite]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-cyan-500 to-emerald-500 rounded-2xl p-1 shadow-2xl shadow-cyan-500/50 animate-pulse">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden">
                <FiGithub className="w-10 h-10 text-white animate-[spin_8s_linear_infinite]" />
              </div>
            </div>
            <div className="absolute -inset-4 bg-cyan-400/20 rounded-3xl blur-xl animate-ping" style={{ animationDuration: '3s' }}></div>
          </div>
        </div>
      </div>
      <h3 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-300 to-indigo-300 bg-clip-text text-transparent mb-2">
        Analyzing GitHub Profile
      </h3><br/>
      <div className="flex items-center gap-3 text-slate-400 font-mono text-sm">
        <span>{step}</span>
        <span className="inline-flex text-[28px] animate-pulse">...</span>
      </div>
      <p className="mt-6 text-xs uppercase tracking-[2px] text-slate-500 font-medium">
        AI Recruiter • Powered by Groq
      </p>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---

export default function App() {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState("");
    const [error, setError] = useState("");
    const [profileData, setProfileData] = useState(null);
    const [analysis, setAnalysis] = useState(null);

    const trimmedApiKey = (groqApiKey || "").trim();

    const analyzeProfile = async (e) => {
      e.preventDefault();
      if (!username.trim()) return;
      if (!trimmedApiKey) {
        setError("Missing Groq API key. Add VITE_GROQ_API_KEY to your environment.");
        return;
      }
    
    setLoading(true);
    setError("");
    setProfileData(null);
    setAnalysis(null);

    try {
      // 1. Fetch GitHub User Data
      setLoadingStep("Fetching GitHub Profile");
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error("GitHub user not found or API limit reached.");
      const userData = await userRes.json();

      // 2. Fetch GitHub Repositories
      setLoadingStep("Fetching Repositories");
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
      const reposData = await reposRes.json();

      const profileSummary = {
        login: userData.login,
        name: userData.name || userData.login,
        bio: userData.bio || "No bio provided.",
        location: userData.location || null,
        followers: userData.followers,
        public_repos: userData.public_repos,
        repos: reposData.slice(0, 10).map((r) => ({
          name: r.name,
          description: r.description || "",
          language: r.language || "Unknown",
          stars: r.stargazers_count,
          forks: r.forks_count,
          updated: r.updated_at,
          html_url: r.html_url
        })),
      };

      setProfileData({ ...userData, repos: profileSummary.repos });
      setLoadingStep("AI Analyzing Profile");

      // 3. Prepare AI Prompt for Groq
      const systemPrompt = `You are an expert senior tech recruiter with 10+ years of experience hiring software engineers.
        Your task is to evaluate a GitHub profile like a real recruiter would.
        CRITICAL RULES:
          - You MUST respond with **valid JSON only**. No explanations, no markdown, no extra text.
          - The JSON must exactly match the schema below.
          - Be honest, constructive, and professional.`;

      const userPrompt = `Analyze this GitHub profile data and return a JSON object.
      Profile Data: ${JSON.stringify(profileSummary, null, 2)}  
      Return ONLY this exact JSON structure (no extra keys, no extra text):
      {
        "score": number,                    // Overall profile quality score from 0 to 100
        "readinessLevel": string,           // One of: "Junior Ready", "Mid-Level Ready", "Senior Ready", "Industry Ready", "Needs Significant Work"
        "summary": string,                  // 2-4 sentence professional summary highlighting the candidate's current marketability
        "strengths": array of strings,      // 3-6 bullet-style strengths (short and impactful)
        "improvements": array of objects,   // Actionable suggestions. Each object must have:
    //  {
    //    "title": string,              // Short actionable title
    //    "description": string,        // Detailed explanation + why it matters
    //    "priority": "high" | "medium" | "low"
    //  }
      }`;

      const groqPayload = {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1200,
      };

      // 4. Call Groq API
      const aiResponse = await fetchWithRetry(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${trimmedApiKey}`,
          },
          body: JSON.stringify(groqPayload),
        }
      );

      let aiText = aiResponse.choices?.[0]?.message?.content?.trim();
      if (!aiText) throw new Error("AI returned empty response.");

      let parsedAnalysis;
      try {
        parsedAnalysis = JSON.parse(aiText);
      } catch (parseErr) {
        console.log("Error:", parseErr);
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedAnalysis = JSON.parse(jsonMatch[0]);
        } 
      }

      // Safety clamps and defaults
      parsedAnalysis.score = Math.max(0, Math.min(100, Number(parsedAnalysis.score) || 65));
      parsedAnalysis.readinessLevel = parsedAnalysis.readinessLevel || "Mid-Level Ready";
      parsedAnalysis.summary = parsedAnalysis.summary || "No summary provided by AI.";
      parsedAnalysis.strengths = Array.isArray(parsedAnalysis.strengths) ? parsedAnalysis.strengths : [];
      parsedAnalysis.improvements = Array.isArray(parsedAnalysis.improvements) ? parsedAnalysis.improvements : [];
      
      setAnalysis(parsedAnalysis);
    } catch (err) {
      console.error("Analysis Error:", err);
      setError(err.message || "Failed to analyze profile. Please try again.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Search Header Area */}
        <div className={`transition-all duration-700 ease-in-out ${profileData && !loading ? "mb-12" : "mt-16 md:mt-32"}`}>
          {!profileData && !loading && (
        <div className="text-center max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
            <Activity className="w-4 h-4" /> Powered by Groq AI
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
                Rate your GitHub.
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Get Job Ready.
                </span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                Get an instant AI-powered professional assessment of your GitHub profile to stand out to tech recruiters.
              </p>
            </div>
          )}

          <form onSubmit={analyzeProfile} className="max-w-2xl mx-auto relative z-20">
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username (e.g., torvalds)"
                className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-full py-5 pl-16 pr-44 text-lg placeholder-slate-500 outline-none transition-all shadow-xl"
              />
              <button
                type="submit"
                disabled={loading || !username.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-semibold px-6 py-3.5 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/25 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Activity className="w-5 h-5 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    Analyze <ChevronRight className="w-5 h-5 -ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 max-w-xl mx-auto p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex gap-3 animate-in fade-in zoom-in-95">
              <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
              <p className="text-rose-300 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && <LoadingScreen step={loadingStep} />}

        {/* Results State */}
        {profileData && analysis && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <ScoreCard score={analysis.score} readinessLevel={analysis.readinessLevel} />
              <ProfileCard profileData={profileData} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              <AnalysisSummary summary={analysis.summary} strengths={analysis.strengths} />
              <ActionPlan improvements={analysis.improvements} />
              {profileData.repos && profileData.repos.length > 0 && (
                <RecentRepos repos={profileData.repos} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
