import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  Search, Menu, X, Globe, Bell, ChevronDown, LogOut,
  LayoutDashboard, Shield, Phone, Mail, Clock, MessageCircle
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Logo } from "./Logo";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Scholarships", path: "/scholarships" },
  { label: "Countries", path: "/countries" },
  { label: "Services", path: "/services" },
  { label: "Blog", path: "/blog" },
  { label: "Notice", path: "/notice" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/scholarships?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top Info Bar */}
      <div style={{ backgroundColor: "#7B1F2E" }} className="text-white text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+8801915342776" className="flex items-center gap-1.5 text-red-200 hover:text-white transition-colors">
              <Phone size={11} className="opacity-80" /> +880 1915-342776
            </a>
            <a href="mailto:rizqaraglobaleducation@gmail.com" className="flex items-center gap-1.5 text-red-200 hover:text-white transition-colors">
              <Mail size={11} className="opacity-80" /> rizqaraglobaleducation@gmail.com
            </a>
            <span className="flex items-center gap-1.5 text-red-200">
              <Clock size={11} className="opacity-80" /> Mon–Sat 9:00 AM – 8:00 PM
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-red-200">
              <Globe size={11} /> EN / BN
            </span>
            <a
              href="https://wa.me/8801915342776"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white hover:text-red-100 transition-colors font-medium"
            >
              <MessageCircle size={11} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}
        style={{ borderBottom: scrolled ? "none" : "1px solid #f3f4f6" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 group">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                    location.pathname === link.path
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  style={location.pathname === link.path ? { backgroundColor: "#7B1F2E" } : {}}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/ai-guide"
                className="ml-1 px-3 py-2 text-sm rounded-lg font-semibold transition-all duration-200 flex items-center gap-1.5 border"
                style={{ color: "#7B1F2E", borderColor: "#7B1F2E40", backgroundColor: "#7B1F2E08" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B1F2E] animate-pulse" />
                AI Guide
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <Search size={18} className="text-gray-600" />
              </button>

              {/* Notification */}
              {isLoggedIn && (
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                  <Bell size={18} className="text-gray-600" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#7B1F2E" }} />
                </button>
              )}

              {/* User Menu / Login */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#7B1F2E" }}>
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[80px] truncate">{user?.name?.split(" ")[0]}</span>
                    <ChevronDown size={13} className="text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 text-xs rounded-full text-white font-medium" style={{ backgroundColor: "#7B1F2E" }}>
                          {user?.role === "admin" ? "Admin" : "Student"}
                        </span>
                      </div>
                      {isAdmin ? (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 transition-colors">
                          <Shield size={14} style={{ color: "#7B1F2E" }} /> Admin Panel
                        </Link>
                      ) : (
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 transition-colors">
                          <LayoutDashboard size={14} style={{ color: "#7B1F2E" }} /> My Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); navigate("/"); }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 w-full transition-colors"
                      >
                        <LogOut size={14} className="text-red-500" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:bg-[#7B1F2E] hover:text-white"
                    style={{ color: "#7B1F2E", border: "1.5px solid #7B1F2E" }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: "#7B1F2E" }}
                  >
                    Register Free
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileOpen ? <X size={20} className="text-gray-700" /> : <Menu size={20} className="text-gray-700" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 shadow-sm">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search scholarship, country, university, subject..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B1F2E] focus:ring-2 focus:ring-[#7B1F2E15] transition-all"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition"
                style={{ backgroundColor: "#7B1F2E" }}
              >
                Search
              </button>
              <button type="button" onClick={() => setSearchOpen(false)} className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 shadow-sm">
            <nav className="flex flex-col gap-1 mb-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-3 text-sm font-medium rounded-xl transition-colors hover:bg-gray-50"
                  style={{ color: location.pathname === link.path ? "#7B1F2E" : "#374151", backgroundColor: location.pathname === link.path ? "#7B1F2E08" : "" }}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/ai-guide" className="px-4 py-3 text-sm font-semibold rounded-xl flex items-center gap-2" style={{ color: "#7B1F2E" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B1F2E] animate-pulse" />
                AI Guide
              </Link>
            </nav>
            {!isLoggedIn && (
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Link to="/login" className="flex-1 py-2.5 text-center text-sm font-semibold rounded-xl border-2" style={{ borderColor: "#7B1F2E", color: "#7B1F2E" }}>Login</Link>
                <Link to="/register" className="flex-1 py-2.5 text-center text-sm font-semibold rounded-xl text-white" style={{ backgroundColor: "#7B1F2E" }}>Register Free</Link>
              </div>
            )}
            {isLoggedIn && (
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex-1 py-2.5 text-center text-sm font-semibold rounded-xl text-white" style={{ backgroundColor: "#7B1F2E" }}>
                  {isAdmin ? "Admin Panel" : "My Dashboard"}
                </Link>
                <button onClick={() => { logout(); navigate("/"); }} className="flex-1 py-2.5 text-center text-sm font-semibold rounded-xl border-2 border-red-200 text-red-500">Logout</button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Click outside to close user menu */}
      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
    </>
  );
}
