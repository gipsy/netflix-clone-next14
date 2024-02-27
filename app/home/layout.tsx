import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

export default async function HomeLayout({children}: { children: ReactNode }) {
  const session = await getServerSession()

  if (!session) {
    return redirect("/login")
  }
  return (
    <div>
      { children }
    </div>
  )
}