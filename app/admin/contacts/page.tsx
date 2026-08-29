"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Search, 
  Download, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  Phone,
  Mail,
  User,
  Trash2
} from "lucide-react";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  subject: string;
  message: string;
  created_at: string;
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry record?")) return;
    try {
      const { error } = await supabase.from("contacts").delete().eq("id", id);
      if (error) throw error;
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContact?.id === id) setSelectedContact(null);
    } catch (err) {
      console.error("Error deleting contact:", err);
      alert("Failed to delete contact record.");
    }
  };

  // Helper to extract phone number safely regardless of column naming (phone vs mobile)
  const getPhoneNumber = (c: Contact) => c.phone || c.mobile || "N/A";

  // Filter & Search Logic
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const term = searchTerm.toLowerCase();
      const phoneNum = getPhoneNumber(c);
      return (
        (c.name?.toLowerCase() || "").includes(term) ||
        (c.email?.toLowerCase() || "").includes(term) ||
        phoneNum.includes(term) ||
        (c.subject?.toLowerCase() || "").includes(term) ||
        (c.message?.toLowerCase() || "").includes(term)
      );
    });
  }, [contacts, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage) || 1;
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredContacts.slice(start, start + itemsPerPage);
  }, [filteredContacts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // CSV Export Handler
  const handleExportCSV = () => {
    if (filteredContacts.length === 0) return;

    const headers = [
      "Name",
      "Email",
      "Mobile / Phone",
      "Subject",
      "Message",
      "Submission Date"
    ];

    const rows = filteredContacts.map((c) => [
      c.name || "",
      c.email || "",
      getPhoneNumber(c),
      c.subject || "",
      c.message || "",
      new Date(c.created_at).toLocaleDateString("en-IN")
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shivtirth_enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">
            Customer Enquiries
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review contact messages, caller phone numbers, and respond to inquiries
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl shadow-lg transition tracking-wider"
        >
          <Download size={16} />
          Export to CSV ({filteredContacts.length})
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search contacts by name, mobile number, email, subject or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-accent text-white placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2"></div>
          </div>
        ) : paginatedContacts.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No contact enquiries found matching current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/40 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-4 px-6">Sender & Contact Details</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Message Preview</th>
                  <th className="py-4 px-6">Date Sent</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {paginatedContacts.map((c) => {
                  const phoneNum = getPhoneNumber(c);

                  return (
                    <tr key={c.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 px-6 min-w-56">
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          <User size={14} className="text-accent shrink-0" />
                          <span>{c.name || "Anonymous"}</span>
                        </div>
                        <div className="text-slate-300 text-xs font-semibold mt-1 flex items-center gap-1.5">
                          <Phone size={12} className="text-accent shrink-0" />
                          <a href={`tel:${phoneNum}`} className="hover:text-accent font-bold select-all">
                            {phoneNum}
                          </a>
                        </div>
                        <div className="text-slate-500 text-xs mt-0.5 flex items-center gap-1.5 truncate">
                          <Mail size={12} className="text-slate-600 shrink-0" />
                          <span>{c.email || "N/A"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-semibold text-slate-200">
                        {c.subject || "No Subject"}
                      </td>

                      <td className="py-4 px-6 text-slate-400 max-w-xs truncate">
                        {c.message}
                      </td>

                      <td className="py-4 px-6 font-medium text-slate-400 whitespace-nowrap">
                        {new Date(c.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>

                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedContact(c)}
                            className="p-2 bg-slate-850 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition"
                            title="View Full Enquiry"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 transition"
                            title="Delete Enquiry"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-850 bg-slate-950/20 text-xs">
            <span className="text-slate-500 font-semibold">
              Showing page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-750 transition text-white"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-750 transition text-white"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wide">
                    Enquiry Details
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Received on {new Date(selectedContact.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 space-y-3 text-sm border border-slate-850">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Sender Name
                  </span>
                  <p className="font-bold text-white mt-1">{selectedContact.name || "Anonymous"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Mobile Number
                  </span>
                  <p className="font-extrabold text-accent mt-1 text-base select-all">
                    {getPhoneNumber(selectedContact)}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-900">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Email Address
                </span>
                <p className="font-bold text-white mt-0.5 select-all">{selectedContact.email || "N/A"}</p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Subject
              </span>
              <p className="text-sm font-bold text-white">{selectedContact.subject || "No Subject"}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Message Content
              </span>
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {selectedContact.message}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <a
                href={`mailto:${selectedContact.email}`}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase rounded-xl transition tracking-wider flex items-center gap-1.5"
              >
                <Mail size={14} />
                Reply Email
              </a>
              <a
                href={`tel:${getPhoneNumber(selectedContact)}`}
                className="px-4 py-2.5 bg-accent hover:bg-accent/90 text-black font-black text-xs uppercase rounded-xl transition tracking-wider flex items-center gap-1.5"
              >
                <Phone size={14} />
                Call Mobile
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
