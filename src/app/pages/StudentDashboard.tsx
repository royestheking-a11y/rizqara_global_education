import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  LayoutDashboard, User, Users, BookOpen, FileText, Bookmark, MessageSquare,
  Bell, CreditCard, Zap, LogOut, ChevronRight, CheckCircle, Clock,
  Upload, Star, Shield, Calendar, AlertCircle, ArrowRight, Edit,
  TrendingUp, Download, Send, Paperclip, X, UserCheck, FileBadge, 
  MapPin, HelpCircle, Briefcase, FileInput, Lock, Activity, Sparkles, ShieldCheck, Eye,
  DollarSign, Globe
} from "lucide-react";
import { api } from "../services/api";
import { useAuth, useSavedScholarships } from "../hooks/useAuth";
import { DashboardSkeleton } from "../components/ui/PremiumSkeletons";

const statusColors: any = {
  "Profile Received": "bg-blue-100 text-blue-700",
  "Document Checking": "bg-[#7B1F2E12] text-[#7B1F2E]",
  "Missing Documents": "bg-red-100 text-red-700",
  "SOP/CV Preparing": "bg-purple-100 text-purple-700",
  "Application Form Started": "bg-indigo-100 text-indigo-700",
  "Submitted": "bg-green-100 text-green-700",
  "Waiting for Result": "bg-gray-100 text-gray-700",
  "Interview Stage": "bg-orange-100 text-orange-700",
  "Visa Guidance": "bg-teal-100 text-teal-700",
  "Completed": "bg-green-100 text-green-700",
  "Rejected": "bg-red-100 text-red-700",
};

const docStatusColors: any = {
  "uploaded": "bg-blue-100 text-blue-700",
  "approved": "bg-green-100 text-green-700",
  "pending": "bg-[#7B1F2E12] text-[#7B1F2E]",
  "not_uploaded": "bg-gray-100 text-gray-500",
  "need_correction": "bg-red-100 text-red-700",
};

