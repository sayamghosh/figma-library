import { redirect } from "next/navigation";

export default function MyComponentsPage() {
  redirect("/dashboard?tab=my-components");
}
