"use client";

import { useEffect, useRef, useState } from "react";
import { Link, Star } from "lucide-react";

const topRowTestimonials = [
	{
		name: "Priya Kulkarni",
		rating: 5,
		source: "Google Maps",
		testimonial:
			"Perfect weekend escape. Clean pools, exciting slides, and great staff support for families.",
	},
	{
		name: "Rohit Wankhede",
		rating: 4,
		source: "Google Maps",
		testimonial:
			"The wave pool was a highlight. Food was good and ticket process was smooth.",
	},
	{
		name: "Neha Sharma",
		rating: 5,
		source: "Google Maps",
		testimonial:
			"Kids loved every minute. Safety arrangements and lifeguards made us feel very comfortable.",
	},
	{
		name: "Aman Verma",
		rating: 5,
		source: "Google Maps",
		testimonial:
			"Great place for friends. Rides are thrilling and the environment is energetic.",
	},
	{
		name: "Sneha Patil",
		rating: 4,
		source: "Google Maps",
		testimonial:
			"Very well maintained park with friendly staff and quick service counters.",
	},
	{
		name: "Vikram Joshi",
		rating: 5,
		source: "Google Maps",
		testimonial:
			"Best waterpark day we have had in a long time. Worth every rupee.",
	},
];

const bottomRowTestimonials = [
	{
		name: "Arjun Deshmukh",
		rating: 4,
		source: "Google Maps",
		testimonial:
			"Adventure and fun at one place. The slides and boating combo was fantastic.",
	},
	{
		name: "Mitali Kale",
		rating: 5,
		source: "Google Maps",
		testimonial:
			"Clean changing rooms, organized entry, and a very lively atmosphere throughout the day.",
	},
	{
		name: "Karan Mehta",
		rating: 5,
		source: "Google Maps",
		testimonial:
			"Music, rides, and crowd vibe were amazing. We will definitely visit again.",
	},
	{
		name: "Pooja Chavan",
		rating: 4,
		source: "Google Maps",
		testimonial:
			"Loved the family-friendly environment and the way staff guided us at every step.",
	},
	{
		name: "Nikhil Bansal",
		rating: 5,
		source: "Google Maps",
		testimonial:
			"From booking to exit, everything felt seamless and properly managed.",
	},
	{
		name: "Ishita Rao",
		rating: 4,
		source: "Google Maps",
		testimonial:
			"Awesome experience with plenty of activities for both kids and adults.",
	},
];

type TestimonialCardProps = {
	name: string;
	testimonial: string;
	rating: number;
	source: string;
};

const TestimonialCard = ({ name, testimonial, rating, source }: TestimonialCardProps) => {
	return (
		<article className="interactive-card min-h-[172px] w-[280px] md:w-[340px] shrink-0 rounded-2xl border border-primary/20 bg-white p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-1 text-amber-400">
					{Array.from({ length: 5 }).map((_, index) => (
						<Star
							key={`${name}-star-${index}`}
							size={16}
							fill={index < rating ? "currentColor" : "none"}
							className={index < rating ? "text-amber-400" : "text-slate-300"}
						/>
					))}
				</div>
				<p className="text-xs font-semibold text-slate-500">{source}</p>
			</div>
			<p className="mb-4 line-clamp-4 text-sm md:text-base leading-relaxed text-slate-800">
				{testimonial}
			</p>
			<div className="mt-auto flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
					{name.charAt(0)}
				</div>
				<p className="text-sm md:text-base font-semibold text-primary">{name}</p>
			</div>
		</article>
	);
};

