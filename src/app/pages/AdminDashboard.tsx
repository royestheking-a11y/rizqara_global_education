import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  LayoutDashboard, GraduationCap, Users, UserCheck, FileText, Bell, BookOpen,
  MessageSquare, MessageCircle, Star, HelpCircle, Settings, LogOut, Plus, Edit,
  Trash2, Eye, Search, ChevronDown, X, Shield, Globe, BarChart3,
  TrendingUp, AlertCircle, CheckCircle, Clock, ClipboardList,
  DollarSign, Megaphone, Mail, Phone, ArrowLeft, MoreVertical, Paperclip, Send, ArrowRight
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { TableSkeleton, DashboardSkeleton, GenericGridSkeleton } from "../components/ui/PremiumSkeletons";
import { Skeleton } from "../components/ui/skeleton";


// === UTILITIES ===
import { api } from "../services/api";

function ImageUpload({ value, onChange, label = "Upload Image" }: { value: string, onChange: (val: string) => void, label?: string }) {
  const [preview, setPreview] = useState(value);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const res = await api.upload(file);
        setPreview(res.url);
        onChange(res.url);
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-500 uppercase block tracking-wider">{label}</label>
      <div className="flex items-center gap-5 p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-white flex-shrink-0 relative group shadow-inner transition-all hover:border-[#7B1F2E50]">
          {preview ? (
            <>
              <img src={preview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Preview" />
              <div className="absolute inset-0 bg-[#7B1F2E]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-1">
                <Edit size={16} className="text-white" />
                <span className="text-[10px] text-white font-bold uppercase">Change</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-[#7B1F2E] transition-colors">
              <Plus size={24} />
              <span className="text-[10px] font-bold uppercase">Add</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#7B1F2E] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-800 mb-1">Select an image</h4>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">Choose a high-quality image. Recommended size: 1200x600px for carousel.</p>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" id={`upload-${label}`} />
          <label htmlFor={`upload-${label}`} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer hover:shadow-md hover:border-[#7B1F2E30] transition-all active:scale-95 group">
            <Plus size={14} className="group-hover:rotate-90 transition-transform" />
            Upload File
          </label>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type = "success", onClose }: { message: string, type?: "success" | "error", onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 ${type === "success" ? "bg-gray-900 text-white" : "bg-red-600 text-white"}`}>
      {type === "success" ? <CheckCircle size={18} className="text-green-400" /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

const navItems = [
  { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={15} /> },
  { id: "scholarships", label: "Scholarships", icon: <GraduationCap size={15} /> },
  { id: "carousel", label: "Hero Carousel", icon: <Megaphone size={15} /> },
  { id: "students", label: "Students", icon: <Users size={15} /> },
  { id: "applications", label: "Applications", icon: <FileText size={15} /> },
  { id: "notices", label: "Notices", icon: <Bell size={15} /> },
  { id: "blog", label: "Blog", icon: <BookOpen size={15} /> },
  { id: "testimonials", label: "Testimonials", icon: <Star size={15} /> },
  { id: "faq", label: "FAQ", icon: <HelpCircle size={15} /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 size={15} /> },
  { id: "payments", label: "Payments", icon: <DollarSign size={15} /> },
  { id: "messages", label: "Messages", icon: <MessageSquare size={15} /> },
];

export default function AdminDashboard() {
  const { user, isLoggedIn, isAdmin, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { tab } = useParams();
  const activeTab = tab || "overview";
  const setActiveTab = (t: string) => navigate(`/admin/${t}`);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const [appFilter, setAppFilter] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn || !isAdmin) navigate("/login");
    }
  }, [isLoggedIn, isAdmin, loading]);

  if (loading) return <DashboardSkeleton />;
  if (!isLoggedIn || !isAdmin) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <AdminOverview />;
      case "scholarships": return <ScholarshipManagement showToast={showToast} />;
      case "carousel": return <CarouselManagement showToast={showToast} />;
      case "students": return <StudentManagement showToast={showToast} setActiveTab={setActiveTab} setAppFilter={setAppFilter} />;
      case "applications": return <ApplicationManagement showToast={showToast} filter={appFilter} setFilter={setAppFilter} />;
      case "notices": return <NoticeManagement showToast={showToast} />;
      case "blog": return <BlogManagement showToast={showToast} />;
      case "testimonials": return <TestimonialManagement showToast={showToast} />;
      case "faq": return <FAQManagement showToast={showToast} />;
      case "analytics": return <Analytics />;
      case "payments": return <PaymentManagement showToast={showToast} />;
      case "messages": return <AdminMessages />;
      default: return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F3F4F6" }}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-40 w-72 flex-shrink-0 bg-white h-full min-h-screen shadow-lg border-r border-gray-100 transition-transform duration-200 flex flex-col`}>
        <div className="p-4 border-b border-gray-100" style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Shield size={14} color="white" /></div>
            <div>
              <div className="text-white font-bold text-sm">RizQara Admin</div>
              <div className="text-red-200 text-xs">Super Administrator</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <p className="text-xs text-gray-400 px-2 mb-2 mt-1">MANAGEMENT</p>
          <div className="space-y-0.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id 
                    ? "bg-[#7B1F2E] text-white shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <div className="bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-md hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
              <div className="w-4 h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-4 h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-4 h-0.5 bg-gray-600"></div>
            </button>
            <div>
              <h1 className="font-bold text-gray-900 text-sm">{navItems.find(n => n.id === activeTab)?.label}</h1>
              <p className="text-xs text-gray-500">RizQara Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" target="_blank" className="text-xs px-3 py-1.5 rounded-lg border font-medium text-gray-600 hover:bg-gray-50"><Globe size={12} className="inline mr-1" />View Site</Link>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#7B1F2E" }}>A</div>
          </div>
        </div>

        <div className="p-5 lg:p-7">
          {renderContent()}
        </div>
      </div>

      {/* Toasts Rendering */}
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

// === OVERVIEW ===
function AdminOverview() {
  const [statsData, setStatsData] = useState<any>(null);
  const [scholarshipList, setScholarshipList] = useState<any[]>([]);
  const [appsList, setAppsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [stats, scholars, apps] = await Promise.all([
          api.get('/stats'),
          api.get('/scholarships'),
          api.get('/applications')
        ]);
        setStatsData(stats);
        setScholarshipList(scholars);
        setAppsList(apps);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <DashboardSkeleton />;

  const stats = [
    { label: "Total Students", value: statsData?.totalStudents?.toString() || "0", change: "Registered Accounts", icon: <Users size={20} />, color: "#7B1F2E" },
    { label: "Active Applications", value: statsData?.activeApplications?.toString() || "0", change: "In Progress", icon: <ClipboardList size={20} />, color: "#7B1F2E" },
    { label: "Open Scholarships", value: statsData?.openScholarships?.toString() || "0", change: "Available", icon: <GraduationCap size={20} />, color: "#10B981" },
    { label: "New Leads", value: statsData?.newLeads?.toString() || "0", change: "Unread Messages", icon: <MessageSquare size={20} />, color: "#3B82F6" },
    { label: "Pending Documents", value: statsData?.pendingDocuments?.toString() || "0", change: "Awaiting Review", icon: <FileText size={20} />, color: "#EF4444" },
    { label: "Total Revenue", value: statsData?.totalRevenue || "৳ 0", change: "From Accepted Payments", icon: <DollarSign size={20} />, color: "#8B5CF6" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="mb-2" style={{ color: s.color }}>{s.icon}</div>
            <div className="text-xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-600 font-medium">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Add Scholarship", icon: <GraduationCap size={20} />, action: "scholarships" },
          { label: "Add Notice", icon: <Megaphone size={20} />, action: "notices" },
          { label: "Review Documents", icon: <FileText size={20} />, action: "applications" },
          { label: "Add Blog Post", icon: <Edit size={20} />, action: "blog" },
        ].map((qa, i) => (
          <button key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition text-left flex items-center gap-3">
            <span className="text-[#7B1F2E]">{qa.icon}</span>
            <span className="font-semibold text-gray-800 text-sm">{qa.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-4">Recent Applications</h3>
          <div className="space-y-3">
            {appsList.slice(0, 5).map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{a.student?.name?.charAt(0) || "S"}</div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">{a.student?.name || "Unknown Student"}</div>
                    <div className="text-[10px] text-gray-500">{a.scholarship?.name || "Scholarship"}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7B1F2E12] text-[#7B1F2E] font-bold">{a.status}</span>
                  <div className="text-[10px] text-gray-400 mt-0.5">{new Date(a.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
            {appsList.length === 0 && <div className="text-center py-4 text-xs text-gray-400">No applications yet</div>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-4">Closing Soon Scholarships</h3>
          <div className="space-y-3">
            {scholarshipList.filter(s => s.daysLeft && s.daysLeft < 30).slice(0, 5).map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0">
                <div className="flex items-center gap-2">
                  <span>{s.countryFlag}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-800 line-clamp-1">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.country}</div>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.daysLeft! <= 14 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                  {s.daysLeft} days left
                </span>
              </div>
            ))}
            {scholarshipList.filter(s => s.daysLeft && s.daysLeft < 30).length === 0 && <div className="text-center py-4 text-xs text-gray-400">No urgent deadlines</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// === SCHOLARSHIP MANAGEMENT ===
function ScholarshipManagement({ showToast }: any) {
  const [scholarshipList, setScholarshipList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({ name: "", slug: "", country: "", degree: "", fundingType: "Fully Funded", status: "Open", ieltsRequired: false, deadline: "", university: "", description: "" });

  const fetchScholarships = async () => {
    try {
      const data = await api.get('/scholarships');
      setScholarshipList(data);
    } catch (err) {
      showToast("Failed to fetch scholarships", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const filtered = scholarshipList.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.country.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    const finalForm = { 
      ...form, 
      degree: typeof form.degree === "string" ? form.degree.split(",").map((d: string) => d.trim()) : form.degree 
    };
    try {
      if (editItem) {
        await api.put(`/scholarships/${editItem._id || editItem.id}`, finalForm);
        showToast("Scholarship updated successfully");
      } else {
        await api.post('/scholarships', finalForm);
        showToast("New scholarship added");
      }
      fetchScholarships();
      setShowModal(false);
      setEditItem(null);
      setForm({ name: "", slug: "", country: "", degree: "", fundingType: "Fully Funded", status: "Open", ieltsRequired: false, deadline: "", university: "", description: "" });
    } catch (err) {
      showToast("Save failed", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this scholarship?")) {
      try {
        await api.delete(`/scholarships/${id}`);
        fetchScholarships();
        showToast("Scholarship deleted", "error");
      } catch (err) {
        showToast("Delete failed", "error");
      }
    }
  };

  const statusColors: any = { "Open": "bg-green-100 text-green-700", "Closing Soon": "bg-red-100 text-red-700", "Upcoming": "bg-blue-100 text-blue-700", "Closed": "bg-gray-100 text-gray-500" };

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="font-bold text-gray-900">Scholarship Management ({filtered.length})</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center gap-1.5 px-4 py-2 bg-[#7B1F2E] text-white text-sm rounded-lg font-medium transition-all duration-200 hover:opacity-90 active:scale-95 focus:ring-2 focus:ring-[#7B1F2E30]"
          >
            <Plus size={14} /> Add Scholarship
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "#FDF8F5" }}>
              <tr>
                {["Scholarship", "Country", "Degree", "Funding", "Status", "Deadline", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, index) => (
                <tr key={s._id || s.id || index} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{s.countryFlag}</span>
                      <div>
                        <div className="font-medium text-gray-900 text-xs">{s.name}</div>
                        <div className="text-xs text-gray-400">{s.university}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{s.country}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{s.degree.slice(0, 2).join(", ")}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{s.fundingType}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{s.daysLeft ? `${s.daysLeft}d` : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link to={`/scholarships/${s.slug || s._id || s.id}`} className="p-1.5 rounded hover:bg-gray-100 text-blue-500"><Eye size={13} /></Link>
                      <button onClick={() => { setEditItem(s); setForm({ name: s.name, slug: s.slug || "", country: s.country, degree: s.degree.join(", "), fundingType: s.fundingType, status: s.status, ieltsRequired: s.ieltsRequired, deadline: s.deadline, university: s.university, description: s.description }); setShowModal(true); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><Edit size={13} /></button>
                      <button onClick={() => handleDelete(s._id || s.id)} className="p-1.5 rounded hover:bg-gray-100 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">{editItem ? "Edit Scholarship" : "Add New Scholarship"}</h3>
              <button onClick={() => { setShowModal(false); setEditItem(null); }}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Scholarship Name", key: "name", type: "text" },
                { label: "URL Slug (Custom)", key: "slug", type: "text", placeholder: "e.g., turkiye-burslari-2027" },
                { label: "Country", key: "country", type: "text" },
                { label: "University", key: "university", type: "text" },
                { label: "Degree Level(s)", key: "degree", type: "text", placeholder: "Bachelor, Master's, PhD" },
                { label: "Deadline", key: "deadline", type: "text", placeholder: "e.g., 2027-02-28" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
                  <input type={f.type} value={form[f.key] || ""} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Funding Type</label>
                <select value={form.fundingType} onChange={e => setForm((p: any) => ({ ...p, fundingType: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white">
                  {["Fully Funded", "Partially Funded", "Self-Funded"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Status</label>
                <select value={form.status} onChange={e => setForm((p: any) => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white">
                  {["Open", "Closing Soon", "Upcoming", "Closed"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Description</label>
                <textarea value={form.description || ""} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="ielts" checked={form.ieltsRequired} onChange={e => setForm((p: any) => ({ ...p, ieltsRequired: e.target.checked }))} />
                <label htmlFor="ielts" className="text-sm text-gray-700">IELTS Required</label>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button 
                onClick={handleSave} 
                className="flex-1 py-2.5 bg-[#7B1F2E] text-white rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95 focus:ring-2 focus:ring-[#7B1F2E30]"
              >
                {editItem ? "Update" : "Add Scholarship"}
              </button>
              <button 
                onClick={() => { setShowModal(false); setEditItem(null); }} 
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 transition-all duration-200 hover:bg-gray-50 active:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === STUDENT MANAGEMENT ===
function StudentManagement({ showToast, setActiveTab, setAppFilter }: any) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState<any>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState<any>({ name: "", email: "", targetCountry: "", targetDegree: "", gpa: "", ieltsStatus: "No IELTS" });

  const fetchStudents = async () => {
    try {
      const data = await api.get('/users');
      setStudents(data);
    } catch (err) {
      showToast("Failed to fetch students", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <TableSkeleton />;

  const handleSave = async () => {
    try {
      if (editItem) {
        await api.put(`/users/${editItem.id || editItem._id}`, form);
        showToast("Student profile updated");
      }
      fetchStudents();
      setShowModal(false);
      setEditItem(null);
    } catch (err) {
      showToast("Save failed", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete student?")) {
      try {
        await api.delete(`/users/${id}`);
        fetchStudents();
        showToast("Student deleted", "error");
      } catch (err) {
        showToast("Delete failed", "error");
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-gray-900">Student Management ({students.length})</h2>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search students..." className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "#FDF8F5" }}>
            <tr>
              {["Student", "Target Country", "Degree", "GPA", "IELTS", "Applications", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((s: any, i) => (
              <tr key={s._id || s.id || i} className="border-t border-gray-50 hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#7B1F2E" }}>{s.name?.charAt(0)}</div>
                    <div>
                      <div className="font-medium text-gray-900 text-xs">{s.name}</div>
                      <div className="text-xs text-gray-400">{s.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{s.targetCountry}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{s.targetDegree}</td>
                <td className="px-4 py-3 text-xs font-semibold" style={{ color: "#7B1F2E" }}>{s.gpa}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{s.ieltsStatus}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{s.applications?.length || 0}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Active</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setViewItem(s)} className="p-1.5 rounded hover:bg-gray-100 text-blue-500 transition-colors"><Eye size={13} /></button>
                    <button onClick={() => { setEditItem(s); setForm({ name: s.name, email: s.email, targetCountry: s.targetCountry, targetDegree: s.targetDegree, gpa: s.gpa, ieltsStatus: s.ieltsStatus }); setShowModal(true); }} className="p-1.5 rounded hover:bg-gray-100 text-yellow-500 transition-colors"><Edit size={13} /></button>
                    <button onClick={() => handleDelete(s.id || s._id)} className="p-1.5 rounded hover:bg-gray-100 text-red-500 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Profile Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-24 bg-gradient-to-r from-[#7B1F2E] to-[#3D0F17]">
              <button onClick={() => setViewItem(null)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"><X size={18} /></button>
            </div>
            <div className="px-8 pb-8">
              <div className="relative -mt-12 mb-4 flex justify-between items-end">
                <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-xl">
                  <div className="w-full h-full rounded-xl flex items-center justify-center text-white text-3xl font-black" style={{ backgroundColor: "#7B1F2E" }}>{viewItem.name?.charAt(0)}</div>
                </div>
                <div className="flex gap-2 pb-2">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">Active</span>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">Verified</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-black text-gray-900">{viewItem.name}</h3>
                <p className="text-gray-500 flex items-center gap-1.5 mt-1 text-sm"><Mail size={14} /> {viewItem.email}</p>
                <p className="text-gray-500 flex items-center gap-1.5 mt-1 text-sm"><Phone size={14} /> {viewItem.phone || "No phone added"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Target Country", value: viewItem.targetCountry, icon: <Globe size={14} /> },
                  { label: "GPA", value: viewItem.gpa, icon: <BarChart3 size={14} /> },
                  { label: "Degree Level", value: viewItem.targetDegree, icon: <GraduationCap size={14} /> },
                  { label: "IELTS Status", value: viewItem.ieltsStatus, icon: <FileText size={14} /> },
                ].map((item, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <span className="text-[#7B1F2E]">{item.icon}</span> {item.label}
                    </div>
                    <div className="text-sm font-bold text-gray-800">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900 text-sm">Profile Completion</h4>
                  <span className="text-xs font-bold text-[#7B1F2E]">{viewItem.profileCompletion || 0}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#7B1F2E] rounded-full transition-all duration-1000" style={{ width: `${viewItem.profileCompletion || 0}%` }} />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <button 
                    onClick={() => {
                      setAppFilter(viewItem.name);
                      setActiveTab("applications");
                      setViewItem(null);
                    }}
                    className="flex-1 py-3 bg-[#7B1F2E] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#7B1F2E40] hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    View Applications
                  </button>
                  <button onClick={() => { setEditItem(viewItem); setForm({ ...viewItem }); setShowModal(true); setViewItem(null); }} className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-all"><Edit size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">Edit Student</h3>
              <button onClick={() => { setShowModal(false); setEditItem(null); }}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Name", key: "name" },
                { label: "Email", key: "email" },
                { label: "Target Country", key: "targetCountry" },
                { label: "Target Degree", key: "targetDegree" },
                { label: "GPA", key: "gpa" },
                { label: "IELTS Status", key: "ieltsStatus" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
                  <input type="text" value={form[f.key as keyof typeof form]} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={handleSave} className="flex-1 py-2.5 text-white rounded-lg font-semibold text-sm" style={{ backgroundColor: "#7B1F2E" }}>Update Student</button>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === APPLICATION MANAGEMENT ===
function ApplicationManagement({ showToast, filter, setFilter }: any) {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const data = await api.get('/applications');
      setApps(data);
    } catch (err) {
      showToast("Failed to fetch applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  if (loading) return <TableSkeleton />;

  const filteredApps = filter 
    ? apps.filter(a => (a.student?.name || "").toLowerCase().includes(filter.toLowerCase())) 
    : apps;

  const statuses = ["Profile Received", "Document Checking", "Missing Documents", "SOP/CV Preparing", "Application Form Started", "Submitted", "Waiting for Result", "Interview Stage", "Visa Guidance", "Completed", "Rejected"];
  const statusColors: any = { "Profile Received": "bg-blue-100 text-blue-700", "Document Checking": "bg-yellow-100 text-yellow-700", "SOP/CV Preparing": "bg-purple-100 text-purple-700", "Submitted": "bg-green-100 text-green-700", "Waiting for Result": "bg-gray-100 text-gray-700" };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/applications/${id}`, { status });
      showToast(`Status updated to: ${status}`);
      fetchApps();
    } catch (err) {
      showToast("Update failed", "error");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-gray-900">Application Management {filter && `(Filtered: ${filter})`}</h2>
        {filter && (
          <button onClick={() => setFilter(null)} className="text-xs text-[#7B1F2E] font-bold hover:underline">Clear Filter</button>
        )}
      </div>
      <div className="space-y-4">
        {filteredApps.map(app => (
          <div key={app._id || app.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-sm">{app.student?.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[app.status] || "bg-gray-100 text-gray-600"}`}>{app.status}</span>
                </div>
                <p className="text-xs text-gray-500">{app.scholarship?.countryFlag} {app.scholarship?.country} • {app.scholarship?.name}</p>
                <p className="text-xs text-gray-400 mt-1">Advisor: {app.advisor} • Updated: {app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : app.lastUpdate}</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={app.status} onChange={e => updateStatus(app._id || app.id, e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none">
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Progress</span>
                <span style={{ color: "#7B1F2E" }}>{app.progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full rounded-full" style={{ width: `${app.progress}%`, backgroundColor: "#7B1F2E" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === NOTICE MANAGEMENT ===
function NoticeManagement({ showToast }: any) {
  const [noticeList, setNoticeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: "", content: "", category: "General", isUrgent: false, isImportant: false });

  const fetchNotices = async () => {
    try {
      const data = await api.get('/notices');
      setNoticeList(data);
    } catch (err) {
      showToast("Failed to fetch notices", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) return <GenericGridSkeleton />;

  const handleSave = async () => {
    try {
      if (editItem) {
        await api.put(`/notices/${editItem._id || editItem.id}`, form);
        showToast("Notice updated");
      } else {
        await api.post('/notices', form);
        showToast("Notice published");
      }
      fetchNotices();
      setShowModal(false);
      setEditItem(null);
      setForm({ title: "", content: "", category: "General", isUrgent: false, isImportant: false });
    } catch (err) {
      showToast("Save failed", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this notice?")) {
      try {
        await api.delete(`/notices/${id}`);
        fetchNotices();
        showToast("Notice deleted", "error");
      } catch (err) {
        showToast("Delete failed", "error");
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-gray-900">Notice Management</h2>
        <button 
          onClick={() => setShowModal(true)} 
          className="flex items-center gap-1.5 px-4 py-2 bg-[#7B1F2E] text-white text-sm rounded-lg font-medium transition-all duration-200 hover:opacity-90 active:scale-95 focus:ring-2 focus:ring-[#7B1F2E30]"
        >
          <Plus size={14} /> Add Notice
        </button>
      </div>

      <div className="space-y-3">
        {noticeList.map((n, i) => (
          <div key={n._id || n.id || i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {n.isUrgent && <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-600">🔴 Urgent</span>}
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{n.category}</span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">{n.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{n.content.substring(0, 100)}...</p>
                <p className="text-xs text-gray-400 mt-1">{n.date}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditItem(n); setForm({ title: n.title, content: n.content, category: n.category, isUrgent: n.isUrgent, isImportant: n.isImportant }); setShowModal(true); }} className="p-1.5 rounded hover:bg-gray-100 text-yellow-500"><Edit size={13} /></button>
                <button onClick={() => handleDelete(n._id || n.id)} className="p-1.5 rounded hover:bg-gray-100 text-red-500"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">{editItem ? "Edit Notice" : "Add Notice"}</h3>
              <button onClick={() => { setShowModal(false); setEditItem(null); }}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Title</label>
                <input type="text" value={form.title} onChange={e => setForm((p: any) => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Category</label>
                <select value={form.category} onChange={e => setForm((p: any) => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none">
                  {["Deadline Reminder", "New Scholarship Open", "Embassy Update", "RizQara Announcement", "Upcoming Scholarship"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Content</label>
                <textarea value={form.content} onChange={e => setForm((p: any) => ({ ...p, content: e.target.value }))} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.isUrgent} onChange={e => setForm((p: any) => ({ ...p, isUrgent: e.target.checked }))} />
                  <span>Mark Urgent</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.isImportant} onChange={e => setForm((p: any) => ({ ...p, isImportant: e.target.checked }))} />
                  <span>Mark Important</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button 
                onClick={handleSave} 
                className="flex-1 py-2.5 bg-[#7B1F2E] text-white rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95 focus:ring-2 focus:ring-[#7B1F2E30]"
              >
                {editItem ? "Update Notice" : "Publish Notice"}
              </button>
              <button 
                onClick={() => { setShowModal(false); setEditItem(null); }} 
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 transition-all duration-200 hover:bg-gray-50 active:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === BLOG MANAGEMENT ===
function BlogManagement({ showToast }: any) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState<any>({ title: "", slug: "", category: "", excerpt: "", image: "" });

  const fetchBlogs = async () => {
    try {
      const data = await api.get('/blogs');
      setPosts(data);
    } catch (err) {
      showToast("Failed to fetch blogs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) return <GenericGridSkeleton />;

  const handleSave = async () => {
    if (!form.image) {
      showToast("Please upload an image", "error");
      return;
    }
    try {
      if (editItem) {
        await api.put(`/blogs/${editItem._id || editItem.id}`, form);
        showToast("Blog post updated successfully");
      } else {
        await api.post('/blogs', form);
        showToast("New blog post published");
      }
      fetchBlogs();
      setShowModal(false);
      setEditItem(null);
      setForm({ title: "", slug: "", category: "", excerpt: "", image: "" });
    } catch (err) {
      showToast("Save failed", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this post?")) {
      try {
        await api.delete(`/blogs/${id}`);
        fetchBlogs();
        showToast("Blog post deleted", "error");
      } catch (err) {
        showToast("Delete failed", "error");
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-gray-900">Blog Management ({posts.length})</h2>
        <button 
          onClick={() => setShowModal(true)} 
          className="flex items-center gap-1.5 px-4 py-2 bg-[#7B1F2E] text-white text-sm rounded-lg font-medium transition-all duration-200 hover:opacity-90 active:scale-95 focus:ring-2 focus:ring-[#7B1F2E30]"
        >
          <Plus size={14} /> New Post
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((p, i) => (
          <div key={p._id || p.id || i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 overflow-hidden">
              <img src={p.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"} alt={p.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500">{p.category}</span>
              <h4 className="font-bold text-gray-900 text-sm mt-2 mb-1 line-clamp-2">{p.title}</h4>
              <p className="text-xs text-gray-400">{p.date} • {p.readTime}</p>
              <div className="flex gap-2 mt-3">
                <Link to={`/blog/${p.slug || p._id || p.id}`} className="flex-1 py-1.5 text-xs text-center border rounded-lg" style={{ borderColor: "#7B1F2E30", color: "#7B1F2E" }}>View</Link>
                <button onClick={() => { setEditItem(p); setForm({ title: p.title, slug: p.slug || "", category: p.category, excerpt: p.excerpt, image: p.image }); setShowModal(true); }} className="flex-1 py-1.5 text-xs text-white rounded-lg" style={{ backgroundColor: "#7B1F2E" }}>Edit</button>
                <button onClick={() => handleDelete(p._id || p.id)} className="p-1.5 rounded hover:bg-gray-100 text-red-500 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{editItem ? "Edit Post" : "Add Post"}</h3>
              <button onClick={() => { setShowModal(false); setEditItem(null); }}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Title</label>
                <input value={form.title} onChange={e => setForm((p: any) => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">URL Slug (Custom)</label>
                <input value={form.slug} onChange={e => setForm((p: any) => ({ ...p, slug: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" placeholder="e.g. mext-scholarship-guide" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Category</label>
                <input value={form.category} onChange={e => setForm((p: any) => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Excerpt</label>
                <textarea value={form.excerpt} onChange={e => setForm((p: any) => ({ ...p, excerpt: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" />
              </div>
              <ImageUpload value={form.image} onChange={val => setForm((p: any) => ({ ...p, image: val }))} label="Blog Cover Image" />
            </div>
            <div className="flex gap-2 mt-4">
              <button 
                onClick={handleSave} 
                className="flex-1 py-2.5 bg-[#7B1F2E] text-white rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95 focus:ring-2 focus:ring-[#7B1F2E30]"
              >
                {editItem ? "Update Post" : "Add Post"}
              </button>
              <button 
                onClick={() => { setShowModal(false); setEditItem(null); }} 
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 transition-all duration-200 hover:bg-gray-50 active:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === TESTIMONIAL MANAGEMENT ===
function TestimonialManagement({ showToast }: any) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState<any>({ name: "", country: "", program: "", feedback: "", status: "Enrolled", image: "" });

  const fetchTestimonials = async () => {
    try {
      const data = await api.get('/testimonials');
      setList(data);
    } catch (err) {
      showToast("Failed to fetch testimonials", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  if (loading) return <GenericGridSkeleton />;

  const handleSave = async () => {
    try {
      if (editItem) {
        await api.put(`/testimonials/${editItem.id || editItem._id}`, form);
        showToast("Testimonial updated");
      } else {
        await api.post('/testimonials', form);
        showToast("New testimonial added");
      }
      fetchTestimonials();
      setShowModal(false);
      setEditItem(null);
      setForm({ name: "", country: "", program: "", feedback: "", status: "Enrolled", image: "" });
    } catch (err) {
      showToast("Save failed", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this testimonial?")) {
      try {
        await api.delete(`/testimonials/${id}`);
        fetchTestimonials();
        showToast("Testimonial deleted", "error");
      } catch (err) {
        showToast("Delete failed", "error");
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-gray-900">Testimonials ({list.length})</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 text-white text-sm rounded-lg" style={{ backgroundColor: "#7B1F2E" }}>
          <Plus size={14} /> Add Testimonial
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((t, i) => (
          <div key={t._id || t.id || i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "#7B1F2E" }}>{t.name.charAt(0)}</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                <div className="text-xs text-gray-500">{t.country} • {t.program}</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 italic mb-3">"{t.feedback.substring(0, 100)}..."</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === "Enrolled" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{t.status}</span>
              <div className="flex gap-1">
                <button onClick={() => { setEditItem(t); setForm({ name: t.name, country: t.country, program: t.program, feedback: t.feedback, status: t.status }); setShowModal(true); }} className="p-1 rounded hover:bg-gray-100 text-yellow-500"><Edit size={12} /></button>
                <button onClick={() => handleDelete(t._id || t.id)} className="p-1.5 rounded hover:bg-gray-100 text-red-500 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{editItem ? "Edit Testimonial" : "Add Testimonial"}</h3>
              <button onClick={() => { setShowModal(false); setEditItem(null); }}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Name</label>
                <input value={form.name} onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Program</label>
                <input value={form.program} onChange={e => setForm((p: any) => ({ ...p, program: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Feedback</label>
                <textarea value={form.feedback} onChange={e => setForm((p: any) => ({ ...p, feedback: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Status</label>
                <select value={form.status} onChange={e => setForm((p: any) => ({ ...p, status: e.target.value as any }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                  {["Applied", "Selected", "Visa Approved", "Under Process", "Enrolled"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <ImageUpload value={form.image} onChange={val => setForm((p: any) => ({ ...p, image: val }))} label="Student Photo" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSave} className="flex-1 py-2.5 text-white rounded-lg font-semibold text-sm" style={{ backgroundColor: "#7B1F2E" }}>{editItem ? "Update" : "Add"}</button>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === FAQ MANAGEMENT ===
function FAQManagement({ showToast }: any) {
  const [faqList, setFaqList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ question: "", answer: "", category: "General" });

  const fetchFAQs = async () => {
    try {
      const data = await api.get('/faqs');
      setFaqList(data);
    } catch (err) {
      showToast("Failed to fetch FAQs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  if (loading) return <GenericGridSkeleton />;

  const handleSave = async () => {
    try {
      if (editItem) {
        await api.put(`/faqs/${editItem.id || editItem._id}`, form);
        showToast("FAQ updated");
      } else {
        await api.post('/faqs', form);
        showToast("New FAQ added");
      }
      fetchFAQs();
      setShowModal(false);
      setEditItem(null);
      setForm({ question: "", answer: "", category: "General" });
    } catch (err) {
      showToast("Save failed", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this FAQ?")) {
      try {
        await api.delete(`/faqs/${id}`);
        fetchFAQs();
        showToast("FAQ deleted", "error");
      } catch (err) {
        showToast("Delete failed", "error");
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-gray-900">FAQ Management ({faqList.length})</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 text-white text-sm rounded-lg" style={{ backgroundColor: "#7B1F2E" }}>
          <Plus size={14} /> Add FAQ
        </button>
      </div>
      <div className="space-y-3">
        {faqList.map((f: any) => (
          <div key={f.id || f._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{f.category}</span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">{f.question}</h4>
                <p className="text-xs text-gray-500 mt-1">{f.answer.substring(0, 80)}...</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditItem(f); setForm({ question: f.question, answer: f.answer, category: f.category }); setShowModal(true); }} className="p-1 rounded hover:bg-gray-100 text-yellow-500"><Edit size={13} /></button>
                <button onClick={() => handleDelete(f.id || f._id)} className="p-1 rounded hover:bg-gray-100 text-red-500"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{editItem ? "Edit FAQ" : "Add FAQ"}</h3>
              <button onClick={() => { setShowModal(false); setEditItem(null); }}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Question</label>
                <input value={form.question} onChange={e => setForm((p: any) => ({ ...p, question: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Answer</label>
                <textarea value={form.answer} onChange={e => setForm((p: any) => ({ ...p, answer: e.target.value }))} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Category</label>
                <select value={form.category} onChange={e => setForm((p: any) => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                  {["General", "Documents", "Financial", "Scholarships", "Services", "Countries", "MBBS"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSave} className="flex-1 py-2.5 text-white rounded-lg font-semibold text-sm" style={{ backgroundColor: "#7B1F2E" }}>
                {editItem ? "Update FAQ" : "Add FAQ"}
              </button>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === ANALYTICS ===
function Analytics() {
  const [scholarshipList, setScholarshipList] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [scholars, stats] = await Promise.all([
          api.get('/scholarships'),
          api.get('/stats')
        ]);
        setScholarshipList(scholars);
        setStatsData(stats);
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-gray-900">Analytics Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Page Views", value: statsData?.pageViews?.toLocaleString() || "0", trend: "Tracking Disabled", icon: <Eye size={22} />, color: "#7B1F2E" },
          { label: "Profile Checks", value: statsData?.profileChecks?.toLocaleString() || "0", trend: "Total Leads", icon: <UserCheck size={22} />, color: "#3B82F6" },
          { label: "WhatsApp Clicks", value: statsData?.whatsappClicks?.toLocaleString() || "0", trend: "Tracking Disabled", icon: <MessageCircle size={22} />, color: "#10B981" },
          { label: "Applications Started", value: statsData?.applicationsStarted?.toLocaleString() || "0", trend: "Total Applications", icon: <ClipboardList size={22} />, color: "#F59E0B" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="mb-2" style={{ color: s.color }}>{s.icon}</div>
            <div className="text-xl font-black text-gray-900 mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className="text-xs font-semibold text-gray-400 mt-1">{s.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-4">Recently Added Scholarships</h4>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 flex-1 rounded" />
                  <Skeleton className="h-4 w-12 rounded" />
                </div>
              ))}
            </div>
          ) : (
            scholarshipList.slice(0, 5).map((s: any, i: number) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-b-0">
                <span>{s.countryFlag}</span>
                <span className="text-sm text-gray-700 flex-1 line-clamp-1">{s.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{s.fundingType || "Funded"}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-4">Top Countries by Interest</h4>
          {loading ? (
             <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex flex-col gap-2 py-2">
                  <div className="flex justify-between"><Skeleton className="h-4 w-24 rounded" /><Skeleton className="h-4 w-8 rounded" /></div>
                  <Skeleton className="h-1.5 w-full rounded" />
                </div>
              ))}
            </div>
          ) : (
            (statsData?.topCountries || []).map((c: any, i: number) => (
              <div key={i} className="py-2 border-b border-gray-50 last:border-b-0">
                <div className="flex justify-between text-sm mb-1">
                  <span>{c.country}</span>
                  <span className="font-semibold" style={{ color: "#7B1F2E" }}>{c.percent}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <div className="h-full rounded-full" style={{ width: `${c.percent}%`, backgroundColor: "#7B1F2E" }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// === ADMIN MESSAGES ===
function AdminMessages() {
  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [leadsData, convsData] = await Promise.all([
        api.get('/leads'),
        api.get('/messages/admin/conversations')
      ]);
      setLeads(leadsData);
      setConversations(convsData);
    } catch (err) {
      console.error("Failed to fetch communications data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchChatHistory = async (studentId: string) => {
    try {
      const data = await api.get(`/messages/admin/${studentId}`);
      setChatHistory(data);
    } catch (err) {
      console.error("Failed to fetch chat history", err);
    }
  };

  useEffect(() => {
    if (selectedMsg && !selectedMsg.isLead) {
      fetchChatHistory(selectedMsg.studentId);
      const interval = setInterval(() => fetchChatHistory(selectedMsg.studentId), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedMsg]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/leads/${id}`, { unread: false });
      fetchData();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  if (loading) return <GenericGridSkeleton />;

  const allMessages = [
    ...leads.map((l: any, index: number) => ({
      id: l._id || l.id || `lead-${index}`,
      studentId: l._id,
      student: l.name,
      message: `Profile Check: ${l.targetCountry} | ${l.targetSubject || l.targetDegree} | GPA: ${l.gpa}`,
      fullLeadData: l,
      time: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : "Just now",
      unread: l.unread,
      isLead: true,
      phone: l.phone,
      email: l.email
    })),
    ...conversations.map((c: any) => ({
      id: c.student._id,
      studentId: c.student._id,
      student: c.student.name,
      message: c.lastMessage.content,
      time: c.lastMessage.createdAt ? new Date(c.lastMessage.createdAt).toLocaleDateString() : "Recently",
      unread: c.unreadCount > 0,
      isLead: false,
      phone: c.student.phone,
      email: c.student.email
    }))
  ];

  const handleSend = async () => {
    if (!replyText.trim() || !selectedMsg) return;
    try {
      const studentId = selectedMsg.studentId;
      const sentMsg = await api.post('/messages', {
        receiverId: studentId,
        content: replyText,
        isAdmin: true
      });
      
      setChatHistory(prev => [...prev, sentMsg]);
      setReplyText("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (selectedMsg) {
    const history = selectedMsg.isLead 
      ? [{ isAdmin: false, content: selectedMsg.message, createdAt: selectedMsg.createdAt || new Date(), _id: "lead-init" }, ...chatHistory]
      : chatHistory;
    
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-180px)] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedMsg(null)} className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-500">
              <ArrowLeft size={18} />
            </button>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ backgroundColor: selectedMsg.isLead ? "#3B82F6" : "#7B1F2E" }}>
              {selectedMsg.student.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm leading-tight">{selectedMsg.student}</h3>
              <p className="text-[10px] text-gray-500 font-medium">{selectedMsg.isLead ? "New Lead" : "Active Student"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`tel:${selectedMsg.phone || "01915342776"}`} className="p-2 hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-gray-100 transition text-gray-600"><Phone size={16} /></a>
            <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-gray-100 transition text-gray-600"><MoreVertical size={16} /></button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FDF8F5]/30">
          <div className="text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-gray-50">Conversation Started</span>
          </div>

          {selectedMsg.isLead && (
            <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                <FileText size={14} /> Profile Check Details
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Target Country", value: selectedMsg.fullLeadData?.targetCountry },
                  { label: "Target Subject", value: selectedMsg.fullLeadData?.targetSubject },
                  { label: "GPA/Result", value: selectedMsg.fullLeadData?.gpa },
                  { label: "IELTS Status", value: selectedMsg.fullLeadData?.ieltsStatus },
                  { label: "Budget", value: selectedMsg.fullLeadData?.budget },
                ].map((f, idx) => (
                  <div key={idx}>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">{f.label}</div>
                    <div className="text-sm font-semibold text-gray-800">{f.value || "—"}</div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-gray-50">
                <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Student Message</div>
                <p className="text-sm text-gray-600 italic">"{selectedMsg.fullLeadData?.message || "No additional message"}"</p>
              </div>
            </div>
          )}
          
          {chatHistory.map((m: any, i: number) => (
            <div key={m._id || i} className={`flex ${m.isAdmin ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                m.isAdmin 
                  ? "bg-[#7B1F2E] text-white rounded-tr-none" 
                  : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
              }`}>
                <p className="leading-relaxed">{m.content}</p>
                <div className={`text-[10px] mt-1 flex items-center gap-1 ${m.isAdmin ? "text-red-100/70" : "text-gray-400"}`}>
                  <Clock size={10} /> {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {m.isAdmin && <CheckCircle size={10} className="ml-auto" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-end gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-[#7B1F2E30] focus-within:bg-white transition-all">
            <button className="p-2 text-gray-400 hover:text-[#7B1F2E] transition"><Paperclip size={18} /></button>
            <textarea 
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              rows={1}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 resize-none max-h-32"
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
            />
            <button 
              onClick={handleSend}
              className="p-2.5 rounded-xl text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:shadow-none"
              style={{ backgroundColor: "#7B1F2E" }}
              disabled={!replyText.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900 text-lg">Communications</h2>
          <p className="text-xs text-gray-500">Manage student inquiries and leads</p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 bg-[#7B1F2E10] text-[#7B1F2E] rounded-xl border border-[#7B1F2E20]">
          {leads.length} New Inquiries
        </span>
      </div>
      
      <div className="grid gap-3">
        {allMessages.map((m: any, i: number) => (
          <div 
            key={i} 
            onClick={() => {
              setSelectedMsg(m);
              if (m.isLead && m.unread) handleMarkAsRead(m.id);
            }}
            className={`bg-white rounded-2xl p-4 shadow-sm border cursor-pointer hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5 ${
              m.unread ? "border-[#7B1F2E20]" : "border-gray-100"
            }`}
            style={m.unread ? { backgroundColor: m.isLead ? "#3B82F605" : "#7B1F2E04" } : {}}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm transition-transform group-hover:scale-105" 
                  style={{ backgroundColor: m.isLead ? "#3B82F6" : "#7B1F2E" }}>
                  {m.student.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-sm text-gray-900 group-hover:text-[#7B1F2E] transition-colors">{m.student}</span>
                    {m.unread && <span className={`w-2 h-2 rounded-full inline-block animate-pulse ${m.isLead ? "bg-blue-500" : "bg-[#7B1F2E]"}`} />}
                    {m.isLead && <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">Lead</span>}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1 group-hover:text-gray-700 transition-colors">{m.message}</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                  <Clock size={10} /> {m.time}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[10px] font-bold text-[#7B1F2E] flex items-center gap-1 uppercase tracking-wider">
                     Reply <ArrowRight size={10} />
                   </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {allMessages.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={32} className="text-gray-300" />
            </div>
            <h3 className="font-bold text-gray-900">No messages yet</h3>
            <p className="text-sm text-gray-500 mt-1">When students contact you, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ======================== CAROUSEL MANAGEMENT ========================

const carouselPlaceholderSvg = `
<svg width="240" height="200" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="clip-path">
      <rect x="-20" y="-20" h 240 v 200 h -240 Z" />
    </clipPath>
  </defs>
  <g clip-path="url(#clip-path)">
    <rect width="240" height="200" fill="#7B1F2E" />
    <circle cx="200" cy="50" r="100" fill="white" fill-opacity="0.05" />
    <circle cx="40" cy="150" r="80" fill="white" fill-opacity="0.05" />
    <rect x="20" y="40" width="200" height="10" rx="2" fill="white" fill-opacity="0.2" />
    <rect x="20" y="60" width="150" height="8" rx="2" fill="white" fill-opacity="0.1" />
    <rect x="20" y="140" width="80" height="25" rx="4" fill="white" />
  </g>
</svg>
`;

function CarouselManagement({ showToast }: any) {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState<any>({
    title: "",
    highlight: "",
    subtitle: "",
    cta1: "Explore Scholarships",
    cta2: "Contact Us",
    bgGradient: "linear-gradient(135deg, #7B1F2E 0%, #3D0F17 100%)",
    image: "",
    badgeIcon: "GraduationCap",
    badge: ""
  });

  const fetchSlides = async () => {
    try {
      const data = await api.get('/heroslides');
      setSlides(data);
    } catch (err) {
      showToast("Failed to fetch slides", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  if (loading) return <GenericGridSkeleton />;

  const handleSave = async () => {
    try {
      if (editItem) {
        await api.put(`/heroslides/${editItem.id || editItem._id}`, form);
        showToast("Carousel slide updated");
      } else {
        await api.post('/heroslides', form);
        showToast("New slide added to carousel");
      }
      fetchSlides();
      setShowModal(false);
      setEditItem(null);
      setForm({ title: "", highlight: "", subtitle: "", cta1: "Explore Scholarships", cta2: "Contact Us", bgGradient: "linear-gradient(135deg, #7B1F2E 0%, #3D0F17 100%)", image: "", badgeIcon: "GraduationCap", badge: "" });
    } catch (err) {
      showToast("Save failed", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this slide?")) {
      try {
        await api.delete(`/heroslides/${id}`);
        fetchSlides();
        showToast("Slide deleted", "error");
      } catch (err) {
        showToast("Delete failed", "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-gray-900 text-lg">Hero Carousel Management</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 text-white text-sm rounded-lg font-medium" style={{ backgroundColor: "#7B1F2E" }}>
          <Plus size={16} /> Add Slide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((s: any, idx: number) => (
          <div key={s._id || s.id || idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="h-48 relative flex items-center justify-center text-white p-8 overflow-hidden" style={{ background: s.bgGradient }}>
              <div className="relative z-10 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-80">{s.badge}</div>
                <div className="font-bold text-lg leading-tight mb-2">{s.title}</div>
                <div className="text-sm opacity-90">{s.highlight}</div>
              </div>
              {s.image && <img src={s.image} className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" alt="" />}
            </div>
            <div className="p-4 flex items-center justify-between bg-gray-50/50">
              <div className="text-xs text-gray-500 font-medium">Slide #{idx + 1}</div>
              <div className="flex gap-2">
                <button onClick={() => { setEditItem(s); setForm(s); setShowModal(true); }} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-yellow-600 transition-all border border-transparent hover:border-gray-100"><Edit size={14} /></button>
                <button onClick={() => handleDelete(s.id || s._id)} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-red-500 transition-all border border-transparent hover:border-gray-100"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 text-xl">{editItem ? "Edit Slide" : "Add Slide"}</h3>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} className="p-1 hover:bg-gray-100 rounded-full transition"><X size={20} /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Slide Title</label>
                <input value={form.title} onChange={e => setForm((p: any) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B1F2E]" placeholder="e.g., Find the Right Scholarship." />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Highlight Text</label>
                <input value={form.highlight} onChange={e => setForm((p: any) => ({ ...p, highlight: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B1F2E]" placeholder="e.g., Apply with Confidence." />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Subtitle</label>
                <textarea value={form.subtitle} onChange={e => setForm((p: any) => ({ ...p, subtitle: e.target.value }))} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B1F2E] resize-none" placeholder="Short description below the title..." />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">CTA 1 Text</label>
                <input value={form.cta1} onChange={e => setForm((p: any) => ({ ...p, cta1: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B1F2E]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">CTA 2 Text</label>
                <input value={form.cta2} onChange={e => setForm((p: any) => ({ ...p, cta2: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B1F2E]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Badge Text</label>
                <input value={form.badge} onChange={e => setForm((p: any) => ({ ...p, badge: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B1F2E]" placeholder="e.g., 1,000+ Scholarships" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Badge Icon</label>
                <select value={form.badgeIcon} onChange={e => setForm((p: any) => ({ ...p, badgeIcon: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none">
                  <option value="GraduationCap">Graduation Cap</option>
                  <option value="FileCheck">File Check</option>
                  <option value="CheckCircle">Check Circle</option>
                  <option value="BarChart3">Bar Chart</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Background Gradient</label>
                <input value={form.bgGradient} onChange={e => setForm((p: any) => ({ ...p, bgGradient: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B1F2E]" placeholder="linear-gradient(...)" />
                <div className="mt-2 flex gap-2">
                  {["linear-gradient(135deg, #7B1F2E 0%, #3D0F17 100%)", "linear-gradient(135deg, #1A3A5C 0%, #0D2040 100%)", "linear-gradient(135deg, #1A3A2A 0%, #0D2018 100%)", "linear-gradient(135deg, #3D2A1A 0%, #1A1208 100%)"].map(g => (
                    <button key={g} onClick={() => setForm((p: any) => ({ ...p, bgGradient: g }))} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ background: g }} type="button" />
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <ImageUpload value={form.image} onChange={val => setForm((p: any) => ({ ...p, image: val }))} label="Background Image" />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={handleSave} className="flex-1 py-3 text-white rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.98]" style={{ backgroundColor: "#7B1F2E" }}>{editItem ? "Update Slide" : "Create Slide"}</button>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentManagement({ showToast }: { showToast: (msg: string, type?: "success" | "error") => void }) {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const data = await api.get('/payments/admin');
      setPayments(data);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/payments/admin/${id}`, { status });
      showToast(`Payment ${status} successfully`);
      fetchPayments();
    } catch (err) {
      showToast("Failed to update payment", "error");
    }
  };

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Verification</h2>
          <p className="text-sm text-gray-500">Review and verify student transaction requests</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
           <span className="px-3 py-1 text-[10px] font-bold uppercase text-[#7B1F2E] bg-[#7B1F2E10] rounded-xl">Manual Review</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction Info</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Purpose</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No payment requests found.</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#7B1F2E] text-white flex items-center justify-center font-bold">
                          {p.student?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{p.student?.name || "Unknown"}</div>
                          <div className="text-[10px] text-gray-500">{p.student?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <img 
                          src={p.method === 'BKash' ? '/payment/Bkash.jpg' : p.method === 'Nagad' ? '/payment/Nagad.jpg' : '/payment/Rocket.png'} 
                          alt={p.method} 
                          className="h-4 w-4 object-contain rounded-sm" 
                        />
                        <div className="inline-flex items-center px-2 py-0.5 bg-gray-100 rounded-md text-[10px] font-bold text-gray-700">
                          {p.method}
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono select-all">TrxID: {p.transactionId}</div>
                      <div className="text-[10px] text-gray-400 mt-1 italic">{new Date(p.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-700">{p.purpose}</span>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900">
                      ৳{p.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-tight ${
                        p.status === 'accepted' ? "bg-green-100 text-green-700" : 
                        p.status === 'rejected' ? "bg-red-100 text-red-700" : 
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {p.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleUpdateStatus(p._id, 'rejected')}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                            title="Reject Payment"
                          >
                            <X size={18} />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(p._id, 'accepted')}
                            className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition"
                            title="Accept Payment"
                          >
                            <CheckCircle size={18} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-300 uppercase italic">Verified</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
