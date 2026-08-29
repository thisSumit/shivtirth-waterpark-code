"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  Mail,
  Calendar,
  Ticket,
  Check,
  RotateCcw
} from "lucide-react";

type Booking = {
  id: string;
  txnid: string;
  payment_status: string;
  total_amount: number;
  ticket_qty: number;
  city?: string;
  adult_qty?: number;
  kid1_qty?: number;
  kid2_qty?: number;
  name?: string;
  customer_name?: string;
  email?: string;
  customer_email?: string;
  mobile?: string;
  customer_phone?: string;
  visit_date: string;
  plan_name: string;
  ticket_type: string;
  addon_summary?: string;
  addon_details?: any;
  created_at: string;
  checked_in?: boolean;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "failed" | "pending">("all");
  const [dateFilterType, setDateFilterType] = useState<"all" | "visit_date" | "booking_date">("all");
  const [selectedDate, setSelectedDate] = useState("");

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Check-in / Park Entry Toggle
  const toggleCheckIn = async (bookingId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;

    // Optimistic update
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, checked_in: nextStatus } : b))
    );
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, checked_in: nextStatus });
    }

    try {
      const { error } = await supabase
        .from("bookings")
        .update({ checked_in: nextStatus })
        .eq("id", bookingId);

      if (error) {
        console.error("Failed to update check-in status in database:", error);
        // Revert on error
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, checked_in: currentStatus } : b))
        );
        alert("Could not update park entry status. Check database permissions.");
      }
    } catch (err) {
      console.error("Error updating check-in:", err);
    }
  };

  // Status Counts
  const statusCounts = useMemo(() => {
    let paid = 0;
    let failed = 0;
    let pending = 0;

    bookings.forEach((b) => {
      const st = (b.payment_status || "").toLowerCase();
      if (st === "paid" || st === "success") paid++;
      else if (st === "failed") failed++;
      else pending++;
    });

    return { all: bookings.length, paid, failed, pending };
  }, [bookings]);

  // Filter & Search Logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const cName = (b.name || b.customer_name || "").toLowerCase();
      const cEmail = (b.email || b.customer_email || "").toLowerCase();
      const cPhone = b.mobile || b.customer_phone || "";
      const txn = (b.txnid || "").toLowerCase();
      const plan = (b.plan_name || "").toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        !search ||
        cName.includes(search) ||
        cEmail.includes(search) ||
        cPhone.includes(search) ||
        txn.includes(search) ||
        plan.includes(search);

      // Status filter
      const st = (b.payment_status || "").toLowerCase();
      let matchesStatus = true;
      if (statusFilter === "paid") {
        matchesStatus = st === "paid" || st === "success";
      } else if (statusFilter === "failed") {
        matchesStatus = st === "failed";
      } else if (statusFilter === "pending") {
        matchesStatus = st !== "paid" && st !== "success" && st !== "failed";
      }

      // Date filter
      let matchesDate = true;
      if (dateFilterType !== "all" && selectedDate) {
        if (dateFilterType === "visit_date") {
          const vDate = b.visit_date ? b.visit_date.split("T")[0] : "";
          matchesDate = vDate === selectedDate;
        } else if (dateFilterType === "booking_date") {
          const bDate = b.created_at ? b.created_at.split("T")[0] : "";
          matchesDate = bDate === selectedDate;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, searchTerm, statusFilter, dateFilterType, selectedDate]);

  // Reset all filters helper
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilterType("all");
    setSelectedDate("");
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilterType, selectedDate]);

  // CSV Export Handler
  const handleExportCSV = () => {
    if (filteredBookings.length === 0) return;

    const headers = [
      "Transaction ID",
      "Customer Name",
      "Email",
      "Phone",
      "City",
      "Adult",
      "Kid 1",
      "Kid 2",
      "Visit Date",
      "Plan Selected",
      "Ticket Type",
      "Ticket Qty",
      "Addons Summary",
      "Total Paid",
      "Payment Status",
      "Park Entered",
      "Booking Date"
    ];

    const rows = filteredBookings.map((b) => [
      b.txnid || "",
      b.name || b.customer_name || "",
      b.email || b.customer_email || "",
      b.mobile || b.customer_phone || "",
      b.city || "",
      b.adult_qty ?? "",
      b.kid1_qty ?? "",
      b.kid2_qty ?? "",
      b.visit_date || "",
      b.plan_name || "",
      b.ticket_type || "",
      b.ticket_qty || 0,
      b.addon_summary || "None",
      b.total_amount || 0,
      b.payment_status || "Pending",
      b.checked_in ? "Yes" : "No",
      new Date(b.created_at).toLocaleDateString("en-IN")
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shivtirth_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "success":
        return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "failed":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">
            Bookings Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Filter, inspect customer details, verify park entry ticks, and export customer list
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl shadow-lg transition tracking-wider"
        >
          <Download size={16} />
          Export CSV ({filteredBookings.length})
        </button>
      </div>

      {/* Quick Status Filter Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter("all")}
          className={`flex items-center justify-between p-4 rounded-2xl border transition text-left ${statusFilter === "all"
              ? "bg-accent/15 border-accent text-white font-bold"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
        >
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold opacity-70">All Bookings</p>
            <p className="text-2xl font-black text-white mt-1">{statusCounts.all}</p>
          </div>
          <Filter size={20} className={statusFilter === "all" ? "text-accent" : "text-slate-600"} />
        </button>

        <button
          onClick={() => setStatusFilter("paid")}
          className={`flex items-center justify-between p-4 rounded-2xl border transition text-left ${statusFilter === "paid"
              ? "bg-green-500/20 border-green-500 text-white font-bold"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
        >
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-green-400">Paid Customers</p>
            <p className="text-2xl font-black text-green-400 mt-1">{statusCounts.paid}</p>
          </div>
          <CheckCircle2 size={20} className="text-green-400" />
        </button>

        <button
          onClick={() => setStatusFilter("failed")}
          className={`flex items-center justify-between p-4 rounded-2xl border transition text-left ${statusFilter === "failed"
              ? "bg-red-500/20 border-red-500 text-white font-bold"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
        >
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-red-400">Failed Bookings</p>
            <p className="text-2xl font-black text-red-400 mt-1">{statusCounts.failed}</p>
          </div>
          <XCircle size={20} className="text-red-400" />
        </button>

        <button
          onClick={() => setStatusFilter("pending")}
          className={`flex items-center justify-between p-4 rounded-2xl border transition text-left ${statusFilter === "pending"
              ? "bg-amber-500/20 border-amber-500 text-white font-bold"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
        >
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-amber-400">Pending</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{statusCounts.pending}</p>
          </div>
          <Clock size={20} className="text-amber-400" />
        </button>
      </div>

      {/* Search and Date Filter Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Text Search */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search customer name, phone, email, txn ID, or plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-accent text-white placeholder:text-slate-600"
            />
          </div>

          {/* Date Filter Type Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Calendar size={16} className="text-slate-400 shrink-0" />
            <select
              value={dateFilterType}
              onChange={(e) => setDateFilterType(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 font-semibold focus:outline-none focus:border-accent w-full md:w-auto"
            >
              <option value="all">All Dates</option>
              <option value="visit_date">Filter by Visit Date</option>
              <option value="booking_date">Filter by Booking Date</option>
            </select>
          </div>

          {/* Date Picker Input (active when dateFilterType != all) */}
          {dateFilterType !== "all" && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-accent font-bold focus:outline-none focus:border-accent w-full md:w-auto"
            />
          )}

          {/* Reset Filters Button */}
          {(searchTerm || statusFilter !== "all" || dateFilterType !== "all" || selectedDate) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition shrink-0"
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2"></div>
          </div>
        ) : paginatedBookings.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No bookings found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/40 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-4 px-5">Txn ID</th>
                  <th className="py-4 px-5">Customer Details</th>
                  <th className="py-4 px-5">City / Guests</th>
                  <th className="py-4 px-5">Visit Date</th>
                  <th className="py-4 px-5">Plan & Add-ons</th>
                  <th className="py-4 px-5 text-center">Qty / Amt</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-center">Park Entry (Tick)</th>
                  <th className="py-4 px-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {paginatedBookings.map((b) => {
                  const custName = b.name || b.customer_name || "Guest";
                  const custEmail = b.email || b.customer_email || "N/A";
                  const custPhone = b.mobile || b.customer_phone || "N/A";
                  const isPaid = (b.payment_status || "").toLowerCase() === "paid" || (b.payment_status || "").toLowerCase() === "success";

                  return (
                    <tr key={b.id} className="hover:bg-slate-800/20 transition-colors">
                      {/* Transaction ID */}
                      <td className="py-4 px-5 font-mono text-[11px] text-slate-400 font-bold select-all">
                        {b.txnid}
                      </td>

                      {/* Customer Details */}
                      <td className="py-4 px-5 min-w-48">
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          <User size={14} className="text-accent shrink-0" />
                          <span>{custName}</span>
                        </div>
                        <div className="text-slate-400 text-xs mt-1 flex items-center gap-1.5">
                          <Phone size={12} className="text-slate-500 shrink-0" />
                          <a href={`tel:${custPhone}`} className="hover:text-accent font-semibold">{custPhone}</a>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1.5 truncate max-w-56">
                          <Mail size={12} className="text-slate-600 shrink-0" />
                          <span>{custEmail}</span>
                        </div>
                      </td>

                      {/* City / Guest Mix */}
                      <td className="py-4 px-5 min-w-28">
                        <div className="font-bold text-white text-xs uppercase tracking-wide">
                          {b.city || "N/A"}
                        </div>
                        <div className="mt-1 text-[10px] text-slate-400 leading-relaxed">
                          <div>Adult: {b.adult_qty ?? 0}</div>
                          <div>Kid 1: {b.kid1_qty ?? 0}</div>
                          <div>Kid 2: {b.kid2_qty ?? 0}</div>
                        </div>
                      </td>

                      {/* Visit Date */}
                      <td className="py-4 px-5 font-semibold text-xs whitespace-nowrap">
                        <div className="text-white font-bold">
                          {new Date(b.visit_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Booked: {new Date(b.created_at).toLocaleDateString("en-IN")}
                        </div>
                      </td>

                      {/* Plan & Addons */}
                      <td className="py-4 px-5 min-w-44">
                        <div className="font-bold text-white text-sm">{b.plan_name}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mt-0.5">
                          {b.ticket_type}
                        </div>
                        {b.addon_summary && b.addon_summary !== "None" && (
                          <div className="mt-1.5 inline-block bg-accent/15 border border-accent/30 text-accent text-[11px] font-bold px-2 py-0.5 rounded-md">
                            🍱 {b.addon_summary}
                          </div>
                        )}
                      </td>

                      {/* Qty & Amount */}
                      <td className="py-4 px-5 text-center whitespace-nowrap">
                        <div className="text-xs font-bold text-slate-300">
                          {b.ticket_qty} Tickets
                        </div>
                        <div className="text-sm font-black text-white mt-0.5">
                          ₹{b.total_amount}
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${getStatusStyle(b.payment_status)}`}>
                          {isPaid && <CheckCircle2 size={12} />}
                          {b.payment_status || "Pending"}
                        </span>
                      </td>

                      {/* Park Entry Checkbox / Toggle */}
                      <td className="py-4 px-5 text-center whitespace-nowrap">
                        <button
                          onClick={() => toggleCheckIn(b.id, !!b.checked_in)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition shadow-sm border ${b.checked_in
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                              : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white"
                            }`}
                          title="Click to toggle park entrance check-in status"
                        >
                          <span className={`w-4 h-4 rounded flex items-center justify-center border ${b.checked_in ? "bg-emerald-500 border-emerald-400 text-black" : "border-slate-600"
                            }`}>
                            {b.checked_in && <Check size={12} strokeWidth={3} />}
                          </span>
                          <span>{b.checked_in ? "Entered" : "Check In"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-center whitespace-nowrap">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-2 bg-slate-850 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition"
                          title="View Full Booking Details"
                        >
                          <Eye size={16} />
                        </button>
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
              Showing page {currentPage} of {totalPages} ({filteredBookings.length} total)
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

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-wide">
                  Booking Details
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1 select-all">
                  Txn ID: {selectedBooking.txnid}
                </p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Customer Details
                </span>
                <p className="font-bold text-white text-base">{selectedBooking.name || selectedBooking.customer_name || "Guest"}</p>
                <p className="text-slate-300 text-xs font-semibold">{selectedBooking.mobile || selectedBooking.customer_phone || "N/A"}</p>
                <p className="text-slate-400 text-xs">{selectedBooking.email || selectedBooking.customer_email || "N/A"}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Visit Date
                </span>
                <p className="font-bold text-white text-base">
                  {new Date(selectedBooking.visit_date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
                <p className="text-xs text-slate-500">
                  Booked on: {new Date(selectedBooking.created_at).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  City
                </span>
                <p className="font-bold text-white text-base">{selectedBooking.city || "N/A"}</p>
                <p className="text-xs text-slate-500">
                  Adult: {selectedBooking.adult_qty ?? 0} | Kid 1: {selectedBooking.kid1_qty ?? 0} | Kid 2: {selectedBooking.kid2_qty ?? 0}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Plan & Ticket Type
                </span>
                <p className="font-bold text-white">{selectedBooking.plan_name}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  {selectedBooking.ticket_type}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Tickets & Total Paid
                </span>
                <p className="font-bold text-white">Qty: {selectedBooking.ticket_qty} Tickets</p>
                <p className="font-black text-accent text-xl mt-1">
                  ₹{selectedBooking.total_amount}
                </p>
              </div>
            </div>

            {/* Add-ons list if present */}
            {selectedBooking.addon_summary && selectedBooking.addon_summary !== "None" && (
              <div className="border-t border-slate-800 pt-4 space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Selected Add-ons
                </span>
                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 text-sm font-bold text-accent">
                  🍱 {selectedBooking.addon_summary}
                </div>
              </div>
            )}

            {/* Interactive Park Entry Toggle inside Modal */}
            <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                  Park Entrance Verification
                </span>
                <span className="text-xs text-slate-400">
                  {selectedBooking.checked_in ? "Customer has entered the park" : "Customer has not checked in yet"}
                </span>
              </div>
              <button
                onClick={() => toggleCheckIn(selectedBooking.id, !!selectedBooking.checked_in)}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition border flex items-center gap-2 ${selectedBooking.checked_in
                    ? "bg-emerald-500 text-black border-emerald-400"
                    : "bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                  }`}
              >
                <Check size={14} />
                {selectedBooking.checked_in ? "Entered (Checked In)" : "Mark as Entered"}
              </button>
            </div>

            <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Payment Status
              </span>
              <span className={`px-3 py-1 rounded-full font-bold ${getStatusStyle(selectedBooking.payment_status)}`}>
                {selectedBooking.payment_status || "Pending"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
