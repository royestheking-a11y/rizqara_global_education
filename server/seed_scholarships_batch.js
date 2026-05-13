const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });
const slugify = require('./utils/slugify');
const Scholarship = require('./models/Scholarship');

const scholarshipsData = [
  { name: "Chevening Scholarship", country: "United Kingdom", countryFlag: "🇬🇧", degree: ["Master's"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: true, status: "Closed", difficulty: "Highly Competitive" },
  { name: "Commonwealth Scholarship", country: "United Kingdom", countryFlag: "🇬🇧", degree: ["Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: true, status: "Closed", difficulty: "Highly Competitive" },
  { name: "Fulbright Foreign Student Program", country: "USA", countryFlag: "🇺🇸", degree: ["Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: true, status: "Upcoming", difficulty: "Highly Competitive" },
  { name: "Hubert H. Humphrey Fellowship", country: "USA", countryFlag: "🇺🇸", degree: ["Fellowship", "Exchange"], fundingType: "Fully Funded", scholarshipType: "Exchange", isVerified: true, ieltsRequired: true, status: "Upcoming", difficulty: "Competitive" },
  { name: "Australia Awards Scholarships", country: "Australia", countryFlag: "🇦🇺", degree: ["Bachelor's", "Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: true, status: "Upcoming", difficulty: "Highly Competitive" },
  { name: "Erasmus Mundus Joint Masters", country: "Europe (Multiple)", countryFlag: "🇪🇺", degree: ["Master's"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: true, status: "Upcoming", difficulty: "Highly Competitive" },
  { name: "MEXT Scholarship", country: "Japan", countryFlag: "🇯🇵", degree: ["Bachelor's", "Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: false, moiAccepted: true, status: "Upcoming", difficulty: "Competitive" },
  { name: "Korean Government Scholarship (GKS/KGSP)", country: "South Korea", countryFlag: "🇰🇷", degree: ["Bachelor's", "Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: false, moiAccepted: true, status: "Upcoming", difficulty: "Competitive" },
  { name: "Turkiye Burslari — Turkey Scholarship", country: "Turkey", countryFlag: "🇹🇷", degree: ["Bachelor's", "Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: false, moiAccepted: true, status: "Closed", difficulty: "Competitive" },
  { name: "Chinese Government Scholarship — CSC", country: "China", countryFlag: "🇨🇳", degree: ["Bachelor's", "Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: false, moiAccepted: true, status: "Open", difficulty: "Medium" },
  { name: "Stipendium Hungaricum", country: "Hungary", countryFlag: "🇭🇺", degree: ["Bachelor's", "Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: true, status: "Closed", difficulty: "Competitive" },
  { name: "Romanian Government Scholarship", country: "Romania", countryFlag: "🇷🇴", degree: ["Bachelor's", "Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: false, moiAccepted: true, status: "Closed", difficulty: "Medium" },
  { name: "Russian Government Scholarship", country: "Russia", countryFlag: "🇷🇺", degree: ["Bachelor's", "Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: false, moiAccepted: true, status: "Closed", difficulty: "Medium" },
  { name: "Azerbaijan Government Scholarship", country: "Azerbaijan", countryFlag: "🇦🇿", degree: ["Bachelor's", "Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: false, moiAccepted: true, status: "Upcoming", difficulty: "Easy" },
  { name: "Italian Government Scholarship", country: "Italy", countryFlag: "🇮🇹", degree: ["Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: true, status: "Upcoming", difficulty: "Competitive" },
  { name: "DAAD Scholarship", country: "Germany", countryFlag: "🇩🇪", degree: ["Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: true, status: "Upcoming", difficulty: "Competitive" },
  { name: "Swedish Institute Scholarship — SISGP", country: "Sweden", countryFlag: "🇸🇪", degree: ["Master's"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: true, status: "Closed", difficulty: "Competitive" },
  { name: "Swiss Government Excellence Scholarship", country: "Switzerland", countryFlag: "🇨🇭", degree: ["PhD", "Postdoc"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: true, status: "Closed", difficulty: "Highly Competitive" },
  { name: "Eiffel Excellence Scholarship", country: "France", countryFlag: "🇫🇷", degree: ["Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: true, status: "Closed", difficulty: "Competitive" },
  { name: "Islamic Development Bank Scholarship — IsDB", country: "International", countryFlag: "🌍", degree: ["Bachelor's", "Master's", "PhD", "Postdoc"], fundingType: "Fully Funded", scholarshipType: "Private", isVerified: true, ieltsRequired: false, status: "Closed", difficulty: "Competitive" },
  { name: "KOICA Scholarship", country: "South Korea", countryFlag: "🇰🇷", degree: ["Master's"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: false, status: "Upcoming", difficulty: "Competitive" },
  { name: "Malaysia International Scholarship — MIS", country: "Malaysia", countryFlag: "🇲🇾", degree: ["Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: false, moiAccepted: true, status: "Upcoming", difficulty: "Medium" },
  { name: "Brunei Government Scholarship", country: "Brunei", countryFlag: "🇧🇳", degree: ["Diploma", "Bachelor's", "Master's"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: false, status: "Closed", difficulty: "Medium" },
  { name: "Gates Cambridge Scholarship", country: "United Kingdom", countryFlag: "🇬🇧", degree: ["Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Private", isVerified: true, ieltsRequired: true, status: "Upcoming", difficulty: "Highly Competitive" },
  { name: "Rhodes Scholarship", country: "United Kingdom", countryFlag: "🇬🇧", degree: ["Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Private", isVerified: true, ieltsRequired: true, status: "Upcoming", difficulty: "Highly Competitive" },
  { name: "Clarendon Scholarship — Oxford", country: "United Kingdom", countryFlag: "🇬🇧", degree: ["Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "University", isVerified: true, ieltsRequired: true, status: "Upcoming", difficulty: "Highly Competitive" },
  { name: "Stanford Knight-Hennessy Scholars", country: "USA", countryFlag: "🇺🇸", degree: ["Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "University", isVerified: true, ieltsRequired: true, status: "Upcoming", difficulty: "Highly Competitive" },
  { name: "Lester B. Pearson Scholarship — University of Toronto", country: "Canada", countryFlag: "🇨🇦", degree: ["Bachelor's"], fundingType: "Fully Funded", scholarshipType: "University", isVerified: true, ieltsRequired: true, status: "Upcoming", difficulty: "Highly Competitive" },
  { name: "Vanier Canada Graduate Scholarship", country: "Canada", countryFlag: "🇨🇦", degree: ["PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: true, status: "Upcoming", difficulty: "Highly Competitive" },
  { name: "Schwarzman Scholars — Tsinghua University, China", country: "China", countryFlag: "🇨🇳", degree: ["Master's"], fundingType: "Fully Funded", scholarshipType: "University", isVerified: true, ieltsRequired: true, status: "Closed", difficulty: "Highly Competitive" },
  { name: "Denys Holland Scholarship — UCL", country: "United Kingdom", countryFlag: "🇬🇧", degree: ["Bachelor's"], fundingType: "Partially Funded", scholarshipType: "University", isVerified: true, ieltsRequired: true, status: "Upcoming", difficulty: "Competitive" },
  { name: "Joint Japan/World Bank Graduate Scholarship", country: "International", countryFlag: "🌍", degree: ["Master's"], fundingType: "Fully Funded", scholarshipType: "Private", isVerified: true, ieltsRequired: true, status: "Closed", difficulty: "Competitive" },
  { name: "OFID Scholarship Award", country: "International", countryFlag: "🌍", degree: ["Master's"], fundingType: "Fully Funded", scholarshipType: "Private", isVerified: true, ieltsRequired: true, status: "Closed", difficulty: "Competitive" },
  { name: "Oxford Centre for Islamic Studies Scholarship — OCIS", country: "United Kingdom", countryFlag: "🇬🇧", degree: ["Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "University", isVerified: true, ieltsRequired: true, status: "Upcoming", difficulty: "Highly Competitive" },
  { name: "Aga Khan Foundation Scholarship", country: "International", countryFlag: "🌍", degree: ["Master's", "PhD"], fundingType: "Partially Funded", scholarshipType: "Private", isVerified: true, ieltsRequired: false, status: "Closed", difficulty: "Competitive" },
  { name: "Holland Scholarship — Netherlands", country: "Netherlands", countryFlag: "🇳🇱", degree: ["Bachelor's", "Master's"], fundingType: "Partially Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: true, status: "Upcoming", difficulty: "Medium" },
  { name: "Transilvania Academica Scholarship — Romania", country: "Romania", countryFlag: "🇷🇴", degree: ["Bachelor's", "Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "University", isVerified: true, ieltsRequired: false, moiAccepted: true, status: "Upcoming", difficulty: "Medium" },
  { name: "Australian Government Research Training Program — RTP", country: "Australia", countryFlag: "🇦🇺", degree: ["Master's", "PhD"], fundingType: "Fully Funded", scholarshipType: "Government", isVerified: true, ieltsRequired: true, status: "Open", difficulty: "Highly Competitive" }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Create scholarships
    for (const data of scholarshipsData) {
      data.slug = slugify(data.name);
      
      // Check if it already exists to avoid duplicates
      const existing = await Scholarship.findOne({ slug: data.slug });
      if (!existing) {
        await Scholarship.create(data);
        console.log(`➕ Added: ${data.name}`);
      } else {
        console.log(`⏩ Skipped (already exists): ${data.name}`);
      }
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seedDatabase();
