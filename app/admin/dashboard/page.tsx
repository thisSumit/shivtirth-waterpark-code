"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import {
  IndianRupee,
  Ticket,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Users,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  RefreshCw
} from "lucide-react";

type Booking = {
  id: string;
  txnid: string;
  payment_status: string;
  total_amount: number;
  ticket_qty: number;
  created_at: string;
  visit_date: string;
};

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contactsCount, setContactsCount] = useState(0);
  const [influencersCount, setInfluencersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "last_month" | "year" | "all">("month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("id, txnid, payment_status, total_amount, ticket_qty, created_at, visit_date");

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);

      // 2. Fetch contact count
      const { count: contactsCountData, error: contactsError } = await supabase
        .from("contacts")
        .select("*", { count: "exact", head: true });

      if (contactsError) throw contactsError;
      setContactsCount(contactsCountData || 0);

      // 3. Fetch influencer count
      const { count: influencersCountData, error: influencersError } = await supabase
        .from("influencers")
        .select("*", { count: "exact", head: true });

      if (influencersError) throw influencersError;
      setInfluencersCount(influencersCountData || 0);

    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter helper functions
  const filteredBookings = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    // Start of current week (Monday)
    const currentDay = now.getDay();
    const diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfWeekTime = startOfWeek.getTime();

    // Start of current month
    const startOfMonthTime = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    // Last Month
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Start of current year
    const startOfYearTime = new Date(now.getFullYear(), 0, 1).getTime();

    return bookings.filter((b) => {
      const bDate = new Date(b.created_at).getTime();

      if (dateFilter === "today") {
        return bDate >= startOfToday;
      }
      if (dateFilter === "week") {
        return bDate >= startOfWeekTime;
      }
      if (dateFilter === "month") {
        return bDate >= startOfMonthTime;
      }
      if (dateFilter === "last_month") {
        return bDate >= startOfLastMonth.getTime() && bDate <= endOfLastMonth.getTime();
      }
      if (dateFilter === "year") {
        return bDate >= startOfYearTime;
      }
      if (dateFilter === "all") {
        if (customStart && customEnd) {
          const cStart = new Date(customStart).getTime();
          const cEnd = new Date(customEnd + "T23:59:59").getTime();
          return bDate >= cStart && bDate <= cEnd;
        }
      }
      return true;
    });
  }, [bookings, dateFilter, customStart, customEnd]);

  // Aggregated Statistics
  const stats = useMemo(() => {
    let revenue = 0;
    let ticketsSold = 0;
    let successful = 0;
    let failed = 0;
    let pending = 0;

    filteredBookings.forEach((b) => {
      if (b.payment_status === "Paid") {
        revenue += Number(b.total_amount) || 0;
        ticketsSold += Number(b.ticket_qty) || 0;
        successful += 1;
      } else if (b.payment_status === "Failed") {
        failed += 1;
      } else {
        pending += 1;
      }
    });

    return {
      revenue,
      ticketsSold,
      successful,
      failed,
      pending,
      totalBookings: filteredBookings.length
    };
  }, [filteredBookings]);

  // SVG Chart Data Generation
  // Groups revenue by date for the last 7 days or last 6 months depending on filter
  const chartData = useMemo(() => {
    const grouped: { [key: string]: number } = {};

    filteredBookings.forEach((b) => {
      if (b.payment_status !== "Paid") return;
      const dateStr = new Date(b.created_at).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
      grouped[dateStr] = (grouped[dateStr] || 0) + b.total_amount;
    });

    // Sort dates chronologically (or take the last 8 entries for presentation)
    const sortedKeys = Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const displayKeys = sortedKeys.slice(-8);

    const values = displayKeys.map((k) => grouped[k]);
    const maxVal = Math.max(...values, 1000);

    return {
      labels: displayKeys,
      values,
      maxVal,
    };
  }, [filteredBookings]);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time analytics and reservation insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition"
            title="Refresh Data"
          >
            <RefreshCw size={18} />
          </button>

          {/* Date Filter Selector */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-sm font-semibold">
            {(["today", "week", "month", "year", "all"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${dateFilter === filter
                    ? "bg-accent text-black font-bold"
                    : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                {filter === "all" ? "Custom" : filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Date Inputs */}
      {dateFilter === "all" && (
        <div className="flex flex-wrap gap-4 items-center bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">From</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">To</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white"
            />
          </div>
          <p className="text-xs text-slate-500">
            Note: Filter bounds apply to transaction booking timestamp.
          </p>
        </div>
      )}

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-accent group-hover:scale-110 transition">
            <IndianRupee size={64} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Revenue
          </p>
          <h3 className="text-3xl font-black text-white mt-2">
            ₹{stats.revenue.toLocaleString("en-IN")}
          </h3>
          <p className="text-xs text-green-400 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp size={14} />
            From successful orders
          </p>
        </div>

        {/* Tickets Sold */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-500 group-hover:scale-110 transition">
            <Ticket size={64} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Tickets Sold
          </p>
          <h3 className="text-3xl font-black text-white mt-2">
            {stats.ticketsSold}
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            Total tickets booked
          </p>
        </div>

        {/* Successful Bookings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-green-500 group-hover:scale-110 transition">
            <CheckCircle2 size={64} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Paid Bookings
          </p>
          <h3 className="text-3xl font-black text-white mt-2">
            {stats.successful}
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            Rate: {stats.totalBookings > 0 ? Math.round((stats.successful / stats.totalBookings) * 100) : 0}% success ratio
          </p>
        </div>

        {/* Failed Bookings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500 group-hover:scale-110 transition">
            <XCircle size={64} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Failed Bookings
          </p>
          <h3 className="text-3xl font-black text-white mt-2">
            {stats.failed}
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            Uncompleted checkouts: {stats.pending}
          </p>
        </div>
      </div>

      {/* Forms & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Custom SVG Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Revenue Trend
            </h3>
            <span className="text-xs text-slate-500">
              Paid sales over filtered range
            </span>
          </div>

          {chartData.values.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
              No sales data in this date range.
            </div>
          ) : (
            <div className="relative h-64 w-full">
              {/* Simple Custom SVG Bar Chart */}
              <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                {/* Horizontal Guide Lines */}
                <line x1="30" y1="20" x2="480" y2="20" stroke="#1e293b" strokeDasharray="4" />
                <line x1="30" y1="80" x2="480" y2="80" stroke="#1e293b" strokeDasharray="4" />
                <line x1="30" y1="140" x2="480" y2="140" stroke="#1e293b" strokeDasharray="4" />
                <line x1="30" y1="200" x2="480" y2="200" stroke="#334155" />

                {/* Bars */}
                {chartData.values.map((val, idx) => {
                  const barWidth = 32;
                  const totalBars = chartData.values.length;
                  const spacing = (450 - barWidth * totalBars) / (totalBars + 1);
                  const x = 30 + spacing + idx * (barWidth + spacing);
                  const pct = val / chartData.maxVal;
                  const barHeight = pct * 180;
                  const y = 200 - barHeight;

                  return (
                    <g key={idx} className="group/bar">
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        rx="4"
                        fill="url(#barGradient)"
                        className="hover:fill-accent transition-all duration-300 cursor-pointer"
                      />
                      {/* Tooltip text */}
                      <text
                        x={x + barWidth / 2}
                        y={Math.max(y - 8, 15)}
                        textAnchor="middle"
                        fill="#fef08a"
                        fontSize="9"
                        fontWeight="bold"
                        className="opacity-0 group-hover/bar:opacity-100 transition duration-300"
                      >
                        ₹{val}
                      </text>
                    </g>
                  );
                })}

                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Labels Row */}
              <div className="flex justify-between pl-6 pr-4 mt-2">
                {chartData.labels.map((lbl, idx) => (
                  <span key={idx} className="text-[10px] font-bold text-slate-500 rotate-12 origin-top-left">
                    {lbl}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info - Enquiries & Collabs */}
        <div className="space-y-6">
          {/* Contacts Counter */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg flex items-center justify-between group hover:border-slate-700 transition">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Contact Enquiries
              </p>
              <h4 className="text-3xl font-black text-white mt-1">
                {contactsCount}
              </h4>
              <p className="text-xs text-slate-500 mt-2">
                Submitted general contact inquiries
              </p>
            </div>
            <div className="p-4 bg-slate-800 text-accent rounded-2xl group-hover:scale-105 transition">
              <MessageSquare size={24} />
            </div>
          </div>

          {/* Influencers Counter */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg flex items-center justify-between group hover:border-slate-700 transition">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Influencer Collabs
              </p>
              <h4 className="text-3xl font-black text-white mt-1">
                {influencersCount}
              </h4>
              <p className="text-xs text-slate-500 mt-2">
                Partnership application submissions
              </p>
            </div>
            <div className="p-4 bg-slate-800 text-blue-400 rounded-2xl group-hover:scale-105 transition">
              <Users size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
