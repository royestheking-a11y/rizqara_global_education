// RizQara Global Education - Demo Data

export const MAROON = "#7B1F2E";
export const GOLD = "#7B1F2E"; // Standardizing to Maroon

export interface Scholarship {
  _id?: string;
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  university: string;
  degree: string[];
  fundingType: "Fully Funded" | "Partially Funded" | "Self-Funded";
  scholarshipType: "Government" | "University" | "Private" | "Exchange";
  ieltsRequired: boolean;
  moiAccepted: boolean;
  deadline: string;
  intake: string;
  applicationFee: string;
  tuitionFee: string;
  livingCost: string;
  status: "Open" | "Closing Soon" | "Upcoming" | "Closed";
  difficulty: "Easy" | "Medium" | "Competitive" | "Highly Competitive";
  description: string;
  benefits: string[];
  eligibility: string[];
  requiredDocuments: string[];
  applicationSteps: string[];
  subjects: string[];
  officialLink: string;
  image: string;
  matchScore?: number;
  tags: string[];
  stipend?: string;
  accommodation?: boolean;
  healthInsurance?: boolean;
  airTicket?: boolean;
  language?: string;
  daysLeft?: number;
  isVerified: boolean;
  rizqaraNote?: string;
}

export interface Country {
  _id?: string;
  id: string;
  name: string;
  flag: string;
  continent: string;
  tuitionRange: string;
  livingCost: string;
  ieltsRequired: boolean;
  popularSubjects: string[];
  scholarshipCount: number;
  description: string;
  partTimeWork: boolean;
  prPathway: boolean;
  image: string;
  currency: string;
  language: string;
}

export interface BlogPost {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
  excerpt: string;
}

export interface Notice {
  _id?: string;
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  isUrgent: boolean;
  isImportant: boolean;
}

export interface Testimonial {
  _id?: string;
  id: string;
  name: string;
  country: string;
  program: string;
  university: string;
  feedback: string;
  image: string;
  status: "Applied" | "Selected" | "Visa Approved" | "Under Process" | "Enrolled";
  year: string;
}

export interface Service {
  _id?: string;
  id: string;
  title: string;
  description: string;
  icon: string;
  price?: string;
  features: string[];
  isFree: boolean;
}

