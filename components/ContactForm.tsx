"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/lib/useSiteSettings";

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const ContactForm = () => {
  const { settings } = useSiteSettings();

  // IMPORTANT: Replace this with your actual Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxY9ulYygp1MMUuf6_aXQdQuFnMDwLILjPmtEXwUlE43wbITkX0Avr0FB-PZtfA7t03gQ/exec";
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (submitted) setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      // 1. Submit to Supabase
      try {
        await supabase.from("contacts").insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        });
      } catch (sbErr) {
        console.error("Supabase contacts submission error:", sbErr);
      }

      // 2. Submit to Google Sheets (legacy)
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      // Note: with 'no-cors' mode, we can't read the response
      // but if no error is thrown, we can assume success
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      
      // Scroll to success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit form. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      {/* Top spacer under fixed navbar */}

<div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-16 text-center">
          <h1 className="inline-block px-4 py-2 rounded-full bg-accent/20 border border-accent/40 text-accent font-semibold mb-4">
            Contact Shivtirth Water Park
          </h1>
          <h1 className="text-4xl uppercase md:text-6xl font-black mb-6 leading-tight">
            Get In Touch
          </h1>
          <p className="text-slate-300 max-w-3xl mx-auto mb-8 text-lg">
            Get in touch with Shivtirth Water Park for bookings, timings, and queries. Visit or contact the best water park in Nagpur for family fun.
          </p>
        </div>
      </div>
      <section className="pt-16 pb-20 px-4 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Sidebar - Contact Info */}
            <aside className="lg:col-span-1">
              <div className="sticky top-28 space-y-8">
                <div className="rounded-3xl bg-white p-6 shadow-lg border border-slate-100">
                  <h3 className="text-xl font-black mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <Link href={`tel:${settings.contactPhone}`} className="flex items-start gap-4 group">
                      <span className="p-3 rounded-full bg-accent/10 text-slate-500">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.1.37 2.28.57 3.5.57a1 1 0 011 1V21a1 1 0 01-1 1C10.85 22 2 13.15 2 2a1 1 0 011-1h4.5a1 1 0 011 1c0 1.22.2 2.4.57 3.5a1 1 0 01-.24 1.01l-2.2 2.28z" />
                        </svg>
                      </span>
                      <span>
                        <p className="text-sm text-slate-500 mb-1">Phone</p>
                        <p className="font-medium group-hover:text-slate-900 transition-colors">
                          {settings.contactPhone}
                        </p>
                      </span>
                    </Link>

                    <Link href={`mailto:${settings.contactEmail}`} className="flex items-start gap-4 group">
                      <span className="p-3 rounded-full bg-accent/10 text-slate-500">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                      </span>
                      <span>
                        <p className="text-sm text-slate-500 mb-1">Email</p>
                        <p className="font-medium group-hover:text-slate-900 transition-colors">
                          {settings.contactEmail}
                        </p>
                      </span>
                    </Link>

                    <div className="flex items-start gap-4">
                      <span className="p-3 rounded-full bg-accent/10 text-slate-500">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                        </svg>
                      </span>
                      <span>
                        <p className="text-sm text-slate-500 mb-1">Location</p>
                        <p className="font-medium">
                          <Link href="https://maps.app.goo.gl/yXiw1fawYjGef5co6" target="_blank" rel="noopener noreferrer">
                            Shivtirth Best Water Park, Umari Dam, near Saoner, Nagpur
                          </Link>
                        </p>
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      <span className="p-3 rounded-full bg-accent/10 text-slate-500">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm8-2h-3.17A3 3 0 0014 4h-4a3 3 0 00-2.83 2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2z" />
                        </svg>
                      </span>
                      <span>
                        <p className="text-sm text-slate-500 mb-1">⁠Water Park:</p>
                        <p className="font-medium">10:00 AM – 04:00 PM</p>
                        <p className="text-sm text-slate-500 mb-1">⁠Boating Park:</p>
                        <p className="font-medium">10:00 AM – 02:00 PM</p>
                        <p className="text-sm text-slate-500 mb-1">⁠Amusement / Adventure Park:</p>
                        <p className="font-medium">04:00 PM – 06:00 PM</p>⁠  
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 shadow-lg relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 h-28 w-28 bg-accent/30 rounded-full blur-2xl" />
                  <h4 className="text-xl font-black mb-2">Need help fast?</h4>
                  <p className="text-slate-200 mb-4">Call our team for quick assistance.</p>
                  <Link
                    href={`tel:${settings.contactPhone}`}
                    className="inline-flex items-center justify-center rounded-full bg-accent text-black font-bold py-3 px-5 shadow-md shadow-accent/30 hover:scale-105 transition"
                  >
                    📞 Call Now
                  </Link>
                </div>
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl bg-white p-6 md:p-8 shadow-lg border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-0 py-4 bg-transparent border-x-0 border-t-0 border-b-2 border-slate-200 text-slate-900 text-base focus:border-accent focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-0 py-4 bg-transparent border-x-0 border-t-0 border-b-2 border-slate-200 text-slate-900 text-base focus:border-accent focus:outline-none transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-0 py-4 bg-transparent border-x-0 border-t-0 border-b-2 border-slate-200 text-slate-900 text-base focus:border-accent focus:outline-none transition-colors"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-0 py-4 bg-transparent border-x-0 border-t-0 border-b-2 border-slate-200 text-slate-900 text-base focus:border-accent focus:outline-none transition-colors"
                      placeholder="Booking, Group visit, General query..."
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                    Additional Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-0 py-4 bg-transparent border-x-0 border-t-0 border-b-2 border-slate-200 text-slate-900 text-base focus:border-accent focus:outline-none transition-colors resize-none"
                    placeholder="Tell us more about your requirements..."
                  />
                </div>

                {submitted && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 text-green-800 px-4 py-3 text-sm">
                    ✓ Thank you! Your inquiry has been received. We'll get back to you shortly.
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">
                    ✗ {error}
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center rounded-full bg-accent text-black font-bold py-4 px-6 shadow-lg shadow-accent/30 transition hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                  </button>
                </div>

                <p className="text-xs text-slate-500 text-center">We typically respond within 1 business day.</p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export { ContactForm };