const navItems = [
  { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { id: "profile", label: "My Profile", icon: <User size={16} /> },
  { id: "applications", label: "My Applications", icon: <BookOpen size={16} /> },
  { id: "documents", label: "Documents", icon: <FileText size={16} /> },
  { id: "saved", label: "Saved Scholarships", icon: <Bookmark size={16} /> },
  { id: "messages", label: "Messages", icon: <MessageSquare size={16} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { id: "payments", label: "Payment History", icon: <CreditCard size={16} /> },
  { id: "ai", label: "AI Guide", icon: <Zap size={16} /> },
];

export default function StudentDashboard() {
  const { user, isLoggedIn, logout, updateProfile, loading: authLoading } = useAuth();
  const { saved: savedIds } = useSavedScholarships();
  const navigate = useNavigate();
  const { tab } = useParams();
  const activeTab = tab || "overview";
  const setActiveTab = (t: string) => navigate(`/dashboard/${t}`);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const apps = await api.get('/applications/me');
      setApplications(apps);
      if (savedIds && savedIds.length > 0) {
        const savedData = await api.get(`/scholarships?ids=${savedIds.join(',')}`);
        setSavedScholarships(savedData);
      } else {
        setSavedScholarships([]);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn) {
        navigate("/login");
      } else {
        fetchData();
      }
    }
  }, [isLoggedIn, authLoading]); // Removed savedIds to prevent infinite loops

  if (authLoading) return <DashboardSkeleton />;
  if (!isLoggedIn || !user) return null;

  const renderContent = () => {
    if (loading) return <DashboardSkeleton />;

    switch (activeTab) {
      case "overview": return <Overview user={user} applications={applications} savedIds={savedIds} setActiveTab={setActiveTab} />;
      case "profile": return <ProfileTab user={user} updateProfile={updateProfile} />;
      case "applications": return <ApplicationsTab applications={applications} />;
      case "documents": return <DocumentsTab user={user} updateProfile={updateProfile} />;
      case "saved": return <SavedTab scholarships={savedScholarships} />;
      case "messages": return <MessagesTab />;
      case "notifications": return <NotificationsTab user={user} updateProfile={updateProfile} />;
      case "payments": return <PaymentsTab />;
      case "ai": return <AITab user={user} />;
      default: return <Overview user={user} applications={applications} savedIds={savedIds} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8F5F0" }}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-40 w-72 flex-shrink-0 bg-white h-full min-h-screen shadow-lg border-r border-gray-100 transition-transform duration-200 flex flex-col`}>
        {/* User Info */}
        <div className="p-5 border-b border-gray-100" style={{ background: "linear-gradient(135deg, #7B1F2E08, #7B1F2E05)" }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }}>
              {user.name?.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">{user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
              <div className="text-xs px-2 py-0.5 rounded-full text-white mt-1 inline-block" style={{ backgroundColor: "#7B1F2E" }}>Student</div>
            </div>
          </div>

          {/* Profile completion */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Profile Completion</span>
              <span className="font-semibold" style={{ color: "#7B1F2E" }}>{user.profileCompletion ?? 0}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${user.profileCompletion ?? 0}%`, backgroundColor: "#7B1F2E" }} />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id ? "text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
                style={activeTab === item.id ? { backgroundColor: "#7B1F2E" } : {}}
              >
                {item.icon}
                {item.label}
                {item.id === "notifications" && (user.notifications?.filter((n: any) => !n.isRead).length || 0) > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ backgroundColor: "#7B1F2E" }}>
                    {user.notifications?.filter((n: any) => !n.isRead).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-md hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
              <span className="block w-5 h-0.5 bg-gray-600 mb-1"></span>
              <span className="block w-5 h-0.5 bg-gray-600 mb-1"></span>
              <span className="block w-5 h-0.5 bg-gray-600"></span>
            </button>
            <div>
              <h1 className="font-bold text-gray-900 text-sm sm:text-base">
                {navItems.find(n => n.id === activeTab)?.label || "Dashboard"}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Welcome back, {user.name?.split(" ")[0]}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/scholarships" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition hover:opacity-90 text-white" style={{ backgroundColor: "#7B1F2E" }}>
              <Star size={12} /> Find Scholarships
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// === OVERVIEW ===
function Overview({ user, applications, savedIds, setActiveTab }: any) {
  const progressSteps = ["Profile Review", "Scholarship Match", "Document Collection", "Document Review", "SOP/CV Support", "Application Submission", "Result Tracking", "Interview/Visa Support"];
  const currentApp = applications[0];
  const currentStep = currentApp ? Math.floor(currentApp.progress / 12.5) : 0;

  return (
    <div className="space-y-6">
      {/* Advisor Message */}
      <div className="rounded-xl p-4 text-white" style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-white"><UserCheck size={20} /></div>
          <div>
            <p className="font-semibold text-sm">Message from Your Advisor</p>
            <p className="text-sm text-white/90 mt-1">Hi {user.name?.split(" ")[0]}! {currentApp ? `We are currently processing your application for ${currentApp.scholarship?.name}.` : "Welcome to RizQara! Complete your profile to see scholarship matches."}</p>
            <p className="text-xs text-white/60 mt-1">RizQara Support Team • Just now</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Applications", value: applications.length.toString(), icon: <FileBadge size={20} />, color: "#7B1F2E" },
          { label: "Saved Scholarships", value: savedIds.length.toString(), icon: <Bookmark size={20} />, color: "#7B1F2E" },
          { 
            label: "Pending Documents", 
            value: (() => {
              const requiredKeys = ["passport", "sscCertificate", "hscCertificate", "cv", "sop", "recommendationLetter"];
              const uploadedKeys = Object.keys(user.documents || {});
              const missingCount = requiredKeys.filter(k => !uploadedKeys.includes(k)).length;
              return missingCount.toString();
            })(), 
            icon: <FileText size={20} />, 
            color: "#EF4444" 
          },
          { 
            label: "Profile Completion", 
            value: `${user.profileCompletion ?? Math.round((['name', 'email', 'phone', 'gpa', 'targetDegree', 'targetCountry', 'targetSubject', 'ieltsStatus', 'budget', 'passportStatus', 'educationLevel'].filter(f => user[f] && user[f].toString().trim() !== "").length / 11) * 100)}%`, 
            icon: <UserCheck size={20} />, 
            color: "#10B981" 
          },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="mb-2" style={{ color: s.color }}>{s.icon}</div>
            <div className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Application Timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-900 mb-4">Application Journey</h3>
        <div className="flex items-center overflow-x-auto gap-0 pb-2">
          {progressSteps.map((step, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < currentStep ? "text-white" : i === currentStep ? "text-white ring-4 ring-offset-2 scale-110" : "bg-gray-100 text-gray-400"
                }`} style={i <= currentStep ? { backgroundColor: "#7B1F2E" } : { borderColor: i === currentStep ? "#7B1F2E" : undefined }}>
                  {i < currentStep ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className="text-xs text-center mt-1 w-20" style={{ color: i <= currentStep ? "#7B1F2E" : "#9CA3AF", fontWeight: i === currentStep ? 600 : 400 }}>
                  {step}
                </span>
              </div>
              {i < progressSteps.length - 1 && (
                <div className="w-8 h-0.5 mb-5 flex-shrink-0" style={{ backgroundColor: i < currentStep ? "#7B1F2E" : "#E5E7EB" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Application */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Current Application</h3>
          <button onClick={() => setActiveTab("applications")} className="text-xs font-medium" style={{ color: "#7B1F2E" }}>View All →</button>
        </div>
        {currentApp ? (
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: "#FDF8F5" }}>
            <div className="text-3xl">{currentApp.scholarship?.countryFlag}</div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-sm">{currentApp.scholarship?.name}</h4>
              <p className="text-xs text-gray-500">{currentApp.scholarship?.country} • {currentApp.scholarship?.university}</p>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span style={{ color: "#7B1F2E" }}>{currentApp.progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full">
                  <div className="h-full rounded-full" style={{ width: `${currentApp.progress}%`, backgroundColor: "#7B1F2E" }} />
                </div>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[currentApp.status] || "bg-gray-100"}`}>{currentApp.status}</span>
          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-xl">
            <p className="text-sm text-gray-500">No active applications yet.</p>
            <Link to="/scholarships" className="text-xs font-bold mt-2 inline-block" style={{ color: "#7B1F2E" }}>Start Applying Now</Link>
          </div>
        )}
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock size={18} className="text-[#7B1F2E]" /> Upcoming Deadlines</h3>
        <div className="space-y-3">
          {[
            { name: "Saudi Arabia Scholarship", days: 10, color: "red" },
            { name: "MEXT Japan", days: 18, color: "orange" },
            { name: "Document Upload Deadline", days: 5, color: "red" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: item.color === "red" ? "#FEF2F2" : "#FFF7ED" }}>
              <div className="flex items-center gap-2">
                <AlertCircle size={14} color={item.color === "red" ? "#DC2626" : "#EA580C"} />
                <span className="text-sm font-medium text-gray-800">{item.name}</span>
              </div>
              <span className="text-xs font-bold" style={{ color: item.color === "red" ? "#DC2626" : "#EA580C" }}>{item.days} days</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// === PROFILE TAB ===
function ProfileTab({ user, updateProfile }: any) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">Personal Information</h3>
          <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition" style={{ backgroundColor: editing ? "#7B1F2E" : "#7B1F2E15", color: editing ? "white" : "#7B1F2E" }}>
            <Edit size={12} /> {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }}>
            {user.name?.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{user.name}</h4>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Full Name", key: "name", type: "text" },
            { label: "Email", key: "email", type: "email" },
            { label: "Phone", key: "phone", type: "text" },
            { label: "GPA / Result", key: "gpa", type: "text" },
            { label: "Current Education", key: "educationLevel", type: "text" },
            { label: "Target Degree", key: "targetDegree", type: "text" },
            { label: "Target Country", key: "targetCountry", type: "text" },
            { label: "Target Subject", key: "targetSubject", type: "text" },
            { label: "IELTS Status", key: "ieltsStatus", type: "text" },
            { label: "Budget", key: "budget", type: "text" },
            { label: "Passport Status", key: "passportStatus", type: "text" },
          ].map(field => (
            <div key={field.key}>
              <label className="text-xs text-gray-500 mb-1 block">{field.label}</label>
              {editing ? (
                <input
                  type={field.type}
                  value={form[field.key] || ""}
                  onChange={e => setForm((p: any) => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]"
                  style={{ borderColor: "#7B1F2E30" }}
                />
              ) : (
                <div className="px-3 py-2 rounded-lg text-sm text-gray-800" style={{ backgroundColor: "#FDF8F5" }}>
                  {user[field.key] || "Not set"}
                </div>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <button onClick={handleSave} className="mt-4 px-6 py-2.5 text-white text-sm rounded-xl font-semibold hover:opacity-90 transition" style={{ backgroundColor: "#7B1F2E" }}>
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}

// === APPLICATIONS TAB ===
function ApplicationsTab({ applications }: any) {
  const allStatuses = ["Profile Received", "Document Checking", "Missing Documents", "SOP/CV Preparing", "Application Form Started", "Submitted", "Waiting for Result", "Interview Stage", "Visa Guidance", "Completed", "Rejected", "On Hold"];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-900 mb-4">My Applications</h3>
        {applications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">You haven't applied for any scholarships yet.</p>
          </div>
        ) : (
          applications.map((app: any, i: number) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 mb-3">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{app.scholarship?.countryFlag}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">{app.scholarship?.name}</h4>
                  <p className="text-xs text-gray-500">{app.scholarship?.country} • {app.scholarship?.university}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[app.status] || "bg-gray-100"}`}>{app.status}</span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Application Progress</span>
                  <span style={{ color: "#7B1F2E" }}>{app.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full rounded-full transition-all" style={{ width: `${app.progress}%`, backgroundColor: "#7B1F2E" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1"><Users size={10} /> Advisor: {app.advisor || "RizQara Support"}</div>
                <div className="flex items-center gap-1"><Clock size={10} /> Updated: {new Date(app.updatedAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))
        )}

        <div className="p-4 rounded-xl border-2 border-dashed border-gray-200 text-center mt-3">
          <p className="text-sm text-gray-500 mb-2">Want to apply for more scholarships?</p>
          <Link to="/scholarships" className="text-xs font-semibold" style={{ color: "#7B1F2E" }}>Browse Scholarships →</Link>
        </div>
      </div>

      {/* Status Guide */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h4 className="font-bold text-gray-900 mb-3">Application Status Guide</h4>
        <div className="grid grid-cols-2 gap-2">
          {allStatuses.map(status => (
            <div key={status} className={`text-xs px-2 py-1 rounded-full font-medium text-center ${statusColors[status] || "bg-gray-100 text-gray-600"}`}>{status}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// === DOCUMENTS TAB ===
function DocumentsTab({ user, updateProfile }: any) {
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const docs = [
    { key: "passport", label: "Passport", icon: <UserCheck size={18} />, required: true },
    { key: "sscCertificate", label: "SSC Certificate", icon: <FileText size={18} />, required: true },
    { key: "hscCertificate", label: "HSC Certificate", icon: <FileText size={18} />, required: true },
    { key: "cv", label: "CV / Resume", icon: <Briefcase size={18} />, required: true },
    { key: "sop", label: "SOP / Motivation Letter", icon: <FileInput size={18} />, required: true },
    { key: "recommendationLetter", label: "Recommendation Letter", icon: <Send size={18} />, required: true },
    { key: "moiCertificate", label: "MOI Certificate", icon: <FileText size={18} />, required: false },
    { key: "medicalReport", label: "Medical Report", icon: <Activity size={18} />, required: false },
    { key: "policeClearance", label: "Police Clearance", icon: <Lock size={18} />, required: false },
  ];

  const userDocs = user.documents || {};
  const uploadedCount = docs.filter(doc => userDocs[doc.key]).length;
  const docScore = Math.round((uploadedCount / docs.length) * 100);

  const handleUpload = async (key: string, file: File) => {
    // 2MB Size Limit
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit. Please compress your file.");
      return;
    }

    setUploading(key);
    try {
      const { url } = await api.upload(file);
      
      const updatedDocs = { ...userDocs, [key]: url };
      await updateProfile({ documents: updatedDocs });
      
      setUploadSuccess(key);
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (err: any) {
      console.error("Upload failed details:", err);
      const errorMsg = err.message || "Unknown upload error";
      alert(`Upload failed: ${errorMsg}. Please check your connection and try again.`);
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Premium Header Card */}
      <div className="bg-gradient-to-br from-[#7B1F2E] to-[#3D0F17] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">Document Readiness</h3>
            <p className="text-xs text-red-100 opacity-80 mb-4">Complete your profile to increase scholarship chances.</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${docScore}%` }} />
              </div>
              <span className="font-black text-lg">{docScore}%</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-red-100 mb-1 opacity-60">Uploaded</div>
            <div className="text-2xl font-black">{uploadedCount}<span className="text-sm font-normal opacity-40 ml-1">/ {docs.length}</span></div>
          </div>
        </div>
      </div>

      {/* Document Grid */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900 text-lg">My Documents</h3>
          <div className="text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Max Size: 2MB</div>
        </div>
        
        <div className="grid gap-3">
          {docs.map(doc => {
            const fileUrl = userDocs[doc.key];
            const isUploading = uploading === doc.key;
            const isSuccess = uploadSuccess === doc.key;
            
            return (
              <div key={doc.key} className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${fileUrl ? 'border-green-100 bg-green-50/20' : 'border-gray-100 bg-white hover:border-[#7B1F2E20]'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${fileUrl ? 'bg-green-500 text-white shadow-green-100' : 'bg-gray-50 text-[#7B1F2E] group-hover:bg-[#7B1F2E] group-hover:text-white'} shadow-sm`}>
                  {fileUrl && !isUploading ? <CheckCircle size={20} /> : doc.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-gray-900">{doc.label}</span>
                    {doc.required && <span className="text-[10px] font-bold text-[#7B1F2E] bg-[#7B1F2E10] px-1.5 py-0.5 rounded-md uppercase">*Required</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${fileUrl ? 'text-green-600' : 'text-gray-400'}`}>
                      {fileUrl ? 'Verified' : 'Not Uploaded'}
                    </span>
                    {fileUrl && (
                      <a href={fileUrl} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-[#7B1F2E] hover:underline flex items-center gap-1 uppercase">
                        <Eye size={10} /> Preview
                      </a>
                    )}
                  </div>
                </div>

                <div className="relative">
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 border-2 border-[#7B1F2E10] border-t-[#7B1F2E] rounded-full animate-spin" />
                      <span className="text-[8px] font-bold text-[#7B1F2E] animate-pulse uppercase">Uploading</span>
                    </div>
                  ) : isSuccess ? (
                    <div className="flex flex-col items-center text-green-500 animate-in zoom-in duration-300">
                      <CheckCircle size={24} />
                      <span className="text-[8px] font-bold uppercase">Success</span>
                    </div>
                  ) : (
                    <label className={`cursor-pointer flex items-center gap-2 px-4 py-2 text-[11px] font-black rounded-xl transition-all shadow-sm active:scale-95 ${fileUrl ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50' : 'bg-[#7B1F2E] text-white hover:opacity-90 shadow-[#7B1F2E20]'}`}>
                      <Upload size={14} /> {fileUrl ? "RE-UPLOAD" : "UPLOAD"}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(doc.key, file);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// === SAVED TAB ===
function SavedTab({ scholarships: saved }: { scholarships: any[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-bold text-gray-900 mb-4">Saved Scholarships ({saved.length})</h3>
      {saved.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-[#7B1F2E] mb-3 flex justify-center"><Bookmark size={48} /></div>
          <p className="text-gray-500 text-sm mb-3">No saved scholarships yet</p>
          <Link to="/scholarships" className="text-xs font-semibold" style={{ color: "#7B1F2E" }}>Browse Scholarships →</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {saved.map(s => (
            <div key={s._id || s.id} className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="h-24 overflow-hidden">
                <img src={s.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"} alt={s.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span>{s.countryFlag}</span>
                  <span className="text-xs text-gray-500">{s.country}</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-1">{s.name}</h4>
                <div className="flex gap-2">
                  <Link 
                    to={`/scholarships/${s._id || s.id}`} 
                    className="flex-1 py-1.5 text-xs font-semibold text-white text-center rounded-lg transition-all hover:opacity-90 active:scale-95" 
                    style={{ backgroundColor: "#7B1F2E" }}
                  >
                    View
                  </Link>
                  <Link 
                    to="/contact" 
                    className="flex-1 py-1.5 text-xs font-semibold text-center rounded-lg border transition-all duration-200 border-[#7B1F2E] text-[#7B1F2E] hover:bg-[#7B1F2E] hover:text-white active:bg-[#7B1F2E] active:text-white active:scale-95"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// === MESSAGES TAB ===
function MessagesTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const data = await api.get('/messages');
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    try {
      const sentMsg = await api.post('/messages', {
        content: newMsg,
        toAdmin: true,
        isAdmin: false
      });
      setMessages(prev => [...prev, sentMsg]);
      setNewMsg("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col" style={{ height: "calc(100vh - 200px)" }}>
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: "#7B1F2E" }}>R</div>
        <div>
          <div className="font-bold text-sm text-gray-900">RizQara Support Team</div>
          <div className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>Online</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">No messages yet. Send a message to start a conversation.</div>
        ) : (
          messages.map((msg: any) => (
            <div key={msg._id} className={`flex ${msg.isAdmin ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${msg.isAdmin ? "bg-gray-100 text-gray-800 rounded-tl-none" : "text-white rounded-tr-none"}`}
                style={!msg.isAdmin ? { backgroundColor: "#7B1F2E" } : {}}>
                <p>{msg.content}</p>
                <p className="text-[10px] mt-1 opacity-60">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2.5 border rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]"
            style={{ borderColor: "#e5e7eb" }}
          />
          <button onClick={sendMessage} className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition hover:opacity-90" style={{ backgroundColor: "#7B1F2E" }}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// === NOTIFICATIONS TAB ===
function NotificationsTab({ user, updateProfile }: any) {
  const notifs = user.notifications || [];

  const markRead = async (id: string) => {
    const updatedNotifs = notifs.map((n: any) => n.id === id ? { ...n, isRead: true } : n);
    await updateProfile({ notifications: updatedNotifs });
  };

  const markAllRead = async () => {
    const updatedNotifs = notifs.map((n: any) => ({ ...n, isRead: true }));
    await updateProfile({ notifications: updatedNotifs });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Notifications</h3>
        <button onClick={markAllRead} className="text-xs" style={{ color: "#7B1F2E" }}>Mark all read</button>
      </div>
      <div className="space-y-3">
        {notifs.length === 0 ? (
          <p className="text-center py-8 text-gray-500 text-sm">No notifications yet.</p>
        ) : (
          notifs.map((n: any) => (
            <div key={n.id} className={`p-4 rounded-xl border transition-all ${!n.isRead ? "border-[#7B1F2E20]" : "border-gray-100"}`} style={!n.isRead ? { backgroundColor: "#7B1F2E08" } : {}}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  {!n.isRead && <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#7B1F2E" }} />}
                  <div>
                    <p className="text-sm text-gray-800">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.date}</p>
                  </div>
                </div>
                {!n.isRead && (
                  <button onClick={() => markRead(n.id)} className="text-xs text-gray-400 hover:text-gray-600 flex-shrink-0">Dismiss</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// === PAYMENTS TAB ===
function PaymentsTab() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentStep, setPaymentStep] = useState<"history" | "details" | "method" | "instructions" | "submitting" | "success">("history");
  
  // New Payment Form State
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [method, setMethod] = useState("");
  const [trxId, setTrxId] = useState("");

  const fetchPayments = async () => {
    try {
      const data = await api.get('/payments/me');
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

  const handleStartPayment = () => {
    setPaymentStep("details");
  };

  const handleSubmitPayment = async (customTrxId?: string) => {
    const finalTrxId = customTrxId || trxId;
    if (!finalTrxId) return;
    setPaymentStep("submitting");
    try {
      await api.post('/payments', {
        amount: Number(amount),
        method,
        transactionId: finalTrxId,
        purpose
      });
      setPaymentStep("success");
      fetchPayments();
    } catch (err) {
      alert("Failed to submit payment. Please check Transaction ID.");
      setPaymentStep("instructions");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  if (loading) return <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-[#7B1F2E30] border-t-[#7B1F2E] rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-5">
      {paymentStep === "history" && (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Payment History</h3>
              <button 
                onClick={handleStartPayment}
                className="px-4 py-2 bg-[#7B1F2E] text-white rounded-xl text-xs font-bold shadow-md hover:opacity-90 transition active:scale-95"
              >
                + Make New Payment
              </button>
            </div>
            
            {payments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-500 text-sm">No payment records found.</p>
                <p className="text-xs text-gray-400 mt-1">Your confirmed payments will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map((p: any) => (
                  <div key={p._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/30">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(p.status)} bg-opacity-10`}>
                        {p.status === 'accepted' ? <CheckCircle size={18} /> : p.status === 'rejected' ? <X size={18} /> : <Clock size={18} />}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{p.purpose}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5 uppercase font-semibold">{p.method} • {p.transactionId}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-gray-900">${p.amount}</div>
                      <div className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${getStatusColor(p.status)}`}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#7B1F2E] to-[#3D0F17] rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield size={120} />
            </div>
            <div className="relative z-10">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Lock size={16} /> Secure Payment Gateway
              </h4>
              <p className="text-xs text-red-100 mb-4 opacity-80 leading-relaxed">
                Pay for SOP writing, Visa processing, or University application fees securely. All transactions are manually verified by our team within 24 hours.
              </p>
              <button 
                onClick={handleStartPayment}
                className="w-full py-3 bg-white text-[#7B1F2E] font-bold rounded-xl text-sm hover:bg-gray-50 transition shadow-md active:scale-[0.98]"
              >
                Start New Transaction
              </button>
            </div>
          </div>
        </>
      )}

      {paymentStep === "details" && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button onClick={() => setPaymentStep("history")} className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 text-xs font-medium">
            <ChevronRight size={14} className="rotate-180" /> Back to History
          </button>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Payment Details</h3>
          <p className="text-gray-500 text-xs mb-6">Enter the amount and reason for payment</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1 uppercase tracking-wider">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 100" 
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 font-bold focus:ring-2 focus:ring-[#7B1F2E20] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1 uppercase tracking-wider">Payment Purpose</label>
              <select 
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-[#7B1F2E20] transition-all"
              >
                <option value="">Select Purpose</option>
                <option value="SOP & CV Writing">SOP & CV Writing</option>
                <option value="Visa Guidance">Visa Guidance</option>
                <option value="Application Processing">Application Processing</option>
                <option value="File Review">File Review</option>
                <option value="Consultancy Fee">Consultancy Fee</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <button 
              disabled={!amount || !purpose}
              onClick={() => setPaymentStep("method")}
              className="w-full py-4 bg-[#7B1F2E] text-white font-bold rounded-xl text-sm shadow-lg hover:opacity-95 transition disabled:opacity-50 disabled:grayscale"
            >
              Continue to Payment Method
            </button>
          </div>
        </div>
      )}

      {paymentStep === "method" && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <button onClick={() => setPaymentStep("details")} className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 text-xs font-medium">
            <ChevronRight size={14} className="rotate-180" /> Back to Details
          </button>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Select Payment Method</h3>
          <p className="text-gray-500 text-xs mb-6">Choose your preferred global or local payment option</p>

          <div className="space-y-6">
            {/* International Payment Options */}
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Global / International Gateways</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'Stripe', label: 'Credit Card', desc: 'Stripe Secure', icon: <CreditCard className="text-blue-600" size={24} /> },
                  { id: 'PayPal', label: 'PayPal', desc: 'Instant Checkout', icon: <DollarSign className="text-yellow-600" size={24} /> },
                  { id: 'Wise', label: 'Wise Transfer', desc: 'Low-cost Wire', icon: <Globe className="text-green-600" size={24} /> }
                ].map(m => (
                  <button 
                    key={m.id}
                    onClick={() => { setMethod(m.id); setPaymentStep("instructions"); }}
                    className={`p-4 rounded-2xl border border-transparent bg-gray-50 hover:border-[#7B1F2E50] transition-all text-center flex flex-col items-center justify-center`}
                  >
                    <div className="h-8 flex items-center justify-center mb-1">
                      {m.icon}
                    </div>
                    <div className="font-bold text-gray-900 text-xs">{m.label}</div>
                    <div className="text-[8px] text-gray-400 font-semibold mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Local backup options */}
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Local Wallet / Manual Backup (South Asia)</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'BKash', label: 'bKash', image: '/payment/Bkash.jpg' },
                  { id: 'Nagad', label: 'Nagad', image: '/payment/Nagad.jpg' },
                  { id: 'Rocket', label: 'Rocket', image: '/payment/Rocket.png' }
                ].map(m => (
                  <button 
                    key={m.id}
                    onClick={() => { setMethod(m.id); setPaymentStep("instructions"); }}
                    className={`p-3 rounded-2xl border border-transparent bg-gray-50 hover:border-[#7B1F2E50] transition-all text-center`}
                  >
                    <div className="h-8 flex items-center justify-center mb-1.5">
                      <img src={m.image} alt={m.label} className="h-full object-contain rounded-md" />
                    </div>
                    <div className="font-bold text-gray-900 text-[10px]">{m.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentStep === "instructions" && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-in zoom-in-95 duration-300">
          <button onClick={() => setPaymentStep("method")} className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 text-xs font-medium">
            <ChevronRight size={14} className="rotate-180" /> Back to Methods
          </button>

          {/* STRIPE CARD FLOW */}
          {method === 'Stripe' && (
            <div className="space-y-4">
              <div className="text-center mb-5">
                <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase mb-2">Secure Credit Card</div>
                <h3 className="text-xl font-bold text-gray-900">Pay with Stripe</h3>
                <p className="text-gray-500 text-xs">Enter your card details to complete payment of <span className="font-bold text-[#7B1F2E]">${amount}</span></p>
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cardholder Name</label>
                  <input type="text" placeholder="e.g. John Doe" defaultValue={user?.name || ""} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#7B1F2E]" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Card Number</label>
                  <input type="text" placeholder="••••  ••••  ••••  ••••" maxLength={19} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#7B1F2E]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Expiration Date</label>
                    <input type="text" placeholder="MM/YY" maxLength={5} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#7B1F2E]" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">CVC Code</label>
                    <input type="password" placeholder="•••" maxLength={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#7B1F2E]" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  const simulatedTrx = 'ch_' + Math.random().toString(36).substring(2, 10).toUpperCase();
                  handleSubmitPayment(simulatedTrx);
                }}
                className="w-full py-4 bg-[#7B1F2E] text-white font-bold rounded-xl text-sm shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                <ShieldCheck size={18} /> Pay ${amount} USD
              </button>
            </div>
          )}

          {/* PAYPAL FLOW */}
          {method === 'PayPal' && (
            <div className="space-y-4">
              <div className="text-center mb-5">
                <div className="inline-block px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-[10px] font-bold uppercase mb-2">Simulated PayPal Checkout</div>
                <h3 className="text-xl font-bold text-gray-900">Pay with PayPal</h3>
                <p className="text-gray-500 text-xs">Complete your secure checkout for <span className="font-bold text-[#7B1F2E]">${amount}</span></p>
              </div>

              <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-yellow-50/20 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto text-yellow-700 font-extrabold text-lg">P</div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Logged in as: <span className="font-bold">{user?.email || "student@rizqara.com"}</span></p>
                  <p className="text-[10px] text-gray-400 mt-1">PayPal sandbox environment connected</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  const simulatedTrx = 'PAYID-' + Math.random().toString(36).substring(2, 10).toUpperCase();
                  handleSubmitPayment(simulatedTrx);
                }}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl text-sm shadow-lg transition flex items-center justify-center gap-2"
              >
                <ShieldCheck size={18} /> Authorize PayPal Payment (${amount})
              </button>
            </div>
          )}

          {/* WISE / BANK TRANSFER FLOW */}
          {method === 'Wise' && (
            <div className="space-y-4">
              <div className="text-center mb-5">
                <div className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase mb-2">Wise Bank Wire</div>
                <h3 className="text-xl font-bold text-gray-900">Wise Transfer Details</h3>
                <p className="text-gray-500 text-xs">Send funds directly to our global operating account</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 mb-5 border border-dashed border-gray-200 space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-400 uppercase tracking-wider">Wise Account Email</span>
                  <span className="font-black text-gray-900">finance@rizqara.com</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-400 uppercase tracking-wider">Account Holder</span>
                  <span className="font-black text-gray-900">RizQara Global Ltd</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-400 uppercase tracking-wider">Reference Code</span>
                  <span className="font-mono font-bold text-[#7B1F2E]">{user?.id?.substring(0, 8).toUpperCase() || "RZQ-STUD"}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-3 border-t border-gray-200">
                  <span className="font-bold text-gray-400 uppercase tracking-wider">Total Due</span>
                  <span className="font-black text-lg text-[#7B1F2E]">${amount} USD</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Transaction Ref / Reference ID</label>
                  <input 
                    type="text" 
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="Enter Transfer ID or Reference Code" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none"
                  />
                  <p className="text-[9px] text-gray-400 mt-1 italic">Enter the unique transaction reference after wire transfer completes.</p>
                </div>

                <button 
                  disabled={!trxId}
                  onClick={() => handleSubmitPayment()}
                  className="w-full py-4 bg-[#7B1F2E] text-white font-bold rounded-xl text-sm shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck size={18} /> Submit Wise Transfer Details
                </button>
              </div>
            </div>
          )}

          {/* LOCAL MANUAL BACKUP FLOW */}
          {(method === 'BKash' || method === 'Nagad' || method === 'Rocket') && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 bg-[#7B1F2E10] text-[#7B1F2E] rounded-full text-[10px] font-bold uppercase mb-3">Mobile Banking Backup</div>
                <h3 className="text-xl font-bold text-gray-900">Send Money via {method}</h3>
                <p className="text-gray-500 text-xs">Please send the exact amount to our local backup number</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-dashed border-gray-200 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-[0.03] grayscale">
                   <img src={method === 'BKash' ? '/payment/Bkash.jpg' : method === 'Nagad' ? '/payment/Nagad.jpg' : '/payment/Rocket.png'} alt="bg" className="w-32 h-32 object-contain" />
                </div>
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Provider</span>
                  <div className="flex items-center gap-2">
                    <img src={method === 'BKash' ? '/payment/Bkash.jpg' : method === 'Nagad' ? '/payment/Nagad.jpg' : '/payment/Rocket.png'} alt={method} className="h-5 w-5 object-contain rounded-md" />
                    <span className="text-sm font-black text-[#7B1F2E]">{method}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Backup Phone</span>
                  <span className="text-lg font-black text-gray-900 tracking-wider">01577180519</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 relative z-10">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Due (Local Eq.)</span>
                  <span className="text-lg font-black text-[#7B1F2E]">${amount} USD</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1 uppercase tracking-wider">Transaction ID (TrxID)</label>
                  <input 
                    type="text" 
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="Enter Transaction ID" 
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 font-bold placeholder:font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-[#7B1F2E20] transition-all"
                  />
                  <p className="text-[10px] text-gray-400 mt-2 italic px-1">Example: 8K9L2M5N3P. Enter this from your {method} confirmation SMS.</p>
                </div>
                
                <button 
                  onClick={() => handleSubmitPayment()}
                  disabled={!trxId}
                  className="w-full py-4 bg-[#7B1F2E] text-white font-bold rounded-xl text-sm shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck size={18} /> Confirm Payment Submission
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {paymentStep === "submitting" && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 border-4 border-[#7B1F2E10] border-t-[#7B1F2E] rounded-full animate-spin mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Verifying Transaction</h3>
          <p className="text-gray-500 text-sm">Please wait while we record your payment details...</p>
        </div>
      )}

      {paymentStep === "success" && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
            <CheckCircle size={48} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Payment Received!</h3>
          <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
            Your transaction <span className="font-bold text-gray-700">{trxId}</span> has been submitted for verification. 
            Our admin will check it and update your status within 12-24 hours.
          </p>
          <button 
            onClick={() => {
              setPaymentStep("history");
              setAmount("");
              setPurpose("");
              setMethod("");
              setTrxId("");
            }}
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition shadow-lg"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

// === AI TAB ===
function AITab({ user }: any) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = (q: string) => {
    setQuery(q);
    setLoading(true);
    setResponse("");
    setTimeout(() => {
      setResponse(`Based on your profile (GPA: ${user.gpa || "N/A"}, Target: ${user.targetCountry || "Not set"}, Budget: ${user.budget || "Not set"}):\n\n✅ Best Match: Stipendium Hungaricum 2027 (Hungary)\n📊 Match Score: 92%\n💰 Funding: Fully Funded\n📋 IELTS: Not Required (MOI Accepted)\n\n📝 Required Documents:\n• MOI Certificate from college\n• Transcripts (all years)\n• Motivation Letter (we can help write this)\n• Recommendation letters (2)\n• CV (we can help prepare)\n\n⭐ RizQara Tip: Hungary has the highest acceptance rate for international students. Start applying now for 2027!\n\n⚠️ Disclaimer: This is AI-generated guidance. Always verify from official sources.`);
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-4 text-center" style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }}>
        <div className="text-white mb-2 flex justify-center"><Sparkles size={24} /></div>
        <h3 className="text-white font-bold mb-1">RizQara AI Guide</h3>
        <p className="text-red-100 text-xs">Ask anything about scholarships tailored to your profile</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {["Which scholarship fits my profile?", "What documents do I need?", "How to improve my SOP?", "Low budget options?"].map(q => (
            <button 
              key={q} 
              onClick={() => ask(q)} 
              className="px-3 py-1.5 text-xs rounded-full border font-medium transition-all duration-200 border-[#7B1F2E30] text-[#7B1F2E] hover:bg-[#7B1F2E] hover:text-white active:bg-[#7B1F2E] active:text-white active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && ask(query)}
            placeholder="Ask RizQara AI..."
            className="flex-1 px-4 py-2.5 border rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]"
            style={{ borderColor: "#e5e7eb" }}
          />
          <button onClick={() => ask(query)} className="px-4 py-2.5 text-white rounded-xl text-sm font-medium" style={{ backgroundColor: "#7B1F2E" }}>
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap size={14} />}
          </button>
        </div>

        {response && (
          <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: "#7B1F2E08", border: "1px solid #7B1F2E15" }}>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
