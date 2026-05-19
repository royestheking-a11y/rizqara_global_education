import { useState, useRef, useEffect } from "react";
import React from "react";
import { Link, useNavigate } from "react-router";
import {
  Shield, Users, Zap, TrendingUp, CheckCircle, MessageSquare,
  Search, ArrowRight, ChevronLeft, ChevronRight, ChevronDown,
  Star, Calendar, Clock, Phone, GraduationCap, Bookmark,
  Landmark, Banknote, FileCheck, BookOpen, BookMarked,
  FlaskConical, Stethoscope, Globe, Map, Wallet, Building2,
  UserCheck, FileText, Plane, FolderOpen, MessageCircle,
  AlertCircle, Sparkles, BarChart3, ShieldCheck, MapPin, Bot
} from "lucide-react";
import { api } from "../services/api";
import { useSavedScholarships, useAuth } from "../hooks/useAuth";
import { SEO } from "../components/SEO";
import type { Scholarship } from "../data/demoData";
import { 
  HeroSkeleton, 
  CategorySkeleton, 
  RunningScholarshipsSkeleton, 
  CountrySkeleton 
} from "../components/ui/PremiumSkeletons";

const CategoryIcon = ({ name }: { name: string }) => {
  switch (name) {
    case "Landmark":      return <Landmark size={20} />;
    case "GraduationCap": return <GraduationCap size={20} />;
    case "CheckCircle":   return <CheckCircle size={20} />;
    case "FileCheck":     return <FileCheck size={20} />;
    case "BookOpen":      return <BookOpen size={20} />;
    case "BookMarked":    return <BookMarked size={20} />;
    case "FlaskConical":  return <FlaskConical size={20} />;
    case "Stethoscope":   return <Stethoscope size={20} />;
    case "Globe":         return <Globe size={20} />;
    case "Map":           return <Map size={20} />;
    case "Wallet":        return <Wallet size={20} />;
    case "Building2":     return <Building2 size={20} />;
    case "Bot":           return <Bot size={20} />;
    case "Search":        return <Search size={20} />;
    default:              return <BookOpen size={20} />;
  }
};

// ─── Service Icon Map ────────────────────────────────────────────
const serviceIconMap: Record<string, React.ReactElement> = {
  "free-profile-check":        <UserCheck size={22} />,
  "full-scholarship-guidance": <GraduationCap size={22} />,
  "sop-cv-service":            <FileText size={22} />,
  "visa-guidance":             <Plane size={22} />,
  "document-preparation":      <FolderOpen size={22} />,
  "interview-preparation":     <MessageCircle size={22} />,
};

// Icon helper for hero slides
const HeroBadgeIcon = ({ name }: { name: string }) => {
  switch (name) {
    case "GraduationCap": return <GraduationCap size={13} />;
    case "FileCheck":     return <FileCheck size={13} />;
    case "CheckCircle":   return <CheckCircle size={13} />;
    case "BarChart3":    return <BarChart3 size={13} />;
    default:              return <GraduationCap size={13} />;
  }
};

// ─── Stats ────────────────────────────────────────────────────────
const stats = [
  { value: "1,000+", label: "Scholarships", icon: <GraduationCap size={16} />, iconLg: <GraduationCap size={22} /> },
  { value: "25+",    label: "Countries",    icon: <Globe size={16} />,          iconLg: <Globe size={22} /> },
  { value: "500+",   label: "Students",     icon: <Users size={16} />,          iconLg: <Users size={22} /> },
  { value: "95%",    label: "Success Rate", icon: <TrendingUp size={16} />,     iconLg: <TrendingUp size={22} /> },
];

// ─── Why Choose ───────────────────────────────────────────────────
const whyChoosePoints = [
  { icon: <Shield size={16} />,         title: "Verified Scholarship Info",  desc: "Every scholarship is verified from official government and university sources." },
  { icon: <Users size={16} />,          title: "Student-Focused Guidance",   desc: "Personalized roadmap based on your profile, not generic advice." },
  { icon: <Zap size={16} />,            title: "AI-Powered Matching",        desc: "Our AI system matches you with scholarships based on your exact profile." },
  { icon: <TrendingUp size={16} />,     title: "Dashboard Tracking",         desc: "Track every step of your application in real-time from your dashboard." },
  { icon: <CheckCircle size={16} />,    title: "No Fake Promises",           desc: "Honest, transparent guidance with realistic expectations." },
  { icon: <MessageSquare size={16} />,  title: "Dedicated Advisor",          desc: "Each student gets a personal advisor who stays with them throughout." },
];

