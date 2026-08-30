"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getWhatsAppBookingHref } from "@/lib/whatsapp";
import { supabase } from "@/lib/supabase";

type InfluencerFormData = {
  fullName: string;
  mobile: string;
  email: string;
  birthDate: string;
  followers: string;
  profileLink: string;
  city: string;
  niche: string;
  message: string;
  acceptGuidelines: boolean;
  acceptConsent: boolean;
};

const brandGuidelines = [
  "Share final deliverables within 5-6 days after your visit.",
  "Send draft content for approval before posting.",
  "Invite @shivtirthbestwaterpark as a collaborator on reels and stories.",
  "Tag Shivtirth and avoid tagging competing brands in the same post.",
  "Use correct ride and attraction names as listed on our website.",
  "Share high-resolution videos and images only.",
  "Deliver raw and edited content via drive, email, or WhatsApp.",
  "Allow Shivtirth to repost approved content on social and ads.",
  "Use agreed campaign hashtags and captions.",
  "Failure to follow agreed deliverables may impact future collaborations.",
];

const opportunities = [
  {
    title: "On-Site Experiences",
    description:
      "Enjoy rides, attractions, and food experiences while creating reels, stories, and shorts for your audience.",
  },
  {
    title: "Giveaways and Contests",
    description:
      "Host engaging giveaway campaigns featuring day passes and group experiences for your followers.",
  },
  {
    title: "Behind-the-Scenes Content",
    description:
      "Show your audience exclusive moments including prep, arrival, and your full content creation journey at the park.",
  },
];


