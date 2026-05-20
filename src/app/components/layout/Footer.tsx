import { Link, useNavigate } from "react-router";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, ArrowRight, Shield } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "../../hooks/useAuth";

export function Footer() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleProfileCheck = () => {
    if (isLoggedIn) {
      navigate("/dashboard/messages");
    } else {
      navigate("/register");
    }
  };

  return (
    <footer style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #f3f4f6" }} className="text-gray-600">
      {/* CTA Banner */}
      <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-bold mb-1">Ready to Study Abroad?</h3>
            <p className="text-red-200 text-sm">Get your free profile check and discover scholarships that match your profile.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={handleProfileCheck}
              className="px-6 py-3 bg-white text-sm font-bold rounded-xl transition-all hover:bg-gray-50 shadow-sm"
              style={{ color: "#7B1F2E" }}
            >
              Free Profile Check
            </button>
            <Link
              to="/scholarships"
              className="px-6 py-3 text-sm font-bold rounded-xl border-2 border-white/40 text-white transition-all hover:bg-white/10"
            >
              Explore Scholarships
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6 group">
              <Logo variant="dark" size="md" />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              RizQara Global Education is a premier international scholarship portal and study abroad consultancy.
              We help students from all around the world find fully-funded scholarships, prepare documents, and achieve their global education dreams.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a href="tel:+8801915342776" className="flex items-center gap-3 text-gray-600 hover:text-[#7B1F2E] transition-colors group">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#7B1F2E] transition-colors" style={{ backgroundColor: "#7B1F2E10" }}>
                  <Phone size={13} style={{ color: "#7B1F2E" }} />
                </div>
                +880 1915-342776
              </a>
              <a href="mailto:rizqaraglobaleducation@gmail.com" className="flex items-center gap-3 text-gray-600 hover:text-[#7B1F2E] transition-colors group">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#7B1F2E] transition-colors" style={{ backgroundColor: "#7B1F2E10" }}>
                  <Mail size={13} style={{ color: "#7B1F2E" }} />
                </div>
                rizqaraglobaleducation@gmail.com
              </a>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#7B1F2E10" }}>
                  <MapPin size={13} style={{ color: "#7B1F2E" }} />
                </div>
                Global Offices
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5 mt-6">
              {[
                { icon: <Facebook size={15} />, href: "https://www.facebook.com/rizqaraglobaledu/", label: "Facebook" },
                { icon: <Instagram size={15} />, href: "https://www.instagram.com/rizqaraglobaledu/", label: "Instagram" },
                { 
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                      <path d="M9 10a3 3 0 1 1 6 0v4a3 3 0 1 1 -6 0" />
                    </svg>
                  ), 
                  href: "https://www.threads.com/@rizqaraglobaledu", 
                  label: "Threads" 
                },
                { icon: <Linkedin size={15} />, href: "https://www.linkedin.com/company/rizqaraglobaleducation/", label: "LinkedIn" },
                { icon: <Youtube size={15} />, href: "#", label: "YouTube" },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: "#7B1F2E10", color: "#7B1F2E" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = "#7B1F2E";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = "#7B1F2E10";
                    e.currentTarget.style.color = "#7B1F2E";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-bold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-4 h-0.5 inline-block" style={{ backgroundColor: "#7B1F2E" }} /> Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "All Scholarships", path: "/scholarships" },
                { label: "Countries",        path: "/countries" },
                { label: "Services",         path: "/services" },
                { label: "Blog",             path: "/blog" },
                { label: "Notice Board",     path: "/notice" },
                { label: "Success Gallery",  path: "/success-gallery" },
                { label: "About Us",         path: "/about" },
                { label: "Contact",          path: "/contact" },
                { label: "No IELTS Guide",   path: "/no-ielts-scholarships-for-international-students" },
              ].map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 hover:text-[#7B1F2E] flex items-center gap-2 group transition-colors"
                  >
                    <ArrowRight size={11} style={{ color: "#7B1F2E" }} className="group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-gray-900 font-bold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-4 h-0.5 inline-block" style={{ backgroundColor: "#7B1F2E" }} /> Our Services
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                "Free Profile Check",
                "Scholarship Matching",
                "SOP & CV Writing",
                "Document Preparation",
                "Visa File Guidance",
                "Interview Coaching",
                "University Shortlisting",
                "Application Support",
              ].map(s => (
                <li key={s}>
                  <Link to="/services" className="text-sm text-gray-600 hover:text-[#7B1F2E] flex items-center gap-2 group transition-colors">
                    <ArrowRight size={11} style={{ color: "#7B1F2E" }} className="group-hover:translate-x-1 transition-transform" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Scholarships */}
          <div>
            <h4 className="text-gray-900 font-bold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-4 h-0.5 inline-block" style={{ backgroundColor: "#7B1F2E" }} /> Top Scholarships
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "MEXT Japan 2027",            flag: "🇯🇵", path: "/scholarships/mext-2027" },
                { label: "Stipendium Hungaricum",       flag: "🇭🇺", path: "/scholarships/hungary-stipendium-2027" },
                { label: "Türkiye Scholarship",         flag: "🇹🇷", path: "/scholarships/turkey-turkiye-scholarship" },
                { label: "Russia Govt Scholarship",     flag: "🇷🇺", path: "/scholarships/russia-government-scholarship" },
                { label: "Saudi Arabia Scholarship",    flag: "🇸🇦", path: "/scholarships/saudi-king-abdullah-scholarship" },
                { label: "Romania Scholarship",         flag: "🇷🇴", path: "/scholarships/romania-government-scholarship" },
                { label: "China CSC Scholarship",       flag: "🇨🇳", path: "/scholarships/china-csc-scholarship" },
              ].map(s => (
                <li key={s.path}>
                  <Link to={s.path} className="text-sm text-gray-600 hover:text-[#7B1F2E] flex items-center gap-2 group transition-colors">
                    <span className="text-base leading-none flex-shrink-0">{s.flag}</span>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Partner Universities Section */}
      <div className="bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center text-center mb-8">
            <h4 className="text-gray-900 font-bold text-sm uppercase tracking-[0.2em] mb-2">We With This Universities</h4>
            <div className="w-12 h-0.5 rounded-full" style={{ backgroundColor: "#7B1F2E" }} />
            <p className="text-gray-400 text-xs mt-3 max-w-lg italic">Officially connected with top-ranked universities globally to bring you exclusive scholarship opportunities.</p>
          </div>
          <div className="flex justify-center">
            <img 
              src="/universities.png" 
              alt="Partner Universities" 
              className="w-full h-auto max-w-5xl transition-all duration-700 hover:scale-[1.02] cursor-default"
            />
          </div>
        </div>
      </div>

      {/* Premium Payment Section */}
      <div className="border-t border-gray-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <Shield size={16} className="text-[#7B1F2E]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B1F2E]">Verified Security</span>
              </div>
              <h4 className="text-gray-900 font-extrabold text-lg">Secure Payments</h4>
              <p className="text-gray-400 text-xs mt-1">Global & Local Payment Options</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              {[
                { name: "Visa", src: "/payment/Visa-Logo.png" },
                { name: "Mastercard", src: "/payment/mastercard-featured-image-1080x628.jpg" },
                { name: "Amex", src: "/payment/amex.jpg" },
                { name: "Payoneer", src: "/payment/payoneer-logo-payoneer-icon-transparent-free-png.webp" },
                { name: "Google Pay", src: "/payment/GooglePayLogo.width-500.format-webp.webp" },
                { name: "Redot Pay", src: "/payment/redot pay.png" },
                { name: "Bkash", src: "/payment/Bkash.jpg" },
                { name: "Nagad", src: "/payment/Nagad.jpg" },
                { name: "Rocket", src: "/payment/Rocket.png" },
              ].map(p => (
                <div key={p.name} className="h-6 md:h-8 w-auto flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                  <img 
                    src={p.src} 
                    alt={p.name} 
                    className="h-full w-auto object-contain brightness-110 contrast-125" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t" style={{ borderColor: "#f3f4f6" }}>
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Shield size={12} style={{ color: "#7B1F2E" }} />
            <span>© 2026 RizQara Global Education. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link to="/privacy-policy" className="hover:text-[#7B1F2E] transition-colors">Privacy Policy</Link>
            <span className="opacity-30">|</span>
            <Link to="/terms-conditions" className="hover:text-[#7B1F2E] transition-colors">Terms & Conditions</Link>
            <span className="opacity-30">|</span>
            <Link to="/refund-policy" className="hover:text-[#7B1F2E] transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}