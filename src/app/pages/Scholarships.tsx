import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router";
import {
  Search, Filter, X, ChevronDown, Bookmark, Star, Shield,
  Calendar, ArrowRight, SlidersHorizontal, Grid3X3, List, Scale,
  Landmark, Clock, CheckCircle
} from "lucide-react";
import { api } from "../services/api";
import { useSavedScholarships, useAuth } from "../hooks/useAuth";
import { SEO } from "../components/SEO";
import { ScholarshipsSkeleton } from "../components/ui/PremiumSkeletons";

// --- Sub-components moved to top for better scope visibility ---

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 mb-2">
        {title} <ChevronDown size={14} className={`transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && <div className="flex flex-wrap gap-1.5">{children}</div>}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
        active ? "text-white border-transparent" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#7B1F2E40]"
      }`}
      style={active ? { backgroundColor: "#7B1F2E", borderColor: "#7B1F2E" } : {}}
    >
      {label}
    </button>
  );
}

function ScholarshipGridCard({ s, onCompare, inCompare, onApply }: { s: any; onCompare: (id: string) => void; inCompare: boolean; onApply: (id: string) => void }) {
  const { isSaved, toggle } = useSavedScholarships();
  const saved = isSaved(s.slug || s._id || s.id);
  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(s.slug || s._id || s.id);
  };

  const statusColors: any = {
    "Open": "bg-green-100 text-green-700",
    "Closing Soon": "bg-red-100 text-red-700",
    "Upcoming": "bg-blue-100 text-blue-700",
    "Closed": "bg-gray-100 text-gray-500"
  };

  const difficultyColors: any = {
    "Easy": "text-green-600",
    "Medium": "text-blue-600",
    "Competitive": "text-orange-600",
    "Highly Competitive": "text-red-600"
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col group h-full">
      <div className="relative h-44 overflow-hidden">
        <img src={s.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none z-10">
          <div className="flex flex-wrap gap-1 sm:gap-1.5 max-w-[70%] pointer-events-auto">
            <span className={`text-[8px] sm:text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full shadow-md border border-white/10 ${statusColors[s.status]}`}>{s.status}</span>
            {s.daysLeft && s.daysLeft <= 14 && (
              <span className="text-[8px] sm:text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full bg-red-600 text-white flex items-center gap-1 shadow-md border border-red-400/20">
                <Clock size={8} className="sm:w-2.5 sm:h-2.5" /> {s.daysLeft}d
              </span>
            )}
            {!s.ieltsRequired && (
              <span className="text-[8px] sm:text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full bg-[#7B1F2E] text-white shadow-md border border-white/20 whitespace-nowrap">
                No IELTS
              </span>
            )}
          </div>
          
          <div className="flex flex-col gap-2 pointer-events-auto">
            <button
              onClick={(e) => { e.preventDefault(); onCompare(s.slug || s._id || s.id); }}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shadow-lg border border-white/20 ${inCompare ? "bg-[#7B1F2E] text-white" : "bg-white/90 text-gray-600 hover:bg-white"}`}
              title="Compare"
            >
              <Scale size={12} className="sm:w-3.5 sm:h-3.5" />
            </button>
            <button 
              onClick={toggleSave} 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-all shadow-lg border border-white/20"
              title="Save"
            >
              <Bookmark size={12} className="sm:w-3.5 sm:h-3.5" fill={saved ? "#7B1F2E" : "none"} color={saved ? "#7B1F2E" : "#6b7280"} />
            </button>
          </div>
        </div>

        {s.isVerified && (
          <div className="absolute bottom-3 left-3 bg-white/95 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold shadow-sm" style={{ color: "#7B1F2E" }}>
            <Shield size={10} /> VERIFIED
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xl">{s.countryFlag}</span>
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-tight">{s.country}</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase tracking-wider">
            {s.fundingType}
          </span>
        </div>

        <h4 className="text-[15px] font-extrabold text-gray-900 mb-1 line-clamp-2 leading-snug group-hover:text-[#7B1F2E] transition-colors">{s.name}</h4>
        <p className="text-xs text-gray-500 mb-4 line-clamp-1 italic">{s.university}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {s.degree.slice(0, 3).map((d: string) => (
            <span key={d} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 border border-gray-100 uppercase tracking-wider">{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50 mb-4 text-[11px]">
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-400 uppercase tracking-widest text-[9px]">Deadline</span>
            <div className="flex items-center gap-1 text-gray-700 font-bold">
              <Calendar size={12} className="text-[#7B1F2E]" /> 
              <span>{s.daysLeft ? `${s.daysLeft} Days` : "Upcoming"}</span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-400 uppercase tracking-widest text-[9px]">Difficulty</span>
            <div className={`font-bold uppercase tracking-tight ${difficultyColors[s.difficulty]}`}>{s.difficulty}</div>
          </div>
        </div>

        {s.matchScore && (
          <div className="mb-5">
            <div className="flex justify-between text-[10px] mb-1.5">
              <span className="text-gray-500 font-bold uppercase tracking-widest">Profile Match</span>
              <span className="font-black" style={{ color: "#7B1F2E" }}>{s.matchScore}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden p-[1px]">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.matchScore}%`, backgroundColor: "#7B1F2E" }} />
            </div>
          </div>
        )}

        <div className="flex gap-2.5 mt-auto pt-2">
          <Link to={`/scholarships/${s.slug || s._id || s.id}`} className="flex-1 py-2.5 text-xs font-bold text-white text-center rounded-xl transition-all hover:shadow-lg active:scale-95" style={{ backgroundColor: "#7B1F2E" }}>
            Details
          </Link>
          <button 
            onClick={() => onApply(s._id || s.id)}
            className="flex-1 py-2.5 text-xs font-bold text-center rounded-xl border-2 transition-all duration-200 border-[#7B1F2E] text-[#7B1F2E] hover:bg-[#7B1F2E] hover:text-white active:scale-95"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