// ─── How It Works ────────────────────────────────────────────────
const howItWorks = [
  { step: "01", title: "Create Student Profile",   desc: "Add your academic info, target country, subject, budget and IELTS status." },
  { step: "02", title: "Get Scholarship Match",    desc: "System shows suitable scholarships with match scores based on your profile." },
  { step: "03", title: "Document Preparation",     desc: "Upload passport, certificates, transcripts, CV, SOP, and recommendation letters." },
  { step: "04", title: "Application Processing",   desc: "RizQara team reviews and guides every step of the application." },
  { step: "05", title: "Track Progress",           desc: "Your dashboard shows live application status at every stage." },
  { step: "06", title: "Visa & Pre-departure",     desc: "Complete visa guidance and pre-departure support until you fly." },
];

// ─── Section Label helper ─────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 tracking-wide uppercase"
      style={{ backgroundColor: "#7B1F2E12", color: "#7B1F2E" }}
    >
      {children}
    </span>
  );
}

// ─── AI Response Generator ────────────────────────────────────────
function generateAIResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("no ielts") || q.includes("without ielts") || q.includes("moi")) {
    return "Great news! You can study abroad without IELTS. Here are your best options:\n\n Hungary – Stipendium Hungaricum (MOI accepted, fully funded)\n Romania – Government Scholarship (MOI accepted)\n Russia – MBBS & Engineering (language training provided)\n Saudi Arabia – Islamic universities (Arabic/English, MOI)\n Turkey – Türkiye Scholarships (no IELTS for most programs)\n\nYou'll need a MOI (Medium of Instruction) certificate from your school/college. Contact RizQara for your free profile check!";
  }
  if (q.includes("mbbs") || q.includes("medicine") || q.includes("doctor")) {
    return "For MBBS abroad without IELTS, these are your top options:\n\n Russia – 5-6 year MBBS, WHO recognized, no IELTS, government scholarship available\n Romania – 6 year MD program, fully funded government scholarship\n Bulgaria – EU medical degree, recognized globally\n Moldova – Budget-friendly MBBS option\n\nCost: Russia govt scholarship = FREE. Self-funded ≈ $3,000-8,000/year\nRequirements: HSC min 70%, Biology + Chemistry, good health certificate\n\nBook a free consultation with RizQara to start your MBBS journey!";
  }
  if (q.includes("japan") || q.includes("mext")) {
    return "MEXT Scholarship 2027 – Japan's Premier Government Scholarship:\n\nStatus: Open (Deadline ~May 2026)\nFully Funded: Tuition + ¥117,000-144,000/month stipend + airfare\nDegrees: Bachelor, Master's, PhD\nIELTS: Not always required\nDifficulty: Competitive\n\nApplication Route: Japanese Embassy Dhaka\nKey Documents: Application form, Academic certificates, Research plan, Recommendation letters\n\nRizQara's Tip: Embassy route has better acceptance. Strong GPA (4.5+) recommended.\n\nContact RizQara for personalized MEXT guidance!";
  }
  if (q.includes("budget") || q.includes("low cost") || q.includes("affordable") || q.includes("lakh")) {
    return "Low Budget Study Abroad Options for You:\n\nFully Funded (Your cost ≈ BDT 1-2 lakh for travel/setup):\n Hungary – Stipendium Hungaricum\n Romania – Government Scholarship\n Russia – Government Scholarship\n Saudi Arabia – Government Scholarship\n\nBudget-Friendly Self-Funded:\n Malaysia – $3,000-5,000/year total\n Philippines – $2,500-4,000/year\n Indonesia – $2,000-3,500/year\n\nRecommendation: Apply for Stipendium Hungaricum (Hungary) – highest acceptance rate for Bangladeshi students!\n\nGet your free profile check from RizQara today!";
  }
  if (q.includes("gpa") || q.includes("result") || q.includes("score")) {
    return "Based on typical GPA requirements:\n\nGPA 4.5-5.0: Japan MEXT, Korea GKS, China CSC, Turkey Türkiye Scholarship\nGPA 3.5-4.5: Hungary Stipendium, Romania Govt, Saudi Arabia, Russia MBBS\nGPA 2.5-3.5: Malaysia self-funded, Russia self-funded, Eastern Europe private universities\n\nImportant: Even with lower GPA, a strong SOP, recommendation letters, and relevant extracurriculars can strengthen your application.\n\nShare your exact GPA with RizQara for a personalized scholarship match!";
  }
  return "Based on your query, here are some recommendations:\n\nTop Scholarships for Bangladeshi Students 2027:\n• Stipendium Hungaricum (Hungary) – Easiest fully funded European scholarship\n• MEXT (Japan) – Most prestigious, no IELTS\n• Romanian Government Scholarship – High acceptance rate\n• Russian Government Scholarship – Best for MBBS\n• Türkiye Scholarship – Competitive but excellent\n\nNext Steps:\n1. Complete your free profile check with RizQara\n2. Prepare MOI certificate from your institution\n3. Start collecting academic certificates\n4. Book a consultation with our advisors\n\nDisclaimer: AI guidance is for initial support only. Always verify from official scholarship websites.\n\nContact RizQara for personalized advice!";
}

