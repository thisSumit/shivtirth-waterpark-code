"use client"

import { Suspense, useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  submitBookingToGoogleSheet,
  storePendingBooking,
  submitBookingToSupabase,
  type BookingAddon,
  type CheckoutBooking,
} from '@/lib/checkout-booking'
import { supabase } from '@/lib/supabase'

type TicketOption = {
  id: string
  label: string
  price: number
}

type PlanCategory = 'offer' | 'package' | 'accommodation'

type Plan = {
  id: string
  category: PlanCategory
  name: string
  image: string
  highlight: string
  covers: string[]
  rules: string[]
  ticketOptions: TicketOption[]
  consentText?: string
}

const plans: Plan[] = [
  // {
  //   id: 'tadka-thursday',
  //   category: 'offer',
  //   name: 'Tadka Thursday Offer',
  //   image: '/offers/Banner4.png',
  //   highlight: '3 Parks in 1 Ticket',
  //   covers: ['Waterpark', 'Amusement', 'Adventure'],
  //   rules: ['3 parks in 1 ticket', 'Offer price valid for selected visit date only'],
  //   ticketOptions: [{ id: 'regular', label: 'Entry Ticket', price: 690 }],
  // },
  // {
  //   id: 'final-exam-offer',
  //   category: 'offer',
  //   name: 'Final Exam Offer',
  //   image: '/offers/banner2.jpeg',
  //   highlight: 'Exam Khatam, Masti Shuru',
  //   covers: ['Waterpark', 'Amusement', 'Adventure'],
  //   rules: ['Flat 25% OFF', 'Limited period offer'],
  //   ticketOptions: [{ id: 'regular', label: 'Entry Ticket', price: 475 }],
  // },
  // {
  //   id: 'college-id-special',
  //   category: 'offer',
  //   name: 'College ID Special Offer',
  //   image: '/offers/banner1.jpeg',
  //   highlight: 'Flat 20% OFF for Students',
  //   covers: ['Waterpark', 'Amusement', 'Adventure'],
  //   rules: [
  //     'Valid for 11th, 12th, UG, PG students',
  //     'Coaching IDs are not accepted',
  //     'College ID + Aadhar Card mandatory at entry',
  //     'Valid till 25th April',
  //     'Available online and offline',
  //   ],
  //   consentText: 'I confirm student is between 16–25 years and required IDs will be shown at entry.',
  //   ticketOptions: [
  //     { id: 'single', label: 'Single Entry', price: 690 },
  //     { id: 'group', label: 'Group Entry', price: 475 },
  //   ],
  // },
  {
    id: 'monsoon-picninic-hungama',
    category: 'offer',
    name: 'Monsoon Picnic Hungama',
    image: '/offers/banner4.png',
    highlight: 'Free Pakoda & High Tea',
    covers: ['Waterpark access', 'Adventure park', 'Amusement park', 'Safari', 'Agro activities'],
    rules: ['Limited period offer'],
    ticketOptions: [{ id: 'regular', label: 'Per Person', price: 690 }],
  },
  {
    id: 'ladki-bahin-special',
    category: 'offer',
    name: 'Ladki Bahin Special Offer',
    image: '/offers/banner3.jpeg',
    highlight: 'Ladies Only Entry Offer',
    covers: ['Waterpark', 'Amusement', 'Adventure'],
    rules: ['Ladies only entry offer', 'Group offer available for multiple tickets'],
    consentText: 'I confirm this booking is for ladies only entry.',
    ticketOptions: [
      { id: 'single', label: 'Single Entry', price: 690 },
      { id: 'group', label: 'Group Entry', price: 550 },
    ],
  },
  {
    id: 'waterpark-package',
    category: 'package',
    name: 'Water Park Package',
    image: '/waterpark-1.jpg',
    highlight: 'Complete water fun package',
    covers: ['Waterpark access', 'Adventure park', 'Amusement park', 'Safari', 'Agro activities'],
    rules: ['Includes adventure + amusement + safari + agro activities'],
    ticketOptions: [{ id: 'regular', label: 'Per Person', price: 690 }],
  },
  {
    id: 'boating-package',
    category: 'package',
    name: 'Boating Package',
    image: '/o11.jpg',
    highlight: 'Exciting boating rides',
    covers: ['Banana boat', 'Speed boat', 'Shikara boat', 'Kayak boat', 'Dragon boat', 'Train boat', 'Sofa boat', 'Paddle boat', 'Octopus Ride', 'Disco Boat', 'Zorbing Ball'],
    rules: ['Includes boating rides and related activities'],
    ticketOptions: [{ id: 'regular', label: 'Per Person', price: 690 }],
  },
  {
    id: 'silver-combo',
    category: 'package',
    name: 'Silver Combo Package',
    image: '/g8.png',
    highlight: 'Waterpark + Boating combo',
    covers: ['All water park activities', 'All boating rides', 'Full day access'],
    rules: ['Includes water park + boating activities'],
    ticketOptions: [{ id: 'regular', label: 'Per Person', price: 890 }],
  },
  {
    id: 'golden-package',
    category: 'package',
    name: 'Golden Full Package',
    image: '/g10.png',
    highlight: 'Premium package with meals',
    covers: ['Waterpark access', 'Boating rides', 'Breakfast', 'Lunch', 'Evening snacks'],
    rules: ['Includes meals and full-day premium access'],
    ticketOptions: [{ id: 'regular', label: 'Per Person', price: 1190 }],
  },
  {
    id: 'stay-package',
    category: 'accommodation',
    name: 'Day & Night Package',
    image: '/Stay-Facilities.jpg',
    highlight: 'Overnight Stay & Adventure Combo',
    covers: ['Camping Tent', 'Bonfire access', 'Next day breakfast'],
    rules: ['No check-in without valid ID proof'],
    ticketOptions: [{ id: 'regular', label: 'Entry Ticket', price: 2500 }],
  },
]

