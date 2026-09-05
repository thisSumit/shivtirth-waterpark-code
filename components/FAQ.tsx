"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import AnimatedHeading from './ui/AnimatedHeading';
import { ScrollReveal } from './ui/ScrollReveal';

const FAQ = () => {
  return (
    <section className='px-4 md:px-8 py-8 max-w-6xl mx-auto'>
      <AnimatedHeading
        title="FAQ"
        subtitle="Find answers to common questions about Shivtirth Water Park"
      />

      <ScrollReveal direction="up" delay={0.2} duration={0.6}>
        <Accordion type="single" collapsible className="w-full space-y-3">
          <AccordionItem value="item-0" className="border border-slate-200/80 rounded-xl px-4 bg-white/80 shadow-sm transition-all duration-300 hover:border-amber-400/60">
            <AccordionTrigger className="font-semibold text-slate-800 hover:text-amber-600 text-left">
              Why do people love Shivtirth Water Park?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-slate-600">
              <p>
               All enjoyments under one roof, in reasonable rates, with many facilities and specialities.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-1" className="border border-slate-200/80 rounded-xl px-4 bg-white/80 shadow-sm transition-all duration-300 hover:border-amber-400/60">
            <AccordionTrigger className="font-semibold text-slate-800 hover:text-amber-600 text-left">
              Where is Shivtirth Water Park located?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm leading-relaxed">
              <p>
                Shivtirth Water Park is located at Umari Dam, near Saoner, Nagpur, on Nagpur Pandhurna/Baitul Highway, 47 km from Nagpur, surrounded by the scenic Satpuda mountains for a refreshing escape into nature.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border border-slate-200/80 rounded-xl px-4 bg-white/80 shadow-sm transition-all duration-300 hover:border-amber-400/60">
            <AccordionTrigger className="font-semibold text-slate-800 hover:text-amber-600 text-left">
              What are the opening and closing timings of Shivtirth Water Park?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm leading-relaxed">
              <p>
                Shivtirth Water Park is open daily from 9:00 AM to 6:00 PM. Timings may change during festivals or private events.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border border-slate-200/80 rounded-xl px-4 bg-white/80 shadow-sm transition-all duration-300 hover:border-amber-400/60">
            <AccordionTrigger className="font-semibold text-slate-800 hover:text-amber-600 text-left">
              What activities can visitors enjoy at Shivtirth?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm leading-relaxed">
              <p>
                Visitors can enjoy water park, waterfall, boating park, amusement park, adventure park, bird park, cultural activities, agro activities, night stay, wedding, and much more, perfect for families, schools, and corporate groups.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border border-slate-200/80 rounded-xl px-4 bg-white/80 shadow-sm transition-all duration-300 hover:border-amber-400/60">
            <AccordionTrigger className="font-semibold text-slate-800 hover:text-amber-600 text-left">
              Can I host my destination wedding at Shivtirth Water Park?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm leading-relaxed">
              <p>
                Absolutely! Shivtirth offers a beautiful natural setting with spacious lawns, water views, and elegant venues, perfect for destination weddings, receptions, and pre-wedding celebrations with customized decoration and catering options.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border border-slate-200/80 rounded-xl px-4 bg-white/80 shadow-sm transition-all duration-300 hover:border-amber-400/60">
            <AccordionTrigger className="font-semibold text-slate-800 hover:text-amber-600 text-left">
              Do you offer group or school picnic packages?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm leading-relaxed">
              <p>
                Yes! We offer special packages for schools, colleges, corporates, and families with exciting discounts and meal options. Visit our Packages Page for details.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border border-slate-200/80 rounded-xl px-4 bg-white/80 shadow-sm transition-all duration-300 hover:border-amber-400/60">
            <AccordionTrigger className="font-semibold text-slate-800 hover:text-amber-600 text-left">
              Are there food and dining options available?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm leading-relaxed">
              <p>
                Yes, the park offers a multi-cuisine restaurant and food stalls serving delicious meals, snacks, and beverages throughout the day.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7" className="border border-slate-200/80 rounded-xl px-4 bg-white/80 shadow-sm transition-all duration-300 hover:border-amber-400/60">
            <AccordionTrigger className="font-semibold text-slate-800 hover:text-amber-600 text-left">
              Is outside food allowed inside the park?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm leading-relaxed">
              <p>
                To ensure safety and hygiene, outside food and drinks are not allowed. However, visitors can enjoy a wide range of food options inside the park.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8" className="border border-slate-200/80 rounded-xl px-4 bg-white/80 shadow-sm transition-all duration-300 hover:border-amber-400/60">
            <AccordionTrigger className="font-semibold text-slate-800 hover:text-amber-600 text-left">
              Is wearing outside costumes allowed at Shivtirth Water Park?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm leading-relaxed">
              <p>
                For hygiene and safety reasons, outside swimming costumes are generally not allowed inside the water park. However, in special cases, self-cleaned fabric costumes are allowed (cotton costumes are not allowed).
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollReveal>
    </section>
  );
};

export default FAQ;