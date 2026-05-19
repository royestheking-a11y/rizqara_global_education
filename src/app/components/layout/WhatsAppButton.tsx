import { useState } from "react";
import { X, MessageCircle, ChevronRight } from "lucide-react";
import { api } from "../../services/api";

const options = [
  { label: "General Inquiry", message: "Hello! I have a general inquiry about RizQara Global Education." },
  { label: "Free Profile Check", message: "Hello! I would like a free profile check for scholarship guidance." },
  { label: "Scholarship Guidance", message: "Hello! I need help finding the right scholarship for my profile." },
  { label: "Visa Support", message: "Hello! I need visa application support and guidance." },
  { label: "Document Support", message: "Hello! I need help with document preparation for my application." },
];

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const waNumber = "8801915342776";

  const openChat = async (message: string) => {
    try {
      await api.post('/stats/whatsapp-click', {});
    } catch (err) {
      console.error("Failed to track WhatsApp option click", err);
    }
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, "_blank");
    setIsOpen(false);
  };

  const toggleOpen = async () => {
    const nextState = !isOpen;
    if (nextState) {
      try {
        await api.post('/stats/whatsapp-click', {});
      } catch (err) {
        console.error("Failed to track WhatsApp panel open", err);
      }
    }
    setIsOpen(nextState);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-5 z-50 w-72 rounded-2xl overflow-hidden shadow-2xl"
          style={{ border: "1px solid #e5e7eb" }}
        >
          {/* Header */}
          <div style={{ backgroundColor: "#25D366" }} className="p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm">RizQara Support</p>
                  <p className="text-xs text-green-100">Usually replies in minutes</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-green-100 bg-white/10 rounded-lg px-3 py-2">
              How can we help you today? Choose a topic below:
            </p>
          </div>

          {/* Options */}
          <div className="bg-white">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => openChat(opt.message)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                style={{ color: "#374151" }}
              >
                <span>{opt.label}</span>
                <ChevronRight size={14} className="text-gray-400" />
              </button>
            ))}
          </div>

          <div className="bg-gray-50 px-4 py-2">
            <p className="text-xs text-center text-gray-400">Powered by WhatsApp</p>
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ backgroundColor: "#25D366" }}
        aria-label="Chat on WhatsApp"
      >
        {isOpen ? (
          <X size={22} color="white" />
        ) : (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
      </button>

      {/* Pulse animation */}
      {!isOpen && (
        <div
          className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: "#25D366" }}
        />
      )}
    </>
  );
}