const addOns = [
  { id: 'boatingpark', name: 'Boating Park Access', price: 690 },
  { id: 'breakfast', name: 'Breakfast', price: 50 },
  { id: 'lunch', name: 'Lunch', price: 250 },
  { id: 'dinner', name: 'Dinner', price: 250 },
  { id: 'combo', name: 'Combined Coupon (All 3 Meals)', price: 550 },
]

const getTomorrowDateString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getDayAfterTomorrowDateString = (fromStr?: string) => {
  const base = fromStr ? new Date(fromStr) : new Date();
  if (isNaN(base.getTime())) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    return tomorrow.toISOString().split('T')[0];
  }
  base.setDate(base.getDate() + (fromStr ? 1 : 2));
  const yyyy = base.getFullYear();
  const mm = String(base.getMonth() + 1).padStart(2, '0');
  const dd = String(base.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const tomorrowStr = getTomorrowDateString();
const defaultCheckOutStr = getDayAfterTomorrowDateString(tomorrowStr);

const CheckoutPageContent = () => {
  const searchParams = useSearchParams()
  const paymentStatus = searchParams.get('payment')

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [visitDate, setVisitDate] = useState(tomorrowStr)
  const [checkInDate, setCheckInDate] = useState(tomorrowStr)
  const [checkOutDate, setCheckOutDate] = useState(defaultCheckOutStr)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'offer' | 'package' | 'accommodation'>('all')
  const [selectedTicketType, setSelectedTicketType] = useState('')
  const [ticketQty, setTicketQty] = useState(1)
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [rulesAccepted, setRulesAccepted] = useState(false)
  const [showConfirmPanel, setShowConfirmPanel] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [processingPayment, setProcessingPayment] = useState(false)

  const [activePlans, setActivePlans] = useState<Plan[]>(plans)
  const [activeAddOns, setActiveAddOns] = useState<typeof addOns>(addOns)

  const [addOnQuantities, setAddOnQuantities] = useState<Record<string, number>>({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    combo: 0,
  })

  useEffect(() => {
    async function fetchPlans() {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .order('display_order', { ascending: true })
        if (data && data.length > 0) {
          const visibleData = data.filter((item) => !item.is_hidden)
          const dbPlans: Plan[] = visibleData.map((item) => ({
            id: item.plan_id,
            category: (item.category || 'package') as PlanCategory,
            name: item.name,
            image: item.image,
            highlight: item.highlight || '',
            covers: Array.isArray(item.covers) ? item.covers : [],
            rules: Array.isArray(item.rules) ? item.rules : [],
            consentText: item.consent_text || undefined,
            ticketOptions: Array.isArray(item.ticket_options) 
              ? item.ticket_options 
              : [{ id: 'regular', label: 'Entry Ticket', price: Number(item.discounted_price) || 690 }],
          }))

          // Merge any fallback hardcoded plans not present in database yet
          const merged = [...dbPlans]
          plans.forEach((p) => {
            if (!dbPlans.some((dbP) => dbP.id === p.id || dbP.name.toLowerCase().trim() === p.name.toLowerCase().trim())) {
              merged.push(p)
            }
          })

          setActivePlans(merged)
        }
      } catch (err) {
        console.error("Error loading plans from Supabase:", err)
      }
    }

    async function fetchAddons() {
      try {
        const { data } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'checkout_addons')
          .single()
        if (data && data.value) {
          const parsed = JSON.parse(data.value)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setActiveAddOns(parsed)
          }
        }
      } catch (err) {
        console.error("Error fetching checkout_addons:", err)
      }
    }

    fetchPlans()
    fetchAddons()
  }, [])

  useEffect(() => {
    const planIdParam = searchParams.get('planId')
    if (planIdParam && activePlans.length > 0) {
      const matchedPlan = activePlans.find((p) => p.id === planIdParam)
      if (matchedPlan) {
        setSelectedPlanId(planIdParam)
        setSelectedCategory(matchedPlan.category)
        setSelectedTicketType(matchedPlan.ticketOptions[0]?.id || '')
      }
    }
  }, [searchParams, activePlans])

  const selectedPlan = useMemo(
    () => activePlans.find((plan) => plan.id === selectedPlanId) || null,
    [selectedPlanId, activePlans]
  )

  const filteredPlans = useMemo(
    () => {
      const isAccommodation = (plan: Plan) =>
        plan.category === 'accommodation' ||
        plan.id.includes('stay') ||
        plan.name.toLowerCase().includes('stay') ||
        plan.name.toLowerCase().includes('farmhouse') ||
        plan.name.toLowerCase().includes('camping') ||
        plan.name.toLowerCase().includes('cottage') ||
        plan.name.toLowerCase().includes('room')

      if (selectedCategory === 'all') {
        const offers = activePlans.filter((plan) => plan.category === 'offer' && !isAccommodation(plan))
        const packages = activePlans.filter((plan) => plan.category === 'package' && !isAccommodation(plan))
        const accommodation = activePlans.filter((plan) => isAccommodation(plan))

        return [...offers, ...packages, ...accommodation]
      }

      if (selectedCategory === 'accommodation') {
        return activePlans.filter(isAccommodation)
      }

      return activePlans.filter((plan) => plan.category === selectedCategory && !isAccommodation(plan))
    },
    [selectedCategory, activePlans]
  )

  const selectPlan = (planId: string, defaultTicketTypeId: string) => {
    if (selectedPlanId === planId) return
    setSelectedPlanId(planId)
    setSelectedTicketType(defaultTicketTypeId || 'regular')
    setTicketQty(1)
    setConsentAccepted(false)
    setRulesAccepted(false)
  }

  const selectCategory = (category: 'all' | 'offer' | 'package' | 'accommodation') => {
    if (selectedCategory === category) return
    setSelectedCategory(category)
    setSelectedPlanId(null)
    setSelectedTicketType('')
    setTicketQty(1)
    setConsentAccepted(false)
    setRulesAccepted(false)
  }

  const activeTicketType = useMemo(() => {
    if (!selectedPlan) return null

    const hasSingleAndGroupPricing =
      selectedPlan.ticketOptions.some((option) => option.id.includes('single') || option.label.toLowerCase().includes('single')) &&
      selectedPlan.ticketOptions.some((option) => option.id.includes('group') || option.label.toLowerCase().includes('group'))

    if (hasSingleAndGroupPricing) {
      const autoTicketId = ticketQty > 2 ? 'group' : 'single'
      return (
        selectedPlan.ticketOptions.find((option) => option.id.includes(autoTicketId) || option.label.toLowerCase().includes(autoTicketId)) ||
        selectedPlan.ticketOptions[0]
      )
    }

    return (
      selectedPlan.ticketOptions.find((option) => option.id === selectedTicketType) ||
      selectedPlan.ticketOptions[0]
    )
  }, [selectedPlan, selectedTicketType, ticketQty])

  const pricingAlertMessage = useMemo(() => {
    if (!selectedPlan) return ''
    const hasSingleAndGroupPricing =
      selectedPlan.ticketOptions.some((option) => option.id.includes('single') || option.label.toLowerCase().includes('single')) &&
      selectedPlan.ticketOptions.some((option) => option.id.includes('group') || option.label.toLowerCase().includes('group'))

    if (hasSingleAndGroupPricing) {
      if (ticketQty > 2) {
        return '🎉 Group Entry price applied!'
      } else {
        return 'Single Entry price applied (up to 2 tickets)'
      }
    }
    return ''
  }, [selectedPlan, ticketQty])

  const isAccommodationSelected = useMemo(() => {
    if (!selectedPlan) return false;
    return (
      selectedPlan.category === 'accommodation' ||
      selectedPlan.id.includes('stay') ||
      selectedPlan.name.toLowerCase().includes('stay') ||
      selectedPlan.name.toLowerCase().includes('farmhouse') ||
      selectedPlan.name.toLowerCase().includes('camping') ||
      selectedPlan.name.toLowerCase().includes('cottage') ||
      selectedPlan.name.toLowerCase().includes('room')
    );
  }, [selectedPlan]);

  const numberOfNights = useMemo(() => {
    if (!isAccommodationSelected) return 1;
    if (!checkInDate || !checkOutDate) return 1;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [isAccommodationSelected, checkInDate, checkOutDate]);

  const ticketSubtotal = activeTicketType
    ? activeTicketType.price * ticketQty * (isAccommodationSelected ? numberOfNights : 1)
    : 0;
  const addOnSubtotal = activeAddOns.reduce(
    (sum, addon) => sum + addon.price * (addOnQuantities[addon.id] || 0),
    0
  )
  const selectedPlanName = selectedPlan?.name || 'No plan selected'
  const selectedPlanRules = selectedPlan?.rules || []
  const selectedPlanConsentText = selectedPlan?.consentText || ''
  const selectedPlanTicketOptions = selectedPlan?.ticketOptions || []
  const activeTicketTypeLabel = activeTicketType?.label || 'Select a plan'
  const activeTicketTypePrice = activeTicketType?.price || 0
  const selectedAddOnSummary = activeAddOns
    .map((addon) => ({ name: addon.name, qty: addOnQuantities[addon.id] || 0 }))
    .filter((addon) => addon.qty > 0)
    .map((addon) => `${addon.name} x ${addon.qty}`)
    .join(', ')
  const addOnSummary = selectedAddOnSummary || 'None'
  const grandTotal = ticketSubtotal + addOnSubtotal

  const updateQty = (
    current: number,
    type: 'inc' | 'dec',
    setter: (value: number) => void,
    min = 0,
    max = 25
  ) => {
    if (type === 'inc' && current < max) setter(current + 1)
    if (type === 'dec' && current > min) setter(current - 1)
  }

  const validateDetailsStep = () => {
    if (name.trim().length < 2) return 'Please enter a valid name.'
    if (!/^[6-9]\d{9}$/.test(mobile)) return 'Please enter a valid 10-digit mobile number.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email address.'
    if (!city.trim()) return 'Please enter your city.'

    if (isAccommodationSelected) {
      if (!checkInDate) return 'Please select a check-in date.'
      if (!checkOutDate) return 'Please select a check-out date.'
      if (checkInDate < tomorrowStr) return 'Check-in date cannot be in the past or today.'
      if (checkOutDate <= checkInDate) return 'Check-out date must be after check-in date.'
    } else {
      if (!visitDate) return 'Please select a visit date.'
      if (visitDate < tomorrowStr) return 'Same day booking is not permitted. Please select tomorrow or a later date.'
    }
    return ''
  }

  const validateChooseOfferStep = () => {
    if (!selectedPlanId) return 'Please choose an offer/package.'
    if (ticketQty < 1) return 'Please add at least 1 ticket.'
    return ''
  }

  const validateConfirmationPanel = () => {
    if (!rulesAccepted) return 'Please accept rules and terms to continue.'
    if (selectedPlanConsentText && !consentAccepted) return 'Please accept the selected offer rules.'
    return ''
  }

  const submitToPayU = async () => {
    setPaymentError('')
    setProcessingPayment(true)

    try {
      if (!selectedPlan || !activeTicketType) {
        throw new Error('Please choose an offer/package.')
      }

      const selectedAddOns: BookingAddon[] = addOns
        .map((addon) => ({ name: addon.name, qty: addOnQuantities[addon.id] || 0 }))
        .filter((addon) => addon.qty > 0)

      const addOnSummary = selectedAddOns.length
        ? selectedAddOns.map((addon) => `${addon.name} x ${addon.qty}`).join(', ')
        : 'None'

      const effectiveVisitDate = isAccommodationSelected
        ? `${checkInDate} to ${checkOutDate} (${numberOfNights} night${numberOfNights > 1 ? 's' : ''})`
        : visitDate

      const response = await fetch('/api/payu/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          mobile: mobile.trim(),
          email: email.trim(),
          city: city.trim(),
          adultQty: ticketQty,
          kids1Qty: 0,
          kids2Qty: 0,
          visitDate: effectiveVisitDate,
          checkInDate: isAccommodationSelected ? checkInDate : undefined,
          checkOutDate: isAccommodationSelected ? checkOutDate : undefined,
          numberOfNights: isAccommodationSelected ? numberOfNights : 1,
          planName: selectedPlan.name,
          ticketType: activeTicketType.label,
          ticketQty,
          ticketSubtotal,
          addOnSubtotal,
          addOnSummary,
          addons: selectedAddOns,
          totalAmount: grandTotal,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data?.action || !data?.fields) {
        throw new Error(data?.error || 'Unable to initiate payment.')
      }

      const txnid = String(data.fields.txnid || `TXN${Date.now()}`)
      const ticketPrice = activeTicketType.price
      const booking: CheckoutBooking = {
        txnid,
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        city: city.trim(),
        adultQty: ticketQty,
        kids1Qty: 0,
        kids2Qty: 0,
        bookedDate: new Date().toISOString(),
        visitDate: effectiveVisitDate,
        checkInDate: isAccommodationSelected ? checkInDate : undefined,
        checkOutDate: isAccommodationSelected ? checkOutDate : undefined,
        numberOfNights: isAccommodationSelected ? numberOfNights : 1,
        planName: selectedPlan.name,
        ticketType: activeTicketType.label,
        ticketPrice,
        ticketQty,
        ticketSubtotal,
        addOns: selectedAddOns,
        addOnSummary,
        addOnSubtotal,
        totalAmount: grandTotal,
        rulesAccepted,
        consentAccepted,
        source: 'checkout-page',
        submittedAt: new Date().toISOString(),
      }

      storePendingBooking(booking)
      await submitBookingToGoogleSheet(booking, 'Not Paid')
      await submitBookingToSupabase(booking, 'Not Paid')

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = data.action

      Object.entries(data.fields).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = String(value)
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Payment initialization failed.')
      setProcessingPayment(false)
    }
  }

  return (
    <section className="bg-linear-to-b from-slate-50 via-white to-slate-50 text-slate-900 min-h-screen">
      <div className='h-30 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900'/>
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-black mb-2">Checkout</h1>
          <p className="text-slate-600">Book offers/packages, add tickets, choose meals, and pay securely.</p>
        </div>

        {paymentStatus === 'success' && (
          <div className="mb-6 rounded-xl border border-green-300 bg-green-50 p-4 text-green-700 font-medium">
            Payment received successfully. Our team will confirm your booking shortly.
          </div>
        )}
        {paymentStatus === 'failed' && (
          <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-700 font-medium">
            Payment failed or was cancelled. Please try again.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-2 md:p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-sm">
              <span className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-accent text-black' : 'bg-slate-100'}`}>Offer/Packages</span>
              <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-accent text-black' : 'bg-slate-100'}`}>Add-ons</span>
              <span className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-accent text-black' : 'bg-slate-100'}`}>Details</span>
              <span className={`px-3 py-1 rounded-full ${step >= 4 ? 'bg-accent text-black' : 'bg-slate-100'}`}>Pay</span>
            </div>

            {step === 3 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-1">
                    <span className="text-sm font-semibold">Name</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Your full name" />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-semibold">Mobile Number</span>
                    <input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="10-digit mobile" />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-semibold">Email (for payment updates)</span>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="name@email.com" />
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="text-sm font-semibold">City</span>
                    <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Enter city" />
                  </label>
                  {isAccommodationSelected ? (
                    <>
                      <label className="space-y-1">
                        <span className="text-sm font-semibold flex items-center justify-between">
                          Check-in Date
                          <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                            {numberOfNights} Night{numberOfNights > 1 ? 's' : ''} Stay
                          </span>
                        </span>
                        <input
                          type="date"
                          min={tomorrowStr}
                          value={checkInDate}
                          onChange={(e) => {
                            const newIn = e.target.value;
                            setCheckInDate(newIn);
                            if (newIn >= checkOutDate) {
                              setCheckOutDate(getDayAfterTomorrowDateString(newIn));
                            }
                          }}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 font-medium"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-sm font-semibold">Check-out Date</span>
                        <input
                          type="date"
                          min={getDayAfterTomorrowDateString(checkInDate)}
                          value={checkOutDate}
                          onChange={(e) => {
                            const newOut = e.target.value;
                            if (newOut > checkInDate) {
                              setCheckOutDate(newOut);
                            }
                          }}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 font-medium"
                        />
                      </label>
                    </>
                  ) : (
                    <label className="space-y-1">
                      <span className="text-sm font-semibold">Visit Date</span>
                      <input type="date" min={tomorrowStr} value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                    </label>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-full border border-slate-300 px-5 py-2.5 font-semibold text-slate-800"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const validationMessage = validateDetailsStep()
                      if (validationMessage) {
                        setPaymentError(validationMessage)
                        return
                      }
                      setPaymentError('')
                      setStep(4)
                    }}
                    className="rounded-full bg-accent px-6 py-3 font-bold text-black"
                  >
                    Continue to Pay
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5 pb-12 md:pb-16">
                <p className="text-sm text-slate-600">Select offer/package, choose ticket type, then use bottom bar for quantity and next step.</p>

                <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => selectCategory('all')}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${selectedCategory === 'all' ? 'bg-accent text-black font-bold' : 'text-slate-700'}`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => selectCategory('offer')}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${selectedCategory === 'offer' ? 'bg-accent text-black font-bold' : 'text-slate-700'}`}
                  >
                    Offers
                  </button>
                  <button
                    type="button"
                    onClick={() => selectCategory('package')}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${selectedCategory === 'package' ? 'bg-accent text-black font-bold' : 'text-slate-700'}`}
                  >
                    Packages
                  </button>
                  <button
                    type="button"
                    onClick={() => selectCategory('accommodation')}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${selectedCategory === 'accommodation' ? 'bg-accent text-black font-bold' : 'text-slate-700'}`}
                  >
                    Accommodation
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPlans.map((plan) => {
                    const isSelected = selectedPlanId === plan.id
                    const hasSingleAndGroupPricing =
                      plan.ticketOptions.some((option) => option.id.includes('single') || option.label.toLowerCase().includes('single')) &&
                      plan.ticketOptions.some((option) => option.id.includes('group') || option.label.toLowerCase().includes('group'))

                    return (
                      <div
                        key={plan.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => selectPlan(plan.id, plan.ticketOptions[0]?.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            selectPlan(plan.id, plan.ticketOptions[0]?.id)
                          }
                        }}
                        className={`text-left rounded-xl border overflow-hidden cursor-pointer ${isSelected ? 'border-accent ring-2 ring-accent/30' : 'border-slate-200'}`}
                      >
                        <div className="relative aspect-3/2 bg-slate-100">
                          <Image src={plan.image} alt={plan.name} fill className="object-cover" />
                        </div>

                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold uppercase text-slate-500">{plan.category}</p>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold border ${isSelected ? 'border-accent bg-accent/20 text-slate-900' : 'border-slate-300 text-slate-600'}`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </span>
                          </div>

                          <p className="font-bold text-slate-900">{plan.name}</p>
                          <p className="text-sm text-slate-600">{plan.highlight}</p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {plan.ticketOptions.map((option) => (
                              <span key={option.id} className="text-xs rounded-full bg-accent/15 border border-accent/30 px-2 py-1">
                                {option.label}: ₹{option.price}
                              </span>
                            ))}
                          </div>

                          <div className="text-xs text-slate-600">
                            <p className="font-semibold text-slate-700 mb-1">Covers:</p>
                            <p>{plan.covers.join(' • ')}</p>
                          </div>

                          <div className="text-xs text-slate-600">
                            <p className="font-semibold text-slate-700 mb-1">Rules:</p>
                            <ul className="space-y-0.5">
                              {plan.rules.map((rule) => (
                                <li key={rule}>• {rule}</li>
                              ))}
                            </ul>
                          </div>

                          {isSelected && (
                            <div className="rounded-lg border border-accent/40 bg-accent/10 p-3 space-y-3">
                              {hasSingleAndGroupPricing ? (
                                <div className="rounded-lg border border-slate-300 bg-white p-2">
                                  <p className="text-sm text-slate-700 mt-1">
                                    {ticketQty > 2 ? 'Group Entry price applied (3+ tickets).' : 'Single Entry price applied (up to 2 tickets).'}
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <p className="text-sm font-semibold">Ticket Type</p>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedPlanTicketOptions.map((option) => (
                                      <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => setSelectedTicketType(option.id)}
                                        className={`rounded-full px-3 py-1.5 text-xs border ${selectedTicketType === option.id ? 'border-accent bg-accent/30 font-semibold' : 'border-slate-300 bg-white'}`}
                                      >
                                        {option.label} • ₹{option.price}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                 <aside className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 h-fit shadow-sm">
            <h3 className="text-xl font-black mb-4">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between"><span>Plan</span><span className="font-semibold text-right">{selectedPlanName}</span></p>
              <p className="flex justify-between"><span>Ticket</span><span>{activeTicketTypeLabel}</span></p>
              <p className="flex justify-between"><span>{isAccommodationSelected ? 'Rate / Night' : 'Ticket Price'}</span><span>₹{activeTicketTypePrice}</span></p>
              <p className="flex justify-between"><span>{isAccommodationSelected ? 'Guests' : 'Ticket Qty'}</span><span>{ticketQty}</span></p>
              {isAccommodationSelected && (
                <>
                  <p className="flex justify-between"><span>Check-in</span><span className="font-medium text-slate-800">{checkInDate}</span></p>
                  <p className="flex justify-between"><span>Check-out</span><span className="font-medium text-slate-800">{checkOutDate}</span></p>
                  <p className="flex justify-between"><span>Duration</span><span className="font-bold text-green-700">{numberOfNights} Night{numberOfNights > 1 ? 's' : ''}</span></p>
                </>
              )}
              <p className="flex justify-between font-semibold pt-1 border-t border-slate-100"><span>Tickets Subtotal</span><span>₹{ticketSubtotal}</span></p>
            </div>

            <div className="border-t border-slate-200 my-4" />

            <div className="space-y-2 text-sm">
              {activeAddOns.map((addon) => {
                const qty = addOnQuantities[addon.id] || 0
                if (!qty) return null
                return (
                  <p key={addon.id} className="flex justify-between">
                    <span>{addon.name} × {qty}</span>
                    <span>₹{addon.price * qty}</span>
                  </p>
                )
              })}
              <p className="flex justify-between font-semibold"><span>Add-ons Subtotal</span><span>₹{addOnSubtotal}</span></p>
            </div>

            <div className="border-t border-slate-200 my-4" />
            <p className="flex justify-between text-lg font-black">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </p>
          </aside>


                <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur">
                  <div className="mx-auto max-w-6xl px-4 py-3 md:px-8">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Selected Package</p>
                            <p className="truncate text-sm font-semibold text-slate-900">{selectedPlanName}</p>
                          <p className="text-sm text-slate-700">
                            {isAccommodationSelected ? (
                              <>
                                Stay: ₹{activeTicketTypePrice} × {ticketQty} guest{ticketQty > 1 ? 's' : ''} × {numberOfNights} night{numberOfNights > 1 ? 's' : ''} = <span className="font-bold text-slate-900">₹{ticketSubtotal}</span>
                              </>
                            ) : (
                              <>
                                Ticket: ₹{activeTicketTypePrice} × {ticketQty} = <span className="font-bold text-slate-900">₹{ticketSubtotal}</span>
                              </>
                            )}
                          </p>
                          {pricingAlertMessage && (
                            <p className="text-[11px] font-bold text-green-600 mt-0.5">
                              {pricingAlertMessage}
                            </p>
                          )}
                        </div>

                        <div className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:w-auto md:min-w-70 md:justify-end">
                          <button
                            type="button"
                            onClick={() => updateQty(ticketQty, 'dec', setTicketQty, 1)}
                            className="h-9 w-9 rounded-lg border border-slate-300 text-lg"
                          >
                            -
                          </button>
                          <span className="min-w-8 text-center text-base font-bold">{ticketQty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(ticketQty, 'inc', setTicketQty, 1)}
                            className="h-9 w-9 rounded-lg border border-slate-300 text-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const validationMessage = validateChooseOfferStep()
                          if (validationMessage) {
                            setPaymentError(validationMessage)
                            return
                          }
                          setPaymentError('')
                          setShowConfirmPanel(true)
                        }}
                        className="w-full rounded-full bg-accent px-4 py-3 text-sm font-bold text-black md:px-6 md:py-3.5"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                {showConfirmPanel && (
                  <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-3 md:items-center">
                    <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-xl">
                      <p className="text-lg font-black">Confirm Rules & Terms</p>
                      <p className="mt-1 text-sm text-slate-600">Review selected plan rules before continuing to add-ons.</p>

                      <div className="mt-4 rounded-xl border border-red-500 bg-slate-50 p-4">
                        <p className="font-semibold mb-2">Rules & Regulations for {selectedPlanName}</p>
                        <ul className="space-y-1 text-sm text-slate-700">
                          {selectedPlanRules.map((rule) => (
                            <li key={rule}>• {rule}</li>
                          ))}
                        </ul>
                      </div>

                      <label className="mt-4 flex items-start gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={rulesAccepted}
                          onChange={(e) => setRulesAccepted(e.target.checked)}
                          className="mt-1"
                        />
                        <span>I have read all rules and accept the terms and conditions of Shivtirth Water Park.</span>
                      </label>

                      {selectedPlanConsentText && (
                        <label className="mt-3 flex items-start gap-2 text-sm">
                          <input type="checkbox" checked={consentAccepted} onChange={(e) => setConsentAccepted(e.target.checked)} className="mt-1" />
                          <span>{selectedPlanConsentText}</span>
                        </label>
                      )}

                      <div className="mt-5 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPanel(false)}
                          className="rounded-full border border-slate-300 px-5 py-2.5 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const validationMessage = validateConfirmationPanel()
                            if (validationMessage) {
                              setPaymentError(validationMessage)
                              return
                            }
                            setPaymentError('')
                            setShowConfirmPanel(false)
                            setStep(2)
                          }}
                          className="rounded-full bg-accent px-6 py-2.5 font-bold text-black"
                        >
                          Confirm & Continue
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">Choose dining packages and adjust quantity as needed.</p>
                {activeAddOns.map((addon) => (
                  <div key={addon.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                    <div>
                      <p className="font-semibold">{addon.name}</p>
                      <p className="text-sm text-slate-500">₹{addon.price} per person</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(addOnQuantities[addon.id] || 0, 'dec', (value) =>
                            setAddOnQuantities((prev) => ({ ...prev, [addon.id]: value }))
                          )
                        }
                        className="h-9 w-9 rounded-lg border border-slate-300 text-lg"
                      >
                        -
                      </button>
                      <span className="font-bold min-w-6 text-center">{addOnQuantities[addon.id] || 0}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(addOnQuantities[addon.id] || 0, 'inc', (value) =>
                            setAddOnQuantities((prev) => ({ ...prev, [addon.id]: value }))
                          )
                        }
                        className="h-9 w-9 rounded-lg border border-slate-300 text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)} className="rounded-full border border-slate-300 px-5 py-2.5 font-semibold text-slate-800">
                    Back
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="rounded-full bg-accent px-6 py-2.5 font-bold text-black">
                    Continue to Details
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1 text-sm">
                  <p><span className="font-semibold">Name:</span> {name}</p>
                  <p><span className="font-semibold">Mobile:</span> {mobile}</p>
                  <p><span className="font-semibold">Email:</span> {email}</p>
                  {isAccommodationSelected ? (
                    <>
                      <p><span className="font-semibold">Check-in Date:</span> {checkInDate}</p>
                      <p><span className="font-semibold">Check-out Date:</span> {checkOutDate}</p>
                      <p><span className="font-semibold">Duration:</span> <span className="font-bold text-green-700">{numberOfNights} Night{numberOfNights > 1 ? 's' : ''}</span></p>
                    </>
                  ) : (
                    <p><span className="font-semibold">Visit Date:</span> {visitDate}</p>
                  )}
                  <p><span className="font-semibold">Plan:</span> {selectedPlanName}</p>
                </div>

<aside className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 h-fit shadow-sm">
            <h3 className="text-xl font-black mb-4">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between"><span>Plan</span><span className="font-semibold text-right">{selectedPlanName}</span></p>
              <p className="flex justify-between"><span>Ticket</span><span>{activeTicketTypeLabel}</span></p>
              <p className="flex justify-between"><span>Ticket Price</span><span>₹{activeTicketTypePrice}</span></p>
              <p className="flex justify-between"><span>Ticket Qty</span><span>{ticketQty}</span></p>
              <p className="flex justify-between font-semibold"><span>Tickets Subtotal</span><span>₹{ticketSubtotal}</span></p>
            </div>

            <div className="border-t border-slate-200 my-4" />

            <div className="space-y-2 text-sm">
              {addOns.map((addon) => {
                const qty = addOnQuantities[addon.id] || 0
                if (!qty) return null
                return (
                  <p key={addon.id} className="flex justify-between">
                    <span>{addon.name} × {qty}</span>
                    <span>₹{addon.price * qty}</span>
                  </p>
                )
              })}
              <p className="flex justify-between font-semibold"><span>Add-ons Subtotal</span><span>₹{addOnSubtotal}</span></p>
            </div>

            <div className="border-t border-slate-200 my-4" />
            <p className="flex justify-between text-lg font-black">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </p>
          </aside>

                <div className="rounded-xl border border-slate-200 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Ticket: {activeTicketTypeLabel}</p>
                      <p className="text-sm text-slate-500">₹{activeTicketTypePrice} per ticket</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQty(ticketQty, 'dec', setTicketQty, 0)}
                        className="h-8 w-8 rounded-lg border border-slate-300 text-base"
                      >
                        -
                      </button>
                      <span className="font-bold min-w-8 text-center">{ticketQty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(ticketQty, 'inc', setTicketQty, 0)}
                        className="h-8 w-8 rounded-lg border border-slate-300 text-base"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => setTicketQty(0)}
                        className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {addOns.map((addon) => {
                    const qty = addOnQuantities[addon.id] || 0
                    return (
                      <div key={addon.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{addon.name}</p>
                          <p className="text-sm text-slate-500">₹{addon.price} per person</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQty(qty, 'dec', (value) =>
                                setAddOnQuantities((prev) => ({ ...prev, [addon.id]: value }))
                              )
                            }
                            className="h-8 w-8 rounded-lg border border-slate-300 text-base"
                          >
                            -
                          </button>
                          <span className="font-bold min-w-8 text-center">{qty}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQty(qty, 'inc', (value) =>
                                setAddOnQuantities((prev) => ({ ...prev, [addon.id]: value }))
                              )
                            }
                            className="h-8 w-8 rounded-lg border border-slate-300 text-base"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setAddOnQuantities((prev) => ({ ...prev, [addon.id]: 0 }))
                            }
                            className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {ticketQty < 1 && (
                  <p className="text-sm font-medium text-red-600">Please keep at least 1 ticket to continue payment.</p>
                )}

                {/* <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(3)} className="rounded-full border border-slate-300 px-5 py-2.5 font-semibold">
                    Back
                  </button>
                </div> */}

                <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur">
                  <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 px-4 py-3 md:grid-cols-[1.1fr_1fr_auto] md:items-center md:px-8">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Current Total</p>
                      <p className="text-lg font-black text-slate-900">₹{grandTotal}</p>
                    </div>

                    <div className="text-sm text-slate-700">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Includes</p>
                      <p className="truncate font-semibold text-slate-900">{selectedPlanName}</p>
                      <p className="truncate">{addOnSummary}</p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="rounded-full border border-slate-300 px-6 py-2.5 font-semibold text-slate-800"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={submitToPayU}
                        disabled={processingPayment || ticketQty < 1}
                        className="rounded-full bg-accent px-6 py-2.5 font-bold text-black disabled:opacity-60"
                      >
                        {processingPayment ? 'Processing...' : 'Pay Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentError && <p className="mt-4 text-sm font-medium text-red-600">{paymentError}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}

const CheckoutFallback = () => (
  <section className="bg-linear-to-b from-slate-50 via-white to-slate-50 text-slate-900 min-h-screen">
    <div className="max-w-6xl mx-auto px-4 md:px-8 pt-32 pb-14">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <p className="text-base font-semibold">Loading checkout...</p>
      </div>
    </div>
  </section>
)

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutPageContent />
    </Suspense>
  )
}