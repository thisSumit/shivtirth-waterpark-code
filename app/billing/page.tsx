"use client"

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type PackagePlan = {
  id: string
  name: string
  price: number
  groupPrice?: number
}

const packagePlans: PackagePlan[] = [
  { id: 'monsoon-picninic-hungama', name: 'Monsoon Picnic Hungama', price: 690 },
  { id: 'ladki-bahin-special', name: 'Ladki Bahin Special Offer', price: 690, groupPrice: 550 },
  { id: 'waterpark-package', name: 'Water Park Package', price: 690 },
  { id: 'boating-package', name: 'Boating Package', price: 690 },
  { id: 'silver-combo', name: 'Silver Combo Package', price: 890 },
  { id: 'golden-package', name: 'Golden Full Package', price: 1190 },
  { id: 'stay-package', name: 'Day & Night Package', price: 2500 },
]

function BillingForm() {
  const searchParams = useSearchParams()
  const planIdFromUrl = searchParams.get('planId') || 'waterpark-package'
  const groupPriceFromUrl = Number(searchParams.get('groupPrice'))

  const [mealPrices, setMealPrices] = useState({ fullMeal: 300, lunch: 200 })

  useEffect(() => {
    const loadMealPrices = async () => {
      try {
        const { data, error } = await supabase.from('settings').select('key, value')
        if (error) throw error

        const fullMeal = data?.find((item) => item.key === 'meal_full_price')
        const lunchMeal = data?.find((item) => item.key === 'meal_lunch_price')

        setMealPrices({
          fullMeal: Number(fullMeal?.value ?? 300) || 300,
          lunch: Number(lunchMeal?.value ?? 200) || 200,
        })
      } catch (err) {
        console.error('Failed to load meal prices:', err)
      }
    }

    loadMealPrices()
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    visitDate: '',
    packageId: packagePlans.some((plan) => plan.id === planIdFromUrl) ? planIdFromUrl : packagePlans[0].id,
    adultQty: 1,
    kids1Qty: 0,
    kids2Qty: 0,
    fullMeal: false,
    onlyLunch: false,
  })

  const selectedPlan = useMemo(
    () => {
      const plan = packagePlans.find((item) => item.id === formData.packageId) || packagePlans[0]
      return formData.packageId === planIdFromUrl && Number.isFinite(groupPriceFromUrl) && groupPriceFromUrl > 0
        ? { ...plan, groupPrice: groupPriceFromUrl }
        : plan
    },
    [formData.packageId, groupPriceFromUrl, planIdFromUrl]
  )

  const hasGroupOffer = selectedPlan.groupPrice != null
  const groupOfferActive = hasGroupOffer && formData.adultQty >= 3
  const adultTicketPrice = groupOfferActive ? selectedPlan.groupPrice! : selectedPlan.price
  const adultPackageTotal = formData.adultQty * adultTicketPrice
  const kids1PackageTotal = formData.kids1Qty * selectedPlan.price * 0.75
  const kids2PackageTotal = formData.kids2Qty * selectedPlan.price * 0.5
  const packageTotal = adultPackageTotal + kids1PackageTotal + kids2PackageTotal

  const adultMealTotal =
    formData.adultQty * ((formData.fullMeal ? mealPrices.fullMeal : 0) + (formData.onlyLunch ? mealPrices.lunch : 0))
  const kids1MealTotal =
    formData.kids1Qty * ((formData.fullMeal ? mealPrices.fullMeal * 0.75 : 0) + (formData.onlyLunch ? mealPrices.lunch * 0.75 : 0))
  const kids2MealTotal =
    formData.kids2Qty * ((formData.fullMeal ? mealPrices.fullMeal * 0.5 : 0) + (formData.onlyLunch ? mealPrices.lunch * 0.5 : 0))
  const mealTotal = adultMealTotal + kids1MealTotal + kids2MealTotal

  const totalAmount = packageTotal + mealTotal
  const totalTickets = formData.adultQty + formData.kids1Qty + formData.kids2Qty

  const mealSummary = [
    formData.fullMeal ? 'Full Meal' : '',
    formData.onlyLunch ? 'Only Lunch' : '',
  ].filter(Boolean).join(' + ') || 'None'

  const updateField = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateQuantity = (field: 'adultQty' | 'kids1Qty' | 'kids2Qty', change: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] + change),
    }))
  }

  const handlePayNow = async () => {
    if (!formData.name.trim()) {
      alert('Please enter your name.')
      return
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      alert('Please enter a valid 10-digit phone number.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      alert('Please enter a valid email address.')
      return
    }

    if (!formData.city.trim()) {
      alert('Please fill in your city.')
      return
    }

    if (!formData.visitDate) {
      alert('Please select your visit or arriving date.')
      return
    }

    if (totalTickets < 1) {
      alert('Please select at least one ticket.')
      return
    }

    try {
      const response = await fetch('/api/payu/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          mobile: formData.phone.trim(),
          email: formData.email.trim(),
          city: formData.city.trim(),
          adultQty: formData.adultQty,
          kids1Qty: formData.kids1Qty,
          kids2Qty: formData.kids2Qty,
          visitDate: formData.visitDate,
          planName: selectedPlan.name,
          ticketType: 'Booking',
          ticketQty: totalTickets,
          ticketSubtotal: packageTotal,
          addOnSubtotal: mealTotal,
          addOnSummary: mealSummary,
          addons: [
            ...(formData.fullMeal ? [{ name: 'Full Meal', qty: totalTickets }] : []),
            ...(formData.onlyLunch ? [{ name: 'Only Lunch', qty: totalTickets }] : []),
          ],
          totalAmount: totalAmount,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data?.action || !data?.fields) {
        throw new Error(data?.error || 'Unable to initiate payment.')
      }

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
      alert(error instanceof Error ? error.message : 'Payment could not be initiated.')
    }
  }

  const numericInputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200'

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 pt-28 pb-8 text-white">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">Booking Counter</p>
          <h1 className="text-3xl font-black md:text-5xl">Book Your Tickets</h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
            <div className="mb-5">
              <h2 className="text-2xl font-black text-slate-900">Personal Details</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-2 md:col-span-1">
                <span className="text-sm font-semibold text-slate-700">Name</span>
                <input
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={numericInputClass}
                  placeholder="Enter full name"
                />
              </label>

              <label className="space-y-2 md:col-span-1">
                <span className="text-sm font-semibold text-slate-700">Number</span>
                <input
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={numericInputClass}
                  placeholder="10-digit mobile"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">Email</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={numericInputClass}
                  placeholder="you@example.com"
                />
              </label>

              <label className="space-y-2 md:col-span-1">
                <span className="text-sm font-semibold text-slate-700">Visit / Arriving Date</span>
                <input
                  type="date"
                  value={formData.visitDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => updateField('visitDate', e.target.value)}
                  className={numericInputClass}
                />
              </label>

              <label className="space-y-2 md:col-span-1">
                <span className="text-sm font-semibold text-slate-700">City</span>
                <input
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={numericInputClass}
                  placeholder="Enter city"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
            <div className="mb-5">
              <h2 className="text-2xl font-black text-slate-900">Package Details</h2>
            </div>

            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Package Name</span>
                <select
                  value={formData.packageId}
                  onChange={(e) => {
                    const nextPackage = packagePlans.find((plan) => plan.id === e.target.value) || packagePlans[0]
                    updateField('packageId', nextPackage.id)
                  }}
                  className={numericInputClass}
                >
                  {packagePlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">Ticket Quantity</p>
                  <p className="text-xs font-medium text-slate-500">Adult = 100%, Kids 1 = 75%, Kids 2 = 50%</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">Adult</p>
                      <p className="text-xs text-slate-500">100% price of ticket</p>
                    </div>
                    <div className="flex items-center rounded-xl border border-slate-300 bg-white">
                      <button type="button" onClick={() => updateQuantity('adultQty', -1)} className="px-3 py-2 text-lg font-bold text-slate-700" aria-label="Decrease adult quantity">-</button>
                      <span className="w-8 text-center text-sm font-bold text-slate-900">{formData.adultQty}</span>
                      <button type="button" onClick={() => updateQuantity('adultQty', 1)} className="px-3 py-2 text-lg font-bold text-slate-700" aria-label="Increase adult quantity">+</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">Kids 1</p>
                      <p className="text-xs text-slate-500">121 cm - 140 cm / 5 to 10 yrs</p>
                    </div>
                    <div className="flex items-center rounded-xl border border-slate-300 bg-white">
                      <button type="button" onClick={() => updateQuantity('kids1Qty', -1)} className="px-3 py-2 text-lg font-bold text-slate-700" aria-label="Decrease Kids 1 quantity">-</button>
                      <span className="w-8 text-center text-sm font-bold text-slate-900">{formData.kids1Qty}</span>
                      <button type="button" onClick={() => updateQuantity('kids1Qty', 1)} className="px-3 py-2 text-lg font-bold text-slate-700" aria-label="Increase Kids 1 quantity">+</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">Kids 2</p>
                      <p className="text-xs text-slate-500">100 cm - 120 cm / 3 to 5 yrs</p>
                    </div>
                    <div className="flex items-center rounded-xl border border-slate-300 bg-white">
                      <button type="button" onClick={() => updateQuantity('kids2Qty', -1)} className="px-3 py-2 text-lg font-bold text-slate-700" aria-label="Decrease Kids 2 quantity">-</button>
                      <span className="w-8 text-center text-sm font-bold text-slate-900">{formData.kids2Qty}</span>
                      <button type="button" onClick={() => updateQuantity('kids2Qty', 1)} className="px-3 py-2 text-lg font-bold text-slate-700" aria-label="Increase Kids 2 quantity">+</button>
                    </div>
                  </div>
                </div>
                {hasGroupOffer && (
                  <p className="mt-3 text-sm font-semibold text-green-600">
                    {groupOfferActive
                      ? `Group offer applied: ${formData.adultQty} adult tickets at ₹${selectedPlan.groupPrice!.toFixed(2)} each.`
                      : `Add ${3 - formData.adultQty} more adult ticket${3 - formData.adultQty === 1 ? '' : 's'} to unlock the group offer at ₹${selectedPlan.groupPrice!.toFixed(2)} per adult.`}
                  </p>
                )}
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-2 text-sm font-semibold text-slate-700">Meal Add-ons</p>

                <div className="space-y-2">
                  <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <div>
                      <span className="font-medium text-slate-800">Full Meal</span>
                      <p className="text-xs text-slate-500">₹{mealPrices.fullMeal}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.fullMeal}
                      onChange={(e) => {
                        updateField('fullMeal', e.target.checked)
                        if (e.target.checked) updateField('onlyLunch', false)
                      }}
                    />
                  </label>

                  <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <div>
                      <span className="font-medium text-slate-800">Only Lunch</span>
                      <p className="text-xs text-slate-500">₹{mealPrices.lunch}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.onlyLunch}
                      onChange={(e) => {
                        updateField('onlyLunch', e.target.checked)
                        if (e.target.checked) updateField('fullMeal', false)
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Billing Summary</p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">₹{totalAmount.toFixed(2)}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 md:min-w-[300px]">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Package</p>
                <p className="mt-1 font-bold text-slate-800">₹{packageTotal.toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Meals</p>
                <p className="mt-1 font-bold text-slate-800">₹{mealTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Package:</span> {packagePlans.find((plan) => plan.id === formData.packageId)?.name || selectedPlan.name}
            </p>
            <p>
              <span className="font-semibold">Tickets:</span> {totalTickets} Total | Adult {formData.adultQty}, Kids 1 {formData.kids1Qty}, Kids 2 {formData.kids2Qty}
            </p>
            <div className="mt-3 space-y-1 border-t border-slate-200 pt-3 text-xs text-slate-600">
              <p>Adult: {formData.adultQty} x ₹{adultTicketPrice.toFixed(2)}{groupOfferActive ? ' (group offer)' : ''} = ₹{adultPackageTotal.toFixed(2)}</p>
              <p>Kids 1: {formData.kids1Qty} x ₹{(selectedPlan.price * 0.75).toFixed(2)} (75%) = ₹{kids1PackageTotal.toFixed(2)}</p>
              <p>Kids 2: {formData.kids2Qty} x ₹{(selectedPlan.price * 0.5).toFixed(2)} (50%) = ₹{kids2PackageTotal.toFixed(2)}</p>
              {formData.fullMeal && <p>Full Meal: Adult {formData.adultQty} x ₹{mealPrices.fullMeal} + Kids 1 {formData.kids1Qty} x ₹{(mealPrices.fullMeal * 0.75).toFixed(2)} + Kids 2 {formData.kids2Qty} x ₹{(mealPrices.fullMeal * 0.5).toFixed(2)} = ₹{((formData.adultQty * mealPrices.fullMeal) + (formData.kids1Qty * mealPrices.fullMeal * 0.75) + (formData.kids2Qty * mealPrices.fullMeal * 0.5)).toFixed(2)}</p>}
              {formData.onlyLunch && <p>Only Lunch: Adult {formData.adultQty} x ₹{mealPrices.lunch} + Kids 1 {formData.kids1Qty} x ₹{(mealPrices.lunch * 0.75).toFixed(2)} + Kids 2 {formData.kids2Qty} x ₹{(mealPrices.lunch * 0.5).toFixed(2)} = ₹{((formData.adultQty * mealPrices.lunch) + (formData.kids1Qty * mealPrices.lunch * 0.75) + (formData.kids2Qty * mealPrices.lunch * 0.5)).toFixed(2)}</p>}
              <p className="pt-1 font-semibold text-slate-800">Total: Package ₹{packageTotal.toFixed(2)} + Meals ₹{mealTotal.toFixed(2)} = ₹{totalAmount.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handlePayNow}
              className="rounded-full bg-yellow-400 px-8 py-3 text-base font-black text-slate-900 shadow-md transition hover:bg-yellow-300"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

function BillingFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
      <p className="text-sm font-semibold">Loading billing page...</p>
    </main>
  )
}

export default function BillingPage() {
  return (
    <Suspense fallback={<BillingFallback />}>
      <BillingForm />
    </Suspense>
  )
}
