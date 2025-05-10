import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to login page if not authenticated
  // In a real app, you would check for authentication here
  redirect("/login")

  return null
}
