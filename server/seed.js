const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scholarship = require('./models/Scholarship');
const Country = require('./models/Country');
const BlogPost = require('./models/BlogPost');
const Notice = require('./models/Notice');
const Testimonial = require('./models/Testimonial');
const Service = require('./models/Service');
const FAQ = require('./models/FAQ');
const HeroSlide = require('./models/HeroSlide');
const Category = require('./models/Category');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const heroSlidesData = [
  {
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
];

const scholarships = [
  {
    name: "Fulbright Foreign Student Program 2027",
    country: "USA",
    countryFlag: "🇺🇸",
    university: "Various US Universities",
    degree: ["Master's", "PhD"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: true,
    moiAccepted: false,
    deadline: "2026-08-01",
    intake: "Fall 2027",
    applicationFee: "Free",
    tuitionFee: "$0 (Full Waiver)",
    livingCost: "Full monthly stipend",
    status: "Upcoming",
    difficulty: "Competitive",
    description: "The Fulbright Program is the flagship international educational exchange program sponsored by the U.S. government. It provides full funding for graduate students and young professionals.",
    benefits: ["Full tuition", "Stipend", "Airfare", "Health insurance"],
    subjects: ["All Subjects except Medicine"],
    officialLink: "https://foreign.fulbrightonline.org/",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
    tags: ["Fully Funded", "USA", "Prestigious"],
    isVerified: true
  },
  {
    name: "Chevening Scholarships 2027",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    university: "Any UK University",
    degree: ["Master's"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: true,
    moiAccepted: true,
    deadline: "2026-11-03",
    intake: "September 2027",
    applicationFee: "Free",
    tuitionFee: "£0 (Full Waiver)",
    livingCost: "Full monthly stipend",
    status: "Upcoming",
    difficulty: "Competitive",
    description: "Chevening is the UK government's international awards program aimed at developing global leaders. It offers full funding for a one-year Master's degree at any UK university.",
    benefits: ["Full tuition", "Monthly stipend", "Airfare", "Visa costs"],
    subjects: ["Leadership", "Business", "Development", "Public Policy"],
    officialLink: "https://www.chevening.org/",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
    tags: ["Fully Funded", "UK", "Leadership"],
    isVerified: true
  },
  {
    name: "Commonwealth Master's Scholarships",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    university: "Participating UK Universities",
    degree: ["Master's"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: true,
    moiAccepted: true,
    deadline: "2026-10-15",
    intake: "September 2027",
    applicationFee: "Free",
    tuitionFee: "£0 (Full Waiver)",
    livingCost: "£1,347/month stipend",
    status: "Upcoming",
    difficulty: "Competitive",
    description: "Funded by the UK Foreign, Commonwealth & Development Office, these scholarships are for talented individuals from low and middle-income Commonwealth countries.",
    benefits: ["Full tuition", "Monthly stipend", "Airfare", "Warm clothing allowance"],
    subjects: ["Development", "Education", "Healthcare", "Infrastructure"],
    officialLink: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/",
    image: "https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800",
    tags: ["Fully Funded", "Commonwealth", "UK"],
    isVerified: true
  },
  {
    name: "Australia Awards Scholarships",
    country: "Australia",
    countryFlag: "🇦🇺",
    university: "Various Australian Universities",
    degree: ["Master's", "PhD"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: true,
    moiAccepted: false,
    deadline: "2026-04-30",
    intake: "Early 2027",
    applicationFee: "Free",
    tuitionFee: "$0 (Full Waiver)",
    livingCost: "Full monthly stipend",
    status: "Upcoming",
    difficulty: "Competitive",
    description: "Australia Awards Scholarships are long-term awards administered by the Department of Foreign Affairs and Trade.",
    benefits: ["Full tuition", "Stipend", "Airfare", "Contribution to living expenses"],
    subjects: ["Health", "Environment", "Infrastructure", "Education"],
    officialLink: "https://www.dfat.gov.au/people-to-people/australia-awards",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800",
    tags: ["Fully Funded", "Australia", "Government"],
    isVerified: true
  },
  {
    name: "Erasmus Mundus Joint Master's",
    country: "Europe",
    countryFlag: "🇪🇺",
    university: "Consortium of European Universities",
    degree: ["Master's"],
    fundingType: "Fully Funded",
    scholarshipType: "University",
    ieltsRequired: true,
    moiAccepted: true,
    deadline: "2027-02-15",
    intake: "September 2027",
    applicationFee: "Free",
    tuitionFee: "€0 (Full Waiver)",
    livingCost: "€1,400/month stipend",
    status: "Upcoming",
    difficulty: "Medium",
    description: "Study at least in two different European countries and get a double or joint degree.",
    benefits: ["Full tuition", "Monthly stipend", "Travel & installation costs"],
    subjects: ["Science", "IT", "Environment", "Engineering"],
    officialLink: "https://erasmus-plus.ec.europa.eu/",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
    tags: ["Fully Funded", "Europe", "Multi-country"],
    isVerified: true
  },
  {
    name: "DAAD EPOS Scholarships",
    country: "Germany",
    countryFlag: "🇩🇪",
    university: "Selected German Universities",
    degree: ["Master's", "PhD"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: true,
    moiAccepted: true,
    deadline: "2026-09-30",
    intake: "Winter 2027",
    applicationFee: "Free",
    tuitionFee: "€0 (Full Waiver)",
    livingCost: "€934/month stipend",
    status: "Upcoming",
    difficulty: "Competitive",
    description: "DAAD offers a range of scholarships for international students from developing countries.",
    benefits: ["Full tuition", "Stipend", "Insurance", "Travel allowance"],
    subjects: ["Development", "Health", "Engineering"],
    officialLink: "https://www.daad.de/",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800",
    tags: ["Fully Funded", "Germany", "Development"],
    isVerified: true
  },
  {
    name: "Türkiye Burslari 2027",
    country: "Turkey",
    countryFlag: "🇹🇷",
    university: "Top Turkish Universities",
    degree: ["Bachelor", "Master's", "PhD"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: false,
    moiAccepted: false,
    deadline: "2027-02-20",
    intake: "September 2027",
    applicationFee: "Free",
    tuitionFee: "₺0 (Full Waiver)",
    livingCost: "Monthly stipend provided",
    status: "Upcoming",
    difficulty: "Medium",
    description: "A government-funded scholarship program for international students to study in Turkey.",
    benefits: ["Full tuition", "Accommodation", "Stipend", "Turkish language course"],
    subjects: ["All Subjects"],
    officialLink: "https://www.turkiyeburslari.gov.tr/",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800",
    tags: ["Fully Funded", "Turkey", "No IELTS"],
    isVerified: true
  },
  {
    name: "Global Korea Scholarship (GKS)",
    country: "South Korea",
    countryFlag: "🇰🇷",
    university: "South Korean Universities",
    degree: ["Bachelor", "Master's", "PhD"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: false,
    moiAccepted: true,
    deadline: "2027-03-31",
    intake: "September 2027",
    applicationFee: "Free",
    tuitionFee: "₩0 (Full Waiver)",
    livingCost: "Full monthly stipend",
    status: "Upcoming",
    difficulty: "Medium",
    description: "The Global Korea Scholarship provides international students with an opportunity to conduct advanced studies at higher educational institutions in Korea.",
    benefits: ["Full tuition", "Stipend", "Airfare", "Korean language training"],
    subjects: ["STEM", "Humanities", "Arts"],
    officialLink: "https://www.studyinkorea.go.kr/",
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200",
    tags: ["Fully Funded", "Korea", "No IELTS"],
    isVerified: true
  },
  {
    name: "Chinese Government Scholarship (CSC)",
    country: "China",
    countryFlag: "🇨🇳",
    university: "Chinese Universities",
    degree: ["Bachelor", "Master's", "PhD"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: false,
    moiAccepted: true,
    deadline: "2027-02-15",
    intake: "September 2027",
    applicationFee: "Free",
    tuitionFee: "¥0 (Full Waiver)",
    livingCost: "Full monthly stipend",
    status: "Upcoming",
    difficulty: "Medium",
    description: "Scholarships for international students to study in China.",
    benefits: ["Full tuition", "Accommodation", "Stipend", "Medical insurance"],
    subjects: ["All Subjects"],
    officialLink: "http://www.campuschina.org/",
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800",
    tags: ["Fully Funded", "China", "Government"],
    isVerified: true
  },
  {
    name: "New Zealand Scholarships",
    country: "New Zealand",
    countryFlag: "🇳🇿",
    university: "Participating NZ Universities",
    degree: ["Master's", "PhD"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: true,
    moiAccepted: false,
    deadline: "2026-05-15",
    intake: "Early 2027",
    applicationFee: "Free",
    tuitionFee: "$0 (Full Waiver)",
    livingCost: "Full monthly stipend",
    status: "Upcoming",
    difficulty: "Competitive",
    description: "Scholarships for citizens from developing countries to study in New Zealand.",
    benefits: ["Full tuition", "Stipend", "Establishment allowance", "Travel"],
    subjects: ["Development", "Climate Change", "Governance"],
    officialLink: "https://www.nzscholarships.govt.nz/",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800",
    tags: ["Fully Funded", "New Zealand", "Development"],
    isVerified: true
  },
  {
    name: "Swiss Govt Excellence Scholarship",
    country: "Switzerland",
    countryFlag: "🇨🇭",
    university: "Swiss Public Universities",
    degree: ["PhD", "Research"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: true,
    moiAccepted: true,
    deadline: "2026-11-30",
    intake: "Fall 2027",
    applicationFee: "Free",
    tuitionFee: "CHF 0 (Full Waiver)",
    livingCost: "CHF 1,920/month stipend",
    status: "Upcoming",
    difficulty: "Competitive",
    description: "Postgraduate scholarships for foreign researchers in all academic disciplines.",
    benefits: ["Stipend", "Insurance", "Travel allowance"],
    subjects: ["Research", "All Subjects"],
    officialLink: "https://www.sbfi.admin.ch/scholarships_eng",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
    tags: ["Fully Funded", "Switzerland", "Research"],
    isVerified: true
  },
  {
    name: "SINGA 2027",
    country: "Singapore",
    countryFlag: "🇸🇬",
    university: "NUS, NTU, SUTD, SMU",
    degree: ["PhD"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: false,
    moiAccepted: true,
    deadline: "2026-06-01",
    intake: "January 2027",
    applicationFee: "Free",
    tuitionFee: "$0 (Full Waiver)",
    livingCost: "S$2,200 - S$2,700/month",
    status: "Upcoming",
    difficulty: "Competitive",
    description: "Singapore International Graduate Award for research in Science and Engineering.",
    benefits: ["Full tuition", "Stipend", "Airfare", "Settling-in allowance"],
    subjects: ["Science", "Engineering"],
    officialLink: "https://www.a-star.edu.sg/Scholarships",
    image: "https://images.unsplash.com/photo-1512100356956-c1227c330289?w=800",
    tags: ["Fully Funded", "Singapore", "STEM"],
    isVerified: true
  },
  {
    name: "Lester B. Pearson Scholarship",
    country: "Canada",
    countryFlag: "🇨🇦",
    university: "University of Toronto",
    degree: ["Bachelor"],
    fundingType: "Fully Funded",
    scholarshipType: "University",
    ieltsRequired: true,
    moiAccepted: false,
    deadline: "2027-01-15",
    intake: "Fall 2027",
    applicationFee: "Free",
    tuitionFee: "$0 (Full Waiver)",
    livingCost: "Books, incidental fees, and full residence support",
    status: "Upcoming",
    difficulty: "Competitive",
    description: "The University of Toronto's most prestigious and competitive scholarship for international students.",
    benefits: ["Tuition", "Books", "Residence"],
    subjects: ["All Undergraduate Subjects"],
    officialLink: "https://future.utoronto.ca/pearson/",
    image: "https://images.unsplash.com/photo-1503614472-8c97d4d18d71?w=800",
    tags: ["Fully Funded", "Canada", "Prestigious"],
    isVerified: true
  },
  {
    name: "Knight-Hennessy Scholars",
    country: "USA",
    countryFlag: "🇺🇸",
    university: "Stanford University",
    degree: ["Master's", "PhD"],
    fundingType: "Fully Funded",
    scholarshipType: "University",
    ieltsRequired: true,
    moiAccepted: false,
    deadline: "2026-10-15",
    intake: "Fall 2027",
    applicationFee: "Free",
    tuitionFee: "$0 (Full Waiver)",
    livingCost: "Full monthly stipend and academic expenses",
    status: "Upcoming",
    difficulty: "Highly Competitive",
    description: "A multidisciplinary community of graduate students at Stanford University.",
    benefits: ["Full tuition", "Stipend", "Travel grants"],
    subjects: ["All Graduate Subjects"],
    officialLink: "https://knight-hennessy.stanford.edu/",
    image: "https://images.unsplash.com/photo-1533664488202-6af66d26c44a?w=800",
    tags: ["Fully Funded", "USA", "Leadership"],
    isVerified: true
  },
  {
    name: "GREAT Scholarships 2027",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    university: "Participating UK Universities",
    degree: ["Master's"],
    fundingType: "Partially Funded",
    scholarshipType: "Government",
    ieltsRequired: true,
    moiAccepted: true,
    deadline: "2027-05-30",
    intake: "September 2027",
    applicationFee: "Free",
    tuitionFee: "£10,000 reduction",
    livingCost: "Student's responsibility",
    status: "Upcoming",
    difficulty: "Medium",
    description: "Scholarships for international students to pursue postgraduate degrees in the UK.",
    benefits: ["£10,000 towards tuition"],
    subjects: ["Various Subjects"],
    officialLink: "https://study-uk.britishcouncil.org/scholarships-funding/great-scholarships",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    tags: ["UK", "Partial Funding"],
    isVerified: true
  },
  {
    name: "Adelaide Global Excellence",
    country: "Australia",
    countryFlag: "🇦🇺",
    university: "University of Adelaide",
    degree: ["Bachelor", "Master's"],
    fundingType: "Partially Funded",
    scholarshipType: "University",
    ieltsRequired: true,
    moiAccepted: false,
    deadline: "2027-06-30",
    intake: "Semester 2 2027",
    applicationFee: "$0",
    tuitionFee: "50% reduction",
    livingCost: "Student's responsibility",
    status: "Upcoming",
    difficulty: "Medium",
    description: "Merit-based scholarships for high-achieving international students.",
    benefits: ["50% tuition waiver"],
    subjects: ["All Subjects"],
    officialLink: "https://www.adelaide.edu.au/scholarships/international/",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800",
    tags: ["Australia", "Merit-based"],
    isVerified: true
  },
  {
    name: "Bocconi Merit Awards",
    country: "Italy",
    countryFlag: "🇮🇹",
    university: "Bocconi University",
    degree: ["Master's"],
    fundingType: "Fully Funded",
    scholarshipType: "University",
    ieltsRequired: false,
    moiAccepted: true,
    deadline: "2027-04-15",
    intake: "Fall 2027",
    applicationFee: "€100",
    tuitionFee: "€0 (Full Waiver)",
    livingCost: "Full living stipend",
    status: "Upcoming",
    difficulty: "Medium",
    description: "Merit-based awards for international students based on academic profile.",
    benefits: ["Full tuition", "Stipend"],
    subjects: ["Business", "Economics", "Law"],
    officialLink: "https://www.unibocconi.eu/scholarships",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800",
    tags: ["Italy", "Fully Funded", "Business"],
    isVerified: true
  },
  {
    name: "University of Calgary Entrance",
    country: "Canada",
    countryFlag: "🇨🇦",
    university: "University of Calgary",
    degree: ["Bachelor"],
    fundingType: "Partially Funded",
    scholarshipType: "University",
    ieltsRequired: true,
    moiAccepted: false,
    deadline: "2026-12-01",
    intake: "Fall 2027",
    applicationFee: "$145",
    tuitionFee: "$20,000 reduction",
    livingCost: "Student's responsibility",
    status: "Upcoming",
    difficulty: "Medium",
    description: "Awards for high-achieving international students entering undergraduate programs.",
    benefits: ["$20,000 award"],
    subjects: ["All Subjects"],
    officialLink: "https://www.ucalgary.ca/registrar/finances/awards",
    image: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=800",
    tags: ["Canada", "Entrance Award"],
    isVerified: true
  },
  {
    name: "NL Scholarship 2027",
    country: "Netherlands",
    countryFlag: "🇳🇱",
    university: "Participating Dutch Universities",
    degree: ["Bachelor", "Master's"],
    fundingType: "Partially Funded",
    scholarshipType: "Government",
    ieltsRequired: true,
    moiAccepted: true,
    deadline: "2027-02-01",
    intake: "Fall 2027",
    applicationFee: "Varies",
    tuitionFee: "€5,000 award",
    livingCost: "Student's responsibility",
    status: "Upcoming",
    difficulty: "Medium",
    description: "Financed by the Dutch Ministry of Education for non-EEA students.",
    benefits: ["€5,000 towards study costs"],
    subjects: ["All Subjects"],
    officialLink: "https://www.studyinnl.org/scholarships/nl-scholarship",
    image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800",
    tags: ["Netherlands", "Government Award"],
    isVerified: true
  },
  {
    name: "Stipendium Hungaricum 2027",
    country: "Hungary",
    countryFlag: "🇭🇺",
    university: "Hungarian Universities",
    degree: ["Bachelor", "Master's", "PhD"],
    fundingType: "Fully Funded",
    scholarshipType: "Government",
    ieltsRequired: false,
    moiAccepted: true,
    deadline: "2027-01-15",
    intake: "September 2027",
    applicationFee: "Free",
    tuitionFee: "€0 (Full Waiver)",
    livingCost: "Full monthly stipend and accommodation",
    status: "Upcoming",
    difficulty: "Medium",
    description: "Hungary's most prestigious government scholarship for international students.",
    benefits: ["Full tuition", "Accommodation", "Stipend", "Health insurance"],
    subjects: ["Medicine", "Engineering", "Arts", "IT"],
    officialLink: "https://stipendiumhungaricum.hu/",
    image: "https://images.unsplash.com/photo-1551867633-194f125bddfa?w=800",
    tags: ["Fully Funded", "Hungary", "No IELTS"],
    isVerified: true
  }
];

const countries = [
  { name: "USA", flag: "🇺🇸", continent: "North America", tuitionRange: "$20,000-50,000", livingCost: "$1,200-2,000/month", ieltsRequired: true, popularSubjects: ["STEM", "Business", "Arts"], scholarshipCount: 25, description: "Home to Ivy League and world-class research institutions.", partTimeWork: true, prPathway: true, image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800", currency: "USD", language: "English" },
  { name: "United Kingdom", flag: "🇬🇧", continent: "Europe", tuitionRange: "£10,000-30,000", livingCost: "£800-1,300/month", ieltsRequired: true, popularSubjects: ["Law", "Medicine", "Business"], scholarshipCount: 20, description: "Rich academic history and top-ranked universities.", partTimeWork: true, prPathway: true, image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800", currency: "GBP", language: "English" },
  { name: "Australia", flag: "🇦🇺", continent: "Oceania", tuitionRange: "$20,000-40,000", livingCost: "$1,200-1,800/month", ieltsRequired: true, popularSubjects: ["Nursing", "IT", "Engineering"], scholarshipCount: 18, description: "Vibrant lifestyle and excellent post-study work options.", partTimeWork: true, prPathway: true, image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800", currency: "AUD", language: "English" },
  { name: "Canada", flag: "🇨🇦", continent: "North America", tuitionRange: "$15,000-35,000", livingCost: "$1,000-1,500/month", ieltsRequired: true, popularSubjects: ["IT", "Project Management", "Health"], scholarshipCount: 22, description: "Friendly environment and high immigration success rate.", partTimeWork: true, prPathway: true, image: "https://images.unsplash.com/photo-1503614472-8c97d4d18d71?auto=format&fit=crop&w=1200&q=80", currency: "CAD", language: "English/French" },
  { name: "Germany", flag: "🇩🇪", continent: "Europe", tuitionRange: "Free - €3,000", livingCost: "€800-1,100/month", ieltsRequired: true, popularSubjects: ["Engineering", "Renewable Energy"], scholarshipCount: 15, description: "Industrial hub with almost free higher education.", partTimeWork: true, prPathway: true, image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800", currency: "EUR", language: "German/English" },
  { name: "Japan", flag: "🇯🇵", continent: "Asia", tuitionRange: "Free - ¥5,000", livingCost: "¥80,000-140,000/month", ieltsRequired: false, popularSubjects: ["Robotics", "Technology"], scholarshipCount: 12, description: "Ancient culture meets future technology.", partTimeWork: true, prPathway: true, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800", currency: "JPY", language: "Japanese/English" },
  { name: "Hungary", flag: "🇭🇺", continent: "Europe", tuitionRange: "Free (Govt)", livingCost: "€300-500/month", ieltsRequired: false, popularSubjects: ["Medicine", "Business"], scholarshipCount: 10, description: "Gateway to European education with full scholarships.", partTimeWork: true, prPathway: false, image: "https://images.unsplash.com/photo-1551867633-194f125bddfa?w=800", currency: "HUF", language: "English/Hungarian" },
  { name: "Turkey", flag: "🇹🇷", continent: "Europe/Asia", tuitionRange: "Free (Govt)", livingCost: "₺5,000-8,000/month", ieltsRequired: false, popularSubjects: ["Engineering", "Social Science"], scholarshipCount: 9, description: "Bridges two continents with quality education.", partTimeWork: false, prPathway: false, image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800", currency: "TRY", language: "Turkish/English" },
  { name: "Russia", flag: "🇷🇺", continent: "Europe/Asia", tuitionRange: "Free - $5,000", livingCost: "$300-500/month", ieltsRequired: false, popularSubjects: ["Medicine", "Aerospace"], scholarshipCount: 11, description: "Affordable and internationally recognized degrees.", partTimeWork: false, prPathway: false, image: "https://images.unsplash.com/photo-1512495039889-52a3b799c9bc?w=800", currency: "RUB", language: "Russian" },
  { name: "Romania", flag: "🇷🇴", continent: "Europe", tuitionRange: "Free - €4,000", livingCost: "€300-450/month", ieltsRequired: false, popularSubjects: ["MBBS", "Engineering"], scholarshipCount: 7, description: "Top European destination for medical studies.", partTimeWork: true, prPathway: false, image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=1200", currency: "RON", language: "Romanian/English" },
  { name: "Saudi Arabia", flag: "🇸🇦", continent: "Middle East", tuitionRange: "Free", livingCost: "Covered", ieltsRequired: false, popularSubjects: ["Islamic Studies", "Engineering"], scholarshipCount: 8, description: "Generous scholarships for international students.", partTimeWork: false, prPathway: false, image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800", currency: "SAR", language: "Arabic/English" },
  { name: "China", flag: "🇨🇳", continent: "Asia", tuitionRange: "Free - ¥10,000", livingCost: "¥2,000-4,000/month", ieltsRequired: false, popularSubjects: ["Engineering", "Mandarin"], scholarshipCount: 30, description: "Rapidly growing educational hub in Asia.", partTimeWork: false, prPathway: false, image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800", currency: "CNY", language: "Chinese/English" },
  { name: "South Korea", flag: "🇰🇷", continent: "Asia", tuitionRange: "Free - ₩5M", livingCost: "₩600,000-900,000/month", ieltsRequired: false, popularSubjects: ["IT", "K-Culture"], scholarshipCount: 10, description: "Innovative education and dynamic tech industry.", partTimeWork: true, prPathway: false, image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200", currency: "KRW", language: "Korean/English" },
  { name: "Singapore", flag: "🇸🇬", continent: "Asia", tuitionRange: "$10,000-30,000", livingCost: "$1,200-1,800/month", ieltsRequired: true, popularSubjects: ["Finance", "Engineering"], scholarshipCount: 12, description: "World-class education in a global city-state.", partTimeWork: true, prPathway: true, image: "https://images.unsplash.com/photo-1525625232717-1c6cc4c0a3ae?auto=format&fit=crop&w=1200&q=80", currency: "SGD", language: "English/Mandarin" },
  { name: "Italy", flag: "🇮🇹", continent: "Europe", tuitionRange: "Free - €4,000", livingCost: "€500-800/month", ieltsRequired: false, popularSubjects: ["Fashion", "Design", "Physics"], scholarshipCount: 14, description: "Cradle of Western civilization and modern design.", partTimeWork: true, prPathway: false, image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800", currency: "EUR", language: "Italian/English" },
  { name: "France", flag: "🇫🇷", continent: "Europe", tuitionRange: "Free - €10,000", livingCost: "€600-1,000/month", ieltsRequired: false, popularSubjects: ["Business", "Culinary Arts"], scholarshipCount: 13, description: "Excellence in research and artistic heritage.", partTimeWork: true, prPathway: false, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", currency: "EUR", language: "French/English" },
  { name: "Netherlands", flag: "🇳🇱", continent: "Europe", tuitionRange: "€8,000-18,000", livingCost: "€800-1,200/month", ieltsRequired: true, popularSubjects: ["Water Management", "Logistics"], scholarshipCount: 11, description: "Highly innovative education with English-taught programs.", partTimeWork: true, prPathway: true, image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800", currency: "EUR", language: "Dutch/English" },
  { name: "Switzerland", flag: "🇨🇭", continent: "Europe", tuitionRange: "€1,000-4,000", livingCost: "€1,200-1,800/month", ieltsRequired: true, popularSubjects: ["Hospitality", "Finance"], scholarshipCount: 9, description: "Stunning landscapes and high-quality PhD research.", partTimeWork: true, prPathway: false, image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800", currency: "CHF", language: "German/French/English" },
  { name: "New Zealand", flag: "🇳🇿", continent: "Oceania", tuitionRange: "$15,000-35,000", livingCost: "$1,100-1,500/month", ieltsRequired: true, popularSubjects: ["Agriculture", "Environment"], scholarshipCount: 7, description: "Safe and welcoming destination with top-tier research.", partTimeWork: true, prPathway: true, image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800", currency: "NZD", language: "English" },
  { name: "Spain", flag: "🇪🇸", continent: "Europe", tuitionRange: "€1,000-5,000", livingCost: "€600-900/month", ieltsRequired: false, popularSubjects: ["Business", "Sports Science"], scholarshipCount: 8, description: "Vibrant culture and affordable prestigious business schools.", partTimeWork: true, prPathway: false, image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80", currency: "EUR", language: "Spanish/English" }
];

const blogPosts = [
  {
    title: "How to Get a Free Profile Check for Study Abroad",
    slug: "free-profile-check-guide",
    category: "Services",
    excerpt: "Discover how RizQara evaluates your academic profile to find the perfect scholarship matches.",
    content: "A profile check is the first step in your study abroad journey. Our experts look at your GPA, IELTS score, and extracurriculars...",
    image: "/blog/free-profile-check.png",
    date: "May 12, 2026",
    readTime: "5 min read",
    author: "RizQara Expert",
    tags: ["Profile Check", "Admission", "Guidance"]
  },
  {
    title: "Full Scholarship Guidance: Your Roadmap to Success",
    slug: "scholarship-guidance-roadmap",
    category: "Scholarship Guide",
    excerpt: "Learn about the end-to-end support we provide for winning fully-funded international scholarships.",
    content: "Winning a scholarship requires more than just good grades. It requires a strategic approach to applications...",
    image: "/blog/scholarship-guidance.png",
    date: "May 11, 2026",
    readTime: "7 min read",
    author: "RizQara Counselor",
    tags: ["Fully Funded", "Roadmap", "Success"]
  },
  {
    title: "Writing a Winning SOP & CV: Professional Tips",
    slug: "sop-cv-writing-tips",
    category: "Tips",
    excerpt: "Your Statement of Purpose and CV are your voice. Make them count with our professional writing tips.",
    content: "A compelling SOP can overcome a slightly lower GPA. We focus on your story, goals, and potential...",
    image: "/blog/sop-cv-writing.png",
    date: "May 10, 2026",
    readTime: "6 min read",
    author: "RizQara Writer",
    tags: ["SOP", "CV", "Writing"]
  },
  {
    title: "Visa File Guidance: Navigating the Complex Process",
    slug: "visa-guidance-process",
    category: "Visa",
    excerpt: "Don't let visa rejection stop your dreams. Get expert guidance on document preparation and interview tips.",
    content: "Visa processing is often the most stressful part of studying abroad. We simplify it with a checklist and mock interviews...",
    image: "/blog/visa-guidance.png",
    date: "May 09, 2026",
    readTime: "8 min read",
    author: "RizQara Visa Team",
    tags: ["Visa", "Assistance", "Documents"]
  },
  {
    title: "Mastering the Scholarship Interview: Mock Session Benefits",
    slug: "interview-prep-benefits",
    category: "Interview",
    excerpt: "Practice makes perfect. Find out how our mock interviews prepare you for embassy and university panels.",
    content: "Confidence is key during an interview. Our mock sessions simulate real-world scenarios to build your confidence...",
    image: "/blog/interview-prep.png",
    date: "May 08, 2026",
    readTime: "4 min read",
    author: "RizQara Interviewer",
    tags: ["Interview", "Mock Session", "Confidence"]
  }
];

const notices = [
  {
    title: "Chevening Scholarship 2027 Applications Opening Soon!",
    content: "The Chevening Scholarship application cycle for 2027 is expected to open in August. Start preparing your leadership examples now. Contact us for guidance.",
    category: "Scholarship Update",
    date: "May 12, 2026",
    isUrgent: true,
    isImportant: true
  },
  {
    title: "New Batch for IELTS Preparation Starting June 1st",
    content: "Join our intensive 2-month IELTS preparation course. Expert instructors and weekly mock tests. Early bird discount available until May 20th.",
    category: "Training",
    date: "May 11, 2026",
    isUrgent: false,
    isImportant: true
  },
  {
    title: "Free Webinar: How to Write a Winning SOP",
    content: "Join us for a free live webinar on May 25th at 7:00 PM. Our lead writer will share secrets to a successful Statement of Purpose.",
    category: "Event",
    date: "May 10, 2026",
    isUrgent: false,
    isImportant: false
  },
  {
    title: "MEXT Scholarship Interview Call Letters Dispatched",
    content: "The Japanese Embassy has started dispatching interview call letters for the MEXT 2027 cycle. Check your email and post box.",
    category: "Alert",
    date: "May 09, 2026",
    isUrgent: true,
    isImportant: true
  },
  {
    title: "RizQara Office Closed for Eid Holidays",
    content: "Our office will remain closed from June 25th to June 28th for Eid holidays. We will resume normal operations on June 29th.",
    category: "General",
    date: "May 08, 2026",
    isUrgent: false,
    isImportant: false
  }
];

const testimonials = [
  {
    name: "Md. Rahul Islam",
    country: "Hungary",
    program: "BSc Computer Engineering",
    university: "Budapest University of Technology",
    feedback: "RizQara helped me get the Stipendium Hungaricum scholarship! They guided me through every document, helped write my motivation letter, and supported me until I got my visa.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop&crop=faces",
    status: "Enrolled",
    year: "2025"
  },
  {
    name: "Fatima Akter",
    country: "Russia",
    program: "MBBS",
    university: "Kazan Federal University",
    feedback: "I dreamed of becoming a doctor but couldn't afford IELTS. RizQara showed me the Russian Government Scholarship path. Now I'm in my 3rd year!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop&crop=faces",
    status: "Enrolled",
    year: "2024"
  }
];

const services = [
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
    price: "$150 - $250",
    features: ["Profile evaluation & scholarship selection", "Document checklist & review", "SOP & CV writing support", "Application form assistance", "Interview preparation", "Visa file guidance", "Dashboard tracking"],
    isFree: false
  },
  {
    id: "sop-cv-service",
    title: "SOP & CV Writing",
    description: "Professional Statement of Purpose and CV preparation by scholarship application experts.",
    icon: "FileText",
    price: "$30 - $80",
    features: ["Custom SOP for target scholarship", "Professional CV formatting", "Motivation letter writing", "Unlimited revisions", "Plagiarism-free writing"],
    isFree: false
  },
  {
    id: "visa-guidance",
    title: "Visa File Guidance",
    description: "Complete visa application support including document preparation, form filling, and embassy interview preparation.",
    icon: "Plane",
    price: "$50 - $100",
    features: ["Visa document checklist", "Form filling assistance", "Financial document guidance", "Embassy interview prep", "SOP for visa", "Insurance guidance"],
    isFree: false
  },
  {
    id: "document-preparation",
    title: "Document Preparation",
    description: "Complete document preparation service including translation, attestation guidance, and document formatting.",
    icon: "FolderOpen",
    price: "$20 - $50",
    features: ["Document checklist creation", "Translation guidance", "Attestation process guide", "Notarization support", "Document formatting"],
    isFree: false
  },
  {
    id: "interview-preparation",
    title: "Interview Preparation",
    description: "Mock interview sessions with scholarship and visa interview coaching by experienced counselors.",
    icon: "MessageCircle",
    price: "$20 - $40",
    features: ["Mock interview sessions (3)", "Common question preparation", "Confidence building tips", "Body language guidance", "Feedback & improvement"],
    isFree: false
  }
];

const faqs = [
  { 
    question: "Can I study abroad without IELTS?", 
    answer: "Yes! Many countries like Japan (MEXT), Hungary (Stipendium Hungaricum), Romania, Russia, Turkey, and Saudi Arabia accept MOI (Medium of Instruction) certificate instead of IELTS for government scholarships.", 
    category: "General" 
  },
  {
    question: "What is a MOI certificate and how do I get it?",
    answer: "A Medium of Instruction (MOI) certificate is a document issued by your school or college stating that your education was conducted in English. You can request this from your institution's registrar or principal. Many European and Asian universities accept this as proof of English proficiency.",
    category: "Documents"
  },
  {
    question: "Are these scholarships fully funded?",
    answer: "Most government scholarships we assist with (like MEXT Japan, Stipendium Hungaricum, and Romanian Government) are fully funded. This typically covers 100% tuition waiver, monthly living allowance, free accommodation, and sometimes round-trip airfare.",
    category: "Financial"
  },
  {
    question: "Can I apply for more than one scholarship at a time?",
    answer: "Yes, you can and should apply for multiple scholarships to increase your chances. RizQara helps you manage and track multiple applications simultaneously through your student dashboard.",
    category: "General"
  },
  {
    question: "Is there an age limit for scholarship applications?",
    answer: "Age limits vary by country and degree level. Generally, for Bachelor's, the limit is 21-25 years; for Master's, it's 30-35 years; and for PhD, it's 35-45 years. Some countries like Romania have no strict age limit for certain programs.",
    category: "General"
  },
  {
    question: "How much budget do I need for a fully funded scholarship?",
    answer: "While the scholarship covers major costs, you should budget for initial expenses like visa fees, health insurance, airfare (if not covered), and approximately 1-2 months of initial living costs. Typically, $1,500 to $3,000 is sufficient for the entire process.",
    category: "Financial"
  },
  {
    question: "Does RizQara guarantee visa approval?",
    answer: "While no one can guarantee a visa, RizQara has a 95%+ success rate. We provide meticulous document preparation, financial guidance, and mock interview sessions to ensure your file is strong and you are confident.",
    category: "Services"
  },
  {
    question: "What documents are required for the initial profile check?",
    answer: "For a free profile evaluation, you only need to provide your SSC/HSC (or O/A Level) results, target country, and current IELTS status (if any). You don't need to upload full documents until we start the formal application process.",
    category: "Documents"
  },
  {
    question: "Which countries are best for MBBS abroad without IELTS?",
    answer: "Russia and Romania are currently the best destinations for MBBS without IELTS. They offer high-quality medical education recognized by WHO and global medical councils, with significantly lower tuition fees compared to private medical colleges in western countries.",
    category: "Medical"
  }
];

const categories = [
  { name: "Government", icon: "Landmark", description: "Government-funded scholarship programs worldwide.", order: 1 },
  { name: "Fully Funded", icon: "Banknote", description: "Scholarships covering all costs including tuition and living.", order: 2 },
  { name: "No IELTS", icon: "FileCheck", description: "Scholarships that don't require IELTS or accept MOI.", order: 3 },
  { name: "Medical/MBBS", icon: "Stethoscope", description: "Medical programs and healthcare scholarships.", order: 4 },
  { name: "Engineering", icon: "Bot", description: "STEM and technical scholarship opportunities.", order: 5 },
  { name: "PhD/Research", icon: "Search", description: "Advanced research and doctoral grants.", order: 6 },
  { name: "Bachelor", icon: "BookOpen", description: "Undergraduate scholarship opportunities worldwide.", order: 7 },
  { name: "University", icon: "GraduationCap", description: "Direct university scholarships and merit-based awards.", order: 8 },
  { name: "MBA/Business", icon: "Briefcase", description: "Business and management scholarships.", order: 9 },
  { name: "Arts/Design", icon: "Palette", description: "Scholarships for creative arts, music, and design.", order: 10 },
  { name: "Social Science", icon: "Users", description: "Humanities and social science grants.", order: 11 },
  { name: "Law/Legal", icon: "Gavel", description: "Scholarships for legal studies and justice programs.", order: 12 },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Scholarship.deleteMany();
    await Country.deleteMany();
    await BlogPost.deleteMany();
    await Notice.deleteMany();
    await Testimonial.deleteMany();
    await Service.deleteMany();
    await FAQ.deleteMany();
    await HeroSlide.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    await User.create({
      name: 'Admin',
      email: 'admin@rizqara.com',
      password: adminPassword,
      role: 'admin'
    });

    const studentPassword = await bcrypt.hash('student123', salt);
    await User.create({
      name: 'Student Demo',
      email: 'student@rizqara.com',
      password: studentPassword,
      role: 'student',
      educationLevel: 'HSC',
      gpa: '5.00',
      targetCountry: 'Japan',
      ieltsStatus: 'Not Yet'
    });

    await Scholarship.insertMany(scholarships);
    await Country.insertMany(countries);
    await BlogPost.insertMany(blogPosts);
    await Notice.insertMany(notices);
    await Testimonial.insertMany(testimonials);
    await Service.insertMany(services);
    await FAQ.insertMany(faqs);
    await HeroSlide.insertMany(heroSlidesData);
    await Category.insertMany(categories);

    console.log('Seeding completed successfully with updated images and 12 categories!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
