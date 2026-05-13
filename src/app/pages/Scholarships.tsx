import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import {
  Search, Filter, X, ChevronDown, Bookmark, Star, Shield,
  Calendar, ArrowRight, SlidersHorizontal, Grid3X3, List, Scale,
  Landmark, Clock, CheckCircle
} from "lucide-react";
import { api } from "../services/api";
import { useSavedScholarships } from "../hooks/useAuth";
import { SEO } from "../components/SEO";

import { ScholarshipsSkeleton } from "../components/ui/PremiumSkeletons";

export default function Scholarships() {
  const [scholarshipList, setScholarshipList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ... rest of the component
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

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by country, university, subject, scholarship name..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E30] border border-gray-100 shadow-sm"
              />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition border border-white/20"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ backgroundColor: "#7B1F2E" }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className={`${filterOpen ? "block" : "hidden"} lg:block w-64 flex-shrink-0`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button onClick={clearAll} className="text-xs text-red-500 hover:underline">Clear All</button>
                )}
              </div>

              <div className="p-4 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Country */}
                <FilterSection title="Country">
                  {["Japan", "Hungary", "Turkey", "Russia", "Romania", "Saudi Arabia", "China", "South Korea", "Germany"].map(c => (
                    <FilterChip key={c} label={c} active={filters.country === c} onClick={() => updateFilter("country", c)} />
                  ))}
                </FilterSection>

                {/* Degree */}
                <FilterSection title="Degree Level">
                  {["Bachelor", "Master's", "PhD", "MBBS", "Foundation"].map(d => (
                    <FilterChip key={d} label={d} active={filters.degree === d} onClick={() => updateFilter("degree", d)} />
                  ))}
                </FilterSection>

                {/* Funding */}
                <FilterSection title="Funding Type">
                  {["Fully Funded", "Partially Funded", "Self-Funded"].map(f => (
                    <FilterChip key={f} label={f} active={filters.funding === f} onClick={() => updateFilter("funding", f)} />
                  ))}
                </FilterSection>

                {/* IELTS */}
                <FilterSection title="IELTS Requirement">
                  <FilterChip label="Not Required" active={filters.ielts === "false"} onClick={() => updateFilter("ielts", "false")} />
                  <FilterChip label="Required" active={filters.ielts === "true"} onClick={() => updateFilter("ielts", "true")} />
                </FilterSection>

                {/* Status */}
                <FilterSection title="Status">
                  {["Open", "Closing Soon", "Upcoming", "Closed"].map(s => (
                    <FilterChip key={s} label={s} active={filters.status === s} onClick={() => updateFilter("status", s)} />
                  ))}
                </FilterSection>

                {/* Difficulty */}
                <FilterSection title="Difficulty">
                  {["Easy", "Medium", "Competitive", "Highly Competitive"].map(d => (
                    <FilterChip key={d} label={d} active={filters.difficulty === d} onClick={() => updateFilter("difficulty", d)} />
                  ))}
                </FilterSection>

                {/* Type */}
                <FilterSection title="Scholarship Type">
                  {["Government", "University", "Private", "Exchange"].map(t => (
                    <FilterChip key={t} label={t} active={filters.type === t} onClick={() => updateFilter("type", t)} />
                  ))}
                </FilterSection>
              </div>
            </div>
          </div>

          {/* Main Content */}
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

            {/* Active Filters */}
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
                    <ScholarshipGridCard key={s._id || s.id} s={s} onCompare={toggleCompare} inCompare={compareList.includes(s._id || s.id)} />
                  ) : (
                    <ScholarshipListCard key={s._id || s.id} s={s} onCompare={toggleCompare} inCompare={compareList.includes(s._id || s.id)} />
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

function ScholarshipGridCard({ s, onCompare, inCompare }: { s: any; onCompare: (id: string) => void; inCompare: boolean }) {
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
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col group">
      <div className="relative h-40 overflow-hidden">
        <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[s.status]}`}>{s.status}</span>
          {s.daysLeft && s.daysLeft <= 14 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-600 text-white flex items-center gap-1">
              <Clock size={10} /> {s.daysLeft}d left
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            onClick={(e) => { e.preventDefault(); onCompare(s.slug || s._id || s.id); }}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition ${inCompare ? "bg-[#7B1F2E] text-white" : "bg-white/90 text-gray-500 hover:bg-white"}`}
          >
            <Scale size={11} />
          </button>
          <button onClick={toggleSave} className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition">
            <Bookmark size={11} fill={saved ? "#7B1F2E" : "none"} color={saved ? "#7B1F2E" : "#6b7280"} />
          </button>
        </div>
        {s.isVerified && (
          <div className="absolute bottom-2 left-3 bg-white/90 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium" style={{ color: "#7B1F2E" }}>
            <Shield size={9} /> Verified
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">{s.countryFlag}</span>
            <span className="text-xs text-gray-500">{s.country}</span>
          </div>
          <span className="text-xs font-medium flex items-center gap-1" style={{ color: "#7B1F2E" }}>
            {s.fundingType === "Fully Funded" ? <><Landmark size={12} /> Fully Funded</> : s.fundingType}
          </span>
        </div>

        <h4 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">{s.name}</h4>
        <p className="text-xs text-gray-500 mb-3 line-clamp-1">{s.university}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {s.degree.slice(0, 2).map((d: string) => (
            <span key={d} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{d}</span>
          ))}
          {!s.ieltsRequired && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#7B1F2E10", color: "#7B1F2E" }}>No IELTS</span>}
        </div>

        <div className="grid grid-cols-2 gap-1.5 mb-3 text-xs text-gray-500">
          <div className="flex items-center gap-1"><Calendar size={9} /> <span>{s.daysLeft ? `${s.daysLeft} days` : "Upcoming"}</span></div>
          <div className={`font-medium ${difficultyColors[s.difficulty]}`}>{s.difficulty}</div>
        </div>

        {s.matchScore && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Profile Match</span>
              <span className="font-bold" style={{ color: "#7B1F2E" }}>{s.matchScore}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${s.matchScore}%`, backgroundColor: "#7B1F2E" }} />
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          <Link to={`/scholarships/${s.slug || s._id || s.id}`} className="flex-1 py-2 text-xs font-semibold text-white text-center rounded-lg transition hover:opacity-90" style={{ backgroundColor: "#7B1F2E" }}>
            View Details
          </Link>
          <Link 
            to="/contact" 
            className="flex-1 py-2 text-xs font-semibold text-center rounded-lg border transition-all duration-200 border-[#7B1F2E] text-[#7B1F2E] hover:bg-[#7B1F2E] hover:text-white active:bg-[#7B1F2E] active:text-white"
          >
            Apply
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScholarshipListCard({ s, onCompare, inCompare }: { s: any; onCompare: (id: string) => void; inCompare: boolean }) {
  const statusColors: any = {
    "Open": "bg-green-100 text-green-700",
    "Closing Soon": "bg-red-100 text-red-700",
    "Upcoming": "bg-blue-100 text-blue-700",
    "Closed": "bg-gray-100 text-gray-500"
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-all">
      <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0">
        <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{s.countryFlag}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[s.status]}`}>{s.status}</span>
              {!s.ieltsRequired && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#7B1F2E10", color: "#7B1F2E" }}>No IELTS</span>}
            </div>
            <h4 className="text-sm font-bold text-gray-900">{s.name}</h4>
            <p className="text-xs text-gray-500">{s.country} • {s.university}</p>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <button onClick={() => onCompare(s.slug || s._id || s.id)} className={`w-7 h-7 rounded-full flex items-center justify-center border transition ${inCompare ? "bg-[#7B1F2E] text-white border-[#7B1F2E]" : "border-gray-200 text-gray-400"}`}><Scale size={11} /></button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
          <span>{s.fundingType}</span>
          <span>{s.degree.join(", ")}</span>
          <span className="flex items-center gap-1"><Calendar size={9} />{s.daysLeft ? `${s.daysLeft} days left` : "Upcoming"}</span>
          {s.matchScore && <span style={{ color: "#7B1F2E" }}>★ {s.matchScore}% match</span>}
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        <Link 
          to={`/scholarships/${s.slug || s._id || s.id}`} 
          className="px-4 py-2 text-xs font-semibold text-white rounded-lg text-center transition-all hover:opacity-90 active:scale-95" 
          style={{ backgroundColor: "#7B1F2E" }}
        >
          Details
        </Link>
        <Link 
          to="/contact" 
          className="px-4 py-2 text-xs font-semibold rounded-lg text-center border transition-all duration-200 border-[#7B1F2E] text-[#7B1F2E] hover:bg-[#7B1F2E] hover:text-white active:bg-[#7B1F2E] active:text-white"
        >
          Apply
        </Link>
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
