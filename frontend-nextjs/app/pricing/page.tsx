import { plansApi } from "../../api/plans";
import PricingClient from "./PricingClient";

export const revalidate = 60; // ISR revalidate every 60 seconds

export default async function PricingPage() {
  // Fetch plans on the server side
  const plans = await plansApi.getAllPlans().catch((err) => {
    console.error("Failed to fetch plans on server:", err.message);
    return [];
  });

  return <PricingClient initialPlans={plans} />;
}
