'use client'

import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-500 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500 blur-3xl"></div>
      </div>

      <div className="relative"> 
        <div className="bg-slate-900 pt-12 text-slate-200">
          <div className="max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-accent">
              Terms & Conditions
            </span>
            <h1 className="mt-4 text-4xl md:text-6xl font-black text-white">
              Shivtirth Best Water Park
            </h1>
            <p className="mt-3 text-slate-300 max-w-3xl">
              Please review these terms before visiting or booking. They help keep every guest safe,
              informed, and ready for a smooth experience.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-10 pb-16">
          <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. General Agreement</h2>
            <p className="text-slate-700 leading-relaxed">
              By purchasing, receiving, or using any ticket, pass, package, or service from Shivtirth Water Park,
              whether through online booking, offline counter purchase, WhatsApp booking, agent booking, or any
              other method, the guest agrees to these Terms & Conditions. These terms apply to all visitors,
              families, school groups, corporate groups, wedding guests, and event organizers.
            </p>
            <p className="mt-3 text-slate-700 leading-relaxed">
              Shivtirth Water Park reserves the right to amend, update, or enforce these terms at any time.
              Continued use of services or entry into the premises after any such update signifies acceptance of
              the revised terms.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Booking, Tickets & Payment</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Tickets may be purchased online, at the ticket counter, through approved agents, or via authorized staff.</li>
              <li>All bookings are subject to availability, capacity limits, timing, and operational conditions.</li>
              <li>Payment received confirms the reservation, but entry remains subject to verification of the ticket and compliance with park rules.</li>
              <li>We reserve the right to cancel or reject any booking if payment is incomplete, fraudulent, or invalid.</li>
              <li>Any counterfeit, duplicate, altered, or manipulated ticket will be considered void and may be refused entry.</li>
              <li>Visitors must carry the booking confirmation, ticket, or valid proof of purchase for entry.</li>
              <li>We are not responsible for booking errors caused by incorrect name, phone number, date, or quantity entered by the customer.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Online & Offline Booking Policy</h2>
            <div className="space-y-4 text-slate-700">
              <div>
                <h3 className="text-slate-900 font-semibold mb-2">Online Bookings</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Online bookings are subject to successful payment processing and confirmation.</li>
                  <li>Tickets are valid only for the date and time specified in the confirmation.</li>
                  <li>Online bookings must be validated at the gate before entry.</li>
                  <li>If the payment fails or is disputed, the ticket may be cancelled without notice.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-slate-900 font-semibold mb-2">Offline Bookings</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Offline purchases are final once taken and are governed by the same terms as online bookings.</li>
                  <li>Cash, UPI, or card tickets are subject to verification and park availability.</li>
                  <li>We may refuse service if the visitor fails to comply with admission rules.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-slate-900 font-semibold mb-2">Group or Bulk Bookings</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Schools, families, corporates, and event groups must provide correct headcount and valid contact information.</li>
                  <li>Group bookings can be cancelled or modified based on final headcount, safety limits, or operational needs.</li>
                  <li>The park may reallocate or adjust timings for large groups if required for safety or logistics.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Ticket Validity, Use & Transfer</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Tickets are valid only for the date, time slot, and package specified on the booking.</li>
              <li>Each ticket is personal and non-transferable unless explicitly permitted by management.</li>
              <li>Duplicate or shared use of a single ticket is not allowed.</li>
              <li>Any ticket not used on the stated date is treated as expired unless revalidated by the management.</li>
              <li>Guests are expected to present valid ID or booking details when asked by staff at the entry gate.</li>
              <li>We reserve the right to refuse entry if any ticket is invalid, expired, duplicated, altered, or used contrary to this policy.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Cancellation, Refund & Rescheduling</h2>
            <div className="space-y-4 text-slate-700">
              <div>
                <h3 className="text-slate-900 font-semibold mb-2">Cancellation Policy</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Cancellation requests made at least 48 hours before the visit may be eligible for a refund as per schedule.</li>
                  <li>Cancellation requests made within 24-48 hours may receive partial refund or rescheduling, depending on management approval.</li>
                  <li>Cancellations made less than 24 hours before entry will generally be non-refundable.</li>
                  <li>No-show tickets are non-refundable.</li>
                  <li>Refunds are processed within 5-7 business days from the approval date.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-slate-900 font-semibold mb-2">Rescheduling</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Date or time changes may be allowed only before the scheduled entry, subject to availability.</li>
                  <li>Requests for rescheduling may be declined if the original date is already fully booked or suspended.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-slate-900 font-semibold mb-2">No Refund Policy</h3>
                <p>
                  Once a booking is confirmed, it is considered final. In general, no refunds will be issued for
                  change of mind, weather conditions unrelated to major operational shutdowns, or if the guest leaves early.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Right to Cancel or Deny Entry</h2>
            <p className="text-slate-700 leading-relaxed">
              Shivtirth Water Park reserves the right to cancel, reject, or revoke any ticket, pass, or booking at
              any time if the guest violates rules, displays misconduct, creates disturbance, attempts fraud,
              endangers safety, or behaves in a manner that threatens staff, other guests, or the property.
            </p>
            <ul className="mt-3 list-disc list-inside text-slate-700 space-y-2">
              <li>Disruptive, abusive, aggressive, or illegal behaviour may result in immediate removal.</li>
              <li>Entry can be denied for intoxication, unsafe clothing, prohibited items, or refusal to follow security and staff instructions.</li>
              <li>Guests may be removed from the premises without refund if they behave unsafely or disruptively.</li>
              <li>We may cancel a group booking if the group creates disturbance, damages park property, or mismanages security compliance.</li>
              <li>Any guest who causes an accident, injury, or damage due to reckless behavior may be held liable and may lose future access privileges.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Age, Eligibility & Accompanying Guests</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Guests must be at least 18 years old to independently book a ticket or participate in certain activities.</li>
              <li>Children under 12 years must be accompanied by an adult guardian.</li>
              <li>Children under 3 years may be exempt or may require a verified companion as per management policy.</li>
              <li>Age verification may be required at entry for certain water rides or adventure activities.</li>
              <li>School and college groups must have proper supervision and follow management guidance.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Entry Rules & Park Conduct</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Valid ticket and ID proof must be shown at entry.</li>
              <li>Guests must follow all posted rules, signage, and staff directions.</li>
              <li>Outside food, alcohol, glass bottles, sharp objects, and prohibited items are not allowed.</li>
              <li>Proper swimwear is required for water activities and may be checked by security.</li>
              <li>Smoking, vaping, intoxication, or illegal substances are strictly prohibited.</li>
              <li>Professional cameras, filming gear, or drones may be restricted without written permission.</li>
              <li>Monsoon closures, maintenance breaks, or emergency stoppages may temporarily suspend specific activities.</li>
              <li>We reserve the right to change attractions, timings, or safety measures based on weather or operational conditions.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Safety, Health & Accidents</h2>
            <div className="space-y-4 text-slate-700">
              <p>
                Shivtirth Water Park provides safety equipment, lifeguards, staff supervision, and operational controls,
                but guests must understand that water parks, adventure areas, rides, and outdoor activities carry
                inherent risks. Participation is voluntary and guests accept these risks.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Guests participate in activities at their own risk.</li>
                <li>Parents/guardians are responsible for supervising children under their care.</li>
                <li>Guests with medical conditions, injuries, pregnancy, epilepsy, heart issues, or other health concerns should avoid risky activities.</li>
                <li>Guests with open wounds, contagious illness, or recent surgery may be denied access to water or adventure activities.</li>
                <li>We are not responsible for injuries caused by misuse of rides, failure to follow instructions, or reckless behavior.</li>
                <li>We may require a guest to stop activity immediately if staff believes the person is unsafe.</li>
              </ul>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Liability, Damage & Accident Claims</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Shivtirth Water Park shall not be responsible for any loss, theft, damage, or destruction of personal property unless due to clear negligence by the management.</li>
              <li>Any guest who accidentally or intentionally damages park property, equipment, furniture, rides, or facilities shall be liable for the cost of repair or replacement.</li>
              <li>In case of any accident, injury, or incident, the management may record the event, request medical support, and document the facts for internal review.</li>
              <li>Any claim for injury, damage, or loss must be reported to management promptly, and the park may require proof, witness information, or supporting documentation.</li>
              <li>Our liability, if any, is limited to the extent allowed by law and shall not cover indirect, incidental, or consequential damages.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Use of Facilities, Equipment & Rentals</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Locker, costume, life jacket, tube, and other rental items are issued subject to availability and proper usage.</li>
              <li>Rental items are to be used as instructed; misuse may cause penalties or lost deposit.</li>
              <li>Refundable security deposit may be withheld if the item is damaged, lost, or returned late.</li>
              <li>Costume and locker charges are non-refundable once issued unless the facility is not available or the park cancels the service.</li>
              <li>Guests must handle all equipment with care and return items at the specified time or as directed by staff.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Photography, Security & Monitoring</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>The park may use CCTV surveillance and security monitoring for the safety of guests and staff.</li>
              <li>Photographs or videos may be taken for promotional or documentation purposes, subject to management policies.</li>
              <li>Guests must not obstruct security personnel, CCTV coverage, or public safety systems.</li>
              <li>Any attempt to hide identity, evade security checks, or violate surveillance protocols may lead to refusal of entry or legal action.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Payment Disputes & Fraud Prevention</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>All online payments are processed through secure payment channels. Shivtirth does not store card details directly.</li>
              <li>Duplicate, fraudulent, disputed, or chargeback transactions may be investigated and the booking may be cancelled.</li>
              <li>We reserve the right to take lawful action against any fraudulent attempt or unauthorized payment use.</li>
              <li>Any booking made using false identity, duplicate contact details, or suspicious payment behavior may be rejected.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Privacy, Data & Communication</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Personal information is used for booking confirmation, communication, support, and service improvement.</li>
              <li>We may contact guests about their booking, safety updates, or park notifications.</li>
              <li>We do not sell personal data to unrelated third parties.</li>
              <li>Data may be shared with service providers or government authorities when required by law.</li>
              <li>See the Privacy Policy for full details.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">15. Intellectual Property & Website Use</h2>
            <p className="text-slate-700 leading-relaxed">
              All website content, images, designs, text, logos, and materials used by Shivtirth are protected by
              applicable intellectual property rights. Guests may not copy, reproduce, misuse, or redistribute these
              materials without prior written permission from the management.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">16. Force Majeure</h2>
            <p className="text-slate-700 leading-relaxed">
              Shivtirth Water Park is not responsible for service interruptions caused by weather, natural disasters,
              government orders, technical failures, public emergencies, power issues, pandemics, political events,
              or any other force majeure condition beyond our reasonable control. In such cases, management may reschedule,
              suspend, or cancel activities without liability beyond a refund or credit as determined by the management.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">17. Dispute Resolution & Contact</h2>
            <div className="space-y-3 text-slate-700">
              <p>Any dispute arising from purchases, entries, bookings, or services shall be addressed in good faith by the management.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Email: support@shivtirthwaterpark.com</li>
                <li>Phone: +91 86053 62212</li>
                <li>Address: Shivtirth Water Park, Umari Dam, near Saoner, Nagpur</li>
              </ul>
              <p className="mt-3">
                If a guest is unable to resolve a concern directly, the matter may be referred to the applicable legal
                authority or dispute channel in accordance with Indian law.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">18. Final Agreement</h2>
            <p className="text-slate-700 leading-relaxed">
              By visiting, booking, or purchasing tickets from Shivtirth Water Park, every guest confirms that they have
              read, understood, and accepted all terms and conditions listed here. These terms cover both online and
              offline purchases, group bookings, personal safety, accidental claims, ticket validity, and all operational
              circumstances surrounding entry and park usage.
            </p>
            <p className="mt-3 text-slate-900 font-semibold">
              Managed by SHIVTIRTH ASSOCIATES PRIVATE LIMITED
            </p>
          </section>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2 font-semibold text-black shadow-lg shadow-accent/20 transition hover:scale-[1.03]"
            >
              Back to Home
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 rounded-full border border-accent/60 px-6 py-2 font-semibold text-slate-800 transition hover:bg-accent/10 hover:text-slate-900"
            >
              Read Privacy Policy
            </Link>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
