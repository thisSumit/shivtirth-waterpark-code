"use client";

import { useState } from "react";
import { Star, ExternalLink, Quote } from "lucide-react";
import AnimatedHeading from "./ui/AnimatedHeading";
import { ScrollReveal, ScrollStaggerItem } from "./ui/ScrollReveal";

const googleReviewsLink =
	"https://www.google.com/search?sca_esv=1e6d41c8364089b5&sxsrf=APpeQnvJ6UuT6MT9v1csGVUiSTAU5oitaQ:1787810058124&q=shivtirth+picnic+spot+reviews&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_xz60olg8NsrlK-yAeEzNJFQcRLmVJLLcSNze2fTmHlJdQPVdvNoSSWMa8GEagktFSpcdPrq118Qtm2qUCFGrcOEH-k_pV1ANNqzeZFyuBnpyprU3w%3D%3D&sa=X&sqi=2&ved=2ahUKEwjGx8K7j8CWAxVJha8BHb3aJ-EQyNoBKAB6BAgZEAA&ictx=1&biw=1536&bih=695&dpr=1.25";
const instagramLink = "https://www.instagram.com/shivtirthbestwaterpark/";
const aboutLink = "/about";

const highlightStats = [
	{ value: "100K+", label: "Happy People", href: googleReviewsLink },
	{ value: "4.7", label: "Google Rating", href: googleReviewsLink },
	{ value: "17K+", label: "Reviews", href: googleReviewsLink },
	{ value: "150+", label: "Activities", href: instagramLink },
	{ value: "95K", label: "Followers", href: instagramLink },
	{ value: "9+", label: "Years Legacy", href: aboutLink },
];

const visitorReviews = [
	{
		name: "Priya Kulkarni",
		rating: 5,
		source: "Google Maps",
		review: "Perfect weekend escape. Clean pools, exciting slides, and great staff support for families.",
	},
	{
		name: "Rohit Wankhede",
		rating: 5,
		source: "Google Maps",
		review: "The wave pool and waterfall were highlights. Food was good and ticket process was very smooth.",
	},
	{
		name: "Neha Sharma",
		rating: 5,
		source: "Google Maps",
		review: "Kids loved every minute. Safety arrangements and lifeguards made us feel very comfortable.",
	},
	{
		name: "Arjun Deshmukh",
		rating: 5,
		source: "Google Maps",
		review: "Adventure and fun at one place! The slides, boating, and adventure combo was fantastic.",
	},
	{
		name: "Mitali Kale",
		rating: 5,
		source: "Google Maps",
		review: "Clean changing rooms, organized entry, and a very lively atmosphere throughout the day.",
	},
	{
		name: "Karan Mehta",
		rating: 5,
		source: "Google Maps",
		review: "Music, rides, and crowd vibe were amazing. Worth every rupee! We will definitely visit again.",
	},
];

const Testimonials = () => {
	const [activeStat, setActiveStat] = useState(-1);

	return (
		<section className="relative overflow-hidden bg-slate-50/50 py-8 border-y border-slate-100">
			<div className="mx-auto w-full max-w-7xl px-4 md:px-6">
				<AnimatedHeading
					title="1st Preference of People"
					subtitle="Highest Rating & Reviews in Vidarbha Region"
				/>

				{/* 5 Highlight Stat Counter Bar */}
				<ScrollReveal direction="up" delay={0.15} duration={0.5}>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
						{highlightStats.map((stat, index) => {
							const isActive = index === activeStat;

							return (
								<ScrollStaggerItem key={stat.label}>
									<a
										href={stat.href}
										target="_blank"
										rel="noreferrer noopener"
										onMouseEnter={() => setActiveStat(index)}
										onMouseLeave={() => setActiveStat(-1)}
										className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border px-3 py-3 text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${isActive
											? "border-amber-400 bg-amber-400 text-slate-950 shadow-md shadow-amber-300/30"
											: "border-slate-200/80 bg-white text-slate-800 hover:border-amber-300 hover:bg-amber-50/50"
											}`}
									>
										<div className="flex items-center justify-between gap-1">
											<span
												className="text-xl md:text-2xl font-bold font-times tracking-tight"
												style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
											>
												{stat.value}
											</span>
										</div>
										<p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600 group-hover:text-slate-900">
											{stat.label}
										</p>
									</a>
								</ScrollStaggerItem>
							);
						})}
					</div>
				</ScrollReveal>

				{/* Real Visitor Review Cards */}
				{/* <ScrollReveal direction="up" delay={0.25} duration={0.6}>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{visitorReviews.map((rev) => (
							<ScrollStaggerItem key={rev.name}>
								<div className="group relative flex flex-col justify-between h-full rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-1">
									<div>
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-0.5 text-amber-400">
												{Array.from({ length: rev.rating }).map((_, i) => (
													<Star key={i} size={13} fill="currentColor" />
												))}
											</div>
											<span className="text-[10px] font-semibold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
												{rev.source}
											</span>
										</div>

										<p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal mb-3 relative">
											<Quote className="inline-block w-3.5 h-3.5 text-amber-400 mr-1 -mt-1 opacity-60" />
											{rev.review}
										</p>
									</div>

									<div className="flex items-center gap-2.5 pt-2 border-t border-slate-100 mt-auto">
										<div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-xs uppercase shadow-sm">
											{rev.name.charAt(0)}
										</div>
										<div>
											<p className="text-xs font-semibold text-slate-900 leading-tight">{rev.name}</p>
											<span className="text-[10px] text-amber-600 font-medium">Verified Visitor</span>
										</div>
									</div>
								</div>
							</ScrollStaggerItem>
						))}
					</div>
				</ScrollReveal> */}

				<ScrollReveal direction="up" delay={0.35} duration={0.5} className="mt-8 text-center">
					<a
						href={googleReviewsLink}
						target="_blank"
						rel="noreferrer noopener"
						className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-black shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
					>
						See All Google Reviews
					</a>
				</ScrollReveal>
			</div>
		</section>
	);
};

export default Testimonials;
