import NotFound from "@/components/pages/not-found";
import { createFileRoute } from "@tanstack/react-router";

// This creates a dedicated /[locale]/404 route
// It's used both as a direct route and imported as a component in other files
export const Route = createFileRoute("/{-$locale}/404")({
  component: NotFound,
});
