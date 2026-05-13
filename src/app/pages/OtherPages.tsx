import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { 
  Search, Calendar, Clock, ArrowRight, ChevronRight, CheckCircle, 
  Globe, Users, Award, BookOpen, Star, Bot, BarChart3, HelpCircle, 
  Sparkles, Target, Info, Lightbulb, UserCheck, Banknote, GraduationCap,
  Building2, Wallet, Stethoscope, MessageSquare, FileCheck, MapPin,
  ClipboardList, AlertCircle, MessageCircle, Building, ShieldCheck
} from "lucide-react";
import { api } from "../services/api";
import { 
  GenericGridSkeleton, 
  ServiceSkeleton, 
  BlogSkeleton, 
  NoticeSkeleton, 
  TestimonialSkeleton,
  DetailsSkeleton
} from "../components/ui/PremiumSkeletons";
import { Skeleton } from "../components/ui/skeleton";

// ======================== COUNTRIES PAGE ========================
export function CountriesPage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await api.get('/countries');
        setCountries(data);
      } catch (err) {
        console.error("Failed to fetch countries", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const filtered = countries.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.popularSubjects.some((s: string) => s.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
      <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Study Abroad Destinations</h1>
          <p className="text-red-200 mb-6">Find scholarships and study options in 25+ countries</p>
          <div className="max-w-md mx-auto relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search country or subject..." className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none border border-gray-100 shadow-sm" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <GenericGridSkeleton />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(c => (
              <Link 
                key={c.slug || c.id || c._id} 
                to={`/countries/${c.slug || c.id || c._id}`} 
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-3 flex items-center gap-3 transform group-hover:translate-y-[-4px] transition-all duration-300">
                      <span className="text-4xl filter drop-shadow-sm">{c.flag}</span>
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight tracking-wide">{c.name}</h3>
                        <p className="text-white/70 text-xs font-medium tracking-wide uppercase">{c.continent}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Scholarships</span>
                      <div className="font-bold text-sm" style={{ color: "#7B1F2E" }}>{c.scholarshipCount || 0}+ Available</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Living Cost</span>
                      <div className="font-bold text-sm text-gray-800">{c.livingCost?.split("/")[0]}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {!c.ieltsRequired && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider" style={{ backgroundColor: "#7B1F2E12", color: "#7B1F2E" }}>No IELTS</span>}
                    {c.partTimeWork && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 uppercase tracking-wider border border-emerald-100">Part-time Work</span>}
                    {c.prPathway && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 uppercase tracking-wider border border-blue-100">PR Pathway</span>}
                  </div>
                  <div className="pt-4 border-t border-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Popular Subjects</p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.popularSubjects?.slice(0, 3).map((s: string) => (
                        <span key={s} className="text-[11px] px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-gray-600 font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ======================== COUNTRY DETAILS ========================
export function CountryDetailsPage() {
  const { id } = useParams();
  const [country, setCountry] = useState<any>(null);
  const [relatedScholarships, setRelatedScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get(`/countries/${id}`);
        setCountry(data);
        const scholarships = await api.get('/scholarships');
        setRelatedScholarships(scholarships.filter((s: any) => s.country === data.name));
      } catch (err) {
        console.error("Failed to fetch country details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <DetailsSkeleton />;

  if (!country) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold mb-4">Country not found</h2><Link to="/countries" className="text-white px-5 py-2 rounded-xl" style={{ backgroundColor: "#7B1F2E" }}>Back to Countries</Link></div></div>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
      <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 text-red-200 text-xs mb-4">
            <Link to="/" className="hover:text-white">Home</Link><ChevronRight size={12} />
            <Link to="/countries" className="hover:text-white">Countries</Link><ChevronRight size={12} />
            <span className="text-white">{country.name}</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{country.flag}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">Study in {country.name}</h1>
              <p className="text-red-200">{country.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {!country.ieltsRequired && <span className="px-3 py-1 rounded-full text-xs bg-white/20 text-white flex items-center gap-1.5"><CheckCircle size={12} /> No IELTS Required</span>}
            {country.partTimeWork && <span className="px-3 py-1 rounded-full text-xs bg-white/20 text-white flex items-center gap-1.5"><Clock size={12} /> Part-time Work Allowed</span>}
            {country.prPathway && <span className="px-3 py-1 rounded-full text-xs bg-white/20 text-white flex items-center gap-1.5"><Building2 size={12} /> PR Pathway</span>}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Tuition Range", value: country.tuitionRange, icon: <Banknote size={18} /> },
            { label: "Living Cost", value: country.livingCost, icon: <MapPin size={18} /> },
            { label: "Currency", value: country.currency, icon: <Wallet size={18} /> },
            { label: "Language", value: country.language, icon: <MessageSquare size={18} /> },
            { label: "Available Scholarships", value: `${country.scholarshipCount || 0}+`, icon: <GraduationCap size={18} /> },
            { label: "IELTS Required", value: country.ieltsRequired ? "Yes" : "Not Required", icon: <FileCheck size={18} /> },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-[#7B1F2E] mb-1">{item.icon}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
              <div className="text-sm font-bold text-gray-900 mt-0.5">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Popular Subjects in {country.name}</h3>
          <div className="flex flex-wrap gap-2">
            {country.popularSubjects?.map((s: string) => <span key={s} className="px-3 py-1.5 rounded-full text-sm border" style={{ borderColor: "#7B1F2E30", color: "#7B1F2E" }}>{s}</span>)}
          </div>
        </div>

        {relatedScholarships.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Available Scholarships in {country.name}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedScholarships.map((s: any) => (
                <Link key={s.slug || s.id || s._id} to={`/scholarships/${s.slug || s.id || s._id}`} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex gap-3 p-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">{s.name}</h4>
                    <p className="text-xs text-gray-500 mb-1">{s.fundingType}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === "Open" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{s.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ======================== SERVICES PAGE ========================
export function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.get('/services');
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
      <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Our Services</h1>
          <p className="text-red-200">Complete study abroad support from profile evaluation to visa approval</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {loading ? (
          <ServiceSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {services.map(s => (
              <Link key={s.slug || s.id || s._id} to={`/services/${s.slug || s.id || s._id}`} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[#7B1F2E]" style={{ backgroundColor: "#7B1F2E10" }}>
                    {s.isFree ? <CheckCircle size={22} /> : <Target size={22} />}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.isFree ? "bg-green-100 text-green-700" : "bg-amber-50 text-amber-700"}`}>{s.isFree ? "FREE" : s.price}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#7B1F2E] transition-colors">{s.title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">{s.description}</p>
                <ul className="space-y-2 mb-5">
                  {s.features?.slice(0, 3).map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle size={12} className="text-green-500 flex-shrink-0 mt-0.5" />{f}
                    </li>
                  ))}
                </ul>
                <div className="py-2.5 text-center text-sm font-bold text-[#7B1F2E] rounded-xl bg-[#7B1F2E08] border border-[#7B1F2E15]">
                  View Details <ArrowRight size={14} className="inline ml-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="bg-gradient-to-r from-[#7B1F2E] to-[#3D0F17] rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Not sure which service you need?</h3>
          <p className="text-red-200 mb-5">Book a free consultation call. Our advisors will guide you to the right service.</p>
          <Link to="/contact" className="inline-block px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition" style={{ backgroundColor: "white", color: "#7B1F2E" }}>
            Book Free Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ServiceDetailsPage() {
  const { id } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await api.get(`/services/${id}`);
        setService(data);
      } catch (err) {
        console.error("Failed to fetch service details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) return <DetailsSkeleton />;

  if (!service) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold mb-4">Service not found</h2><Link to="/services" className="text-white px-5 py-2 rounded-xl" style={{ backgroundColor: "#7B1F2E" }}>Back to Services</Link></div></div>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
      <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 text-red-200 text-xs mb-4">
            <Link to="/" className="hover:text-white">Home</Link><ChevronRight size={12} />
            <Link to="/services" className="hover:text-white">Services</Link><ChevronRight size={12} />
            <span className="text-white">{service.title}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">{service.title}</h1>
          <p className="text-red-200 max-w-2xl leading-relaxed">{service.description}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-[#7B1F2E]" /> What's Included
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.features?.map((f: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info size={20} className="text-[#7B1F2E]" /> Service Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}. Our expert team at RizQara Global Education ensures that you receive the highest quality of service and guidance. We have helped hundreds of students achieve their dreams with this specific service.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Service Price</div>
                <div className="text-3xl font-black text-gray-900">{service.isFree ? "FREE" : service.price}</div>
              </div>
              <Link to="/contact" className="block w-full py-3.5 text-center font-bold text-white rounded-xl shadow-lg shadow-[#7B1F2E30] transition hover:opacity-90 active:scale-95 mb-4" style={{ backgroundColor: "#7B1F2E" }}>
                Book This Service
              </Link>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <Clock size={14} className="text-[#7B1F2E]" /> 24/7 Support
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <UserCheck size={14} className="text-[#7B1F2E]" /> Expert Guidance
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <ShieldCheck size={14} className="text-[#7B1F2E]" /> Verified Process
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================== BLOG PAGE ========================
export function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await api.get('/blogs');
        setBlogPosts(data);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const categories = ["All", ...Array.from(new Set(blogPosts.map(b => b.category)))];
  const filtered = blogPosts.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q);
    const matchCat = activeCategory === "All" || b.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-screen" style={{ backgroundColor: "#FDF8F5" }}>
      <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Blog & Knowledge Hub</h1>
          <p className="text-red-200 mb-6">Scholarship guides, country guides, SOP tips, and study abroad resources</p>
          <div className="max-w-md mx-auto relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none border border-gray-100 shadow-sm" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <BlogSkeleton />
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(c => (
                <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeCategory === c ? "text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#7B1F2E30]"}`} style={activeCategory === c ? { backgroundColor: "#7B1F2E" } : {}}>
                  {c}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(b => (
                <Link key={b.id || b._id} to={`/blog/${b.slug || b._id || b.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
                  <div className="relative h-44 overflow-hidden">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 rounded text-xs font-medium text-white" style={{ backgroundColor: "#7B1F2E" }}>{b.category}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-[#7B1F2E] transition-colors line-clamp-2">{b.title}</h4>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{b.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {b.tags?.slice(0, 3).map((tag: string) => <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-500">{tag}</span>)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Calendar size={10} />{b.date}</span>
                      <span className="flex items-center gap-1"><Clock size={10} />{b.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ======================== BLOG DETAILS ========================
export function BlogDetailsPage() {
  const { slug } = useParams();
  const id = slug; // Parameter name is 'slug' in routes but used for ID/Slug lookup in API
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;
        const data = await api.get(`/blogs/${id}`);
        setPost(data);
      } catch (err) {
        console.error("Failed to fetch blog post", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <DetailsSkeleton />;

  if (!post) return <div className="min-h-screen flex items-center justify-center"><Link to="/blog" className="text-white px-5 py-2 rounded-xl" style={{ backgroundColor: "#7B1F2E" }}>Back to Blog</Link></div>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
          <Link to="/">Home</Link><ChevronRight size={12} /><Link to="/blog">Blog</Link><ChevronRight size={12} /><span className="text-gray-800">{post.category}</span>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <img src={post.image} alt={post.title} className="w-full h-64 object-cover" />
          <div className="p-8">
            <span className="text-xs px-3 py-1 rounded-full text-white mb-4 inline-block" style={{ backgroundColor: "#7B1F2E" }}>{post.category}</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              <span className="flex items-center gap-1"><Users size={14} />{post.author}</span>
              <span className="flex items-center gap-1"><Calendar size={14} />{post.date}</span>
              <span className="flex items-center gap-1"><Clock size={14} />{post.readTime}</span>
            </div>
            <div className="text-gray-600 leading-relaxed mb-5 blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            <div className="flex flex-wrap gap-2 pt-5 border-t border-gray-100">
              {post.tags?.map((tag: string) => <span key={tag} className="px-3 py-1 rounded-full text-xs border" style={{ borderColor: "#7B1F2E30", color: "#7B1F2E" }}>{tag}</span>)}
            </div>
          </div>
        </div>
        <div className="mt-6 p-5 bg-gradient-to-r from-[#7B1F2E] to-[#3D0F17] rounded-2xl text-white text-center">
          <h3 className="font-bold mb-2">Need Personalized Guidance?</h3>
          <p className="text-red-200 text-sm mb-4">Get a free profile check from our experts.</p>
          <Link to="/contact" className="inline-block px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90" style={{ backgroundColor: "white", color: "#7B1F2E" }}>Free Profile Check</Link>
        </div>
      </div>
    </div>
  );
}

// ======================== NOTICE PAGE ========================
export function NoticePage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await api.get('/notices');
        setNotices(data);
      } catch (err) {
        console.error("Failed to fetch notices", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const cats = ["All", ...Array.from(new Set(notices.map(n => n.category)))];
  const filtered = notices.filter(n => filter === "All" || n.category === filter);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
      <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Notices & Announcements</h1>
          <p className="text-red-200">Stay updated with the latest scholarship deadlines, embassy updates, and important announcements</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <NoticeSkeleton />
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {cats.map(c => (
                <button key={c} onClick={() => setFilter(c)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${filter === c ? "text-white" : "bg-white border border-gray-200 text-gray-600"}`} style={filter === c ? { backgroundColor: "#7B1F2E" } : {}}>
                  {c}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {filtered.map(n => (
                <div key={n.id || n._id} className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: n.isUrgent ? "#7B1F2E30" : "#f0f0f0", borderLeftWidth: n.isUrgent ? 4 : 1, borderLeftColor: n.isUrgent ? "#7B1F2E" : "#f0f0f0" }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {n.isUrgent && <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-600 flex items-center gap-1"><AlertCircle size={10} /> Urgent</span>}
                        {n.isImportant && <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#7B1F2E12] text-[#7B1F2E] flex items-center gap-1"><Star size={10} fill="#7B1F2E" /> Important</span>}
                        <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500">{n.category}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{n.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{n.content}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Calendar size={10} /> {n.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ======================== SUCCESS GALLERY ========================
export function SuccessGalleryPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await api.get('/testimonials');
        setTestimonials(data);
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) return <TestimonialSkeleton />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
      <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Success Gallery</h1>
          <p className="text-red-200">Real students, real scholarships, real success stories</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { value: "500+", label: "Students Guided" }, { value: "95%", label: "Success Rate" }, { value: "25+", label: "Countries" }
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-black mb-1" style={{ color: "#7B1F2E" }}>{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <TestimonialSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map(t => (
              <div key={t.id || t._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.program}</p>
                    <p className="text-xs font-medium" style={{ color: "#7B1F2E" }}>{t.university}</p>
                  </div>
                </div>
                <div className="flex mb-2">{[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#7B1F2E" color="#7B1F2E" />)}</div>
                <p className="text-sm text-gray-600 italic mb-3">"{t.feedback}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{t.country} • {t.year}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.status === "Enrolled" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ======================== ABOUT PAGE ========================
export function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
      <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-3">About RizQara Global Education</h1>
          <p className="text-red-200 max-w-2xl mx-auto leading-relaxed">
            Bangladesh's premier scholarship portal and study abroad consultancy, dedicated to helping students achieve their global education dreams.
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              RizQara Global Education was founded with a single mission: to make study abroad accessible and achievable for every Bangladeshi student, regardless of their financial background.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe every student deserves accurate, verified information and genuine guidance — not false promises. Our platform combines cutting-edge technology with expert human guidance to deliver the most comprehensive scholarship service in Bangladesh.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <GraduationCap size={24} />, title: "1000+ Scholarships", desc: "Verified from official sources" },
              { icon: <Globe size={24} />, title: "25+ Countries", desc: "Study destinations covered" },
              { icon: <Users size={24} />, title: "500+ Students", desc: "Successfully guided" },
              { icon: <CheckCircle size={24} />, title: "95% Success Rate", desc: "Application success rate" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                <div className="text-[#7B1F2E] mb-2 flex justify-center">{s.icon}</div>
                <div className="font-bold text-gray-900 text-sm">{s.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-5">Why We're Different</h3>
          <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <Search size={20} />, title: "Verified Information", desc: "Every scholarship listed is verified directly from official government and university sources. No outdated or inaccurate information." },
                { icon: <Bot size={20} />, title: "AI-Powered Matching", desc: "Our intelligent system matches students with the most suitable scholarships based on their complete profile and preferences." },
                { icon: <UserCheck size={20} />, title: "Dedicated Advisors", desc: "Each student gets a personal advisor who guides them through the entire process from profile evaluation to visa approval." },
                { icon: <BarChart3 size={20} />, title: "Real-time Tracking", desc: "Students can track every step of their application in real-time through our comprehensive dashboard system." },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-xl" style={{ backgroundColor: "#FDF8F5" }}>
                  <span className="text-[#7B1F2E] mt-1">{item.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold hover:opacity-90 transition" style={{ backgroundColor: "#7B1F2E" }}>
            Start Your Journey with Us <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ======================== FAQ PAGE ========================
export function FAQPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await api.get('/faqs');
        setFaqs(data);
      } catch (err) {
        console.error("Failed to fetch faqs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const cats = ["All", ...Array.from(new Set(faqs.map(f => f.category)))];
  const filtered = faqs.filter(f => {
    const q = search.toLowerCase();
    const matchSearch = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    const matchCat = activeCategory === "All" || f.category === activeCategory;
    return matchSearch && matchCat;
  });

  if (loading) return <GenericGridSkeleton />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
      <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h1>
          <p className="text-red-200 mb-6">Find answers to the most common questions about studying abroad</p>
          <div className="max-w-md mx-auto relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..." className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none border border-gray-100 shadow-sm" />
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {cats.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${activeCategory === c ? "text-white" : "bg-white border border-gray-200 text-gray-600"}`} style={activeCategory === c ? { backgroundColor: "#7B1F2E" } : {}}>
              {c}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {filtered.map(f => (
            <div key={f.id || f._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <button onClick={() => setOpen(open === (f.id || f._id) ? null : (f.id || f._id))} className="w-full flex items-center justify-between px-5 py-4 text-left">
                <span className="text-sm font-semibold text-gray-900 pr-4">{f.question}</span>
                <ChevronRight size={16} className={`text-gray-400 flex-shrink-0 transition-transform ${open === (f.id || f._id) ? "rotate-90" : ""}`} />
              </button>
              {open === (f.id || f._id) && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-gray-600 leading-relaxed">{f.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-8">
            <div className="text-[#7B1F2E] mb-3 flex justify-center"><HelpCircle size={48} /></div>
            <p className="text-gray-500">No questions found. <button onClick={() => setSearch("")} className="underline" style={{ color: "#7B1F2E" }}>Clear search</button></p>
          </div>
        )}
        <div className="mt-8 bg-gradient-to-r from-[#7B1F2E] to-[#3D0F17] rounded-2xl p-6 text-center text-white">
          <h3 className="font-bold mb-2">Still have questions?</h3>
          <p className="text-red-200 text-sm mb-4">Our advisors are ready to help. Contact us anytime.</p>
          <Link to="/contact" className="inline-block px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90" style={{ backgroundColor: "white", color: "#7B1F2E" }}>Ask Our Advisor</Link>
        </div>
      </div>
    </div>
  );
}

// ======================== AI GUIDE PAGE ========================
export function AIGuidePage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ q: string; a: string }>>([]);

  const ask = (q: string) => {
    if (!q.trim()) return;
    const currentQuery = q || query;
    setLoading(true);
    setTimeout(() => {
      const answer = generateResponse(currentQuery);
      setHistory(prev => [{ q: currentQuery, a: answer }, ...prev]);
      setResponse(answer);
      setLoading(false);
      setQuery("");
    }, 1500);
  };

  const generateResponse = (q: string) => {
    const ql = q.toLowerCase();
    if (ql.includes("mext") || ql.includes("japan")) return "MEXT Scholarship 2027 – Japan\n\nStatus: Open (Deadline ~May 2026)\nFunds: Fully Funded: Tuition + ¥117,000-144,000/month + airfare\nDegrees: Bachelor, Master's, PhD, Research\nIELTS: Not required (Embassy screening)\n\nKey Documents Needed:\n• Passport\n• Academic certificates & transcripts\n• Research plan/SOP\n• 2 recommendation letters\n• Medical certificate\n• Photos\n\nProcess: Apply via Japanese Embassy Dhaka → Primary screening → Interview → University placement\n\nRizQara Tip: Strong GPA (4.5+) recommended. Start Japanese basics. Embassy route has better success rate.\n\nDisclaimer: Verify all information from official mext.go.jp website.";
    if (ql.includes("hungary") || ql.includes("stipendium")) return "Stipendium Hungaricum 2027\n\nStatus: Opening November 2026\nFunds: Fully Funded: Tuition + HUF 43,700/month + dorm\nDegrees: Bachelor, Master's, PhD, Foundation\nIELTS: NOT required — MOI accepted!\n\nKey Documents:\n• Passport\n• Academic transcripts\n• MOI certificate from your college\n• Motivation letter (1-2 pages)\n• 2 recommendation letters\n• CV\n• Medical certificate\n• Police clearance\n• Photos\n\nProcess: Apply on Stipendium portal → Select 3 universities → Document upload → Tempus review → University acceptance\n\nRizQara's Top Pick for Bangladeshi students!\nHighest acceptance rate. Easy process. MOI accepted.\n\nDisclaimer: Verify from official stipendiumhungaricum.hu";
    if (ql.includes("no ielts") || ql.includes("moi") || ql.includes("without ielts")) return "Top No-IELTS Scholarship Options for Bangladesh 2027\n\n1. Hungary – Stipendium Hungaricum\n   • MOI Accepted\n   • Fully Funded\n   • High acceptance\n\n2. Romania – Government Scholarship\n   • MOI Accepted\n   • Fully Funded\n   • Easy process\n\n3. Russia – Government Scholarship\n   • No language cert needed\n   • Russian language training provided\n   • Best for MBBS\n\n4. Saudi Arabia – Government\n   • MOI/English cert needed\n   • For Muslim students\n\n5. Turkey – Türkiye Scholarship\n   • English ability test\n   • No IELTS for some programs\n\nHow to get MOI Certificate:\nContact your HSC/Degree college principal → Request English medium instruction letter → Get signed and stamped\n\nDisclaimer: Always verify requirements from official sources.";
    if (ql.includes("mbbs") || ql.includes("medicine") || ql.includes("doctor")) return "MBBS Abroad Without IELTS – Top Options 2027\n\n1. Russia (BEST for MBBS)\n   • 5-6 year program\n   • WHO recognized\n   • Government scholarship available\n   • Russian language training included\n   • Cost: Free (scholarship) or $3,000-6,000/year\n   • Requirements: HSC Biology+Chemistry, good grades\n\n2. Romania\n   • 6 year MD program\n   • EU degree\n   • Government scholarship available\n   • Cost: Free (scholarship) or €4,000-6,000/year\n\n3. Bulgaria\n   • EU medical degree\n   • No IELTS\n   • Self-funded ~€5,000/year\n\n4. Moldova\n   • Budget-friendly option\n   • WHO recognized\n   • ~$3,000/year\n\nImportant:\n• BMDC recognition is crucial — check before applying\n• Total duration: 5-6 years + 1 year internship\n• Required: Good Biology & Chemistry grades\n\nDisclaimer: Verify BMDC recognition before choosing any MBBS program abroad.";
    return "RizQara AI Scholarship Guide\n\nBased on your query, here are our top recommendations for Bangladeshi students in 2027:\n\nBest Fully Funded Scholarships:\n1. Hungary – Stipendium Hungaricum (Easiest, MOI accepted)\n2. Romania – Government Scholarship (High acceptance)\n3. Japan – MEXT (Prestigious, No IELTS)\n4. Russia – Government Scholarship (Best for MBBS)\n5. Turkey – Türkiye Scholarships (Competitive)\n\nGeneral Requirements:\n• MOI certificate from your college/university\n• Academic transcripts (all years)\n• Motivation letter / SOP\n• Recommendation letters (2-3)\n• Valid passport\n• Medical certificate\n• Police clearance (some countries)\n\nStart Now:\n1. Get MOI certificate from your institution\n2. Book a free profile check with RizQara\n3. Start preparing documents early (takes 4-6 weeks)\n\nContact RizQara: +880 1725-350352\nWhatsApp: Chat with our advisors\n\nDisclaimer: This is AI-assisted guidance for initial support. Always verify information from official scholarship websites before applying.";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
      <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-white mb-3 flex justify-center"><Sparkles size={48} /></div>
          <h1 className="text-3xl font-bold text-white mb-2">RizQara AI Guide</h1>
          <p className="text-red-200">Ask anything about scholarships, countries, documents, or visa processes</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
          <div className="p-5 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "MEXT Japan 2027",
                "Stipendium Hungaricum",
                "No IELTS options",
                "MBBS abroad",
                "Fully funded scholarships",
              ].map(q => (
                <button 
                  key={q} 
                  onClick={() => ask(q)} 
                  className="px-3 py-1.5 text-xs rounded-full border font-medium transition-all duration-200 border-[#7B1F2E30] text-[#7B1F2E] hover:bg-[#7B1F2E] hover:text-white active:bg-[#7B1F2E] active:text-white active:scale-95"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div className="p-5">
            <div className="flex gap-2 mb-4">
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && ask(query)} placeholder='e.g., "My GPA is 4.83, no IELTS, what scholarships can I apply for?"' className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#7B1F2E12]" />
              <button onClick={() => ask(query)} disabled={loading} className="px-5 py-3 text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-60 flex items-center gap-2 transition" style={{ backgroundColor: "#7B1F2E" }}>
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Ask AI"}
              </button>
            </div>

            {response && !loading && (
              <div className="rounded-xl p-5" style={{ backgroundColor: "#7B1F2E08", border: "1px solid #7B1F2E15" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={18} className="text-amber-500" />
                  <span className="text-sm font-semibold" style={{ color: "#7B1F2E" }}>RizQara AI</span>
                </div>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{response}</pre>
                <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-100 flex items-center gap-2">
                  <AlertCircle size={14} className="text-yellow-600 flex-shrink-0" />
                  <p className="text-xs text-yellow-700">AI guidance is for initial support only. Verify all information from official sources before applying.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {history.length > 1 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Previous Questions</h3>
            <div className="space-y-3">
              {history.slice(1, 4).map((h, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Q: {h.q}</p>
                  <pre className="text-xs text-gray-500 whitespace-pre-wrap font-sans line-clamp-3">{h.a}</pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}