const InfluencerCollab = () => {
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyqZCUBwMQfPOGSuW2zkER7v7jNCN3qkQ3Ns_50bqsjcbcND_2ysaFMXd4t6_AQzhKG/exec";

  const [formData, setFormData] = useState<InfluencerFormData>({
    fullName: "",
    mobile: "",
    email: "",
    birthDate: "",
    followers: "",
    profileLink: "",
    city: "",
    niche: "",
    message: "",
    acceptGuidelines: false,
    acceptConsent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
        await supabase.from("influencers").insert({
          full_name: formData.fullName,
          mobile: formData.mobile,
          email: formData.email,
          birth_date: formData.birthDate,
          followers: formData.followers,
          profile_link: formData.profileLink,
          city: formData.city,
          niche: formData.niche,
          message: formData.message,
          accept_guidelines: formData.acceptGuidelines,
          accept_consent: formData.acceptConsent,
        });
      } catch (sbErr) {
        console.error("Supabase influencer submission error:", sbErr);
      }

      // 2. Submit to Google Sheets (legacy)
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formType: "influencer-collaboration",
          ...formData,
        }),
      });

      setSubmitted(true);
      setFormData({
        fullName: "",
        mobile: "",
        email: "",
        birthDate: "",
        followers: "",
        profileLink: "",
        city: "",
        niche: "",
        message: "",
        acceptGuidelines: false,
        acceptConsent: false,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Influencer form submission error:", err);
      setError("Failed to submit your request. Please try again or connect with us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 text-center md:px-8">
          <p className="mb-4 inline-block rounded-full border border-accent/40 bg-accent/20 px-4 py-2 font-semibold text-accent">
            Creator Partnership Program
          </p>
          <h1 className="mb-6 text-4xl font-black uppercase leading-tight md:text-6xl">
            Join The Shivtirth
            <br />
            Influencer Family
          </h1>
        </div>
      </div>


      <section className="px-4 pb-12 pt-6 md:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-3">

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-lg md:p-8">
              <h3 className="text-2xl font-black">Collaboration Request Form</h3>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full border-x-0 border-b-2 border-t-0 border-slate-200 bg-transparent px-0 py-4 text-base text-slate-900 transition-colors focus:border-accent focus:outline-none"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label htmlFor="mobile" className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Mobile Number *
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full border-x-0 border-b-2 border-t-0 border-slate-200 bg-transparent px-0 py-4 text-base text-slate-900 transition-colors focus:border-accent focus:outline-none"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-x-0 border-b-2 border-t-0 border-slate-200 bg-transparent px-0 py-4 text-base text-slate-900 transition-colors focus:border-accent focus:outline-none"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="birthDate" className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Birth Date *
                  </label>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    className="w-full border-x-0 border-b-2 border-t-0 border-slate-200 bg-transparent px-0 py-4 text-base text-slate-900 transition-colors focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <label htmlFor="followers" className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Followers / Subscribers *
                  </label>
                  <input
                    id="followers"
                    name="followers"
                    type="text"
                    value={formData.followers}
                    onChange={handleChange}
                    required
                    className="w-full border-x-0 border-b-2 border-t-0 border-slate-200 bg-transparent px-0 py-4 text-base text-slate-900 transition-colors focus:border-accent focus:outline-none"
                    placeholder="Ex: 25K on Instagram"
                  />
                </div>

                <div>
                  <label htmlFor="profileLink" className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Instagram / YouTube Profile Link *
                  </label>
                  <input
                    id="profileLink"
                    name="profileLink"
                    type="url"
                    value={formData.profileLink}
                    onChange={handleChange}
                    required
                    className="w-full border-x-0 border-b-2 border-t-0 border-slate-200 bg-transparent px-0 py-4 text-base text-slate-900 transition-colors focus:border-accent focus:outline-none"
                    placeholder="https://www.instagram.com/yourhandle"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <label htmlFor="city" className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    City *
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full border-x-0 border-b-2 border-t-0 border-slate-200 bg-transparent px-0 py-4 text-base text-slate-900 transition-colors focus:border-accent focus:outline-none"
                    placeholder="Nagpur"
                  />
                </div>

                <div>
                  <label htmlFor="niche" className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Content Niche
                  </label>
                  <input
                    id="niche"
                    name="niche"
                    type="text"
                    value={formData.niche}
                    onChange={handleChange}
                    className="w-full border-x-0 border-b-2 border-t-0 border-slate-200 bg-transparent px-0 py-4 text-base text-slate-900 transition-colors focus:border-accent focus:outline-none"
                    placeholder="Travel, Lifestyle, Family, Adventure"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full resize-none border-x-0 border-b-2 border-t-0 border-slate-200 bg-transparent px-0 py-4 text-base text-slate-900 transition-colors focus:border-accent focus:outline-none"
                  placeholder="Share your campaign idea and expected collaboration deliverables."
                />
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="acceptGuidelines"
                    checked={formData.acceptGuidelines}
                    onChange={handleChange}
                    required
                    className="mt-1 h-4 w-4 accent-teal-700"
                  />
                  <span>I agree to follow all creator guidelines, tag rules, and timeline commitments.</span>
                </label>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="acceptConsent"
                    checked={formData.acceptConsent}
                    onChange={handleChange}
                    required
                    className="mt-1 h-4 w-4 accent-teal-700"
                  />
                  <span>I consent to Shivtirth using approved collaboration content across digital channels.</span>
                </label>
              </div>

              {submitted && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  Thank you. Your influencer collaboration request has been received.
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-4 font-bold text-black shadow-lg shadow-accent/30 transition hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
              >
                {isSubmitting ? "Submitting..." : "Submit Collaboration Request"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-100 bg-white p-6 shadow-lg md:p-8">
          <h3 className="mb-6 text-2xl font-black md:text-3xl">Brand Guidelines To Follow</h3>
          <ol className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
            {brandGuidelines.map((item, index) => (
              <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-bold text-slate-900">{index + 1}.</span> {item}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 pb-8 pt-6 md:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-100 bg-white p-6 shadow-lg md:p-8">
          <h3 className="mb-6 text-2xl font-black md:text-3xl">Collaboration Opportunities</h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {opportunities.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h4 className="mb-2 text-lg font-black">{item.title}</h4>
                <p className="text-sm text-slate-700">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};

export default InfluencerCollab;