export interface FAQItem {
  _id?: string;
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface HeroSlide {
  _id?: string;
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  cta1: string;
  cta2: string;
  bgGradient: string;
  image: string;
  badgeIcon: string;
  badge: string;
}

// ======================== HERO CAROUSEL ========================
export const heroSlidesData: HeroSlide[] = [
  {
    id: "h1",
    title: "Find the Right Scholarship.",
    highlight: "Apply with Confidence.",
    subtitle: "Government Scholarship · University Admission · Visa Support",
    cta1: "Explore Scholarships",
    cta2: "Free Profile Check",
    bgGradient: "linear-gradient(135deg, #7B1F2E 0%, #3D0F17 100%)",
    image: "https://images.unsplash.com/photo-1523050335102-c32509b45f09?w=1200",
    badgeIcon: "GraduationCap",
    badge: "1,000+ Scholarships Listed",
  },
  {
    id: "h2",
    title: "No IELTS? Still Want",
    highlight: "to Study Abroad?",
    subtitle: "Find countries & universities based on your profile — IELTS not required.",
    cta1: "Check Eligibility",
    cta2: "No IELTS Options",
    bgGradient: "linear-gradient(135deg, #1A3A5C 0%, #0D2040 100%)",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200",
    badgeIcon: "FileCheck",
    badge: "19+ No IELTS Scholarships",
  },
  {
    id: "h3",
    title: "Apply Smart.",
    highlight: "Apply Right.",
    subtitle: "Step-by-step guidance for scholarship applications by experienced consultants.",
    cta1: "Start Your Journey",
    cta2: "See Success Stories",
    bgGradient: "linear-gradient(135deg, #1A3A2A 0%, #0D2018 100%)",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200",
    badgeIcon: "CheckCircle",
    badge: "500+ Success Stories",
  },
  {
    id: "h4",
    title: "Track Your Application",
    highlight: "Every Step of the Way.",
    subtitle: "See every step from document check to final submission on your dashboard.",
    cta1: "Create Account",
    cta2: "See Dashboard",
    bgGradient: "linear-gradient(135deg, #3D2A1A 0%, #1A1208 100%)",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200",
    badgeIcon: "BarChart3",
    badge: "Real-time Tracking",
  },
];

// ======================== SCHOLARSHIPS ========================
export const scholarships: Scholarship[] = [
  {
    id: "mext-2027",
    name: "MEXT Scholarship 2027",
    country: "Japan",
    countryFlag: "🇯🇵",
    university: "Various National Universities",
    degree: ["Bachelor", "Master's", "PhD", "Research"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: false,
    moiAccepted: true,
    deadline: "2026-05-30",
    intake: "April 2027",
    applicationFee: "Free",
    tuitionFee: "¥0 (Full Waiver)",
    livingCost: "¥117,000/month stipend",
    status: "Open",
    difficulty: "Competitive",
    description: "The MEXT (Monbukagakusho) Scholarship is one of Japan's most prestigious government scholarships, offered by the Japanese Ministry of Education. It covers all academic expenses and provides a monthly stipend for the entire study period.",
    benefits: ["Full tuition waiver", "Monthly stipend ¥117,000-¥144,000", "Round-trip airfare", "Accommodation support", "Japanese language training", "Health insurance"],
    eligibility: ["Age 17-34 for undergrad, 35 for grad", "Strong academic background", "Interest in Japan/Japanese culture", "No concurrent scholarship holder", "In good health"],
    requiredDocuments: ["Passport", "Academic certificates", "Transcripts", "Recommendation letters (2)", "Research plan/SOP", "Medical certificate", "Photo"],
    applicationSteps: ["Submit application to Embassy", "Embassy screening", "Primary screening documents", "Interview at Embassy", "University placement", "Final selection", "Pre-departure orientation"],
    subjects: ["Engineering", "Science", "Medicine", "Arts", "Social Science", "Agriculture", "Education"],
    officialLink: "https://www.mext.go.jp/en/policy/education/highered/title02/detail02/sdetail02/1373897.htm",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
    matchScore: 88,
    tags: ["No IELTS", "Fully Funded", "Government", "Japan", "Top Pick"],
    stipend: "¥117,000 - ¥144,000/month",
    accommodation: true,
    healthInsurance: true,
    airTicket: true,
    language: "Japanese/English",
    daysLeft: 18,
    isVerified: true,
    rizqaraNote: "Highly recommended for students with GPA 4.5+. Embassy route has better acceptance rate. Prepare Japanese language basics."
  },
  {
    id: "hungary-stipendium-2027",
    name: "Stipendium Hungaricum 2027",
    country: "Hungary",
    countryFlag: "🇭🇺",
    university: "All Hungarian Universities",
    degree: ["Bachelor", "Master's", "PhD", "Foundation"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: false,
    moiAccepted: true,
    deadline: "2027-01-15",
    intake: "September 2027",
    applicationFee: "Free",
    tuitionFee: "€0 (Full Waiver)",
    livingCost: "€150-300/month from scholarship",
    status: "Upcoming",
    difficulty: "Medium",
    description: "Stipendium Hungaricum is Hungary's premier government scholarship program offering full study grants to students from partner countries. Bangladesh is a partner country with excellent acceptance rates.",
    benefits: ["Full tuition waiver", "Monthly stipend HUF 43,700", "Dormitory accommodation", "Health insurance", "No IELTS required with MOI"],
    eligibility: ["Any degree level", "Strong academic record", "MOI certificate or IELTS 5.5+", "Under 45 years of age"],
    requiredDocuments: ["Passport", "Degree certificates", "Transcripts", "MOI/IELTS certificate", "Motivation letter", "CV", "Reference letters", "Medical certificate"],
    applicationSteps: ["Apply on Stipendium portal", "Select 3 universities", "Upload documents", "Tempus Foundation screening", "University acceptance", "Scholarship confirmation"],
    subjects: ["Medicine", "Engineering", "IT", "Business", "Agriculture", "Arts", "Law"],
    officialLink: "https://stipendiumhungaricum.hu/",
    image: "https://images.unsplash.com/photo-1551867633-194f125bddfa?q=80&w=800&auto=format&fit=crop",
    matchScore: 92,
    tags: ["No IELTS", "Fully Funded", "Europe", "Easy Apply", "Popular"],
    stipend: "HUF 43,700/month",
    accommodation: true,
    healthInsurance: true,
    airTicket: false,
    language: "English/Hungarian",
    daysLeft: 245,
    isVerified: true,
    rizqaraNote: "Best option for Bangladeshi students! MOI is accepted. High acceptance rate. Medical and engineering programs are excellent."
  },
  {
    id: "turkey-turkiye-scholarship",
    name: "Türkiye Scholarships 2027",
    country: "Turkey",
    countryFlag: "🇹🇷",
    university: "Top Turkish Universities",
    degree: ["Bachelor", "Master's", "PhD"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: false,
    moiAccepted: false,
    deadline: "2027-02-20",
    intake: "September/October 2027",
    applicationFee: "Free",
    tuitionFee: "₺0 (Full Waiver)",
    livingCost: "₺1,200-3,500/month stipend",
    status: "Upcoming",
    difficulty: "Competitive",
    description: "Türkiye Scholarships is a highly competitive government-funded scholarship program offering full coverage for international students to study at prestigious Turkish universities.",
    benefits: ["Full tuition waiver", "Monthly stipend", "Free accommodation", "Health insurance", "Turkish language course", "Return flight"],
    eligibility: ["Academic GPA 70%+ for bachelor", "55%+ for master/PhD medical", "Under 21 for bachelor, 30 for master"],
    requiredDocuments: ["Passport", "Diploma", "Transcript", "Language certificate", "Motivation letter", "Reference letters", "Photo"],
    applicationSteps: ["Register on scholarships.gov.tr", "Complete profile", "Upload documents", "Select programs", "Wait for result", "Placement", "Visa"],
    subjects: ["Engineering", "Medicine", "Social Sciences", "Natural Sciences", "Arts", "Business"],
    officialLink: "https://www.turkiyeburslari.gov.tr/",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop",
    matchScore: 79,
    tags: ["Fully Funded", "Government", "Europe", "Middle East", "Competitive"],
    stipend: "₺1,200-3,500/month",
    accommodation: true,
    healthInsurance: true,
    airTicket: true,
    language: "English/Turkish",
    daysLeft: 285,
    isVerified: true,
    rizqaraNote: "Very popular among Bangladeshi students. Apply early as competition is high from South Asia."
  },
  {
    id: "russia-government-scholarship",
    name: "Russian Government Scholarship 2027",
    country: "Russia",
    countryFlag: "🇷🇺",
    university: "125+ Russian Universities",
    degree: ["Bachelor", "Master's", "PhD", "Residency"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: false,
    moiAccepted: false,
    deadline: "2027-03-01",
    intake: "September 2027",
    applicationFee: "Free",
    tuitionFee: "₽0 (Full Waiver)",
    livingCost: "₽1,500-3,000/month stipend",
    status: "Upcoming",
    difficulty: "Medium",
    description: "The Russian Government Scholarship offers comprehensive funding for international students at Russia's top universities including MSU, SPbU, and medical institutions famous for MBBS programs.",
    benefits: ["Full tuition waiver", "Dormitory accommodation", "Monthly stipend", "Health insurance", "Russian language preparatory year"],
    eligibility: ["Under 35 for bachelor, 40 for master/PhD", "Good academic record", "Good health condition", "No IELTS required - Russian language training provided"],
    requiredDocuments: ["Passport", "Diploma/Certificate", "Transcripts", "Medical certificate", "HIV test", "Recommendation letter", "Photos"],
    applicationSteps: ["Apply via Rossotrudnichestvo", "Embassy nomination", "University selection", "Document verification", "Enrollment order", "Visa processing"],
    subjects: ["Medicine (MBBS)", "Engineering", "Natural Sciences", "Humanities", "Arts", "Economics"],
    officialLink: "https://education-in-russia.com/",
    image: "https://images.unsplash.com/photo-1512495039889-52a3b799c9bc?q=80&w=800&auto=format&fit=crop",
    matchScore: 75,
    tags: ["MBBS", "No IELTS", "Fully Funded", "Government", "Medical"],
    stipend: "₽1,500-3,000/month",
    accommodation: true,
    healthInsurance: true,
    airTicket: false,
    language: "Russian (Training provided)",
    daysLeft: 295,
    isVerified: true,
    rizqaraNote: "Best for MBBS aspirants. No IELTS required. Russian language course included. Medical universities are globally recognized."
  },
  {
    id: "saudi-king-abdullah-scholarship",
    name: "Saudi Arabia Government Scholarship",
    country: "Saudi Arabia",
    countryFlag: "🇸🇦",
    university: "King Abdulaziz University & Others",
    degree: ["Bachelor", "Master's", "PhD"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: false,
    moiAccepted: true,
    deadline: "2026-06-15",
    intake: "September 2026",
    applicationFee: "Free",
    tuitionFee: "Full Waiver",
    livingCost: "SAR 850/month",
    status: "Closing Soon",
    difficulty: "Competitive",
    description: "Saudi Arabia offers government scholarships through its universities for international Muslim students. The scholarship covers full tuition, accommodation, monthly allowance and return flight.",
    benefits: ["Full tuition waiver", "Monthly allowance SAR 850", "Free housing", "Health coverage", "Return air ticket", "Book allowance"],
    eligibility: ["Muslim", "Under 25 for bachelor, 40 for master/PhD", "Strong academic record", "Arabic language knowledge preferred"],
    requiredDocuments: ["Passport", "Islamic certificate/letter", "Academic certificates", "Transcripts", "Medical report", "Police clearance", "Recommendation letters"],
    applicationSteps: ["Contact Saudi Embassy", "Submit application form", "Document verification", "Embassy recommendation", "University placement", "Visa"],
    subjects: ["Islamic Studies", "Arabic Language", "Engineering", "Medicine", "Business", "Computer Science"],
    officialLink: "https://edugate.moe.gov.sa/",
    image: "https://images.unsplash.com/photo-1586724230021-4c3838663c58?auto=format&fit=crop&w=1200&q=80",
    matchScore: 71,
    tags: ["No IELTS", "Fully Funded", "Muslim Countries", "Middle East", "Closing Soon"],
    stipend: "SAR 850/month",
    accommodation: true,
    healthInsurance: true,
    airTicket: true,
    language: "Arabic/English",
    daysLeft: 10,
    isVerified: true,
    rizqaraNote: "Excellent for Muslim students. Arabic language knowledge is a plus. Documents must be attested and translated."
  },
  {
    id: "romania-government-scholarship",
    name: "Romanian Government Scholarship 2027",
    country: "Romania",
    countryFlag: "🇷🇴",
    university: "Romanian State Universities",
    degree: ["Bachelor", "Master's", "PhD"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: false,
    moiAccepted: true,
    deadline: "2027-03-31",
    intake: "October 2027",
    applicationFee: "Free",
    tuitionFee: "Full Waiver",
    livingCost: "€65-85/month",
    status: "Upcoming",
    difficulty: "Easy",
    description: "Romania offers government scholarships to international students through a bilateral agreement. This is one of the most accessible European scholarships for Bangladeshi students with an acceptance rate above 60%.",
    benefits: ["Full tuition waiver", "Dormitory accommodation", "Monthly allowance €65-85", "Romanian language preparatory year included"],
    eligibility: ["Under 35", "Min GPA requirement", "MOI or IELTS 5.0+", "Good health"],
    requiredDocuments: ["Passport", "Degree certificates", "Transcripts", "MOI certificate", "Motivation letter", "Medical certificate", "Police clearance", "Photos"],
    applicationSteps: ["Apply via Romanian Embassy Dhaka", "Document submission", "Embassy nomination", "University placement", "Visa process"],
    subjects: ["Medicine", "Engineering", "Science", "Arts", "Law", "Economic Sciences"],
    officialLink: "https://www.studiiinanglish.ro/",
    image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=1200&q=80",
    matchScore: 85,
    tags: ["Easy Apply", "No IELTS", "Europe", "Government", "High Acceptance"],
    stipend: "€65-85/month",
    accommodation: true,
    healthInsurance: false,
    airTicket: false,
    language: "English/Romanian",
    daysLeft: 325,
    isVerified: true,
    rizqaraNote: "Highest acceptance rate for Bangladeshi students. Easy process, MOI accepted. Strong medical and engineering programs."
  },
  {
    id: "china-csc-scholarship",
    name: "Chinese Government Scholarship (CSC) 2027",
    country: "China",
    countryFlag: "🇨🇳",
    university: "Top Chinese Universities",
    degree: ["Bachelor", "Master's", "PhD"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: false,
    moiAccepted: false,
    deadline: "2027-03-15",
    intake: "September 2027",
    applicationFee: "Free",
    tuitionFee: "¥0",
    livingCost: "¥1,500-3,500/month",
    status: "Upcoming",
    difficulty: "Competitive",
    description: "China Scholarship Council (CSC) offers comprehensive scholarships at top Chinese universities for international students to pursue bachelor, master's, and doctoral degrees.",
    benefits: ["Full tuition waiver", "Monthly stipend ¥1,500-3,500", "Accommodation", "Health insurance", "Accidental injury insurance"],
    eligibility: ["Non-Chinese citizen", "Age requirements by degree", "Good academic standing", "Good health"],
    requiredDocuments: ["Passport", "Highest diploma", "Transcripts", "Language certificate", "Recommendation letters", "Study plan", "Medical exam form"],
    applicationSteps: ["Apply on CSC portal", "Apply to universities directly", "Receive acceptance letter", "CSC review", "Admission notice", "Visa"],
    subjects: ["Engineering", "Medicine", "Sciences", "Arts", "Business", "Law", "Agriculture"],
    officialLink: "https://www.campuschina.org/",
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800&auto=format&fit=crop",
    matchScore: 77,
    tags: ["Fully Funded", "Government", "Asia", "China", "Competitive"],
    stipend: "¥1,500-3,500/month",
    accommodation: true,
    healthInsurance: true,
    airTicket: false,
    language: "Chinese/English",
    daysLeft: 305,
    isVerified: true,
    rizqaraNote: "Very competitive. Prepare a strong study plan. Chinese language knowledge is a big advantage for university scholarships."
  },
  {
    id: "korea-gks-scholarship",
    name: "Korean Government Scholarship (GKS) 2027",
    country: "South Korea",
    countryFlag: "🇰🇷",
    university: "Korean Universities",
    degree: ["Bachelor", "Master's", "PhD"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: false,
    moiAccepted: false,
    deadline: "2027-02-28",
    intake: "March/September 2027",
    applicationFee: "Free",
    tuitionFee: "₩0",
    livingCost: "₩900,000/month",
    status: "Upcoming",
    difficulty: "Highly Competitive",
    description: "The Korean Government Scholarship (GKS/KGSP) is a prestigious scholarship that covers all educational and living expenses for international students at Korean universities.",
    benefits: ["Full tuition", "Monthly allowance ₩900,000", "Airfare", "Accommodation", "Medical insurance", "Korean language training", "Settlement allowance"],
    eligibility: ["Under 25 for undergrad, 40 for grad", "GPA 80%+", "Not a Korean citizen", "Good health"],
    requiredDocuments: ["Passport", "Personal statement", "Study plan", "Diploma", "Transcripts", "Recommendation letters", "Medical certificate"],
    applicationSteps: ["Embassy application", "NIIED screening", "Korean language test", "University placement", "Final acceptance", "Pre-departure"],
    subjects: ["Engineering", "Sciences", "Business", "Arts", "Korean Studies", "Medicine"],
    officialLink: "https://www.studyinkorea.go.kr/",
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80",
    matchScore: 65,
    tags: ["Fully Funded", "Asia", "Highly Competitive", "Korea", "K-Culture"],
    stipend: "₩900,000/month",
    accommodation: true,
    healthInsurance: true,
    airTicket: true,
    language: "Korean (Training) / English",
    daysLeft: 292,
    isVerified: true,
    rizqaraNote: "Very competitive. Need strong English scores and impressive academic record. K-pop and culture interest adds to application."
  }
];

// ======================== COUNTRIES ========================
export const countries: Country[] = [
  { id: "japan", name: "Japan", flag: "🇯🇵", continent: "Asia", tuitionRange: "¥0 (Fully Funded Available)", livingCost: "¥80,000-150,000/month", ieltsRequired: false, popularSubjects: ["Engineering", "Science", "Technology", "Medicine"], scholarshipCount: 12, description: "Japan offers world-class education with the prestigious MEXT scholarship. No IELTS required for government scholarships.", partTimeWork: true, prPathway: true, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop", currency: "JPY", language: "Japanese/English" },
  { id: "hungary", name: "Hungary", flag: "🇭🇺", continent: "Europe", tuitionRange: "Free (Stipendium Hungaricum)", livingCost: "€300-600/month", ieltsRequired: false, popularSubjects: ["Medicine", "Engineering", "IT", "Business"], scholarshipCount: 8, description: "Hungary's Stipendium Hungaricum is the easiest fully-funded European scholarship for Bangladeshi students. MOI accepted.", partTimeWork: true, prPathway: false, image: "https://images.unsplash.com/photo-1551867633-194f125bddfa?q=80&w=800&auto=format&fit=crop", currency: "HUF", language: "English/Hungarian" },
  { id: "turkey", name: "Turkey", flag: "🇹🇷", continent: "Europe/Asia", tuitionRange: "Free (Govt Scholarship)", livingCost: "₺5,000-10,000/month", ieltsRequired: false, popularSubjects: ["Engineering", "Medicine", "Social Sciences", "Arts"], scholarshipCount: 10, description: "Turkey bridges East and West with excellent universities and generous Türkiye Scholarships covering all expenses.", partTimeWork: false, prPathway: false, image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop", currency: "TRY", language: "Turkish/English" },
  { id: "russia", name: "Russia", flag: "🇷🇺", continent: "Europe/Asia", tuitionRange: "Free (Govt) / $2,000-8,000/year", livingCost: "$300-600/month", ieltsRequired: false, popularSubjects: ["Medicine (MBBS)", "Engineering", "Natural Sciences"], scholarshipCount: 9, description: "Russia is the top destination for MBBS abroad without IELTS. Russian government scholarships include language training.", partTimeWork: false, prPathway: false, image: "https://images.unsplash.com/photo-1512495039889-52a3b799c9bc?q=80&w=800&auto=format&fit=crop", currency: "RUB", language: "Russian (training provided)" },
  { id: "romania", name: "Romania", flag: "🇷🇴", continent: "Europe", tuitionRange: "Free (Govt Scholarship)", livingCost: "€300-500/month", ieltsRequired: false, popularSubjects: ["Medicine", "Engineering", "Science", "Law"], scholarshipCount: 6, description: "Romania offers the highest acceptance rate European scholarship for Bangladeshi students. MOI accepted and easy process.", partTimeWork: true, prPathway: false, image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=1200&q=80", currency: "RON", language: "English/Romanian" },
  { id: "saudi-arabia", name: "Saudi Arabia", flag: "🇸🇦", continent: "Middle East", tuitionRange: "Free (Govt Scholarship)", livingCost: "SAR 800-1,500/month", ieltsRequired: false, popularSubjects: ["Islamic Studies", "Medicine", "Engineering", "Business"], scholarshipCount: 5, description: "Saudi Arabia offers generous scholarships for Muslim students with full coverage including accommodation and stipend.", partTimeWork: false, prPathway: false, image: "https://images.unsplash.com/photo-1586724230021-4c3838663c58?auto=format&fit=crop&w=1200&q=80", currency: "SAR", language: "Arabic/English" },
  { id: "china", name: "China", flag: "🇨🇳", continent: "Asia", tuitionRange: "Free (CSC) / $3,000-10,000/year", livingCost: "¥2,000-5,000/month", ieltsRequired: false, popularSubjects: ["Engineering", "Medicine", "Business", "Sciences"], scholarshipCount: 15, description: "China offers the most scholarships globally through CSC. No IELTS for Chinese language programs. Many English programs available.", partTimeWork: false, prPathway: false, image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800&auto=format&fit=crop", currency: "CNY", language: "Chinese/English" },
  { id: "germany", name: "Germany", flag: "🇩🇪", continent: "Europe", tuitionRange: "€0-1,500/semester (public)", livingCost: "€800-1,200/month", ieltsRequired: true, popularSubjects: ["Engineering", "Science", "Business", "Arts"], scholarshipCount: 7, description: "Germany offers almost free education at public universities. DAAD scholarships are available for outstanding students.", partTimeWork: true, prPathway: true, image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop", currency: "EUR", language: "German/English" },
  { id: "malaysia", name: "Malaysia", flag: "🇲🇾", continent: "Asia", tuitionRange: "$3,000-8,000/year", livingCost: "$400-700/month", ieltsRequired: false, popularSubjects: ["Engineering", "Business", "IT", "Medicine"], scholarshipCount: 5, description: "Malaysia is a budget-friendly option with English-medium education and no IELTS for many programs.", partTimeWork: true, prPathway: false, image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=800&auto=format&fit=crop", currency: "MYR", language: "English/Malay" },
  { id: "south-korea", name: "South Korea", flag: "🇰🇷", continent: "Asia", tuitionRange: "Free (GKS) / $3,000-7,000/year", livingCost: "₩500,000-1,000,000/month", ieltsRequired: false, popularSubjects: ["Engineering", "Technology", "Business", "Korean Studies"], scholarshipCount: 8, description: "South Korea offers the GKS scholarship with full funding. Growing tech ecosystem and vibrant culture.", partTimeWork: true, prPathway: false, image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80", currency: "KRW", language: "Korean/English" }
];

// ======================== BLOG POSTS ========================
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to Apply for MEXT Scholarship from Bangladesh – Complete Guide 2027",
    slug: "mext-scholarship-bangladesh-guide-2027",
    category: "Scholarship Guide",
    excerpt: "MEXT is Japan's government scholarship — one of the most prestigious in Asia. Here's a complete step-by-step guide for Bangladeshi students.",
    content: "MEXT Scholarship is fully funded by the Japanese government...",
    image: "https://images.unsplash.com/photo-1526481280693-3bfa75ac8efd?q=80&w=800&auto=format&fit=crop",
    date: "May 10, 2026",
    readTime: "8 min read",
    author: "RizQara Research Team",
    tags: ["MEXT", "Japan", "Fully Funded", "No IELTS"]
  },
  {
    id: "2",
    title: "Best Countries to Study Abroad Without IELTS in 2027",
    slug: "study-abroad-without-ielts-2027",
    category: "No IELTS Study Abroad",
    excerpt: "Don't have IELTS? You can still study in Europe, Asia, and the Middle East. Here are the top 10 countries that accept MOI or don't require IELTS.",
    content: "Many Bangladeshi students assume IELTS is mandatory for studying abroad...",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    date: "May 8, 2026",
    readTime: "6 min read",
    author: "RizQara Research Team",
    tags: ["No IELTS", "MOI", "Study Abroad", "Guide"]
  },
  {
    id: "3",
    title: "SOP Writing Guide for Scholarship Applications – Tips & Samples",
    slug: "sop-writing-guide-scholarship",
    category: "SOP & CV Tips",
    excerpt: "Your Statement of Purpose (SOP) can make or break your scholarship application. Learn how to write a compelling SOP that wins scholarships.",
    content: "A Statement of Purpose is your chance to speak directly to the scholarship committee...",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop",
    date: "May 5, 2026",
    readTime: "10 min read",
    author: "RizQara SOP Expert",
    tags: ["SOP", "CV", "Application Tips", "Writing"]
  },
  {
    id: "4",
    title: "MBBS Abroad Without IELTS – Russia, Romania, Bangladesh Guide",
    slug: "mbbs-abroad-without-ielts",
    category: "MBBS Abroad",
    excerpt: "Want to become a doctor abroad without IELTS? Russia and Romania are your best options. Complete cost, process, and recognition guide.",
    content: "MBBS abroad is a dream for thousands of Bangladeshi students...",
    image: "https://images.unsplash.com/photo-1576091160550-2173bdd99625?q=80&w=800&auto=format&fit=crop",
    date: "May 2, 2026",
    readTime: "7 min read",
    author: "RizQara Medical Team",
    tags: ["MBBS", "Russia", "Romania", "No IELTS", "Medicine"]
  },
  {
    id: "5",
    title: "Stipendium Hungaricum 2027 – Complete Application Guide for Bangladesh",
    slug: "stipendium-hungaricum-2027-bangladesh",
    category: "Scholarship Guide",
    excerpt: "Stipendium Hungaricum is Hungary's flagship scholarship — the best option for Bangladeshi students looking for a funded European education.",
    content: "Stipendium Hungaricum is offered by the Hungarian government to students from partner countries...",
    image: "https://images.unsplash.com/photo-1551867633-194f125bddfa?q=80&w=800&auto=format&fit=crop",
    date: "April 28, 2026",
    readTime: "9 min read",
    author: "RizQara Research Team",
    tags: ["Hungary", "Stipendium", "Europe", "Fully Funded"]
  },
  {
    id: "6",
    title: "Low Budget Study Abroad Options for Bangladeshi Students in 2027",
    slug: "low-budget-study-abroad-bangladeshi-students",
    category: "Country Guide",
    excerpt: "Studying abroad on a budget is possible! Here are the most affordable countries and programs with scholarships for Bangladeshi students.",
    content: "Many students think studying abroad requires huge financial resources...",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
    date: "April 25, 2026",
    readTime: "5 min read",
    author: "RizQara Research Team",
    tags: ["Low Budget", "Affordable", "Scholarship", "Bangladesh"]
  }
];

// ======================== NOTICES ========================
export const notices: Notice[] = [
  {
    id: "1",
    title: "Saudi Arabia Scholarship Deadline – Only 10 Days Left!",
    content: "Students interested in Saudi Arabia Government Scholarship 2026 must submit their complete documents by June 15, 2026. Do not delay. Contact RizQara immediately for document preparation assistance.",
    category: "Deadline Reminder",
    date: "May 12, 2026",
    isUrgent: true,
    isImportant: true
  },
  {
    id: "2",
    title: "MEXT Scholarship 2027 – Application Now Open",
    content: "Japan's MEXT Scholarship applications are now open. Bangladeshi students can apply through the Japanese Embassy Dhaka. The deadline is approximately end of May 2026. Start preparing your documents now.",
    category: "New Scholarship Open",
    date: "May 10, 2026",
    isUrgent: false,
    isImportant: true
  },
  {
    id: "3",
    title: "Free Profile Check – Limited Slots Available",
    content: "RizQara Global Education is offering free profile evaluation for scholarship matching. Only 20 slots available for May 2026. Book your slot now before it fills up.",
    category: "RizQara Announcement",
    date: "May 8, 2026",
    isUrgent: false,
    isImportant: false
  },
  {
    id: "4",
    title: "Romania Embassy – Document Authentication Update",
    content: "Romanian Embassy Dhaka has updated their document authentication requirements. All certificates must now be authenticated by the Ministry of Foreign Affairs before submission.",
    category: "Embassy Update",
    date: "May 6, 2026",
    isUrgent: true,
    isImportant: true
  },
  {
    id: "5",
    title: "Stipendium Hungaricum 2027 – Registration Opens in November",
    content: "Hungary's flagship scholarship program for 2027 will open registration in November 2026. Start preparing your documents early: transcripts, MOI certificate, motivation letter, and recommendation letters.",
    category: "Upcoming Scholarship",
    date: "May 4, 2026",
    isUrgent: false,
    isImportant: true
  }
];

// ======================== TESTIMONIALS ========================
export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Md. Rahul Islam",
    country: "Hungary",
    program: "BSc Computer Engineering",
    university: "Budapest University of Technology",
    feedback: "RizQara helped me get the Stipendium Hungaricum scholarship! They guided me through every document, helped write my motivation letter, and supported me until I got my visa. I'm now studying in Budapest!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop&crop=faces",
    status: "Enrolled",
    year: "2025"
  },
  {
    id: "2",
    name: "Fatima Akter",
    country: "Russia",
    program: "MBBS",
    university: "Kazan Federal University",
    feedback: "I dreamed of becoming a doctor but couldn't afford IELTS preparation. RizQara showed me the Russian Government Scholarship path. Now I'm in my 3rd year of MBBS in Kazan!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop&crop=faces",
    status: "Enrolled",
    year: "2024"
  },
  {
    id: "3",
    name: "Arif Hossain",
    country: "Romania",
    program: "MBA",
    university: "Bucharest University",
    feedback: "The Romanian Government Scholarship seemed impossible to me. But RizQara's step-by-step guidance made it happen. Visa approved, now living in Romania!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop&crop=faces",
    status: "Visa Approved",
    year: "2025"
  },
  {
    id: "4",
    name: "Sumaiya Begum",
    country: "Turkey",
    program: "Master's in International Relations",
    university: "Ankara University",
    feedback: "Türkiye Scholarship is highly competitive but RizQara's team helped me craft a winning application. My SOP was perfected by their experts. Thank you RizQara!",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop&crop=faces",
    status: "Enrolled",
    year: "2025"
  },
  {
    id: "5",
    name: "Imran Khan",
    country: "Japan",
    program: "Master's in Mechanical Engineering",
    university: "Osaka University",
    feedback: "MEXT is one of the most prestigious scholarships in Asia. I applied with RizQara's guidance and got accepted! My research plan was written with their expert help.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop&crop=faces",
    status: "Enrolled",
    year: "2024"
  },
  {
    id: "6",
    name: "Nazia Rahman",
    country: "Saudi Arabia",
    program: "BSc Medicine",
    university: "King Abdulaziz University",
    feedback: "Getting into KAU without RizQara's help would have been nearly impossible for me. They prepared all my documents perfectly and I got the scholarship!",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop&crop=faces",
    status: "Visa Approved",
    year: "2026"
  }
];

// ======================== SERVICES ========================
export const services: Service[] = [
  {
    id: "free-profile-check",
    title: "Free Profile Check",
    description: "Get your academic profile evaluated by our experts and discover which scholarships and countries match your profile.",
    icon: "UserCheck",
    price: "Free",
    features: ["Profile evaluation within 48 hours", "Scholarship match recommendations", "Country suggestion based on your profile", "Initial guidance call"],
    isFree: true
  },
  {
    id: "full-scholarship-guidance",
    title: "Full Scholarship Guidance",
    description: "End-to-end scholarship application support from document preparation to final submission and visa guidance.",
    icon: "GraduationCap",
    price: "৳ 15,000 - 25,000",
    features: ["Profile evaluation & scholarship selection", "Document checklist & review", "SOP & CV writing support", "Application form assistance", "Interview preparation", "Visa file guidance", "Dashboard tracking"],
    isFree: false
  },
  {
    id: "sop-cv-service",
    title: "SOP & CV Writing",
    description: "Professional Statement of Purpose and CV preparation by scholarship application experts.",
    icon: "FileText",
    price: "৳ 3,000 - 8,000",
    features: ["Custom SOP for target scholarship", "Professional CV formatting", "Motivation letter writing", "Unlimited revisions", "Plagiarism-free writing"],
    isFree: false
  },
  {
    id: "visa-guidance",
    title: "Visa File Guidance",
    description: "Complete visa application support including document preparation, form filling, and embassy interview preparation.",
    icon: "Plane",
    price: "৳ 5,000 - 10,000",
    features: ["Visa document checklist", "Form filling assistance", "Financial document guidance", "Embassy interview prep", "SOP for visa", "Insurance guidance"],
    isFree: false
  },
  {
    id: "document-preparation",
    title: "Document Preparation",
    description: "Complete document preparation service including translation, attestation guidance, and document formatting.",
    icon: "FolderOpen",
    price: "৳ 2,000 - 5,000",
    features: ["Document checklist creation", "Translation guidance", "Attestation process guide", "Notarization support", "Document formatting"],
    isFree: false
  },
  {
    id: "interview-preparation",
    title: "Interview Preparation",
    description: "Mock interview sessions with scholarship and visa interview coaching by experienced counselors.",
    icon: "MessageCircle",
    price: "৳ 2,000 - 4,000",
    features: ["Mock interview sessions (3)", "Common question preparation", "Confidence building tips", "Body language guidance", "Feedback & improvement"],
    isFree: false
  }
];

// ======================== FAQ ========================
export const faqs: FAQItem[] = [
  { id: "1", question: "Can I study abroad without IELTS?", answer: "Yes! Many countries like Japan (MEXT), Hungary (Stipendium Hungaricum), Romania, Russia, Turkey, and Saudi Arabia accept MOI (Medium of Instruction) certificate instead of IELTS for government scholarships. RizQara will guide you on which options match your profile.", category: "General" },
  { id: "2", question: "What is a MOI certificate and who issues it?", answer: "MOI (Medium of Instruction) certificate is a document from your previous educational institution stating that your medium of instruction was English. Your school or college principal issues this. It is accepted by many European and Asian universities as proof of English proficiency.", category: "Documents" },
  { id: "3", question: "Can I apply with a low budget?", answer: "Absolutely! Countries like Russia, Romania, Hungary, Turkey, and Saudi Arabia offer fully funded scholarships with no tuition fees and monthly stipends. The only cost may be visa fees, flight, and initial living expenses (approximately BDT 1-3 lakhs).", category: "Financial" },
  { id: "4", question: "Do all scholarships cover full tuition?", answer: "Not all. There are three types: Fully Funded (tuition + accommodation + stipend), Partially Funded (only tuition or only accommodation), and Self-Funded (no financial support). RizQara focuses on fully funded opportunities for Bangladeshi students.", category: "Scholarships" },
  { id: "5", question: "What documents are typically needed for scholarship applications?", answer: "Basic documents include: Passport, SSC & HSC certificates and mark sheets, CV, SOP/Motivation letter, Recommendation letters (2-3), MOI or IELTS certificate, Medical certificate, Police clearance, and photos. Additional documents may be required per scholarship.", category: "Documents" },
  { id: "6", question: "Can RizQara apply on my behalf?", answer: "RizQara guides and supports the application process. We help you prepare all documents, fill forms, and submit applications. However, some scholarship portals require personal login, so we guide you through the submission process together.", category: "Services" },
  { id: "7", question: "How can I track my application?", answer: "Once you register on RizQara's platform, you get access to a personal student dashboard where you can track your application status, view pending documents, communicate with your advisor, and see every step of the process.", category: "Dashboard" },
  { id: "8", question: "Is the profile check really free?", answer: "Yes! RizQara offers a completely free profile evaluation for all students. Just fill out the Free Profile Check form with your academic details and we will review your profile and suggest suitable scholarships within 48 hours.", category: "Services" },
  { id: "9", question: "Which countries are best for Bangladeshi students?", answer: "Based on acceptance rates and affordability, the best countries are: Hungary (Stipendium - highest acceptance), Romania (easy process, fully funded), Russia (MBBS, no IELTS), Turkey (good universities), Japan (MEXT, prestigious), and Saudi Arabia (for Muslim students).", category: "Countries" },
  { id: "10", question: "Can I apply for multiple scholarships at once?", answer: "Yes, you can apply for multiple scholarships simultaneously. In fact, we recommend applying to 3-5 scholarships to maximize your chances. RizQara's dashboard helps you track all your applications in one place.", category: "Scholarships" },
  { id: "11", question: "Is MBBS abroad possible without IELTS?", answer: "Yes! Russia and Romania are the best destinations for MBBS without IELTS. Russian government scholarships include a Russian language preparatory year. Both countries have WHO-recognized medical universities.", category: "MBBS" },
  { id: "12", question: "How do I know if a scholarship is legitimate?", answer: "All scholarships listed on RizQara are verified from official government and university sources. Look for the 'Verified' badge on scholarship cards. Always check the official website link provided on each scholarship details page.", category: "Scholarships" }
];

// ======================== DEMO USERS ========================
export const demoStudents = [
  {
    id: "student-001",
    name: "Md. Karim Hossain",
    email: "karim@example.com",
    phone: "+880 1712-345678",
    country: "Bangladesh",
    educationLevel: "HSC Completed",
    gpa: "4.83",
    targetDegree: "Bachelor",
    targetCountry: "Hungary",
    targetSubject: "Computer Engineering",
    ieltsStatus: "No IELTS",
    budget: "5 lakh",
    passportStatus: "Have Passport",
    preferredIntake: "September 2027",
    profileCompletion: 72,
    applications: [
      { scholarshipId: "hungary-stipendium-2027", status: "Document Checking", progress: 40, advisor: "RizQara Team" }
    ],
    savedScholarships: ["hungary-stipendium-2027", "romania-government-scholarship"],
    documents: {
      passport: "uploaded",
      sscCertificate: "approved",
      hscCertificate: "uploaded",
      cv: "pending",
      sop: "pending",
      recommendationLetter: "not_uploaded",
      moiCertificate: "uploaded"
    },
    notifications: [
      { id: "n1", message: "Your HSC certificate has been approved!", date: "May 11, 2026", isRead: false },
      { id: "n2", message: "Please upload your CV to proceed.", date: "May 10, 2026", isRead: false },
      { id: "n3", message: "Hungary scholarship deadline is approaching.", date: "May 8, 2026", isRead: true }
    ]
  }
];

export const demoAdmin = {
  email: "admin@rizqara.com",
  password: "admin123",
  name: "RizQara Admin",
  role: "admin"
};

export const scholarshipCategories = [
  { id: "government", title: "Government Scholarships", icon: "Landmark", description: "Official government-funded scholarships from Japan, Hungary, Turkey, Russia and more.", count: 24 },
  { id: "university", title: "University Scholarships", icon: "GraduationCap", description: "Direct university scholarships and merit-based awards.", count: 18 },
  { id: "fully-funded", title: "Fully Funded", icon: "Banknote", description: "100% coverage including tuition, accommodation, stipend and more.", count: 21 },
  { id: "no-ielts", title: "No IELTS Required", icon: "FileCheck", description: "Scholarships where IELTS is not mandatory or MOI is accepted.", count: 19 },
  { id: "bachelor", title: "Bachelor Programs", icon: "Book", description: "Undergraduate scholarship opportunities worldwide.", count: 15 },
  { id: "masters", title: "Master's Programs", icon: "FlaskConical", description: "Postgraduate scholarship opportunities for master's degrees.", count: 16 },
  { id: "phd", title: "PhD Scholarships", icon: "Microscope", description: "Doctoral research scholarships at world-class universities.", count: 12 },
  { id: "mbbs", title: "MBBS Abroad", icon: "Stethoscope", description: "Medical degree programs abroad, especially Russia and Romania.", count: 8 },
  { id: "europe", title: "Europe Scholarships", icon: "Globe", description: "Study in European countries with low or zero tuition fees.", count: 20 },
  { id: "asia", title: "Asia Scholarships", icon: "Map", description: "Japan, China, Korea, Malaysia and other Asian countries.", count: 17 },
  { id: "low-budget", title: "Low Budget Study", icon: "Coins", description: "Affordable study abroad options for budget-conscious students.", count: 14 },
  { id: "foundation", title: "Foundation Programs", icon: "Building", description: "Foundation and pre-university programs leading to degree enrollment.", count: 6 }
];
