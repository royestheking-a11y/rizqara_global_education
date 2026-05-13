import { Link } from "react-router";
import { Shield, FileText, RefreshCw, ChevronRight } from "lucide-react";

const LegalLayout = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
    <div style={{ background: "linear-gradient(135deg, #7B1F2E, #3D0F17)" }} className="py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-4 text-white">
          {icon}
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <div className="flex items-center justify-center gap-2 text-red-200 text-xs">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span className="text-white">{title}</span>
        </div>
      </div>
    </div>
    
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
          {children}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400 mb-4">Last updated: May 12, 2026</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition hover:opacity-90" style={{ backgroundColor: "#7B1F2E" }}>
            Contact Support for Questions
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" icon={<Shield size={32} />}>
      <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">1. Information We Collect</h2>
      <p className="mb-6">
        At RizQara Global Education, we collect information you provide directly to us when you create an account, apply for scholarships, or contact our support team. This includes your name, email address, educational background, and any documents uploaded for scholarship applications.
      </p>
      
      <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">2. How We Use Your Information</h2>
      <p className="mb-4">We use the information we collect to:</p>
      <ul className="list-disc pl-5 mb-6 space-y-2">
        <li>Provide, maintain, and improve our services</li>
        <li>Process scholarship applications and match you with opportunities</li>
        <li>Send you technical notices, updates, and security alerts</li>
        <li>Respond to your comments, questions, and requests</li>
      </ul>

      <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">3. Data Security</h2>
      <p className="mb-6">
        We implement a variety of security measures to maintain the safety of your personal information. Your sensitive data is encrypted via Secure Socket Layer (SSL) technology and is only accessible by a limited number of persons who have special access rights to such systems.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">4. Third-Party Disclosure</h2>
      <p className="mb-6">
        We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except to trusted third parties who assist us in operating our website and conducting our business, so long as those parties agree to keep this information confidential.
      </p>
    </LegalLayout>
  );
}

export function TermsConditionsPage() {
  return (
    <LegalLayout title="Terms & Conditions" icon={<FileText size={32} />}>
      <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">1. Acceptance of Terms</h2>
      <p className="mb-6">
        By accessing and using the RizQara Global Education portal, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">2. Use License</h2>
      <p className="mb-6">
        Permission is granted to temporarily download one copy of the materials (information or software) on RizQara's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">3. Disclaimer</h2>
      <p className="mb-6">
        The materials on RizQara Global Education's website are provided on an 'as is' basis. RizQara makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">4. Limitations</h2>
      <p className="mb-6">
        In no event shall RizQara Global Education or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on RizQara's website.
      </p>
    </LegalLayout>
  );
}

export function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund Policy" icon={<RefreshCw size={32} />}>
      <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">1. Service Fees</h2>
      <p className="mb-6">
        RizQara Global Education offers various premium services including document review, SOP writing assistance, and visa consultation. Fees for these services are clearly communicated before any transaction is initiated.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">2. Refund Eligibility</h2>
      <p className="mb-4">Refunds may be requested under the following conditions:</p>
      <ul className="list-disc pl-5 mb-6 space-y-2">
        <li>The service has not yet been initiated by our team.</li>
        <li>There is a proven failure on our part to deliver the agreed-upon service within the specified timeline.</li>
        <li>Duplicate payments made due to technical errors.</li>
      </ul>

      <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">3. Non-Refundable Items</h2>
      <p className="mb-6">
        Once a document review or SOP writing service has been completed and delivered to the student, the service fee is non-refundable. Consultation fees are also non-refundable once the consultation session has taken place.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">4. Processing Refunds</h2>
      <p className="mb-6">
        Approved refunds will be processed within 7-10 business days and will be credited back to the original method of payment. Please note that bank processing times may vary.
      </p>
    </LegalLayout>
  );
}
