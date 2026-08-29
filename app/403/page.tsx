import type { Metadata } from "next";
import StatusScreen from "@/components/StatusScreen";

export const metadata: Metadata = {
  title: "403 Forbidden",
};

export default function ForbiddenPage() {
  return (
    <StatusScreen
      code="403"
      title="Access forbidden"
      description="You do not have permission to view this page. Return to the homepage or browse current offers instead."
    />
  );
}