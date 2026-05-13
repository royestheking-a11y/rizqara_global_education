import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, CheckCircle, ArrowRight, UserPlus, Sparkles, BarChart3, Bookmark, Home } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Logo } from "../components/layout/Logo";

export default function Register() {
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "",
    educationLevel: "", gpa: "", targetDegree: "", targetCountry: "",
    targetSubject: "", ieltsStatus: "", budget: "", passportStatus: ""
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));

  const handleNext = () => {
    if (step === 1) {
      if (!form.name || !form.email || !form.password) { setError("Please fill all required fields."); return; }
      if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    }
    setError("");
    setStep(s => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await register(form);
    if (result.success) navigate("/dashboard");
    else setError(result.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#FDF8F5" }}>
      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 relative" style={{ background: "linear-gradient(135deg, #7B1F2E 0%, #3D0F17 100%)" }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url(/singup.jpg)" }} />
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <Logo variant="light" size="lg" className="mb-8" />
          <h2 className="text-3xl font-black mb-4" style={{ lineHeight: 1.2 }}>
            Start Your<br />
            <span className="text-white">Study Abroad Journey</span>
          </h2>
          <p className="text-red-200 mb-8 leading-relaxed">
            Create your free student account to access scholarship matching, document tracking, AI guidance, and direct support from our advisors.
          </p>
          <div className="space-y-4">
            {[
              { icon: <UserPlus size={18} />, text: "Create your profile" },
              { icon: <Bookmark size={18} />, text: "Get matched with scholarships" },
              { icon: <Sparkles size={18} />, text: "Prepare with AI guidance" },
              { icon: <BarChart3 size={18} />, text: "Track your applications" },
            ].map((s, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-red-100/90 group/item">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover/item:bg-white/20 transition-colors">
                  {s.icon}
                </div>
                <span className="font-medium">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="lg:hidden">
              <Logo size="md" />
            </div>
            <Link 
              to="/" 
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#7B1F2E] transition-colors py-2 px-3 rounded-lg border border-gray-100 hover:border-[#7B1F2E30] hover:bg-[#7B1F2E05]"
            >
              <Home size={14} />
              Back to Website
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Free Account</h1>
          <p className="text-gray-500 mb-6 text-sm">Already have an account? <Link to="/login" className="font-semibold" style={{ color: "#7B1F2E" }}>Sign in</Link></p>

          {/* Step Indicator */}
          <div className="flex items-center mb-7">
            {["Basic Info", "Academic Profile", "Confirm"].map((label, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "text-white" : "bg-gray-200 text-gray-500"}`}
                  style={step === i + 1 ? { backgroundColor: "#7B1F2E" } : {}}>
                  {step > i + 1 ? <CheckCircle size={14} /> : i + 1}
                </div>
                <div className="flex-1 hidden sm:flex flex-col ml-2">
                  <span className={`text-xs font-medium ${step === i + 1 ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
                </div>
                {i < 2 && <div className={`w-8 h-0.5 mx-2 ${step > i + 1 ? "bg-green-400" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g., Md. Karim Hossain" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address *</label>
                <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone / WhatsApp *</label>
                <input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+880 1725-350352" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Password *</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)} placeholder="Min 6 characters" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12] pr-11" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button onClick={handleNext} className="w-full py-3.5 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 transition" style={{ backgroundColor: "#7B1F2E" }}>
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Current Education Level</label>
                <select value={form.educationLevel} onChange={e => update("educationLevel", e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]">
                  <option value="">Select level</option>
                  {["HSC Completed", "O Level / A Level", "Bachelor's (Ongoing)", "Bachelor's (Completed)", "Master's (Ongoing)", "Master's (Completed)"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">GPA / CGPA / Result</label>
                <input value={form.gpa} onChange={e => update("gpa", e.target.value)} placeholder="e.g., 4.83, 3.5, 75%" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Target Degree</label>
                <select value={form.targetDegree} onChange={e => update("targetDegree", e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]">
                  <option value="">Select degree</option>
                  {["Bachelor", "Master's", "PhD", "MBBS", "Foundation"].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Target Country</label>
                <select value={form.targetCountry} onChange={e => update("targetCountry", e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]">
                  <option value="">Select country</option>
                  {["Hungary", "Japan", "Romania", "Russia", "Turkey", "Saudi Arabia", "China", "Germany", "South Korea", "Multiple Countries"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Target Subject</label>
                <input value={form.targetSubject} onChange={e => update("targetSubject", e.target.value)} placeholder="e.g., Engineering, MBBS, Business" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">IELTS Status</label>
                <select value={form.ieltsStatus} onChange={e => update("ieltsStatus", e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]">
                  <option value="">Select status</option>
                  {["No IELTS", "Planning to take IELTS", "IELTS 5.0-5.5", "IELTS 6.0-6.5", "IELTS 7.0+"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Budget</label>
                <select value={form.budget} onChange={e => update("budget", e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]">
                  <option value="">Select budget</option>
                  {["Want fully funded (0 budget)", "Up to 2 lakh BDT", "Up to 5 lakh BDT", "Up to 10 lakh BDT", "Unlimited"].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Passport Status</label>
                <select value={form.passportStatus} onChange={e => update("passportStatus", e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]">
                  <option value="">Select status</option>
                  {["Have Valid Passport", "Passport Expired", "No Passport Yet", "Applied for Passport"].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium">Back</button>
                <button onClick={handleNext} className="flex-1 py-3 text-white font-semibold rounded-xl text-sm hover:opacity-90 transition" style={{ backgroundColor: "#7B1F2E" }}>Continue</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: "#FDF8F5", border: "1px solid #7B1F2E20" }}>
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Review Your Profile</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "Name", value: form.name },
                    { label: "Email", value: form.email },
                    { label: "Education", value: form.educationLevel || "—" },
                    { label: "GPA", value: form.gpa || "—" },
                    { label: "Target Degree", value: form.targetDegree || "—" },
                    { label: "Target Country", value: form.targetCountry || "—" },
                    { label: "IELTS", value: form.ieltsStatus || "—" },
                    { label: "Budget", value: form.budget || "—" },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="text-gray-400">{item.label}</div>
                      <div className="font-semibold text-gray-800 mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                <div className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-green-700">
                    <strong>Free profile check included!</strong> After registration, our team will review your profile and send you personalized scholarship recommendations within 48 hours.
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-2">
                <input type="checkbox" required className="mt-0.5" />
                <span className="text-xs text-gray-500">
                  I agree to the <Link to="/terms" className="underline" style={{ color: "#7B1F2E" }}>Terms of Service</Link> and <Link to="/privacy" className="underline" style={{ color: "#7B1F2E" }}>Privacy Policy</Link>. I understand this platform is for educational guidance purposes.
                </span>
              </label>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium">Back</button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 py-3.5 bg-[#7B1F2E] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 shadow-lg shadow-[#7B1F2E20] transition active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle size={16} className="text-white" />
                  )}
                  <span className="text-white">Create Account</span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Need help with registration?</p>
            <a
              href="https://wa.me/8801915342776"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-3.5 border-2 rounded-xl text-sm font-bold transition-all duration-300 group"
              style={{ 
                borderColor: "#25D36620", 
                color: "#128C7E",
                backgroundColor: "#25D36605"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#25D36610";
                e.currentTarget.style.borderColor = "#25D36640";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#25D36605";
                e.currentTarget.style.borderColor = "#25D36620";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg 
                viewBox="0 0 24 24" 
                width="20" 
                height="20" 
                fill="currentColor" 
                className="transition-transform duration-300 group-hover:scale-110"
                style={{ color: "#25D366" }}
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Assistance via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
