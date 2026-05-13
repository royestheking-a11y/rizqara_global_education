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
    "headline": `${s.name} for Bangladeshi Students`,
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
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
      <SEO 
        title={`${s.name} | Scholarship Details for Bangladeshi Students`}
        description={`Detailed guide on ${s.name} for Bangladeshi students. Learn about eligibility, required documents, and how to apply successfully.`}
        keywords={`${s.name}, ${s.country} scholarship, study in ${s.country} from Bangladesh, scholarship application guide`}
        canonical={`/scholarships/${s.slug || s._id}`}
        ogImage={s.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"}
        schema={[scholarshipSchema, breadcrumbSchema]}
      />
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-red-200 text-xs mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <Link to="/scholarships" className="hover:text-white">Scholarships</Link>
            <ChevronRight size={12} />
            <span className="text-white">{s.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-4xl">{s.countryFlag}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColors[s.status]}`}>{s.status}</span>
                {s.isVerified && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-white/20 text-white border border-white/30">
                    <Shield size={12} /> Verified Official Source
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">{s.name}</h1>
              <p className="text-red-200 text-lg mb-4">{s.country} • {s.university}</p>

              <div className="flex flex-wrap gap-4 text-sm text-white/80">
                <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-red-200" />{s.degree.join(", ")}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><DollarSign size={14} className="text-red-200" />{s.fundingType}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Clipboard size={14} className="text-red-200" />{s.ieltsRequired ? "IELTS Required" : s.moiAccepted ? "MOI Accepted" : "No IELTS"}</span>
                {s.daysLeft && (
                  <>
                    <span>•</span>
                    <span className={`flex items-center gap-1.5 font-semibold ${s.daysLeft <= 14 ? "text-yellow-400" : ""}`}>
                      <Clock size={12} />{s.daysLeft} days left
                    </span>
                  </>
                )}
              </div>

              {s.matchScore && (
                <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <Star size={14} fill="#white" color="white" className="opacity-80" />
                  <span className="text-white text-sm font-semibold">Profile Match: {s.matchScore}%</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 flex-shrink-0 w-full lg:w-56">
              <button
                onClick={handleApply}
                className="py-3.5 px-6 rounded-xl font-semibold text-sm text-center transition-all duration-200 bg-white text-[#7B1F2E] hover:bg-gray-50 active:scale-95 w-full"
              >
                Apply with Guidance
              </button>
              <button
                onClick={toggleSave}
                className={`py-3.5 px-6 rounded-xl font-semibold text-sm border-2 flex items-center justify-center gap-2 transition ${saved ? "bg-white/20 border-white text-white" : "border-white text-white hover:bg-white/20"}`}
              >
                <Bookmark size={15} fill={saved ? "white" : "none"} />
                {saved ? "Saved" : "Save Scholarship"}
              </button>
              <button
                onClick={() => setEligibilityOpen(true)}
                className="py-3.5 px-6 rounded-xl font-semibold text-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
              >
                Check Eligibility
              </button>
              {s.officialLink && (
                <a href={s.officialLink} target="_blank" rel="noopener noreferrer"
                  className="py-3 px-6 rounded-xl text-xs border border-white/20 text-white/70 text-center hover:bg-white/10 transition flex items-center justify-center gap-1">
                  <Globe size={12} /> Official Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Key Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Key Information</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Country", value: `${s.countryFlag} ${s.country}` },
                  { label: "Funding Type", value: s.fundingType },
                  { label: "Scholarship Type", value: s.scholarshipType },
                  { label: "IELTS", value: s.ieltsRequired ? "Required" : "Not Required" },
                  { label: "MOI Accepted", value: s.moiAccepted ? "Yes" : "No" },
                  { label: "Deadline", value: s.deadline },
                  { label: "Intake", value: s.intake },
                  { label: "Application Fee", value: s.applicationFee },
                  { label: "Difficulty", value: s.difficulty },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-xl" style={{ backgroundColor: "#FDF8F5" }}>
                    <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                    <div className="text-sm font-semibold text-gray-800">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex overflow-x-auto border-b border-gray-100">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3.5 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab ? "border-[#7B1F2E] text-[#7B1F2E]" : "border-transparent text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">About this Scholarship</h4>
                      <p className="text-gray-600 leading-relaxed text-sm">{s.description}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Target Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {s.subjects.map((sub: string) => (
                          <span key={sub} className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{sub}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Degree Levels</h4>
                      <div className="flex flex-wrap gap-2">
                        {s.degree.map((d: string) => (
                          <span key={d} className="px-3 py-1 rounded-full text-xs text-white font-medium" style={{ backgroundColor: "#7B1F2E" }}>{d}</span>
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
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { icon: <DollarSign size={16} />, label: "Monthly Stipend", value: s.stipend || "Included" },
                        { icon: <Home size={16} />, label: "Accommodation", value: s.accommodation ? "Provided" : "Not included" },
                        { icon: <Activity size={16} />, label: "Health Insurance", value: s.healthInsurance ? "Provided" : "Not included" },
                        { icon: <Plane size={16} />, label: "Air Ticket", value: s.airTicket ? "Round trip" : "Not included" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#7B1F2E15" }}>
                            <span style={{ color: "#7B1F2E" }}>{item.icon}</span>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">{item.label}</div>
                            <div className="text-sm font-semibold text-gray-800">{item.value}</div>
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
                    <div className="grid sm:grid-cols-2 gap-3">
                      {s.requiredDocuments.map((doc: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#7B1F2E]"><FileText size={16} /></div>
                          <span className="text-sm text-gray-700">{doc}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: "#7B1F2E08", border: "1px solid #7B1F2E20" }}>
                      <p className="text-sm" style={{ color: "#7B1F2E" }}>
                        <strong className="flex items-center gap-1.5 mb-1"><Lightbulb size={14} /> RizQara Tip:</strong> Start collecting your documents early. Translation and attestation can take 2-4 weeks in Bangladesh.
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
          <div className="space-y-5">
            {/* Quick Apply Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h4 className="font-bold text-gray-900 mb-4">Apply with Guidance</h4>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[s.status]}`}>{s.status}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Deadline</span>
                <span className="text-sm font-semibold text-gray-800">{s.deadline}</span>
              </div>
              {s.daysLeft && (
                <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor: s.daysLeft <= 14 ? "#FEF2F2" : "#F0FDF4" }}>
                  <div className="flex items-center gap-2">
                    <Clock size={14} style={{ color: s.daysLeft <= 14 ? "#DC2626" : "#16A34A" }} />
                    <span className="text-sm font-semibold" style={{ color: s.daysLeft <= 14 ? "#DC2626" : "#16A34A" }}>
                      {s.daysLeft <= 14 ? `⚠️ Only ${s.daysLeft} days left!` : `${s.daysLeft} days remaining`}
                    </span>
                  </div>
                </div>
              )}
              <Link to="/contact" className="block py-3.5 rounded-xl text-white font-semibold text-sm text-center hover:opacity-90 transition" style={{ backgroundColor: "#7B1F2E" }}>
                Apply with RizQara
              </Link>
              <Link 
                to="/contact" 
                className="block mt-2 py-3 rounded-xl font-semibold text-sm text-center border transition-all duration-200 border-[#7B1F2E30] text-[#7B1F2E] hover:bg-[#7B1F2E] hover:text-white active:bg-[#7B1F2E] active:text-white active:scale-95"
              >
                Free Profile Check
              </Link>
            </div>

            {/* Funding Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h4 className="font-bold text-gray-900 mb-3">Funding Summary</h4>
                {[
                  { icon: <DollarSign size={14} />, label: "Tuition", value: s.tuitionFee },
                  { icon: <Home size={14} />, label: "Accommodation", value: s.accommodation ? "Provided" : "Self" },
                  { icon: <Banknote size={14} />, label: "Stipend", value: s.stipend || "Check official" },
                  { icon: <Plane size={14} />, label: "Air Ticket", value: s.airTicket ? "Round trip" : "Not included" },
                  { icon: <Activity size={14} />, label: "Health Insurance", value: s.healthInsurance ? "Covered" : "Not included" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0">
                    <span className="text-sm text-gray-500 flex items-center gap-2"><span style={{ color: "#7B1F2E" }}>{item.icon}</span>{item.label}</span>
                    <span className="text-xs font-semibold text-gray-800">{item.value}</span>
                  </div>
                ))}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
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

        {/* Related Scholarships */}
        {relatedScholarships.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-900 mb-5">Related Scholarships</h3>
            <div className="grid md:grid-cols-3 gap-5">
              {relatedScholarships.map(rs => (
                <Link key={rs.slug || rs.id || rs._id} to={`/scholarships/${rs.slug || rs.id || rs._id}`} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
                  <div className="h-28 overflow-hidden">
                    <img src={rs.image} alt={rs.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span>{rs.countryFlag}</span>
                      <span className="text-xs text-gray-500">{rs.country}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{rs.name}</h4>
                    <span className="text-xs text-gray-500">{rs.fundingType}</span>
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
                  { key: "nationality", label: "Are you a Bangladeshi/international student from a partner country?" },
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
                <button onClick={() => { setEligibilityOpen(false); handleApply(); }} className="w-full block py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90" style={{ backgroundColor: "#7B1F2E" }}>
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
