import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

const FAQ = () => {
  return (
    <div className='px-4 md:px-8 py-8 md:py-10 max-w-7xl mx-auto'>
      <div className='text-center mb-12'>
        <h2 className='uppercase text-2xl md:text-3xl font-black text-slate-900'>
          Frequently Asked Questions
        </h2>
        <p className='text-gray-600 text-sm max-w-2xl mx-auto'>
          Find answers to common questions about Shivtirth Water Park
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">

  <AccordionItem value="item-0">
    <AccordionTrigger>Why do people love Shivtirth Water Park?</AccordionTrigger>
    <AccordionContent className="flex flex-col gap-4 text-balance">
      <ul className="list-disc pl-5 space-y-2">
        <li>Very reasonable pricing starting from ₹590.</li>
        <li>Government-authorized and ISO-certified picnic center.</li>
        <li>All enjoyments under one roof.</li>
        <li>Satpuda nature-based picnic spot on a hill station surrounded by dam, forest, and valley views.</li>
        <li>National Highway touch location,  just 47 km from Nagpur.</li>
        <li>Strong priority on safety and quality.</li>
        <li>Experienced and helpful staff support.</li>
      </ul>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-1">
    <AccordionTrigger>Where is Shivtirth Water Park located?</AccordionTrigger>
    <AccordionContent className="flex flex-col gap-4 text-balance">
      <p>
        Shivtirth Water Park is located at Umari Dam, near Saoner, Nagpur, surrounded by the scenic Satpuda mountains for a refreshing escape into nature.
      </p>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-2">
    <AccordionTrigger>What are the opening and closing timings of Shivtirth Water Park?</AccordionTrigger>
    <AccordionContent className="flex flex-col gap-4 text-balance">
      <p>
        Shivtirth Water Park is open daily from 9:00 AM to 6:00 PM. Timings may change during festivals or private events.
      </p>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-3">
    <AccordionTrigger>What activities can visitors enjoy at Shivtirth?</AccordionTrigger>
    <AccordionContent className="flex flex-col gap-4 text-balance">
      <p>
        Visitors can enjoy water park, waterfall, boating park, amusement park, adventure park, bird park, cultural activities, agro activities, night stay, wedding, and much more,  perfect for families, schools, and corporate groups.
      </p>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-4">
    <AccordionTrigger>Can I host my destination wedding at Shivtirth Water Park?</AccordionTrigger>
    <AccordionContent className="flex flex-col gap-4 text-balance">
      <p>
        Absolutely! Shivtirth offers a beautiful natural setting with spacious lawns, water views, and elegant venues,  perfect for destination weddings, receptions, and pre-wedding celebrations with customized decoration and catering options.
      </p>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-5">
    <AccordionTrigger>Do you offer group or school picnic packages?</AccordionTrigger>
    <AccordionContent className="flex flex-col gap-4 text-balance">
      <p>
        Yes! We offer special packages for schools, colleges, corporates, and families with exciting discounts and meal options. Visit our Packages Page for details.
      </p>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-6">
    <AccordionTrigger>Are there food and dining options available?</AccordionTrigger>
    <AccordionContent className="flex flex-col gap-4 text-balance">
      <p>
        Yes, the park offers a multi-cuisine restaurant and food stalls serving delicious meals, snacks, and beverages throughout the day.
      </p>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-7">
    <AccordionTrigger>Is outside food allowed inside the park?</AccordionTrigger>
    <AccordionContent className="flex flex-col gap-4 text-balance">
      <p>
        To ensure safety and hygiene, outside food and drinks are not allowed. However, visitors can enjoy a wide range of food options inside the park.
      </p>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-8">
    <AccordionTrigger>Is wearing outside costumes allowed at Shivtirth Water Park?</AccordionTrigger>
    <AccordionContent className="flex flex-col gap-4 text-balance">
      <p>
        For hygiene and safety reasons, outside swimming costumes are generally not allowed inside the water park. However, in special cases, self-cleaned fabric costumes are allowed (cotton costumes are not allowed).
      </p>
    </AccordionContent>
  </AccordionItem>

</Accordion>
    </div>
  )
}

export default FAQ