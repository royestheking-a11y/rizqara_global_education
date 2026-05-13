import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle, ArrowLeft, MoreVertical } from "lucide-react";
import { api } from "../services/api";
import { SEO } from "../components/SEO";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", gpa: "", targetCountry: "", targetSubject: "", budget: "", ieltsStatus: "No IELTS", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/leads', form);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit lead", err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
      <SEO 
        title="Contact Us & Free Profile Check | RizQara Global Education"
        description="Get a free profile check for scholarships. Contact RizQara Global Education for study abroad guidance, university admission, and visa support."
        keywords="contact RizQara, free scholarship profile check, study abroad consultation Bangladesh"
        canonical="/contact"
      />
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Get Free Profile Check</h1>
          <p className="text-red-200">Our experts will review your profile and suggest the best scholarships for you — 100% free.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Contact Us</h3>
              {[
                { icon: <Phone size={18} style={{ color: "#7B1F2E" }} />, label: "Phone / WhatsApp", value: "+880 1915-342776" },
                { icon: <Mail size={18} style={{ color: "#7B1F2E" }} />, label: "Email", value: "rizqaraglobaleducation@gmail.com" },
                { icon: <MapPin size={18} style={{ color: "#7B1F2E" }} />, label: "Location", value: "Dhaka, Bangladesh" },
                { icon: <Clock size={18} style={{ color: "#7B1F2E" }} />, label: "Office Hours", value: "Mon–Sat, 9 AM – 8 PM" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-b-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#7B1F2E10" }}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                    <div className="text-sm font-semibold text-gray-800">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <a 
              href="https://wa.me/8801915342776" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl text-white font-semibold shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              style={{ backgroundColor: "#25D366" }}
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <div className="text-sm">Chat on WhatsApp</div>
                <div className="text-xs font-normal text-green-100">Usually replies in minutes</div>
              </div>
            </a>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Response Time</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">WhatsApp</span>
                  <span className="font-medium text-green-600">Usually within 30 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">Within 24 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Profile Check</span>
                  <span className="font-medium">Within 48 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#7B1F2E15" }}>
                  <CheckCircle size={32} style={{ color: "#7B1F2E" }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
                <p className="text-gray-500 mb-4">Thank you {form.name}! RizQara team will review your profile and get back to you within 48 hours.</p>
                <p className="text-sm text-gray-400">You can also reach us on WhatsApp for faster response.</p>
                <a href="https://wa.me/8801725350352" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all duration-300 group"
                  style={{ backgroundColor: "#25D366" }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="white" className="group-hover:scale-110 transition-transform">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-5">Free Profile Check Form</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Full Name *</label>
                      <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Phone / WhatsApp *</label>
                      <input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+880 1712-345678" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">GPA / Result</label>
                      <input value={form.gpa} onChange={e => setForm(p => ({ ...p, gpa: e.target.value }))} placeholder="e.g., 4.83 or 75%" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">IELTS Status</label>
                      <select value={form.ieltsStatus} onChange={e => setForm(p => ({ ...p, ieltsStatus: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]">
                        {["No IELTS", "Planning IELTS", "IELTS 5.0-5.5", "IELTS 6.0+"].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Target Country</label>
                      <input value={form.targetCountry} onChange={e => setForm(p => ({ ...p, targetCountry: e.target.value }))} placeholder="e.g., Hungary, Japan, Russia" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Target Subject</label>
                      <input value={form.targetSubject} onChange={e => setForm(p => ({ ...p, targetSubject: e.target.value }))} placeholder="e.g., Engineering, MBBS" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Budget</label>
                    <select value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]">
                      <option value="">Select your budget</option>
                      {["Want fully funded", "Up to 2 lakh BDT", "Up to 5 lakh BDT", "Up to 10 lakh BDT", "Open to all options"].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Message / Additional Info</label>
                    <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={3} placeholder="Any specific scholarship in mind? Any questions for our team?" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12] resize-none" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-3.5 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus:ring-2 focus:ring-[#7B1F2E30] disabled:opacity-60" style={{ backgroundColor: "#7B1F2E" }}>
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
                    Submit Profile Check Request
                  </button>
                  <p className="text-xs text-center text-gray-400">100% free • No spam • No hidden charges</p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