const Testimonials = () => {
	const topViewportRef = useRef<HTMLDivElement>(null);
	const bottomViewportRef = useRef<HTMLDivElement>(null);
	const topTrackRef = useRef<HTMLDivElement>(null);
	const bottomTrackRef = useRef<HTMLDivElement>(null);
	const [draggingTop, setDraggingTop] = useState(false);
	const [draggingBottom, setDraggingBottom] = useState(false);

	const repeatedTop = [...topRowTestimonials, ...topRowTestimonials];
	const repeatedBottom = [...bottomRowTestimonials, ...bottomRowTestimonials];

	useEffect(() => {
		const setupRow = (
			viewportEl: HTMLDivElement,
			trackEl: HTMLDivElement,
			direction: "left" | "right",
			speedPxPerFrame: number,
			setDragging: (dragging: boolean) => void
		) => {
			let rafId = 0;
			let lastTime = 0;
			let isDragging = false;
			let startX = 0;
			let startOffset = 0;
			const halfTrackWidth = trackEl.scrollWidth / 2;

			if (!halfTrackWidth) return () => {};

			let offset = direction === "left" ? 0 : -halfTrackWidth;

			const normalizeOffset = () => {
				while (offset <= -halfTrackWidth) offset += halfTrackWidth;
				while (offset > 0) offset -= halfTrackWidth;
			};

			const applyTransform = () => {
				trackEl.style.transform = `translate3d(${offset}px, 0, 0)`;
			};

			normalizeOffset();
			applyTransform();

			const animate = (time: number) => {
				if (!lastTime) lastTime = time;
				const delta = (time - lastTime) / 16.6667;
				lastTime = time;

				if (!isDragging) {
					offset += (direction === "left" ? -1 : 1) * speedPxPerFrame * delta;
					normalizeOffset();
					applyTransform();
				}

				rafId = requestAnimationFrame(animate);
			};

			const onPointerDown = (e: PointerEvent) => {
				isDragging = true;
				setDragging(true);
				startX = e.clientX;
				startOffset = offset;
				viewportEl.setPointerCapture(e.pointerId);
			};

			const onPointerMove = (e: PointerEvent) => {
				if (!isDragging) return;
				const dx = e.clientX - startX;
				offset = startOffset + dx;
				normalizeOffset();
				applyTransform();
			};

			const onPointerUp = () => {
				isDragging = false;
				setDragging(false);
			};

			viewportEl.addEventListener("pointerdown", onPointerDown);
			viewportEl.addEventListener("pointermove", onPointerMove);
			viewportEl.addEventListener("pointerup", onPointerUp);
			viewportEl.addEventListener("pointercancel", onPointerUp);
			viewportEl.addEventListener("lostpointercapture", onPointerUp);

			rafId = requestAnimationFrame(animate);

			return () => {
				cancelAnimationFrame(rafId);
				viewportEl.removeEventListener("pointerdown", onPointerDown);
				viewportEl.removeEventListener("pointermove", onPointerMove);
				viewportEl.removeEventListener("pointerup", onPointerUp);
				viewportEl.removeEventListener("pointercancel", onPointerUp);
				viewportEl.removeEventListener("lostpointercapture", onPointerUp);
			};
		};

		if (!topViewportRef.current || !bottomViewportRef.current || !topTrackRef.current || !bottomTrackRef.current) {
			return;
		}

		const cleanupTop = setupRow(topViewportRef.current, topTrackRef.current, "left", 0.58, setDraggingTop);
		const cleanupBottom = setupRow(bottomViewportRef.current, bottomTrackRef.current, "right", 0.62, setDraggingBottom);

		return () => {
			cleanupTop();
			cleanupBottom();
		};
	}, []);

	return (
		<section className="relative overflow-hidden bg-white py-8 md:py-10">
			<div className="mx-auto w-full max-w-7xl px-4 md:px-6">
				<div className="mx-auto max-w-3xl text-center">
					<p className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-xs font-bold tracking-[0.2em] text-primary uppercase">
						Visitor Reviews
					</p>
					<h2 className="uppercase text-2xl md:text-3xl font-black text-slate-900">Go Through our Reviews</h2>
					<p className="text-sm md:text-base text-slate-700">
						Highest rating & reviews in Vidarbha Region.
					</p>
					<div className="mx-auto my-4 flex w-fit items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700">
						<div className="flex items-center gap-0.5 text-amber-500">
							{Array.from({ length: 5 }).map((_, index) => (
								<Star key={`overall-star-${index}`} size={14} fill="currentColor" className="text-amber-500" />
							))}
						</div>
						<span>4.7/5 Google Maps Rating</span>
					</div>
					<a
						href="https://www.google.com/search?sca_esv=1e6d41c8364089b5&sxsrf=APpeQnvJ6UuT6MT9v1csGVUiSTAU5oitaQ:1787810058124&q=shivtirth+picnic+spot+reviews&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_xz60olg8NsrlK-yAeEzNJFQcRLmVJLLcSNze2fTmHlJdQPVdvNoSSWMa8GEagktFSpcdPrq118Qtm2qUCFGrcOEH-k_pV1ANNqzeZFyuBnpyprU3w%3D%3D&sa=X&sqi=2&ved=2ahUKEwjGx8K7j8CWAxVJha8BHb3aJ-EQyNoBKAB6BAgZEAA&ictx=1&biw=1536&bih=695&dpr=1.25"
						target="_blank"
						rel="noreferrer noopener"
						className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black shadow-md transition-all duration-200 hover:bg-accent/90 hover:shadow-lg"
					>
						See All Reviews
					</a>
				</div>

				{/* <div className="space-y-5 md:space-y-6">
					<div
						ref={topViewportRef}
						className={`relative overflow-hidden cursor-grab touch-pan-y [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] ${draggingTop ? "cursor-grabbing" : ""}`}
					>
						<div ref={topTrackRef} className="flex w-max gap-4 md:gap-6 py-2 select-none will-change-transform">
							{repeatedTop.map((item, index) => (
								<TestimonialCard key={`${item.name}-top-${index}`} name={item.name} testimonial={item.testimonial} rating={item.rating} source={item.source} />
							))}
						</div>
					</div>

					<div
						ref={bottomViewportRef}
						className={`relative overflow-hidden cursor-grab touch-pan-y [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] ${draggingBottom ? "cursor-grabbing" : ""}`}
					>
						<div ref={bottomTrackRef} className="flex w-max gap-4 md:gap-6 py-2 select-none will-change-transform">
							{repeatedBottom.map((item, index) => (
								<TestimonialCard key={`${item.name}-bottom-${index}`} name={item.name} testimonial={item.testimonial} rating={item.rating} source={item.source} />
							))}
						</div>
					</div>
				</div> */}
			</div>
		</section>
	);
};

export default Testimonials;
