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
  // Groups revenue by date/time based on selected dateFilter with full type safety & proper bucketing
  const chartData = useMemo(() => {
    const paidBookings = filteredBookings.filter((b) => b.payment_status === "Paid");

    let labels: string[] = [];
    let values: number[] = [];
    let counts: number[] = [];

    const now = new Date();

    if (dateFilter === "today") {
      // 6 time blocks for today
      const slots = [
        { label: "12am-4am", start: 0, end: 4 },
        { label: "4am-8am", start: 4, end: 8 },
        { label: "8am-12pm", start: 8, end: 12 },
        { label: "12pm-4pm", start: 12, end: 16 },
        { label: "4pm-8pm", start: 16, end: 20 },
        { label: "8pm-12am", start: 20, end: 24 },
      ];
      labels = slots.map((s) => s.label);
      values = new Array(6).fill(0);
      counts = new Array(6).fill(0);

      paidBookings.forEach((b) => {
        const d = new Date(b.created_at);
        const hour = d.getHours();
        const idx = slots.findIndex((s) => hour >= s.start && hour < s.end);
        if (idx !== -1) {
          values[idx] += Number(b.total_amount) || 0;
          counts[idx] += 1;
        }
      });
    } else if (dateFilter === "week") {
      // 7 Days of current week (Monday to Sunday)
      const currentDay = now.getDay();
      const diffToMon = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
      const monday = new Date(now.getFullYear(), now.getMonth(), diffToMon);

      labels = [];
      values = [];
      counts = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];
        labels.push(d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }));

        let sum = 0;
        let count = 0;
        paidBookings.forEach((b) => {
          const bDateStr = new Date(b.created_at).toISOString().split("T")[0];
          if (bDateStr === dateStr) {
            sum += Number(b.total_amount) || 0;
            count += 1;
          }
        });
        values.push(sum);
        counts.push(count);
      }
    } else if (dateFilter === "month") {
      // Days of current month
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const dayMap: { [day: number]: { sum: number; count: number; dateStr: string } } = {};
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, month, d);
        dayMap[d] = {
          sum: 0,
          count: 0,
          dateStr: dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        };
      }

      paidBookings.forEach((b) => {
        const d = new Date(b.created_at);
        if (d.getFullYear() === year && d.getMonth() === month) {
          const dayNum = d.getDate();
          if (dayMap[dayNum]) {
            dayMap[dayNum].sum += Number(b.total_amount) || 0;
            dayMap[dayNum].count += 1;
          }
        }
      });

      const days = Object.keys(dayMap).map(Number);
      labels = days.map((d) => dayMap[d].dateStr);
      values = days.map((d) => dayMap[d].sum);
      counts = days.map((d) => dayMap[d].count);
    } else if (dateFilter === "year") {
      // 12 Months of current year
      const year = now.getFullYear();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      labels = monthNames;
      values = new Array(12).fill(0);
      counts = new Array(12).fill(0);

      paidBookings.forEach((b) => {
        const d = new Date(b.created_at);
        if (d.getFullYear() === year) {
          const m = d.getMonth();
          values[m] += Number(b.total_amount) || 0;
          counts[m] += 1;
        }
      });
    } else {
      // Custom or ALL: Chronological date grouping
      const dateMap: { [key: string]: { sum: number; count: number; dateDisplay: string; timestamp: number } } = {};

      paidBookings.forEach((b) => {
        const d = new Date(b.created_at);
        const key = d.toISOString().split("T")[0];
        const dateDisplay = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });

        if (!dateMap[key]) {
          dateMap[key] = { sum: 0, count: 0, dateDisplay, timestamp: d.getTime() };
        }
        dateMap[key].sum += Number(b.total_amount) || 0;
        dateMap[key].count += 1;
      });

      const sortedKeys = Object.keys(dateMap).sort((a, b) => dateMap[a].timestamp - dateMap[b].timestamp);
      const displayKeys = sortedKeys.length > 25 ? sortedKeys.slice(-25) : sortedKeys;

      labels = displayKeys.map((k) => dateMap[k].dateDisplay);
      values = displayKeys.map((k) => dateMap[k].sum);
      counts = displayKeys.map((k) => dateMap[k].count);
    }

    const rawMax = Math.max(...values, 0);
    let maxVal = 1000;
    if (rawMax > 0) {
      const pow = Math.pow(10, Math.floor(Math.log10(rawMax)));
      maxVal = Math.ceil(rawMax / (pow * 0.5)) * (pow * 0.5);
      if (maxVal <= rawMax) maxVal = rawMax * 1.15;
    }

    const totalRevenue = values.reduce((a, b) => a + b, 0);

    return {
      labels,
      values,
      counts,
      maxVal,
      totalRevenue,
      peakRevenue: rawMax,
    };
  }, [filteredBookings, dateFilter]);

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
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                Revenue Trend
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Total Period Sales: <span className="text-accent font-bold">₹{chartData.totalRevenue.toLocaleString("en-IN")}</span>
              </p>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700 font-semibold self-start sm:self-auto">
              Max Peak: ₹{chartData.peakRevenue.toLocaleString("en-IN")}
            </span>
          </div>

          {chartData.values.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
              No sales data in this date range.
            </div>
          ) : (
            <div className="relative h-64 w-full">
              {/* High-Precision SVG Bar Chart with Y-Axis & X-Axis Alignment */}
              <svg className="w-full h-full" viewBox="0 0 650 220">
                {/* Y-Axis Grid Lines & Ticks */}
                {[0, 0.33, 0.66, 1].map((ratio, i) => {
                  const y = 180 - ratio * 150;
                  const tickVal = Math.round(chartData.maxVal * ratio);
                  const formattedVal =
                    tickVal >= 100000
                      ? `₹${(tickVal / 100000).toFixed(1)}L`
                      : tickVal >= 1000
                      ? `₹${(tickVal / 1000).toFixed(1)}k`
                      : `₹${tickVal}`;

                  return (
                    <g key={i}>
                      <line
                        x1="65"
                        y1={y}
                        x2="630"
                        y2={y}
                        stroke={i === 0 ? "#334155" : "#1e293b"}
                        strokeDasharray={i === 0 ? "none" : "4"}
                      />
                      <text
                        x="55"
                        y={y + 4}
                        textAnchor="end"
                        fill="#64748b"
                        fontSize="10"
                        fontWeight="600"
                      >
                        {formattedVal}
                      </text>
                    </g>
                  );
                })}

                {/* Bars & Labels */}
                {chartData.values.map((val, idx) => {
                  const totalCount = chartData.values.length;
                  const availWidth = 565; // from x=65 to x=630
                  const colWidth = availWidth / totalCount;
                  const barWidth = Math.min(32, Math.max(8, colWidth * 0.55));
                  const centerX = 65 + idx * colWidth + colWidth / 2;
                  const x = centerX - barWidth / 2;
                  const barHeight = (val / chartData.maxVal) * 150;
                  const y = 180 - barHeight;

                  // Label display step if too many bars
                  const step = totalCount > 20 ? 4 : totalCount > 12 ? 2 : 1;
                  const showLabel = idx % step === 0 || idx === totalCount - 1;

                  return (
                    <g key={idx} className="group/bar">
                      {/* Interactive Bar */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={Math.max(barHeight, 3)}
                        rx="4"
                        fill={val > 0 ? "url(#barGradient)" : "#1e293b"}
                        className="hover:brightness-125 transition-all duration-300 cursor-pointer"
                      />

                      {/* Bar Top Value Label on Hover */}
                      <g className="opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                        <rect
                          x={Math.max(10, Math.min(650 - 90, centerX - 45))}
                          y={Math.max(y - 28, 5)}
                          width="90"
                          height="22"
                          rx="6"
                          fill="#0f172a"
                          stroke="#eab308"
                          strokeWidth="1"
                        />
                        <text
                          x={Math.max(10, Math.min(650 - 90, centerX - 45)) + 45}
                          y={Math.max(y - 13, 20)}
                          textAnchor="middle"
                          fill="#fef08a"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          ₹{val.toLocaleString("en-IN")} ({chartData.counts[idx]})
                        </text>
                      </g>

                      {/* X-Axis Date/Time Label */}
                      {showLabel && (
                        <text
                          x={centerX}
                          y="205"
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="9"
                          fontWeight="600"
                        >
                          {chartData.labels[idx]}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
              </svg>
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
