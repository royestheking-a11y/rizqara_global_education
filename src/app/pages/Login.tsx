import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, ArrowRight, Shield, BarChart3, Bookmark, MessageSquare, FileText, Home } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Logo } from "../components/layout/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    console.log("Login Result:", result);
    if (result.success && result.user) {
      console.log("Redirecting to:", result.user.role === "admin" ? "/admin" : "/dashboard");
      navigate(result.user.role === "admin" ? "/admin" : "/dashboard");
    } else if (result.success) {
      navigate("/dashboard");
    } else {
      console.error("Login failed:", result);
      setError(result.message);
    }
    setLoading(false);
  };



  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#FDF8F5" }}>
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #7B1F2E 0%, #3D0F17 100%)" }}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url(/login.webp)" }}
        />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 border-8 border-white -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5 border-8 border-white translate-y-1/3 -translate-x-1/3" />
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <Logo variant="light" size="lg" className="mb-8" />
          <h2 className="text-3xl font-black mb-4" style={{ lineHeight: 1.2 }}>
            Welcome Back to<br />
            <span className="text-white">RizQara Global Education</span>
          </h2>
          <p className="text-red-200 leading-relaxed mb-8">
            Access your dashboard to track applications, view saved scholarships, communicate with your advisor, and manage documents.
          </p>
          <div className="space-y-4">
            {[
              { icon: <BarChart3 size={18} />, text: "Track application progress" },
              { icon: <Bookmark size={18} />, text: "View saved scholarships" },
              { icon: <MessageSquare size={18} />, text: "Message your advisor" },
              { icon: <FileText size={18} />, text: "Upload & manage documents" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-red-100/90 group/item">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover/item:bg-white/20 transition-colors">
                  {item.icon}
                </div>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 lg:hidden">
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

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in to your account</h1>
          <p className="text-gray-500 mb-6 text-sm">Don't have an account? <Link to="/register" className="font-semibold" style={{ color: "#7B1F2E" }}>Create one free</Link></p>



          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2"
                style={{ borderColor: "#e5e7eb", "--tw-ring-color": "#7B1F2E30" } as any}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12] pr-11"
                  style={{ borderColor: "#e5e7eb" }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <button type="button" className="text-sm font-medium" style={{ color: "#7B1F2E" }}>
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#7B1F2E] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-60 shadow-lg shadow-[#7B1F2E20] active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowRight size={16} className="text-white" />
              )}
              <span className="text-white">{loading ? "Signing in..." : "Sign In"}</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Or Quick Access</p>
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
              Continue via WhatsApp
            </a>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing in, you agree to our{" "}
            <Link to="/terms" style={{ color: "#7B1F2E" }}>Terms of Service</Link> and{" "}
            <Link to="/privacy" style={{ color: "#7B1F2E" }}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
