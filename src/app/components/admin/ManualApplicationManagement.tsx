import { useState, useEffect } from "react";
import { 
  Search, Plus, Edit, Trash2, Eye, X, Globe, Calendar, Clock, 
  TrendingUp, DollarSign, Mail, Phone, User, MessageCircle, FileText,
  AlertCircle, CheckCircle, HelpCircle, ArrowRight
} from "lucide-react";
import { api } from "../../services/api";

const STATUS_STEPS = ["Pending", "Processing", "Submitted", "Completed"];

function StatusArrowFlow({ status }: { status: string }) {
  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
        <X size={10} /> Rejected
      </span>
    );
  }
  
  const currentIndex = STATUS_STEPS.indexOf(status);
  
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {STATUS_STEPS.map((step, idx) => {
        const isActive = idx === currentIndex;
        const isPast = idx < currentIndex;
        return (
          <div key={step} className="flex items-center gap-1">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-all uppercase tracking-wider ${
              isActive 
                ? "bg-[#7B1F2E] text-white shadow-sm ring-1 ring-[#7B1F2E50]" 
                : isPast 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-gray-100 text-gray-400"
            }`}>
              {step}
            </span>
            {idx < STATUS_STEPS.length - 1 && (
              <span className={`text-xs ${isPast ? "text-green-500 font-bold" : "text-gray-300"}`}>➔</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ManualApplicationManagement({ showToast }: { showToast: any }) {
  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null); // for View Details Modal
  const [editStudent, setEditStudent] = useState<any>(null); // for Edit Student Info Modal
  const [showAddAppModal, setShowAddAppModal] = useState(false); // for adding a new application to a student
  
  // Forms state
  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    phone: "",
    scholarship: "",
    country: "",
    notes: "",
    status: "Pending",
    paymentAmount: 0,
    paymentMethod: "WhatsApp Manual",
    paymentStatus: "Unpaid"
  });

  const [newAppForm, setNewAppForm] = useState({
    scholarship: "",
    country: "",
    notes: "",
    status: "Pending",
    paymentAmount: 0,
    paymentMethod: "WhatsApp Manual",
    paymentStatus: "Unpaid"
  });

  const [editStudentForm, setEditStudentForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const fetchRecordsAndStats = async () => {
    try {
      setLoading(true);
      const [recordsData, statsData] = await Promise.all([
        api.get('/manual-applications'),
        api.get('/manual-applications/stats')
      ]);
      setRecords(recordsData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch manual application data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordsAndStats();
  }, []);

  const handleCreate = async () => {
    if (!studentForm.name || !studentForm.email || !studentForm.phone || !studentForm.scholarship || !studentForm.country) {
      showToast("Please fill all required fields", "error");
      return;
    }
    try {
      await api.post('/manual-applications', studentForm);
      showToast("Manual application record created successfully!");
      setShowAddModal(false);
      // Reset form
      setStudentForm({
        name: "",
        email: "",
        phone: "",
        scholarship: "",
        country: "",
        notes: "",
        status: "Pending",
        paymentAmount: 0,
        paymentMethod: "WhatsApp Manual",
        paymentStatus: "Unpaid"
      });
      fetchRecordsAndStats();
    } catch (err) {
      showToast("Failed to create manual application", "error");
    }
  };

  const handleEditStudentInfo = async () => {
    if (!editStudentForm.name || !editStudentForm.email || !editStudentForm.phone) {
      showToast("Please fill in name, email, and phone", "error");
      return;
    }
    try {
      const updated = await api.put(`/manual-applications/${editStudent._id}`, {
        ...editStudent,
        ...editStudentForm
      });
      showToast("Student profile updated!");
      setEditStudent(null);
      if (selectedStudent && selectedStudent._id === editStudent._id) {
        setSelectedStudent(updated);
      }
      fetchRecordsAndStats();
    } catch (err) {
      showToast("Failed to update student profile", "error");
    }
  };

  const handleAddScholarship = async () => {
    if (!newAppForm.scholarship || !newAppForm.country) {
      showToast("Please enter scholarship and country name", "error");
      return;
    }
    try {
      const updatedApps = [...(selectedStudent.applications || []), {
        scholarship: newAppForm.scholarship,
        country: newAppForm.country,
        notes: newAppForm.notes,
        status: newAppForm.status,
        payment: {
          amount: Number(newAppForm.paymentAmount),
          method: newAppForm.paymentMethod,
          status: newAppForm.paymentStatus,
          date: new Date()
        }
      }];

      const updated = await api.put(`/manual-applications/${selectedStudent._id}`, {
        ...selectedStudent,
        applications: updatedApps
      });
      
      showToast("New scholarship application added successfully!");
      setSelectedStudent(updated);
      setShowAddAppModal(false);
      setNewAppForm({
        scholarship: "",
        country: "",
        notes: "",
        status: "Pending",
        paymentAmount: 0,
        paymentMethod: "WhatsApp Manual",
        paymentStatus: "Unpaid"
      });
      fetchRecordsAndStats();
    } catch (err) {
      showToast("Failed to add scholarship", "error");
    }
  };

  const handleUpdateAppStatus = async (appId: string, updatedFields: any) => {
    try {
      const updatedApps = selectedStudent.applications.map((app: any) => {
        if (app._id === appId) {
          return {
            ...app,
            ...updatedFields,
            payment: {
              ...(app.payment || {}),
              ...(updatedFields.payment || {})
            }
          };
        }
        return app;
      });

      const updated = await api.put(`/manual-applications/${selectedStudent._id}`, {
        ...selectedStudent,
        applications: updatedApps
      });

      showToast("Application status updated!");
      setSelectedStudent(updated);
      fetchRecordsAndStats();
    } catch (err) {
      showToast("Failed to update application", "error");
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (confirm("Are you sure you want to delete this student and all their manual application records?")) {
      try {
        await api.delete(`/manual-applications/${id}`);
        showToast("Student manual record deleted successfully", "success");
        if (selectedStudent && selectedStudent._id === id) {
          setSelectedStudent(null);
        }
        fetchRecordsAndStats();
      } catch (err) {
        showToast("Failed to delete record", "error");
      }
    }
  };

  const handleDeleteApplication = async (appId: string) => {
    if (confirm("Are you sure you want to delete this scholarship application from the student's profile?")) {
      try {
        const updatedApps = selectedStudent.applications.filter((app: any) => app._id !== appId);
        const updated = await api.put(`/manual-applications/${selectedStudent._id}`, {
          ...selectedStudent,
          applications: updatedApps
        });
        showToast("Scholarship application removed!");
        setSelectedStudent(updated);
        fetchRecordsAndStats();
      } catch (err) {
        showToast("Failed to remove application", "error");
      }
    }
  };

  const filtered = records.filter(r => {
    const term = search.toLowerCase();
    if (!term) return true;
    
    const matchesStudent = r.name.toLowerCase().includes(term) || 
                           r.email.toLowerCase().includes(term) || 
                           r.phone.toLowerCase().includes(term);
                           
    const matchesApps = r.applications && r.applications.some((app: any) => 
      app.scholarship.toLowerCase().includes(term) || 
      app.country.toLowerCase().includes(term) || 
      app.status.toLowerCase().includes(term)
    );
    
    return matchesStudent || matchesApps;
  });

  if (loading && records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#7B1F2E] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-gray-500">Loading manual applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Premium Stats Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Today's Stats */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 bg-red-50 text-[#7B1F2E] rounded-bl-2xl opacity-80 group-hover:opacity-100 transition-opacity">
            <Clock size={16} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Today's Applications</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-gray-900">{stats?.daily?.count || 0}</h3>
            <span className="text-[10px] text-gray-400 font-semibold">applications</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Today's Payments</span>
            <span className="text-sm font-extrabold text-[#7B1F2E]">$ {(stats?.daily?.revenue || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 bg-green-50 text-green-700 rounded-bl-2xl opacity-80 group-hover:opacity-100 transition-opacity">
            <Calendar size={16} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">This Month's Volume</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-gray-900">{stats?.monthly?.count || 0}</h3>
            <span className="text-[10px] text-gray-400 font-semibold">applications</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Monthly Revenue</span>
            <span className="text-sm font-extrabold text-green-700">$ {(stats?.monthly?.revenue || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Yearly Stats */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 bg-[#7B1F2E]/5 text-[#7B1F2E] rounded-bl-2xl opacity-80 group-hover:opacity-100 transition-opacity">
            <TrendingUp size={16} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Yearly Summary</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-gray-900">{stats?.yearly?.count || 0}</h3>
            <span className="text-[10px] text-gray-400 font-semibold">applications</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Yearly Revenue</span>
            <span className="text-sm font-extrabold text-[#7B1F2E]">$ {(stats?.yearly?.revenue || 0).toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* Main Panel Search + Add */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="font-bold text-gray-900 text-base">Manual Applicants & Payments</h2>
          <p className="text-xs text-gray-500">Record and manage offline/WhatsApp student applications ({filtered.length})</p>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search by name, country..." 
              className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none w-full sm:w-60 focus:ring-1 focus:ring-[#7B1F2E] transition-all bg-gray-50/50" 
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#7B1F2E] text-white text-xs rounded-xl font-bold transition-all hover:opacity-90 active:scale-95 shadow-sm shadow-[#7B1F2E20]"
          >
            <Plus size={14} /> Add Entry
          </button>
        </div>
      </div>

      {/* Manual Applications List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FDF8F5] border-b border-gray-100">
              <tr>
                <th className="px-5 py-3.5 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Student / Contact</th>
                <th className="px-5 py-3.5 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Total Applications</th>
                <th className="px-5 py-3.5 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Recent Apply</th>
                <th className="px-5 py-3.5 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Status Pipeline</th>
                <th className="px-5 py-3.5 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Payment Summary</th>
                <th className="px-5 py-3.5 font-bold text-gray-500 uppercase tracking-wider text-[10px] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((record) => {
                const latestApp = record.applications && record.applications.length > 0 
                  ? record.applications[record.applications.length - 1] 
                  : null;
                  
                const totalPaid = record.applications 
                  ? record.applications.reduce((sum: number, app: any) => sum + (app.payment?.status === "Completed" ? (app.payment?.amount || 0) : 0), 0)
                  : 0;

                return (
                  <tr key={record._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#7B1F2E]/10 text-[#7B1F2E] flex items-center justify-center font-bold text-sm">
                          {record.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{record.name}</p>
                          <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-0.5">
                            <span className="flex items-center gap-1"><Mail size={10} /> {record.email}</span>
                            <span className="flex items-center gap-1"><Phone size={10} /> {record.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7B1F2E]/5 text-[#7B1F2E]">
                        {record.applications?.length || 0} Scholarship{record.applications?.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {latestApp ? (
                        <div>
                          <p className="font-bold text-gray-800">{latestApp.scholarship}</p>
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1 mt-0.5">
                            <Globe size={9} className="text-[#7B1F2E]" /> {latestApp.country}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No scholarship added</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {latestApp ? (
                        <StatusArrowFlow status={latestApp.status} />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-extrabold text-[#7B1F2E]">$ {totalPaid.toLocaleString()}</p>
                        <p className="text-[9px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider">
                          Completed payments ({record.applications?.filter((a: any) => a.payment?.status === "Completed").length || 0} of {record.applications?.length || 0})
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => setSelectedStudent(record)} 
                          title="View Details & Add Scholarship"
                          className="p-1.5 rounded-lg bg-gray-50 hover:bg-[#7B1F2E]/10 hover:text-[#7B1F2E] text-gray-600 transition-colors"
                        >
                          <Eye size={13} />
                        </button>
                        <button 
                          onClick={() => {
                            setEditStudent(record);
                            setEditStudentForm({ name: record.name, email: record.email, phone: record.phone });
                          }} 
                          title="Edit Student Info"
                          className="p-1.5 rounded-lg bg-gray-50 hover:bg-yellow-50 hover:text-yellow-700 text-gray-600 transition-colors"
                        >
                          <Edit size={13} />
                        </button>
                        <button 
                          onClick={() => handleDeleteRecord(record._id)} 
                          title="Delete Student Record"
                          className="p-1.5 rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-600 text-gray-600 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    No manual application records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Add New Entry (First Scholarship Application) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 max-h-[85vh] overflow-y-auto animate-zoom-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div>
                <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                  <User className="text-[#7B1F2E]" size={18} /> Add Student Manual Entry
                </h3>
                <p className="text-[10px] text-gray-500">Store manual applications received via WhatsApp or cash payments</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Profile details */}
              <div className="bg-[#FDF8F5] p-4 rounded-2xl border border-[#7B1F2E]/5 space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest border-l-2 border-[#7B1F2E] pl-2 mb-2">Student Profile Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Student Full Name *</label>
                    <input 
                      type="text" 
                      value={studentForm.name} 
                      onChange={e => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Tanvir Rahman"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#7B1F2E]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Student Gmail *</label>
                    <input 
                      type="email" 
                      value={studentForm.email} 
                      onChange={e => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="gmail / email address"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#7B1F2E]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Mobile / WhatsApp Number *</label>
                    <input 
                      type="text" 
                      value={studentForm.phone} 
                      onChange={e => setStudentForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="e.g. +88017XXXXXXXX"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#7B1F2E]"
                    />
                  </div>
                </div>
              </div>

              {/* Scholarship application details */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest border-l-2 border-gray-400 pl-2 mb-2">Initial Scholarship Application</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Scholarship Name *</label>
                    <input 
                      type="text" 
                      value={studentForm.scholarship} 
                      onChange={e => setStudentForm(prev => ({ ...prev, scholarship: e.target.value }))}
                      placeholder="e.g. Chinese Government Scholarship"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#7B1F2E]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Country *</label>
                    <input 
                      type="text" 
                      value={studentForm.country} 
                      onChange={e => setStudentForm(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="e.g. China"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#7B1F2E]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Special Note</label>
                    <textarea 
                      value={studentForm.notes} 
                      onChange={e => setStudentForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      placeholder="Any specific note from WhatsApp conversation..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#7B1F2E] resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Initial Status</label>
                    <select 
                      value={studentForm.status} 
                      onChange={e => setStudentForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#7B1F2E]"
                    >
                      {["Pending", "Processing", "Submitted", "Completed", "Rejected"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest border-l-2 border-gray-400 pl-2 mb-2">Initial Payment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Payment Amount ($)</label>
                    <input 
                      type="number" 
                      value={studentForm.paymentAmount} 
                      onChange={e => setStudentForm(prev => ({ ...prev, paymentAmount: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#7B1F2E]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Payment Method</label>
                    <select 
                      value={studentForm.paymentMethod} 
                      onChange={e => setStudentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#7B1F2E]"
                    >
                      {['Stripe', 'PayPal', 'Wise', 'Bank Transfer', 'BKash', 'Nagad', 'Rocket', 'WhatsApp Manual', 'Cash'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Payment Status</label>
                    <select 
                      value={studentForm.paymentStatus} 
                      onChange={e => setStudentForm(prev => ({ ...prev, paymentStatus: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#7B1F2E]"
                    >
                      {["Unpaid", "Pending", "Completed"].map(ps => <option key={ps} value={ps}>{ps}</option>)}
                    </select>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleCreate} 
                className="flex-1 py-3 bg-[#7B1F2E] text-white rounded-xl font-bold text-xs hover:opacity-90 active:scale-95 transition"
              >
                Create Record
              </button>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="flex-1 py-3 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-gray-50 active:scale-95 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: View Details & Manage Multiple Applications */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-zoom-in max-h-[90vh] flex flex-col">
            <div className="relative h-24 bg-gradient-to-r from-[#7B1F2E] to-[#3D0F17] flex-shrink-0 flex items-center px-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black text-2xl">
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{selectedStudent.name}</h3>
                  <p className="text-xs text-red-200 flex items-center gap-1"><Mail size={12} /> {selectedStudent.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Basic Details Panel */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gmail / Email</span>
                  <p className="text-xs font-bold text-gray-800 truncate">{selectedStudent.email}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">WhatsApp Number</span>
                  <p className="text-xs font-bold text-gray-800">{selectedStudent.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student ID</span>
                  <p className="text-[10px] font-bold text-gray-500 font-mono">{selectedStudent._id}</p>
                </div>
              </div>

              {/* Scholarship Applications Header */}
              <div className="flex justify-between items-center border-l-4 border-[#7B1F2E] pl-3">
                <div>
                  <h4 className="font-black text-gray-900 text-sm">Scholarship Applications</h4>
                  <p className="text-[10px] text-gray-500">Manage or update student's manual scholarship requests</p>
                </div>
                <button 
                  onClick={() => setShowAddAppModal(true)}
                  className="px-3 py-1.5 bg-[#7B1F2E] text-white text-[10px] font-bold rounded-lg hover:opacity-90 flex items-center gap-1 transition"
                >
                  <Plus size={12} /> Apply Another
                </button>
              </div>

              {/* Scholarship Application Items Stack */}
              <div className="space-y-4">
                {selectedStudent.applications && selectedStudent.applications.map((app: any) => (
                  <div key={app._id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow transition-all space-y-4">
                    
                    {/* Scholarship and country */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h5 className="font-extrabold text-gray-900 text-sm">{app.scholarship}</h5>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 mt-0.5 uppercase tracking-wider">
                          <Globe size={11} className="text-[#7B1F2E]" /> {app.country}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleDeleteApplication(app._id)}
                        className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition"
                        title="Remove Application"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {/* Status progress bar / arrows */}
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Pipeline Stage</span>
                        <StatusArrowFlow status={app.status} />
                      </div>
                      
                      {/* Update status selector */}
                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Quick Edit Stage</label>
                        <select 
                          value={app.status} 
                          onChange={e => handleUpdateAppStatus(app._id, { status: e.target.value })}
                          className="px-2 py-1 border border-gray-200 rounded-lg text-[11px] font-bold bg-white focus:outline-none focus:border-[#7B1F2E]"
                        >
                          {["Pending", "Processing", "Submitted", "Completed", "Rejected"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Notes detail */}
                    <div className="space-y-1 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Special Notes & Remarks</span>
                      <textarea 
                        defaultValue={app.notes || ""} 
                        onBlur={e => handleUpdateAppStatus(app._id, { notes: e.target.value })}
                        placeholder="Click to add/edit special notes for this application..."
                        rows={1}
                        className="w-full bg-transparent border-0 focus:ring-0 text-xs text-gray-700 placeholder-gray-400 focus:outline-none resize-y"
                      />
                    </div>

                    {/* Payment sub-panel */}
                    <div className="pt-3 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                      
                      {/* Amount details */}
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Amount</span>
                        <div className="flex items-center border border-gray-200 rounded-lg px-2 py-1 bg-gray-50/50">
                          <span className="text-xs font-bold text-gray-500 mr-1">$</span>
                          <input 
                            type="number"
                            defaultValue={app.payment?.amount || 0}
                            onBlur={e => handleUpdateAppStatus(app._id, { payment: { ...app.payment, amount: Number(e.target.value) } })}
                            className="bg-transparent border-0 w-full focus:ring-0 text-xs font-bold focus:outline-none text-gray-800"
                          />
                        </div>
                      </div>

                      {/* Method details */}
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Method</span>
                        <select 
                          value={app.payment?.method || "WhatsApp Manual"} 
                          onChange={e => handleUpdateAppStatus(app._id, { payment: { ...app.payment, method: e.target.value } })}
                          className="px-2 py-1 border border-gray-200 rounded-lg text-xs bg-white w-full font-bold focus:outline-none text-gray-700"
                        >
                          {['Stripe', 'PayPal', 'Wise', 'Bank Transfer', 'BKash', 'Nagad', 'Rocket', 'WhatsApp Manual', 'Cash'].map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>

                      {/* Payment Status selector */}
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Status</span>
                        <select 
                          value={app.payment?.status || "Unpaid"} 
                          onChange={e => handleUpdateAppStatus(app._id, { payment: { ...app.payment, status: e.target.value } })}
                          className={`px-2 py-1 border rounded-lg text-xs w-full font-bold focus:outline-none ${
                            app.payment?.status === "Completed" 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : app.payment?.status === "Pending"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {["Unpaid", "Pending", "Completed"].map(ps => <option key={ps} value={ps}>{ps}</option>)}
                        </select>
                      </div>

                    </div>
                  </div>
                ))}

                {(!selectedStudent.applications || selectedStudent.applications.length === 0) && (
                  <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">No scholarship applications added yet.</p>
                  </div>
                )}
              </div>

            </div>

            <div className="p-4 border-t border-gray-100 flex gap-2 flex-shrink-0 bg-gray-50/50">
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="w-full py-2.5 bg-gray-900 hover:opacity-90 text-white rounded-xl font-bold text-xs transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Scholarship Application inside student detail */}
      {showAddAppModal && selectedStudent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-zoom-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h4 className="font-black text-gray-900 text-sm">Add New Scholarship Application</h4>
                <p className="text-[10px] text-gray-500">Record a new scholarship request for {selectedStudent.name}</p>
              </div>
              <button 
                onClick={() => setShowAddAppModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Scholarship Name *</label>
                <input 
                  type="text" 
                  value={newAppForm.scholarship} 
                  onChange={e => setNewAppForm(prev => ({ ...prev, scholarship: e.target.value }))}
                  placeholder="e.g. CSC Chinese Government Scholarship"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#7B1F2E]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Country *</label>
                <input 
                  type="text" 
                  value={newAppForm.country} 
                  onChange={e => setNewAppForm(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="e.g. China"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#7B1F2E]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Special Note</label>
                <textarea 
                  value={newAppForm.notes} 
                  onChange={e => setNewAppForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  placeholder="Any remarks..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#7B1F2E] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Status</label>
                  <select 
                    value={newAppForm.status} 
                    onChange={e => setNewAppForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none"
                  >
                    {["Pending", "Processing", "Submitted", "Completed", "Rejected"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Amount ($)</label>
                  <input 
                    type="number" 
                    value={newAppForm.paymentAmount} 
                    onChange={e => setNewAppForm(prev => ({ ...prev, paymentAmount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Payment Method</label>
                  <select 
                    value={newAppForm.paymentMethod} 
                    onChange={e => setNewAppForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none"
                  >
                    {['Stripe', 'PayPal', 'Wise', 'Bank Transfer', 'BKash', 'Nagad', 'Rocket', 'WhatsApp Manual', 'Cash'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Payment Status</label>
                  <select 
                    value={newAppForm.paymentStatus} 
                    onChange={e => setNewAppForm(prev => ({ ...prev, paymentStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none"
                  >
                    {["Unpaid", "Pending", "Completed"].map(ps => <option key={ps} value={ps}>{ps}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 mt-5">
              <button 
                onClick={handleAddScholarship} 
                className="flex-1 py-2.5 bg-[#7B1F2E] text-white rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition"
              >
                Apply Scholarship
              </button>
              <button 
                onClick={() => setShowAddAppModal(false)} 
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-gray-50 active:scale-95 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Edit Student Profile Info */}
      {editStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-zoom-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h4 className="font-black text-gray-900 text-sm">Edit Student Profile</h4>
                <p className="text-[10px] text-gray-500">Update basic registration details of manual record</p>
              </div>
              <button 
                onClick={() => setEditStudent(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Student Full Name</label>
                <input 
                  type="text" 
                  value={editStudentForm.name} 
                  onChange={e => setEditStudentForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#7B1F2E]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Student Gmail</label>
                <input 
                  type="email" 
                  value={editStudentForm.email} 
                  onChange={e => setEditStudentForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#7B1F2E]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">WhatsApp / Phone Number</label>
                <input 
                  type="text" 
                  value={editStudentForm.phone} 
                  onChange={e => setEditStudentForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#7B1F2E]"
                />
              </div>
            </div>

            <div className="flex gap-2.5 mt-5">
              <button 
                onClick={handleEditStudentInfo} 
                className="flex-1 py-2.5 bg-[#7B1F2E] text-white rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition"
              >
                Update Profile
              </button>
              <button 
                onClick={() => setEditStudent(null)} 
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-gray-50 active:scale-95 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