// ─── HOME PAGE ────────────────────────────────────────────────────
// ─── SEO Schemas ──────────────────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "RizQara Global Education",
  "url": "https://rizqaraglobaleducation.vercel.app",
  "logo": "https://rizqaraglobaleducation.vercel.app/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+8801915342776",
    "contactType": "customer service",
    "areaServed": "BD",
    "availableLanguage": ["English", "Bengali"]
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How to get a fully funded scholarship from Bangladesh?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To get a fully funded scholarship, you need to maintain a high GPA, participate in extracurricular activities, and have a strong SOP. RizQara Global Education provides a personalized roadmap for Bangladeshi students to achieve this."
      }
    },
    {
      "@type": "Question",
      "name": "Can I study abroad without IELTS?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, many universities in countries like China, Turkey, and some European countries accept Medium of Instruction (MOI) certificates. RizQara can help you find these opportunities."
      }
    }
  ]
};

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [runningScholarships, setRunningScholarships] = useState<Scholarship[]>([]);
  const [countryList, setCountryList] = useState<any[]>([]);
  const [blogList, setBlogList] = useState<any[]>([]);
  const [noticeList, setNoticeList] = useState<any[]>([]);
  const [testimonialList, setTestimonialList] = useState<any[]>([]);
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery]   = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedDegree, setSelectedDegree]   = useState("");
  const [aiQuery, setAiQuery]     = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading]   = useState(false);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate    = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

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
        const [scholarshipData, categoryData, testimonialData, blogData, countryData, heroData, serviceData, noticeData] = await Promise.all([
          api.get('/scholarships'),
          api.get('/categories'),
          api.get('/testimonials'),
          api.get('/blogs'),
          api.get('/countries'),
          api.get('/heroslides'),
          api.get('/services'),
          api.get('/notices')
        ]);
        
        setRunningScholarships(scholarshipData);
        if (categoryData && categoryData.length > 0) setCategories(categoryData);
        setTestimonialList(testimonialData);
        setBlogList(blogData);
        setCountryList(countryData);
        setHeroSlides(heroData);
        setServiceList(serviceData);
        setNoticeList(noticeData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (heroSlides.length > 0) {
      intervalRef.current = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 5500);
      return () => clearInterval(intervalRef.current);
    }
  }, [heroSlides]);

  const [faqList, setFaqList] = useState<any[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await api.get('/faqs');
        setFaqList(data);
      } catch (err) {
        console.error("Failed to fetch faqs", err);
      }
    };
    fetchFaqs();
  }, []);

  const getCategoryCount = (catName: string) => {
    if (!runningScholarships || !runningScholarships.length) return 0;
    const name = catName.toLowerCase().trim();
    
    // Type Filters
    if (name.includes("government")) return runningScholarships.filter(s => s.scholarshipType === "Government").length;
    if (name.includes("university")) return runningScholarships.filter(s => s.scholarshipType === "University").length;
    if (name.includes("private")) return runningScholarships.filter(s => s.scholarshipType === "Private").length;
    
    // Funding Filters
    if (name.includes("fully funded")) return runningScholarships.filter(s => s.fundingType === "Fully Funded").length;
    if (name.includes("partially funded")) return runningScholarships.filter(s => s.fundingType === "Partially Funded").length;
    
    // Requirement Filters
    if (name.includes("no ielts") || name.includes("without ielts")) return runningScholarships.filter(s => !s.ieltsRequired).length;
    if (name.includes("moi accepted")) return runningScholarships.filter(s => s.moiAccepted).length;
    
    // Degree Level Filters
    if (name.includes("bachelor")) return runningScholarships.filter(s => s.degree?.some(d => d.toLowerCase().includes("bachelor"))).length;
    if (name.includes("master")) return runningScholarships.filter(s => s.degree?.some(d => d.toLowerCase().includes("master"))).length;
    if (name.includes("phd") || name.includes("research")) return runningScholarships.filter(s => s.degree?.some(d => d.toLowerCase().includes("phd") || d.toLowerCase().includes("research"))).length;
    if (name.includes("mbbs") || name.includes("medical")) return runningScholarships.filter(s => s.degree?.some(d => d.toLowerCase().includes("mbbs") || d.toLowerCase().includes("medical")) || s.subjects?.some(sub => sub.toLowerCase().includes("medical") || sub.toLowerCase().includes("medicine"))).length;
    
    // Subject Filters
    if (name.includes("engineering")) return runningScholarships.filter(s => s.subjects?.some(sub => sub.toLowerCase().includes("engineering"))).length;
    if (name.includes("mba") || name.includes("business") || name.includes("management")) return runningScholarships.filter(s => s.subjects?.some(sub => sub.toLowerCase().includes("business") || sub.toLowerCase().includes("management") || sub.toLowerCase().includes("mba"))).length;
    if (name.includes("arts") || name.includes("design")) return runningScholarships.filter(s => s.subjects?.some(sub => sub.toLowerCase().includes("art") || sub.toLowerCase().includes("design"))).length;
    if (name.includes("social")) return runningScholarships.filter(s => s.subjects?.some(sub => sub.toLowerCase().includes("social"))).length;
    if (name.includes("law") || name.includes("legal")) return runningScholarships.filter(s => s.subjects?.some(sub => sub.toLowerCase().includes("law") || sub.toLowerCase().includes("legal"))).length;
    if (name.includes("computer") || name.includes("it") || name.includes("science")) return runningScholarships.filter(s => s.subjects?.some(sub => sub.toLowerCase().includes("computer") || sub.toLowerCase().includes("science") || sub.toLowerCase().includes("it"))).length;

    // Region Filters
    if (name.includes("europe")) return runningScholarships.filter(s => ["Hungary", "Romania", "Russia", "Germany", "Poland", "Italy", "France", "Spain"].includes(s.country)).length;
    if (name.includes("asia")) return runningScholarships.filter(s => ["Japan", "Saudi Arabia", "Turkey", "China", "South Korea", "Malaysia", "Indonesia"].includes(s.country)).length;
    
    return 0;
  };

  const goSlide = (idx: number) => {
    clearInterval(intervalRef.current);
    setCurrentSlide(idx);
    intervalRef.current = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 5500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery)     params.set("q",       searchQuery);
    if (selectedCountry) params.set("country",  selectedCountry);
    if (selectedDegree)  params.set("degree",   selectedDegree);
    navigate(`/scholarships?${params.toString()}`);
  };

  const handleAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      setAiResponse(generateAIResponse(aiQuery));
      setAiLoading(false);
    }, 1500);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can I study abroad without IELTS from Bangladesh?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, some countries and universities may accept MOI or alternative English proof, but requirements vary by scholarship, university and program."
        }
      },
      {
        "@type": "Question",
        "name": "Does RizQara Global Education help with scholarship applications?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RizQara Global Education helps students with profile evaluation, scholarship matching, document checklist, SOP/CV support, application guidance and visa file preparation."
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeroSkeleton />
        <CategorySkeleton />
        <RunningScholarshipsSkeleton />
        <CountrySkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="RizQara Global Education | Study Abroad & Scholarship Guidance in Bangladesh"
        description="Find scholarships, study abroad options, university admission guidance, SOP/CV support, and visa file guidance for Bangladeshi students with RizQara Global Education."
        keywords="study abroad Bangladesh, scholarship guidance Bangladesh, foreign university admission, RizQara Global Education, বিদেশে উচ্চশিক্ষা, স্কলারশিপ আবেদন"
        schema={[organizationSchema, faqSchema]}
      />

      {/* ══════════════════════════════ HERO CAROUSEL ══════════════════════════════ */}
      <section className="w-full py-4 md:py-6" style={{ backgroundColor: "#FDF8F5" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-gray-100/50 bg-gray-50">
            {/* Slides */}
            {heroSlides.length > 0 ? (
              heroSlides.map((s: any, i: number) => (
                <div
                  key={i}
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: i === currentSlide ? 1 : 0, pointerEvents: i === currentSlide ? "auto" : "none" }}
                >
                  <img
                    src={s.image}
                    alt={s.title || `Slide ${i + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {/* Subtle bottom overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                </div>
              ))
            ) : (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }}>
                <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Dot indicators */}
            {heroSlides.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {heroSlides.map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => goSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className="rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      width: i === currentSlide ? "18px" : "6px",
                      height: "6px",
                      backgroundColor: i === currentSlide ? "white" : "rgba(255,255,255,0.5)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>


      {/* ══════════════════════ SCHOLARSHIP CATEGORIES ════════════════════ */}
      <section className="py-16" style={{ backgroundColor: "#FDF8F5" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
            <SectionLabel>Opportunity Hub</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">Find Scholarships by Country, Degree and Funding Type</h2>
            <p className="text-gray-500 leading-relaxed max-w-2xl">Explore government, university, fully funded, no IELTS, Bachelor, Master’s, PhD and MBBS scholarships for Bangladeshi students.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat: any) => {
              const catId = cat._id || cat.id;
              const count = getCategoryCount(cat.name || catId);
              return (
                <Link
                  key={catId}
                  to={`/scholarships?category=${catId}`}
                  className="group bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-gray-100 hover:border-[#7B1F2E20]"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white mx-auto mb-3 group-hover:scale-110 transition-transform duration-200"
                    style={{ backgroundColor: "#7B1F2E" }}
                  >
                    <CategoryIcon name={cat.icon} />
                  </div>
                  <h4 className="text-xs font-semibold text-gray-800 mb-1 group-hover:text-[#7B1F2E] transition-colors leading-tight">{cat.name}</h4>
                  <span className="text-[11px] text-gray-400">{count || 0} scholarships</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>


      {/* ════════════════════════ RUNNING SCHOLARSHIPS ════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <SectionLabel>Open Now</SectionLabel>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Currently Open Scholarships</h2>
            <p className="text-gray-500">Don't miss out! These programs are currently accepting applications from Bangladeshi students.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {runningScholarships.slice(0, 8).map(s => (
              <ScholarshipCard key={s._id || s.id} scholarship={s} />
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════ COUNTRIES ═══════════════════════════ */}
      <section className="py-16" style={{ backgroundColor: "#FDF8F5" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <SectionLabel>Global Reach</SectionLabel>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Study Abroad Countries for Bangladeshi Students</h2>
              <p className="text-gray-500">Explore educational opportunities in your dream destination.</p>
            </div>
            <Link to="/countries" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90 flex-shrink-0" style={{ backgroundColor: "#7B1F2E" }}>
              All Countries <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {countryList.map(c => (
              <Link
                key={c._id || c.id}
                to={`/countries/${c.slug || c.id || c._id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-gray-100"
              >
                <div className="relative h-36 overflow-hidden">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2 transform group-hover:translate-y-[-2px] transition-all duration-300">
                      <span className="text-xl leading-none filter drop-shadow-sm">{c.flag}</span>
                      <span className="text-white text-sm font-bold truncate tracking-wide">{c.name}</span>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{c.scholarshipCount}+ Scholarships</span>
                    </div>
                    {!c.ieltsRequired && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{ backgroundColor: "#7B1F2E12", color: "#7B1F2E" }}>No IELTS</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════ HOW IT WORKS ══════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <SectionLabel>Our Expertise</SectionLabel>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Study Abroad Services</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Get profile evaluation, scholarship matching, university shortlisting, SOP, CV, recommendation letter, application and visa guidance support.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative p-6 rounded-2xl border-2 border-gray-100 hover:border-[#7B1F2E18] hover:shadow-md transition-all group">
                <div className="absolute -top-3 left-6 text-5xl font-black opacity-[0.04] leading-none select-none" style={{ color: "#7B1F2E" }}>{step.step}</div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: "#7B1F2E" }}>
                  {step.step}
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm">{step.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight size={16} style={{ color: "#7B1F2E25" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════ FREE PROFILE CHECK CTA ══════════════════ */}
      <section className="py-14" style={{ background: "linear-gradient(135deg, #7B1F2E 0%, #3D0F17 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
          >
            <ShieldCheck size={24} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Get Your Free Profile Check</h2>
          <p className="text-red-200 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
            Let our experts evaluate your profile and tell you exactly which scholarships you qualify for — 100% free, no obligations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleProfileCheck}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition hover:shadow-xl"
              style={{ backgroundColor: "white", color: "#7B1F2E" }}
            >
              Request Free Profile Check <ArrowRight size={14} />
            </button>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm border-2 text-white hover:bg-white/10 transition"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              Create Student Account
            </Link>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════ AI GUIDE ════════════════════════════ */}
      <section className="py-16" style={{ backgroundColor: "#FDF8F5" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide"
              style={{ backgroundColor: "#7B1F2E12", color: "#7B1F2E" }}
            >
              <Sparkles size={11} /> AI Powered
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">RizQara AI Guide</h2>
            <p className="text-gray-500 text-sm">Ask anything about scholarships, countries, documents, or visa. Get instant AI-powered guidance.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            {/* Suggested questions */}
            <div className="p-5 border-b border-gray-100" style={{ backgroundColor: "#7B1F2E04" }}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Suggested Questions</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "No IELTS scholarship options",
                  "MEXT Japan 2027 details",
                  "MBBS abroad without IELTS",
                  "Low budget study abroad",
                  "GPA 4.5 scholarship match",
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => setAiQuery(q)}
                    className="px-3 py-1.5 text-xs rounded-lg border font-medium transition-all duration-200 border-[#7B1F2E20] text-[#7B1F2E] bg-[#7B1F2E06] hover:bg-[#7B1F2E] hover:text-white hover:border-[#7B1F2E] active:scale-95"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5">
              <form onSubmit={handleAI} className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={e => setAiQuery(e.target.value)}
                  placeholder='e.g., "My GPA is 4.83, no IELTS, budget 5 lakh. Which countries can I apply?"'
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B1F2E] focus:ring-2 focus:ring-[#7B1F2E10] transition-all bg-gray-50 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="px-5 py-3 text-white rounded-xl text-sm font-bold transition hover:opacity-90 flex items-center gap-2 flex-shrink-0"
                  style={{ backgroundColor: "#7B1F2E" }}
                >
                  {aiLoading
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Zap size={14} />}
                  Ask AI
                </button>
              </form>

              {aiLoading && (
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#7B1F2E06" }}>
                  <div className="w-5 h-5 border-2 border-[#7B1F2E25] border-t-[#7B1F2E] rounded-full animate-spin" />
                  <span className="text-sm text-gray-500">RizQara AI is thinking...</span>
                </div>
              )}

              {aiResponse && !aiLoading && (
                <div className="rounded-2xl p-5" style={{ backgroundColor: "#7B1F2E05", border: "1px solid #7B1F2E12" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#7B1F2E" }}>
                      <Sparkles size={13} color="white" />
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#7B1F2E" }}>RizQara AI Response</span>
                  </div>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{aiResponse}</pre>
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2 text-xs text-amber-700">
                    <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
                    AI guidance is for initial support only. Always verify final information from official scholarship websites.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/ai-guide" className="inline-flex items-center gap-1.5 text-sm font-semibold transition hover:underline" style={{ color: "#7B1F2E" }}>
              Open Full AI Guide <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>


      {/* ═════════════════════════ WHY CHOOSE US ═════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <SectionLabel>Why RizQara?</SectionLabel>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Trusted Study Abroad Partner</h2>
              <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                আমরা শুধু স্বপ্ন দেখাই না — আমরা আপনার profile অনুযায়ী realistic roadmap তৈরি করি।
                <br /><br />
                We don't just show you scholarships — we build a personalized, realistic roadmap based on your academic profile, budget, and goals.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {whyChoosePoints.map((p, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-4 rounded-xl border border-gray-100 hover:border-[#7B1F2E18] hover:shadow-sm transition-all"
                    style={{ backgroundColor: "#FDFAF7" }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white" style={{ backgroundColor: "#7B1F2E" }}>
                      {p.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-0.5">{p.title}</h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map(s => (
                <div key={s.label} className="rounded-2xl p-7 text-center border border-gray-100 hover:shadow-md transition-all" style={{ backgroundColor: "#FDFAF7" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#7B1F2E10" }}>
                    <span style={{ color: "#7B1F2E" }}>{s.iconLg}</span>
                  </div>
                  <div className="text-3xl font-black mb-1" style={{ color: "#7B1F2E" }}>{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════ SERVICES ════════════════════════════ */}
      <section className="py-16" style={{ backgroundColor: "#FDF8F5" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <SectionLabel>What We Offer</SectionLabel>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h2>
            <p className="text-gray-500 text-sm">Complete study abroad support from profile evaluation to visa approval</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviceList.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group flex flex-col">
                <div className="flex justify-between items-start mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200"
                    style={{ backgroundColor: "#7B1F2E" }}
                  >
                    {serviceIconMap[s.id] || <GraduationCap size={22} />}
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${s.isFree ? "bg-emerald-100 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {s.isFree ? "FREE" : s.price}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm">{s.title}</h4>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-1">{s.description}</p>
                <ul className="space-y-2 mb-5">
                  {s.features.slice(0, 3).map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: "#7B1F2E" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 text-xs font-bold transition-all group-hover:gap-2.5 mt-auto"
                  style={{ color: "#7B1F2E" }}
                >
                  Learn More <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={handleProfileCheck}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition hover:shadow-lg"
              style={{ backgroundColor: "#7B1F2E" }}
            >
              Get Free Profile Check <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>


      {/* ═══════════════════════ TESTIMONIALS ════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <SectionLabel>Student Stories</SectionLabel>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Success Gallery</h2>
            <p className="text-gray-500 text-sm">Real students, real scholarships, real success</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonialList.map(t => (
              <div key={t._id || t.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.program}</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: "#7B1F2E" }}>{t.university}</p>
                  </div>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#7B1F2E" color="#7B1F2E" />)}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">"{t.feedback}"</p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400 flex items-center gap-1.5">
                    <MapPin size={11} />
                    {t.country} · {t.year}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    t.status === "Enrolled"     ? "bg-emerald-100 text-emerald-700" :
                    t.status === "Visa Approved"? "bg-blue-100 text-blue-700" :
                                                  "bg-amber-100 text-amber-700"
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/success-gallery"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold border-2 transition hover:bg-[#7B1F2E] hover:text-white"
              style={{ borderColor: "#7B1F2E", color: "#7B1F2E" }}
            >
              View All Success Stories <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>


      {/* ═════════════════════════ LATEST NOTICES ════════════════════════ */}
      <section className="py-14" style={{ backgroundColor: "#FDF8F5" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-3">
            <div>
              <SectionLabel>Updates</SectionLabel>
              <h2 className="text-3xl font-bold text-gray-900">Latest Notices</h2>
            </div>
            <Link to="/notice" className="inline-flex items-center gap-1.5 text-sm font-semibold transition hover:underline" style={{ color: "#7B1F2E" }}>
              All Notices <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {noticeList.slice(0, 3).map(n => (
              <div key={n._id || n.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-3">
                  {n.isUrgent && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                      <AlertCircle size={10} /> Urgent
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-500">{n.category}</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-2 leading-snug">{n.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{n.content.substring(0, 100)}...</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Calendar size={11} /> {n.date}
                  </span>
                  <Link to="/notice" className="text-xs font-bold flex items-center gap-1 transition hover:underline" style={{ color: "#7B1F2E" }}>
                    Read More <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════ BLOG ═════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <SectionLabel>Knowledge Hub</SectionLabel>
              <h2 className="text-3xl font-bold text-gray-900">Latest from the Blog</h2>
            </div>
            <Link to="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition flex-shrink-0" style={{ backgroundColor: "#7B1F2E" }}>
              All Articles <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogList.slice(0, 3).map((b: any) => {
              // Build a unified images list: prefer b.images array, fall back to b.image
              const allImages: string[] = (b.images && b.images.length > 0)
                ? b.images
                : b.image ? [b.image] : [];
              const hasMultiple = allImages.length >= 2;

              return (
                <Link key={b._id || b.id} to={`/blog/${b.slug || b._id || b.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">

                  {/* ── Image area ── */}
                  {hasMultiple ? (
                    /* Multi-image strip: main image left, stack right */
                    <div className="relative h-44 overflow-hidden grid gap-0.5" style={{ gridTemplateColumns: "1fr 1fr" }}>
                      {/* Main / first image */}
                      <div className="relative overflow-hidden" style={{ gridRow: "span 2" }}>
                        <img
                          src={allImages[0]}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {/* Second image */}
                      <div className="relative overflow-hidden">
                        <img
                          src={allImages[1]}
                          alt={`${b.title} 2`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {/* Third image (if exists) */}
                      {allImages[2] && (
                        <div className="relative overflow-hidden">
                          <img
                            src={allImages[2]}
                            alt={`${b.title} 3`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* +more badge if there are even more */}
                          {allImages.length > 3 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">+{allImages.length - 3}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Category badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: "#7B1F2E" }}>{b.category}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                  ) : (
                    /* Single image — original layout */
                    <div className="relative h-44 overflow-hidden">
                      <img src={allImages[0] || ""} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: "#7B1F2E" }}>{b.category}</span>
                      </div>
                    </div>
                  )}

                  {/* ── Text content ── */}
                  <div className="p-5">
                    <h4 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-[#7B1F2E] transition-colors line-clamp-2 leading-snug">{b.title}</h4>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{b.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1.5"><Calendar size={11} />{b.date}</span>
                      <span className="flex items-center gap-1.5"><Clock size={11} />{b.readTime}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>


      {/* ══════════════════════════ FAQ ══════════════════════════════════ */}
      <section className="py-16" style={{ backgroundColor: "#FDF8F5" }}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <SectionLabel>Common Questions</SectionLabel>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
          </div>

          <HomeFAQ items={faqList.length > 0 ? faqList : undefined} />

          <div className="text-center mt-8">
            <Link to="/faq" className="inline-flex items-center gap-1.5 text-sm font-semibold transition hover:underline" style={{ color: "#7B1F2E" }}>
              View All FAQs <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>


      {/* ══════════════════════════ FINAL CTA ════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div
            className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #7B1F2E 0%, #3D0F17 50%, #1A0A0E 100%)" }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-[0.04] border border-white -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-[0.04] border border-white translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-3">Start Your Study Abroad Journey Today</h2>
              <p className="text-red-200 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
                Scholarship, university admission, document preparation ও application tracking — সবকিছু এখন সহজ ও organized.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition hover:shadow-xl"
                  style={{ backgroundColor: "white", color: "#7B1F2E" }}
                >
                  <Phone size={14} /> Talk to Advisor
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm border-2 text-white hover:bg-white/10 transition"
                  style={{ borderColor: "rgba(255,255,255,0.3)" }}
                >
                  <GraduationCap size={14} /> Create Free Account
                </Link>
                <a
                  href="https://wa.me/8801725350352"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm border-2 text-white hover:bg-[#25D366] transition-all duration-300 group"
                  style={{ borderColor: "rgba(37,211,102,0.4)" }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="white" className="group-hover:scale-110 transition-transform">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// ─── Scholarship Card ────────────────────────────────────────────
function ScholarshipCard({ scholarship: s }: { scholarship: any }) {
  const { isSaved, toggle } = useSavedScholarships();
  const scId = s._id || s.id;
  const saved = isSaved(scId);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(scId);
  };

  const statusMap: Record<string, { badge: string; dot: string }> = {
    "Open":         { badge: "bg-emerald-500 text-white", dot: "bg-emerald-200" },
    "Closing Soon": { badge: "bg-red-500 text-white",     dot: "bg-red-200" },
    "Upcoming":     { badge: "bg-blue-500 text-white",    dot: "bg-blue-200" },
    "Closed":       { badge: "bg-gray-400 text-white",    dot: "bg-gray-200" },
  };
  const sc = statusMap[s.status] || statusMap["Closed"];

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
      {/* Image */}
      <div className="relative h-40 overflow-hidden flex-shrink-0">
        <img src={s.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        {/* Status */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${sc.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} inline-block`} />
            {s.status}
          </span>
        </div>

        {/* Save button */}
        <button
          onClick={toggleSave}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center hover:bg-white transition shadow-sm"
        >
          <Bookmark size={12} fill={saved ? "#7B1F2E" : "none"} color={saved ? "#7B1F2E" : "#9ca3af"} />
        </button>

        {/* Country + Verified */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
          <span className="text-white text-sm font-semibold flex items-center gap-1.5">
            <span className="text-base leading-none">{s.countryFlag}</span>
            {s.country}
          </span>
          {s.isVerified && (
            <span className="inline-flex items-center gap-1 bg-white/95 text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ color: "#7B1F2E" }}>
              <ShieldCheck size={9} /> Verified
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-2.5">
        {/* Funding & IELTS badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            s.fundingType === "Fully Funded"     ? "bg-amber-50 text-amber-700 border border-amber-100" :
            s.fundingType === "Partially Funded" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                                                   "bg-gray-100 text-gray-600"
          }`}>
            {s.fundingType}
          </span>
          {!s.ieltsRequired && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ backgroundColor: "#7B1F2E08", color: "#7B1F2E", borderColor: "#7B1F2E18" }}>
              No IELTS
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{s.name}</h4>

        {/* Degree tags */}
        <div className="flex flex-wrap gap-1">
          {s.degree.slice(0, 2).map((d: string) => (
            <span key={d} className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 font-medium">{d}</span>
          ))}
        </div>

        {/* Deadline + Match */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-2 border-t border-gray-50">
          <span className="flex items-center gap-1.5">
            <Calendar size={11} />
            {s.daysLeft
              ? <span className={s.daysLeft <= 14 ? "text-red-600 font-bold" : "text-gray-500"}>{s.daysLeft}d left</span>
              : <span>Upcoming</span>}
          </span>
          {s.matchScore && (
            <span className="flex items-center gap-1 font-bold" style={{ color: "#7B1F2E" }}>
              <TrendingUp size={10} />{s.matchScore}%
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/scholarships/${s.slug || s._id || s.id}`}
            className="flex-1 py-2.5 text-xs font-bold text-white text-center rounded-xl transition hover:opacity-90"
            style={{ backgroundColor: "#7B1F2E" }}
          >
            View Details
          </Link>
          <Link
            to="/contact"
            className="flex-1 py-2.5 text-xs font-bold text-center rounded-xl border-2 transition-all duration-200 border-[#7B1F2E] text-[#7B1F2E] hover:bg-[#7B1F2E] hover:text-white active:bg-[#7B1F2E] active:text-white active:scale-95"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Home FAQ ────────────────────────────────────────────────────
function HomeFAQ({ items }: { items?: any[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const defaultItems = [
    { q: "Can I study abroad without IELTS?", a: "Yes! Many countries like Japan (MEXT), Hungary (Stipendium Hungaricum), Romania, Russia, Turkey, and Saudi Arabia accept MOI certificate instead of IELTS." },
    { q: "What is a MOI certificate and how do I get it?", a: "A Medium of Instruction (MOI) certificate is a document issued by your previous school/college stating that your education was conducted in English. It replaces IELTS for many scholarships." },
    { q: "Are these scholarships fully funded?", a: "Most government scholarships we assist with (like MEXT Japan, Stipendium Hungaricum) are fully funded, covering tuition, living allowance, and accommodation." },
    { q: "Can I apply for more than one scholarship at a time?", a: "Yes, you can apply for multiple scholarships to increase your chances. RizQara helps you manage multiple applications simultaneously." },
    { q: "Is there an age limit for scholarship applications?", a: "Age limits vary by country. Generally, Bachelor's limit is 21-25, Master's is 30-35, and PhD is 35-45. Romania has no strict age limit for certain programs." },
    { q: "How much budget do I need for a fully funded scholarship?", a: "While the scholarship covers major costs, you should budget for initial expenses like visa fees and health insurance, typically BDT 1.5 to 3 lakhs." },
    { q: "Does RizQara guarantee visa approval?", a: "While no one can guarantee a visa, RizQara has a 95%+ success rate through meticulous document preparation and mock interview sessions." },
    { q: "Which countries are best for MBBS abroad without IELTS?", a: "Russia and Romania are the best destinations for MBBS without IELTS, offering high-quality education recognized by WHO and BMDC at lower costs." }
  ];

  const displayItems = items || defaultItems;

  return (
    <div className="space-y-3">
      {displayItems.map((item, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-[#7B1F2E15] transition-all">
          <button
            onClick={() => setOpen(open === `${i}` ? null : `${i}`)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-sm font-semibold text-gray-900 pr-4">{item.q || item.question}</span>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform flex-shrink-0 ${open === `${i}` ? "rotate-180" : ""}`}
              style={{ color: open === `${i}` ? "#7B1F2E" : undefined }}
            />
          </button>
          {open === `${i}` && (
            <div className="px-5 pb-5 pt-0">
              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed">{item.a || item.answer}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
