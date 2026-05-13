import { createBrowserRouter, Outlet } from "react-router";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { WhatsAppButton } from "./components/layout/WhatsAppButton";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import Home from "./pages/Home";
import Scholarships from "./pages/Scholarships";
import ScholarshipDetails from "./pages/ScholarshipDetails";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import {
  CountriesPage,
  CountryDetailsPage,
  ServicesPage,
  ServiceDetailsPage,
  BlogPage,
  BlogDetailsPage,
  NoticePage,
  SuccessGalleryPage,
  AboutPage,
  FAQPage,
  AIGuidePage,
} from "./pages/OtherPages";
import { PrivacyPolicyPage, TermsConditionsPage, RefundPolicyPage } from "./pages/LegalPages";

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function AuthLayout() {
  return (
    <div>
      <ScrollToTop />
      <Outlet />
      <WhatsAppButton />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "scholarships", Component: Scholarships },
      { path: "scholarships/:id", Component: ScholarshipDetails },
      { path: "countries", Component: CountriesPage },
      { path: "countries/:id", Component: CountryDetailsPage },
      { path: "services", Component: ServicesPage },
      { path: "services/:id", Component: ServiceDetailsPage },
      { path: "blog", Component: BlogPage },
      { path: "blog/:slug", Component: BlogDetailsPage },
      { path: "notice", Component: NoticePage },
      { path: "success-gallery", Component: SuccessGalleryPage },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: Contact },
      { path: "faq", Component: FAQPage },
      { path: "ai-guide", Component: AIGuidePage },
      { path: "privacy-policy", Component: PrivacyPolicyPage },
      { path: "terms-conditions", Component: TermsConditionsPage },
      { path: "refund-policy", Component: RefundPolicyPage },
    ],
  },
  {
    Component: AuthLayout,
    children: [
      { path: "/login", Component: Login },
      { path: "/register", Component: Register },
      { path: "/dashboard", Component: StudentDashboard },
      { path: "/dashboard/:tab", Component: StudentDashboard },
      { path: "/admin", Component: AdminDashboard },
      { path: "/admin/:tab", Component: AdminDashboard },
    ],
  },
]);
