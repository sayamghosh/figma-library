import { plansApi } from "../../api/plans";
import FaqClient from "./FaqClient";

export const revalidate = 60;

export default async function FaqPage() {
  const plans = await plansApi.getAllPlans().catch((err) => {
    console.error("Failed to fetch plans on FAQ page:", err.message);
    return [];
  });

  return <FaqClient initialPlans={plans} />;
}