function ScholarshipListCard({ s, onCompare, inCompare, onApply }: { s: any; onCompare: (id: string) => void; inCompare: boolean; onApply: (id: string) => void }) {
  const statusColors: any = {
    "Open": "bg-green-100 text-green-700",
    "Closing Soon": "bg-red-100 text-red-700",
    "Upcoming": "bg-blue-100 text-blue-700",
    "Closed": "bg-gray-100 text-gray-500"
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-all group relative">
      <div className="w-full sm:w-32 h-32 sm:h-auto rounded-xl overflow-hidden flex-shrink-0 relative">
        <img src={s.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <div className="absolute inset-0 bg-black/10 sm:hidden" />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 sm:hidden">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/95 ${statusColors[s.status]}`}>{s.status}</span>
          {!s.ieltsRequired && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#7B1F2E] text-white">No IELTS</span>}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <div className="hidden sm:flex items-center gap-2 mb-1.5">
              <span className="text-lg">{s.countryFlag}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusColors[s.status]}`}>{s.status}</span>
              {!s.ieltsRequired && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-white" style={{ backgroundColor: "#7B1F2E" }}>No IELTS</span>}
            </div>
            <h4 className="text-base font-extrabold text-gray-900 group-hover:text-[#7B1F2E] transition-colors truncate sm:whitespace-normal sm:line-clamp-2">{s.name}</h4>
            <p className="text-xs text-gray-500 font-medium">{s.country} • {s.university}</p>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0 absolute top-3 right-3 sm:relative sm:top-0 sm:right-0">
            <button 
              onClick={() => onCompare(s.slug || s._id || s.id)} 
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all shadow-sm ${inCompare ? "bg-[#7B1F2E] text-white border-[#7B1F2E]" : "bg-white border-gray-200 text-gray-400 hover:text-[#7B1F2E] hover:border-[#7B1F2E40]"}`}
            >
              <Scale size={12} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] text-gray-500 font-bold uppercase tracking-tight mt-3">
          <span className="flex items-center gap-1 text-[#7B1F2E]"><Landmark size={12} /> {s.fundingType}</span>
          <span className="flex items-center gap-1"><Grid3X3 size={12} /> {s.degree[0]}</span>
          <span className="flex items-center gap-1"><Calendar size={12} /> {s.daysLeft ? `${s.daysLeft} days` : "Upcoming"}</span>
          {s.matchScore && <span className="text-green-600">★ {s.matchScore}% Match</span>}
        </div>
      </div>

      <div className="flex sm:flex-col gap-2 mt-2 sm:mt-0 sm:w-28 flex-shrink-0">
        <Link 
          to={`/scholarships/${s.slug || s._id || s.id}`} 
          className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-white rounded-xl text-center transition-all hover:opacity-90 active:scale-95" 
          style={{ backgroundColor: "#7B1F2E" }}
        >
          Details
        </Link>
        <button 
          onClick={() => onApply(s._id || s.id)}
          className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold rounded-xl text-center border-2 transition-all duration-200 border-[#7B1F2E] text-[#7B1F2E] hover:bg-[#7B1F2E] hover:text-white active:scale-95"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

function CompareModal({ ids, onClose, scholarshipList }: { ids: string[]; onClose: () => void; scholarshipList: any[] }) {
  const items = scholarshipList.filter(s => ids.includes(s.slug || s._id || s.id));

  const fields = [
    { label: "Country", key: "country" },
    { label: "Funding", key: "fundingType" },
    { label: "Degree", render: (s: any) => s.degree.join(", ") },
    { label: "IELTS Required", render: (s: any) => s.ieltsRequired ? "Yes" : "No" },
    { label: "Deadline (Days)", render: (s: any) => s.daysLeft ? `${s.daysLeft} days` : "Upcoming" },
    { label: "Stipend", key: "stipend" },
    { label: "Difficulty", key: "difficulty" },
    { label: "Verified", render: (s: any) => s.isVerified ? <span className="flex items-center justify-center gap-1 text-green-600"><CheckCircle size={12} /> Yes</span> : "No" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-bold text-gray-900">Compare Scholarships</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#FDF8F5" }}>
                <th className="text-left p-4 text-gray-500 font-medium w-32">Feature</th>
                {items.map(s => (
                  <th key={s.slug || s._id || s.id} className="p-4 text-center">
                    <div className="text-2xl mb-1">{s.countryFlag}</div>
                    <div className="font-bold text-gray-900 text-xs">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.country}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((f, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="p-4 text-gray-500 text-xs font-medium">{f.label}</td>
                  {items.map(s => (
                    <td key={s.slug || s._id || s.id} className="p-4 text-center text-xs font-medium text-gray-800">
                      {f.render ? f.render(s) : (s[f.key as keyof typeof s] as string) || "—"}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-gray-100">
                <td className="p-4 text-gray-500 text-xs font-medium">Action</td>
                {items.map(s => (
                  <td key={s.slug || s._id || s.id} className="p-4 text-center">
                    <Link to={`/scholarships/${s.slug || s._id || s.id}`} onClick={onClose} className="inline-block px-3 py-1.5 text-xs text-white rounded-lg" style={{ backgroundColor: "#7B1F2E" }}>
                      View Details
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function Scholarships() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleApply = async (scholarshipId: string) => {
    if (!isLoggedIn || !user) {
      navigate("/register");
      return;
    }
    
    try {
      await api.post('/applications', {
        student: user.id || (user as any)._id,
        scholarship: scholarshipId,
        status: 'Profile Received',
        progress: 5
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to apply", err);
      navigate("/dashboard");
    }
  };

  const [scholarshipList, setScholarshipList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [compareList, setCompareList] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const data = await api.get('/scholarships');
        setScholarshipList(data);
      } catch (err) {
        console.error("Failed to fetch scholarships", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, []);

  const [filters, setFilters] = useState({
    country: searchParams.get("country") || "",
    degree: searchParams.get("degree") || "",
    funding: searchParams.get("funding") || "",
    type: "",
    ielts: searchParams.get("ielts") || "",
    status: searchParams.get("status") || "",
    category: searchParams.get("category") || "",
    difficulty: "",
  });

  const [sortBy, setSortBy] = useState("deadline");

  const filtered = scholarshipList.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q) ||
      s.university.toLowerCase().includes(q) || s.subjects.some((sub: string) => sub.toLowerCase().includes(q));
    const matchCountry = !filters.country || s.country === filters.country;
    const matchDegree = !filters.degree || s.degree.some((d: string) => d.includes(filters.degree));
    const matchFunding = !filters.funding || s.fundingType === filters.funding;
    const matchType = !filters.type || s.scholarshipType === filters.type;
    const matchIelts = !filters.ielts || (filters.ielts === "false" ? !s.ieltsRequired : s.ieltsRequired);
    const matchStatus = !filters.status || s.status === filters.status;
    const matchDifficulty = !filters.difficulty || s.difficulty === filters.difficulty;
    return matchSearch && matchCountry && matchDegree && matchFunding && matchType && matchIelts && matchStatus && matchDifficulty;
  }).sort((a, b) => {
    if (sortBy === "deadline") return (a.daysLeft || 999) - (b.daysLeft || 999);
    if (sortBy === "match") return (b.matchScore || 0) - (a.matchScore || 0);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: prev[key as keyof typeof prev] === value ? "" : value }));
  };

  const clearAll = () => {
    setFilters({ country: "", degree: "", funding: "", type: "", ielts: "", status: "", category: "", difficulty: "" });
    setSearch("");
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (search ? 1 : 0);

  if (loading) return <ScholarshipsSkeleton />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
      <SEO 
        title="Scholarships for Bangladeshi Students | Fully Funded & No IELTS Options"
        description="Explore government, university, fully funded, no IELTS, Bachelor, Master’s, PhD and MBBS scholarships for Bangladeshi students."
        keywords="scholarships for Bangladeshi students, fully funded scholarship Bangladesh, no IELTS scholarship, study abroad scholarship"
        canonical="/scholarships"
      />
      
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Find Scholarships Based on Your Profile</h1>
          <p className="text-red-200 mb-6">Search from 1000+ scholarships across 25+ countries</p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-3xl">
            <div className="flex-1 relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7B1F2E] transition-colors" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country, university, subject..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#7B1F2E10] border-0 shadow-lg transition-all"
              />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white text-[#7B1F2E] text-sm font-bold hover:bg-red-50 transition shadow-lg sm:w-auto w-full"
            >
              <SlidersHorizontal size={18} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white ml-1" style={{ backgroundColor: "#7B1F2E" }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar Filters Wrapper */}
          <div className={`
            fixed inset-0 z-[60] lg:relative lg:z-0 lg:block lg:w-64 flex-shrink-0 transition-all duration-300
            ${filterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"}
          `}>
            {/* Mobile Overlay */}
            <div 
              className="lg:hidden absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setFilterOpen(false)}
            />
            
            {/* Drawer/Sidebar */}
            <div className={`
              absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white lg:bg-transparent lg:w-64 lg:relative lg:inset-auto
              shadow-2xl lg:shadow-none flex flex-col transform transition-transform duration-500 ease-out
              ${filterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
              <div className="bg-white lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-24 h-full lg:h-auto flex flex-col">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <Filter size={18} style={{ color: "#7B1F2E" }} />
                    <h3 className="font-bold text-gray-900">Filters</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {activeFiltersCount > 0 && (
                      <button onClick={clearAll} className="text-xs text-[#7B1F2E] font-semibold hover:underline">Clear</button>
                    )}
                    <button 
                      onClick={() => setFilterOpen(false)}
                      className="lg:hidden p-1.5 rounded-lg bg-gray-100 text-gray-500"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Filters Content */}
                <div className="p-5 space-y-6 overflow-y-auto flex-1 lg:max-h-[calc(100vh-200px)]">
                  <FilterSection title="Country">
                    {["Japan", "Hungary", "Turkey", "Russia", "Romania", "Saudi Arabia", "China", "South Korea", "Germany"].map(c => (
                      <FilterChip key={c} label={c} active={filters.country === c} onClick={() => updateFilter("country", c)} />
                    ))}
                  </FilterSection>

                  <FilterSection title="Degree Level">
                    {["Bachelor", "Master's", "PhD", "MBBS", "Foundation"].map(d => (
                      <FilterChip key={d} label={d} active={filters.degree === d} onClick={() => updateFilter("degree", d)} />
                    ))}
                  </FilterSection>

                  <FilterSection title="Funding Type">
                    {["Fully Funded", "Partially Funded", "Self-Funded"].map(f => (
                      <FilterChip key={f} label={f} active={filters.funding === f} onClick={() => updateFilter("funding", f)} />
                    ))}
                  </FilterSection>

                  <FilterSection title="IELTS Requirement">
                    <FilterChip label="Not Required" active={filters.ielts === "false"} onClick={() => updateFilter("ielts", "false")} />
                    <FilterChip label="Required" active={filters.ielts === "true"} onClick={() => updateFilter("ielts", "true")} />
                  </FilterSection>

                  <FilterSection title="Status">
                    {["Open", "Closing Soon", "Upcoming", "Closed"].map(s => (
                      <FilterChip key={s} label={s} active={filters.status === s} onClick={() => updateFilter("status", s)} />
                    ))}
                  </FilterSection>

                  <FilterSection title="Difficulty">
                    {["Easy", "Medium", "Competitive", "Highly Competitive"].map(d => (
                      <FilterChip key={d} label={d} active={filters.difficulty === d} onClick={() => updateFilter("difficulty", d)} />
                    ))}
                  </FilterSection>

                  <FilterSection title="Scholarship Type">
                    {["Government", "University", "Private", "Exchange"].map(t => (
                      <FilterChip key={t} label={t} active={filters.type === t} onClick={() => updateFilter("type", t)} />
                    ))}
                  </FilterSection>
                </div>

                {/* Mobile Apply Button */}
                <div className="p-4 lg:hidden bg-gray-50 border-t border-gray-100">
                  <button 
                    onClick={() => setFilterOpen(false)}
                    className="w-full py-4 rounded-2xl text-white font-bold text-sm shadow-xl transition-all active:scale-[0.98]"
                    style={{ backgroundColor: "#7B1F2E" }}
                  >
                    Show {filtered.length} Results
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Results Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
              <div>
                <p className="font-semibold text-gray-900">{filtered.length} Scholarships Found</p>
                {search && <p className="text-sm text-gray-500">Results for "{search}"</p>}
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
                >
                  <option value="deadline">Sort by Deadline</option>
                  <option value="match">Sort by Match Score</option>
                  <option value="name">Sort by Name</option>
                </select>
                <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-[#7B1F2E] text-white" : "text-gray-500"}`}><Grid3X3 size={14} /></button>
                  <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-[#7B1F2E] text-white" : "text-gray-500"}`}><List size={14} /></button>
                </div>
              </div>
            </div>

            {/* Active Filter Badges */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(filters).map(([key, val]) =>
                  val ? (
                    <span key={key} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-white border shadow-sm" style={{ borderColor: "#7B1F2E30", color: "#7B1F2E" }}>
                      {val}
                      <button onClick={() => updateFilter(key, val)}><X size={10} /></button>
                    </span>
                  ) : null
                )}
              </div>
            )}

            {/* Compare Bar */}
            {compareList.length > 0 && (
              <div className="mb-5 p-4 bg-white rounded-xl border-2 border-[#7B1F2E30] flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Scale size={16} style={{ color: "#7B1F2E" }} />
                  <span className="text-sm font-medium">{compareList.length} scholarships selected for comparison</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCompareOpen(true)}
                    className="px-4 py-2 text-xs text-white rounded-lg font-medium"
                    style={{ backgroundColor: "#7B1F2E" }}
                  >
                    Compare Now
                  </button>
                  <button onClick={() => setCompareList([])} className="px-4 py-2 text-xs rounded-lg border border-gray-200 text-gray-500">Clear</button>
                </div>
              </div>
            )}

            {/* Results Grid/List */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <div className="text-[#7B1F2E] mb-4 flex justify-center"><Search size={48} /></div>
                <h3 className="font-bold text-gray-800 mb-2">No scholarships found</h3>
                <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filters</p>
                <button onClick={clearAll} className="px-5 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: "#7B1F2E" }}>Clear All Filters</button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-5" : "flex flex-col gap-4"}>
                 {filtered.map(s => (
                   viewMode === "grid" ? (
                     <ScholarshipGridCard key={s._id || s.id} s={s} onCompare={toggleCompare} inCompare={compareList.includes(s._id || s.id)} onApply={handleApply} />
                   ) : (
                     <ScholarshipListCard key={s._id || s.id} s={s} onCompare={toggleCompare} inCompare={compareList.includes(s._id || s.id)} onApply={handleApply} />
                   )
                 ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      {compareOpen && compareList.length > 1 && (
        <CompareModal ids={compareList} onClose={() => setCompareOpen(false)} scholarshipList={scholarshipList} />
      )}
    </div>
  );
}
