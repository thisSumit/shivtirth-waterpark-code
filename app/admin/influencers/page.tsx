"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Search, 
  Download, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Instagram,
  Award
} from "lucide-react";

type Influencer = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  instagram_handle: string;
  follower_count: number;
  message: string;
  created_at: string;
};

export default function AdminInfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);

  const formatFollowers = (count: any) => {
    if (count === null || count === undefined || String(count).trim() === "") return "N/A";
    const cleanStr = String(count).replace(/,/g, '').trim();
    const num = Number(cleanStr);
    if (!isNaN(num) && cleanStr !== "") {
      return num.toLocaleString("en-IN");
    }
    return String(count);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchInfluencers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("influencers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (data) {
        const mapped = data.map((item: any) => {
          let handle = item.profile_link || "";
          if (handle.includes("instagram.com/")) {
            const parts = handle.split("instagram.com/");
            if (parts[1]) {
              handle = parts[1].split("/")[0].split("?")[0];
            }
          }
          return {
            id: item.id,
            name: item.full_name,
            email: item.email,
            mobile: item.mobile,
            instagram_handle: handle,
            follower_count: item.followers,
            message: item.message,
            created_at: item.created_at,
          };
        });
        setInfluencers(mapped);
      } else {
        setInfluencers([]);
      }
    } catch (err) {
      console.error("Error fetching influencers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, []);

  // Filter & Search Logic
  const filteredInfluencers = useMemo(() => {
    return influencers.filter((i) => {
      const term = searchTerm.toLowerCase();
      return (
        (i.name?.toLowerCase() || "").includes(term) ||
        (i.email?.toLowerCase() || "").includes(term) ||
        (i.mobile || "").includes(term) ||
        (i.instagram_handle?.toLowerCase() || "").includes(term) ||
        (i.message?.toLowerCase() || "").includes(term)
      );
    });
  }, [influencers, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredInfluencers.length / itemsPerPage) || 1;
  const paginatedInfluencers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInfluencers.slice(start, start + itemsPerPage);
  }, [filteredInfluencers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // CSV Export Handler
  const handleExportCSV = () => {
    if (filteredInfluencers.length === 0) return;

    const headers = [
      "Name",
      "Email",
      "Mobile",
      "Instagram Handle",
      "Follower Count",
      "Proposal Message",
      "Submission Date"
    ];

    const rows = filteredInfluencers.map((i) => [
      i.name || "",
      i.email || "",
      i.mobile || "",
      i.instagram_handle || "",
      i.follower_count || 0,
      i.message || "",
      new Date(i.created_at).toLocaleDateString("en-IN")
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shivtirth_influencers_${new Date().toISOString().split('T')[0]}.csv`);
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
            Influencer Collaborations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage applications from content creators and brand promoters
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl shadow-lg transition tracking-wider"
        >
          <Download size={16} />
          Export to CSV
        </button>
      </div>

      {/* Search control */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search influencers by name, handle, email, phone or message contents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-accent text-white"
          />
        </div>
      </div>

      {/* Influencers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2"></div>
          </div>
        ) : paginatedInfluencers.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No influencer submissions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/40 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-4 px-6">Creator Info</th>
                  <th className="py-4 px-6">Instagram Handle</th>
                  <th className="py-4 px-6">Follower Count</th>
                  <th className="py-4 px-6">Pitch Preview</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {paginatedInfluencers.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">{i.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{i.email}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{i.mobile}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-accent flex items-center gap-1.5 mt-2">
                      <Instagram size={15} />
                      {i.instagram_handle ? (
                        <a 
                          href={`https://instagram.com/${(i.instagram_handle || '').replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {i.instagram_handle.startsWith('@') ? i.instagram_handle : `@${i.instagram_handle}`}
                        </a>
                      ) : (
                        <span className="text-slate-500 font-medium">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-bold text-white">
                      {formatFollowers(i.follower_count)}
                    </td>
                    <td className="py-4 px-6 text-slate-400 max-w-xs truncate">
                      {i.message}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => setSelectedInfluencer(i)}
                        className="p-2 bg-slate-850 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
                        title="View Full Application"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
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
                className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-750 transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-750 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Influencer Details Modal */}
      {selectedInfluencer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                  <Award size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wide">
                    Influencer Proposal
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Submitted on {new Date(selectedInfluencer.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInfluencer(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Influencer Name
                  </span>
                  <p className="font-bold text-white mt-0.5">{selectedInfluencer.name}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Instagram Handle
                  </span>
                  <p className="font-bold text-accent mt-0.5 flex items-center gap-1">
                    <Instagram size={14} />
                    {selectedInfluencer.instagram_handle ? (
                      <a 
                        href={`https://instagram.com/${(selectedInfluencer.instagram_handle || '').replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {selectedInfluencer.instagram_handle}
                      </a>
                    ) : (
                      <span className="text-slate-500 font-medium">N/A</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Follower Count
                  </span>
                  <p className="font-bold text-white mt-0.5">
                    {formatFollowers(selectedInfluencer.follower_count)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Mobile Number
                  </span>
                  <p className="font-bold text-white mt-0.5 select-all">{selectedInfluencer.mobile}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Email Address
                </span>
                <p className="font-bold text-white mt-0.5 select-all">{selectedInfluencer.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Pitch / Message Content
              </span>
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {selectedInfluencer.message}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <a
                href={`mailto:${selectedInfluencer.email}`}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase rounded-xl transition tracking-wider"
              >
                Email Influencer
              </a>
              <a
                href={`https://wa.me/${selectedInfluencer.mobile.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase rounded-xl transition tracking-wider flex items-center gap-1.5"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
