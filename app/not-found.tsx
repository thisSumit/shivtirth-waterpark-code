import type { Metadata } from "next";
import StatusScreen from "@/components/StatusScreen";

export const metadata: Metadata = {
  title: "404 Page Not Found",
};

export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      title="Page not found"
      description="The page you are looking for does not exist or may have moved. Head back home or explore the latest offers at Shivtirth Water Park."
    />
  );
}