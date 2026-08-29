You are a Senior Full Stack Engineer specializing in Next.js, TypeScript, Supabase, Shadcn UI, Tailwind CSS, Analytics Dashboards, and CMS Architecture.

# IMPORTANT - ANALYZE FIRST

DO NOT start coding immediately.

First, scan and analyze the entire existing codebase.

You must:

* Analyze all pages
* Analyze all components
* Analyze all forms
* Analyze all API routes
* Analyze the PayU integration
* Analyze all hardcoded content
* Analyze all images and videos
* Analyze all attractions, offers, packages, galleries, and activities
* Analyze how booking data is currently stored
* Identify every editable field on the website

The Admin Panel must be generated according to the ACTUAL WEBSITE STRUCTURE, not assumptions.

If the website contains sections that are not mentioned below, include them automatically if they contain editable content.

Only after completing analysis, create the implementation.

# TECH STACK

Frontend:

* Next.js App Router
* TypeScript
* Tailwind CSS
* Shadcn UI

Backend:

* Supabase Database
* Supabase Authentication
* Supabase Storage

Payments:

* PayU Payment Gateway

Hosting:

* Vercel

# OBJECTIVE

Create a complete Admin Panel + CMS + Analytics System for the website.

The Admin Panel should allow non-technical users to manage the website without touching code.

# ADMIN AUTHENTICATION

Create:

/admin/login

Features:

* Supabase Auth
* Protected Routes
* Secure Sessions
* Logout
* Role-Based Access (Admin)

# DASHBOARD

Create:

/admin/dashboard

Show:

* Total Revenue
* Total Tickets Sold
* Total Successful Bookings
* Total Failed Bookings
* Contact Form Submissions
* Influencer Form Submissions

Analytics:

* Today's Revenue
* Weekly Revenue
* Monthly Revenue
* Yearly Revenue

Charts:

* Revenue Trend
* Booking Trend
* Ticket Sales Trend

Date Filters:

* Today
* This Week
* This Month
* Last Month
* This Year
* Custom Range

All statistics should update automatically when date range changes.

# PAYU INTEGRATION

Analyze existing PayU implementation.

After successful payment:

Store:

* Booking ID
* Transaction ID
* Customer Name
* Phone
* Email
* Ticket Quantity
* Total Amount
* Payment Status
* Visit Date
* Created Date

in Supabase.

After failed payment:

Store failed transaction in database.

# BOOKINGS MANAGEMENT

Create:

/admin/bookings

Tabs:

1. Successful
2. Failed

Features:

* Search
* Filter
* Sort
* Pagination
* Export CSV
* Export Excel

Columns:

* Booking ID
* Customer Name
* Phone
* Email
* Tickets
* Amount
* Status
* Transaction ID
* Visit Date
* Created Date

# CONTACT ENQUIRIES

Create:

/admin/contacts

Display:

* Name
* Phone
* Email
* Message
* Date

Export functionality required.

# INFLUENCER COLLABORATION

Create:

/admin/influencers

Display:

* Name
* Phone
* Email
* Instagram Profile
* Followers Count
* Message
* Date

Export functionality required.

# CONTENT MANAGEMENT SYSTEM

Create:

/admin/content

The CMS must automatically manage all editable website content discovered during codebase analysis.

# HERO SECTION

Admin can:

* Upload Hero Video
* Change Hero Title
* Change Hero Description
* Change CTA Buttons

Store media in Supabase Storage.

# POPUP MANAGEMENT

Admin can:

* Upload Popup Image
* Edit Popup Content
* Enable / Disable Popup

# OFFERS MANAGEMENT

Create:

/admin/offers

Admin can:

* Add Offer
* Edit Offer
* Delete Offer

Fields:

* Image
* Title
* Description
* Includes
* Rules & Regulations
* Price

# PACKAGES MANAGEMENT

Create:

/admin/packages

Admin can:

* Add Package
* Edit Package
* Delete Package

Fields:

* Image
* Title
* Description
* Price
* Key Highlights
* Access To

Support dynamic arrays.

# GALLERY MANAGEMENT

Create:

/admin/gallery

Admin can:

* Upload Images
* Delete Images
* Reorder Images

# ATTRACTIONS MANAGEMENT

Analyze all attraction pages.

Examples may include:

* Water Park
* Boating Park
* Adventure Park
* Amusement Park

For every attraction:

Admin can:

* Add
* Edit
* Delete

Fields:

* Image
* Title
* Description

# ACTIVITIES MANAGEMENT

Create:

/admin/activities

Fields:

* Title
* Description
* Highlight Points

# WEBSITE SETTINGS

Create:

/admin/settings

Admin can update:

* Primary Phone Number
* Secondary Phone Number
* WhatsApp Number
* Email Address
* Address
* Social Media Links

Changes should reflect globally across the website.

# MEDIA STORAGE

Use Supabase Storage Buckets:

* hero-videos
* popup-images
* gallery-images
* offers
* packages
* attractions
* activities

Media should upload directly from Admin Panel.

Admin should never need to paste URLs manually.

# DATABASE DESIGN

Generate complete Supabase schema.

Include:

* users
* bookings
* contacts
* influencers
* offers
* packages
* gallery
* attractions
* activities
* settings
* website_content

Include:

* Primary Keys
* Timestamps
* Relationships
* Row Level Security Policies

# UI REQUIREMENTS

Use:

* Shadcn UI
* Tailwind CSS
* Responsive Layout
* Dark Mode

Design:

Modern SaaS Dashboard

Include:

* Cards
* Charts
* Data Tables
* Filters
* Modals
* Toast Notifications
* Loading States
* Empty States

# FINAL DELIVERABLE

1. Analyze codebase.
2. Create implementation plan.
3. Create Supabase schema.
4. Create storage architecture.
5. Create admin authentication.
6. Create dashboard analytics.
7. Connect PayU data.
8. Create CMS.
9. Connect CMS to frontend.
10. Replace hardcoded content with dynamic content.

Generate production-ready code only.

No placeholders.
No pseudo code.
No assumptions.
Use the actual website structure discovered during analysis.
