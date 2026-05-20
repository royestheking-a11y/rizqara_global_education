import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  Calendar, CheckCircle, Shield, Bookmark, ArrowRight, X, Star,
  Globe, Clock, AlertTriangle, ChevronRight, Users, DollarSign, Plane,
  Search, BookOpen, Clipboard, Home, Activity, Info, FileText, Lightbulb,
  Banknote, HelpCircle, AlertCircle
} from "lucide-react";
import { api } from "../services/api";
import { useSavedScholarships, useAuth } from "../hooks/useAuth";
import { SEO } from "../components/SEO";

import { DetailsSkeleton } from "../components/ui/PremiumSkeletons";

export default function ScholarshipDetails() {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState<any>(null);
  const [relatedScholarships, setRelatedScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSaved, toggle } = useSavedScholarships();
  const saved = scholarship ? isSaved(scholarship._id || scholarship.id) : false;
  const [activeTab, setActiveTab] = useState("overview");
  const [eligibilityOpen, setEligibilityOpen] = useState(false);
  const [eligibilityAnswers, setEligibilityAnswers] = useState<any>({});
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleApply = async () => {
    if (!isLoggedIn || !user) {
      navigate("/register");
      return;
    }
    
    try {
      await api.post('/applications', {
        student: user.id || (user as any)._id,
        scholarship: scholarship._id || scholarship.id,
        status: 'Profile Received',
        progress: 5
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to apply", err);
      navigate("/dashboard");
    }
  };

  const handleProfileCheck = () => {
    if (isLoggedIn) {
      navigate("/dashboard/messages");
    } else {
      navigate("/register");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sData, allScholarships] = await Promise.all([
          api.get(`/scholarships/${id}`),
          api.get('/scholarships')
        ]);
        setScholarship(sData);
        
        // Find related scholarships
        if (sData) {
          const related = allScholarships.filter((x: any) => 
            (x._id || x.id) !== (sData._id || sData.id) && 
            (x.country === sData.country || x.degree?.some((d: string) => sData.degree?.includes(d)))
          ).slice(0, 3);
          setRelatedScholarships(related);
        }
      } catch (err) {
        console.error("Failed to fetch scholarship details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FDF8F5" }}>
        <div className="text-center">
          <div className="text-gray-300 mb-4"><Search size={64} className="mx-auto" /></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Scholarship Not Found</h2>
          <p className="text-gray-500 mb-6">The scholarship you're looking for doesn't exist.</p>
          <Link to="/scholarships" className="px-6 py-3 text-white rounded-xl font-semibold" style={{ backgroundColor: "#7B1F2E" }}>
            Browse All Scholarships
          </Link>
        </div>
      </div>
    );
  }

  const s = scholarship;

  const toggleSave = () => {
    toggle(s.id || s._id);
  };

  const statusColors: any = {
    "Open": "bg-green-100 text-green-700 border-green-200",
    "Closing Soon": "bg-red-100 text-red-700 border-red-200",
    "Upcoming": "bg-blue-100 text-blue-700 border-blue-200",
    "Closed": "bg-gray-100 text-gray-500 border-gray-200"
  };

  const tabs = ["overview", "benefits", "eligibility", "documents", "process", "support"];

  const checkEligibility = () => {
    const score = Object.values(eligibilityAnswers).filter(Boolean).length;
    if (score >= 4) setEligibilityResult("eligible");
    else if (score >= 2) setEligibilityResult("maybe");
    else setEligibilityResult("not-eligible");
  };

  const scholarshipSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${s.name} for International Students`,
    "description": s.description || `Apply for ${s.name} in ${s.country}. Explore eligibility, benefits, and application process.`,
    "image": s.image || "/og-image.png",
    "author": {
      "@type": "Organization",
      "name": "RizQara Global Education"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RizQara Global Education",
      "logo": {
        "@type": "ImageObject",
        "url": "https://rizqaraglobaleducation.vercel.app/logo.png"
      }
    },
    "datePublished": s.createdAt || "2026-05-13"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://rizqaraglobaleducation.vercel.app/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Scholarships",
        "item": "https://rizqaraglobaleducation.vercel.app/scholarships"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": s.name,
        "item": `https://rizqaraglobaleducation.vercel.app/scholarships/${s.slug || s._id}`
      }
    ]
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#FDF8F5" }}>
      <SEO 
        title={`${s.name} | Scholarship Details for International Students`}
        description={`Detailed guide on ${s.name} for international students. Learn about eligibility, required documents, and how to apply successfully.`}
        keywords={`${s.name}, ${s.country} scholarship, study in ${s.country} abroad, scholarship application guide`}
        canonical={`/scholarships/${s.slug || s._id}`}
        ogImage={s.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"}
        schema={[scholarshipSchema, breadcrumbSchema]}
      />
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-6 sm:py-10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-red-200 text-[9px] sm:text-xs mb-4 sm:mb-6 overflow-hidden">
            <Link to="/" className="hover:text-white shrink-0">Home</Link>
            <ChevronRight size={10} className="shrink-0 opacity-50" />
            <Link to="/scholarships" className="hover:text-white shrink-0">Scholarships</Link>
            <ChevronRight size={10} className="shrink-0 opacity-50" />
            <span className="text-white truncate opacity-90">{s.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="text-3xl sm:text-4xl">{s.countryFlag}</span>
                <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-sm font-semibold border ${statusColors[s.status]}`}>{s.status}</span>
                {s.isVerified && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs bg-white/20 text-white border border-white/30">
                    <Shield size={10} className="sm:w-3 sm:h-3" /> <span className="hidden xs:inline">Verified Official Source</span><span className="xs:hidden">Verified</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">{s.name}</h1>
              <p className="text-red-100 text-base sm:text-lg mb-4 opacity-90">{s.country} • {s.university}</p>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-white/80">
                <span className="flex items-center gap-1.5"><BookOpen size={13} className="text-red-200" />{s.degree.join(", ")}</span>
                <span className="hidden xs:inline text-white/30">•</span>
                <span className="flex items-center gap-1.5"><DollarSign size={13} className="text-red-200" />{s.fundingType}</span>
                <span className="hidden xs:inline text-white/30">•</span>
                <span className="flex items-center gap-1.5"><Clipboard size={13} className="text-red-200" />{s.ieltsRequired ? "IELTS Required" : s.moiAccepted ? "MOI Accepted" : "No IELTS"}</span>
                {s.daysLeft && (
                  <>
                    <span className="hidden xs:inline text-white/30">•</span>
                    <span className={`flex items-center gap-1.5 font-semibold ${s.daysLeft <= 14 ? "text-yellow-400" : "text-white"}`}>
                      <Clock size={13} />{s.daysLeft} days left
                    </span>
                  </>
                )}
              </div>

              {s.matchScore && (
                <div className="mt-5 inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
                  <Star size={13} fill="white" color="white" className="opacity-80" />
                  <span className="text-white text-[11px] sm:text-sm font-semibold uppercase tracking-wider">Profile Match: {s.matchScore}%</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0 w-full lg:w-64">
              <button
                onClick={handleApply}
                className="py-3 px-6 rounded-xl font-bold text-sm text-center transition-all duration-200 bg-white text-[#7B1F2E] hover:shadow-lg active:scale-[0.98] flex-1 lg:w-full border-b-4 border-gray-200"
              >
                Apply with RizQara Guidance
              </button>
              <div className="flex gap-2 w-full">
                <button
                  onClick={toggleSave}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm border flex items-center justify-center gap-2 transition ${saved ? "bg-white/20 border-white text-white" : "border-white/40 text-white hover:bg-white/20"}`}
                >
                  <Bookmark size={14} fill={saved ? "white" : "none"} />
                  {saved ? "Saved" : "Save"}
                </button>
                <button
                  onClick={() => setEligibilityOpen(true)}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
                >
                  Check Eligibility
                </button>
              </div>
              {s.officialLink && (
                <a href={s.officialLink} target="_blank" rel="noopener noreferrer"
                  className="py-2.5 px-6 rounded-xl text-[10px] sm:text-xs border border-white/10 text-white/60 text-center hover:bg-white/10 hover:text-white transition flex items-center justify-center gap-1.5 w-full">
                  <Globe size={12} /> Official Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Key Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 w-full max-w-full box-border">
              <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7B1F2E10] flex items-center justify-center shrink-0">
                  <Info size={16} className="text-[#7B1F2E]" />
                </div>
                Key Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { label: "Country", value: `${s.countryFlag} ${s.country}` },
                  { label: "Funding", value: s.fundingType },
                  { label: "Scholarship", value: s.scholarshipType },
                  { label: "IELTS", value: s.ieltsRequired ? "Required" : "No IELTS" },
                  { label: "MOI", value: s.moiAccepted ? "Accepted" : "No" },
                  { label: "Deadline", value: s.deadline },
                  { label: "Intake", value: s.intake },
                  { label: "App Fee", value: s.applicationFee },
                  { label: "Difficulty", value: s.difficulty },
                ].map(item => (
                  <div key={item.label} className="p-3.5 rounded-2xl border border-gray-50 flex flex-col justify-center bg-[#FDF8F5]">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-black mb-1">{item.label}</div>
                    <div className="text-xs sm:text-sm font-black text-gray-800 break-words line-clamp-2" title={item.value}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="relative group">
                <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm px-2">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 sm:px-5 py-4 text-[12px] sm:text-[13px] font-bold capitalize whitespace-nowrap border-b-2 transition-all ${
                        activeTab === tab ? "border-[#7B1F2E] text-[#7B1F2E] bg-white" : "border-transparent text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {/* Horizontal Scroll Hint Overlay */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50/50 to-transparent pointer-events-none sm:hidden" />
              </div>

              <div className="p-4 sm:p-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">About this Scholarship</h4>
                      <p className="text-gray-600 leading-relaxed text-sm">{s.description}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <BookOpen size={16} className="text-[#7B1F2E]" />
                        Target Subjects
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {s.subjects.map((sub: string) => (
                          <span key={sub} className="px-3 py-1.5 rounded-lg text-[11px] sm:text-xs bg-gray-100 text-gray-700 font-medium border border-gray-200/50">{sub}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Star size={16} className="text-[#7B1F2E]" />
                        Degree Levels
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {s.degree.map((d: string) => (
                          <span key={d} className="px-3 py-1.5 rounded-lg text-[11px] sm:text-xs text-white font-bold tracking-wide shadow-sm" style={{ backgroundColor: "#7B1F2E" }}>{d}</span>
                        ))}
                      </div>
                    </div>
                    {s.rizqaraNote && (
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#7B1F2E08", border: "1px solid #7B1F2E20" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Star size={14} fill="#7B1F2E" color="#7B1F2E" />
                        <span className="text-sm font-semibold" style={{ color: "#7B1F2E" }}>RizQara Expert Note</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{s.rizqaraNote}</p>
                    </div>
                    )}
                  </div>
                )}

                {activeTab === "benefits" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">Scholarship Benefits</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {s.benefits.map((b: string, i: number) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-green-50">
                            <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {[
                        { icon: <DollarSign size={16} />, label: "Monthly Stipend", value: s.stipend || "Included" },
                        { icon: <Home size={16} />, label: "Accommodation", value: s.accommodation ? "Provided" : "Not included" },
                        { icon: <Activity size={16} />, label: "Health Insurance", value: s.healthInsurance ? "Provided" : "Not included" },
                        { icon: <Plane size={16} />, label: "Air Ticket", value: s.airTicket ? "Round trip" : "Not included" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-[#7B1F2E20] transition-colors">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#7B1F2E10" }}>
                            <span style={{ color: "#7B1F2E" }}>{item.icon}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{item.label}</div>
                            <div className="text-sm font-bold text-gray-800 truncate">{item.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#FDF8F5" }}>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500 text-xs">Tuition Fee</span>
                          <div className="font-semibold text-gray-800">{s.tuitionFee}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Living Cost</span>
                          <div className="font-semibold text-gray-800">{s.livingCost}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "eligibility" && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Eligibility Requirements</h4>
                    <div className="space-y-3">
                      {s.eligibility.map((e: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: "#7B1F2E" }}>
                            {i + 1}
                          </div>
                          <span className="text-sm text-gray-700">{e}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                      <h5 className="font-semibold text-blue-800 text-sm mb-2 flex items-center gap-2">
                        <Info size={16} /> Language Requirements
                      </h5>
                      <p className="text-sm text-blue-700">
                        Language: {s.language || "Check official website"}<br />
                        IELTS: {s.ieltsRequired ? "Required" : "Not Required"}<br />
                        MOI Accepted: {s.moiAccepted ? "Yes" : "No"}
                      </p>
                    </div>
                    <button
                      onClick={() => setEligibilityOpen(true)}
                      className="mt-4 w-full py-3 rounded-xl font-semibold text-sm text-white transition hover:opacity-90"
                      style={{ backgroundColor: "#7B1F2E" }}
                    >
                      Check Your Eligibility Instantly
                    </button>
                  </div>
                )}

                {activeTab === "documents" && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Required Documents</h4>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                      {s.requiredDocuments.map((doc: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100 bg-white hover:border-[#7B1F2E20] transition-colors">
                          <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-[#7B1F2E] shrink-0 border border-gray-100"><FileText size={16} /></div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">{doc}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 p-4 rounded-2xl" style={{ backgroundColor: "#7B1F2E08", border: "1px solid #7B1F2E20" }}>
                      <p className="text-sm" style={{ color: "#7B1F2E" }}>
                        <strong className="flex items-center gap-1.5 mb-1.5"><Lightbulb size={16} /> RizQara Pro Tip:</strong> Start collecting your documents early. Translation and attestation can take 2-4 weeks.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "process" && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Application Process</h4>
                    <div className="space-y-3">
                      {s.applicationSteps.map((step: string, i: number) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: "#7B1F2E" }}>
                            {i + 1}
                          </div>
                          <div className="flex-1 pb-4 border-b border-gray-100 last:border-b-0">
                            <span className="text-sm text-gray-700">{step}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: "#7B1F2E10" }}>
                      <p className="text-sm text-gray-700">
                        <strong>Need help with the process?</strong> RizQara's team will guide you through every step.
                      </p>
                      <Link to="/contact" className="inline-flex items-center gap-1 mt-2 text-xs font-semibold" style={{ color: "#7B1F2E" }}>
                        Get Guidance <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                )}

                {activeTab === "support" && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">RizQara Support for this Scholarship</h4>
                    <div className="grid gap-3">
                      {[
                        "Profile evaluation & eligibility check",
                        "Complete document checklist",
                        "SOP & Motivation letter writing",
                        "CV preparation",
                        "Application form filling support",
                        "Interview preparation",
                        "Visa file guidance",
                        "Pre-departure counselling"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                          <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/contact" className="mt-5 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition" style={{ backgroundColor: "#7B1F2E" }}>
                      Apply with RizQara Guidance <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
            {/* Quick Apply Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 w-full max-w-full box-border">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: "#7B1F2E" }}>
                  <Clipboard size={18} />
                </div>
                <h4 className="font-bold text-gray-900">Apply with Guidance</h4>
              </div>
              
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusColors[s.status]}`}>{s.status}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Deadline</span>
                  <span className="text-sm font-bold text-gray-800">{s.deadline}</span>
                </div>
                {s.daysLeft && (
                  <div className={`p-3 rounded-xl flex items-center gap-3 ${s.daysLeft <= 14 ? "bg-red-50" : "bg-green-50"}`}>
                    <Clock size={16} className={s.daysLeft <= 14 ? "text-red-600" : "text-green-600"} />
                    <span className={`text-xs font-bold ${s.daysLeft <= 14 ? "text-red-700" : "text-green-700"}`}>
                      {s.daysLeft <= 14 ? `Only ${s.daysLeft} days left!` : `${s.daysLeft} days remaining`}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleApply}
                  className="w-full py-4 rounded-xl text-white font-bold text-sm text-center shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 border-b-4 border-[#5a1622]" 
                  style={{ backgroundColor: "#7B1F2E" }}
                >
                  Start Application
                </button>
                <button 
                  onClick={handleProfileCheck}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-center border-2 border-[#7B1F2E20] text-[#7B1F2E] hover:bg-[#7B1F2E05] transition-all duration-200"
                >
                  Free Profile Check
                </button>
              </div>
            </div>

            {/* Funding Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 w-full max-w-full box-border">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: "#7B1F2E15" }}>
                  <DollarSign size={18} className="text-[#7B1F2E]" />
                </div>
                <h4 className="font-bold text-gray-900">Funding Summary</h4>
              </div>
              <div className="space-y-4">
                {[
                  { icon: <BookOpen size={16} />, label: "Tuition", value: s.tuitionFee },
                  { icon: <Home size={16} />, label: "Housing", value: s.accommodation ? "Provided" : "Self" },
                  { icon: <Banknote size={16} />, label: "Stipend", value: s.stipend || "Included" },
                  { icon: <Plane size={16} />, label: "Travel", value: s.airTicket ? "Round trip" : "Not included" },
                  { icon: <Activity size={16} />, label: "Health", value: s.healthInsurance ? "Covered" : "Not included" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 pb-3 border-b border-gray-50 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[#7B1F2E] shrink-0">{item.icon}</span>
                      <span className="text-xs sm:text-sm text-gray-500 font-medium truncate">{item.label}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-black text-gray-800 break-words line-clamp-2">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
              <h4 className="font-bold text-gray-900 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((tag: string) => (
                  <Link 
                    key={tag} 
                    to={`/scholarships?q=${tag}`} 
                    className="px-3 py-1 rounded-full text-xs border transition-all duration-200 border-[#7B1F2E30] text-[#7B1F2E] hover:bg-[#7B1F2E] hover:text-white active:bg-[#7B1F2E] active:text-white active:scale-95"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {relatedScholarships.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star size={20} className="text-[#7B1F2E]" /> Related Scholarships
            </h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedScholarships.map(rs => (
                <Link key={rs.slug || rs.id || rs._id} to={`/scholarships/${rs.slug || rs.id || rs._id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                  <div className="h-32 overflow-hidden relative">
                    <img src={rs.image} alt={rs.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                      {rs.countryFlag} {rs.country}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#7B1F2E] transition-colors">{rs.name}</h4>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#7B1F2E] bg-[#7B1F2E10] px-2 py-0.5 rounded-md uppercase">{rs.fundingType}</span>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-[#7B1F2E] transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Eligibility Checker Modal */}
      {eligibilityOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">Check Your Eligibility</h3>
              <button onClick={() => { setEligibilityOpen(false); setEligibilityResult(null); setEligibilityAnswers({}); }}><X size={18} /></button>
            </div>

            {!eligibilityResult ? (
              <div className="space-y-4">
                {[
                  { key: "gpa", label: "Do you meet the GPA/grade requirement?" },
                  { key: "language", label: s.ieltsRequired ? "Do you have IELTS 5.5+ or English proficiency certificate?" : "Do you have MOI certificate or IELTS?" },
                  { key: "passport", label: "Do you have a valid passport?" },
                  { key: "degree", label: `Are you applying for ${s.degree.join(" or ")}?` },
                  { key: "nationality", label: "Are you an international student?" },
                ].map(q => (
                  <div key={q.key}>
                    <p className="text-sm text-gray-700 mb-2">{q.label}</p>
                    <div className="flex gap-2">
                      {["Yes", "No", "Not Sure"].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setEligibilityAnswers((prev: any) => ({ ...prev, [q.key]: opt === "Yes" }))}
                          className={`flex-1 py-2 text-xs rounded-lg border font-medium transition-all duration-200 ${
                            eligibilityAnswers[q.key] === (opt === "Yes") && opt !== "Not Sure" 
                              ? "bg-[#7B1F2E] text-white border-[#7B1F2E]" 
                              : "border-gray-200 text-gray-600 hover:border-[#7B1F2E30] hover:text-[#7B1F2E]"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={checkEligibility}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm mt-2"
                  style={{ backgroundColor: "#7B1F2E" }}
                >
                  Check Eligibility
                </button>
              </div>
            ) : (
              <div className="text-center">
                {eligibilityResult === "eligible" && (
                  <>
                    <div className="text-green-500 mb-3 flex justify-center"><CheckCircle size={48} /></div>
                    <h4 className="text-lg font-bold text-green-700 mb-2">You're Eligible!</h4>
                    <p className="text-sm text-gray-600 mb-5">Great news! Based on your answers, you appear to meet the eligibility requirements for {s.name}.</p>
                  </>
                )}
                {eligibilityResult === "maybe" && (
                  <>
                    <div className="text-yellow-500 mb-3 flex justify-center"><HelpCircle size={48} /></div>
                    <h4 className="text-lg font-bold text-yellow-700 mb-2">Maybe Eligible</h4>
                    <p className="text-sm text-gray-600 mb-5">You might be eligible but need to check some requirements. Contact RizQara for a detailed profile evaluation.</p>
                  </>
                )}
                {eligibilityResult === "not-eligible" && (
                  <>
                    <div className="text-red-500 mb-3 flex justify-center"><AlertCircle size={48} /></div>
                    <h4 className="text-lg font-bold text-red-700 mb-2">May Not Be Eligible</h4>
                    <p className="text-sm text-gray-600 mb-5">You may not meet all requirements, but don't worry! RizQara can find alternative scholarships that match your profile.</p>
                  </>
                )}
                <button onClick={() => { setEligibilityOpen(false); handleProfileCheck(); }} className="w-full block py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90" style={{ backgroundColor: "#7B1F2E" }}>
                  Get Free Profile Check
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
