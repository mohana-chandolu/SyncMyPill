// app/q/page.tsx
import { redirect } from "next/navigation";

export default function Q() {
  redirect("/auth?next=/today");
}
