"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminActivitiesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/attractions?tab=other-activities");
  }, [router]);

  return (
    <div className="py-20 flex items-center justify-center text-slate-400">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2 mr-3"></div>
      Redirecting to Attractions & Activities CMS...
    </div>
  );
}
