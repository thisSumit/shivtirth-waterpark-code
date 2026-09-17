import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best School Picnic Spot in Nagpur | Water Park & Group Outing Packages",
  description:
    "Plan safe, memorable school trips and student group picnics at Shivtirth Water Park Nagpur. All-inclusive passes with breakfast, lunch, water rides, bird park, and safety marshals.",
  keywords: [
    "school picnic spot nagpur",
    "best school trip water park",
    "student picnic packages nagpur",
    "group outing water park nagpur",
    "school picnic packages saoner",
  ],
  alternates: {
    canonical: "https://www.shivtirthwaterpark.com/school-picnic",
  },
  openGraph: {
    title: "School Picnic & Group Outing Packages - Shivtirth Water Park Nagpur",
    description:
      "All-inclusive school picnic packages with dedicated safety staff, unlimited water slides, bird park tour, and pure veg buffet lunch.",
    url: "https://www.shivtirthwaterpark.com/school-picnic",
  },
};

export default function SchoolPicnicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
