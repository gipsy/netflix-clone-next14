"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"

export default function GoogleSignInButton() {
  return (
    <Button onClick={() => signIn('google', { callback: '/' })} variant="outline" size="icon">
      <FcGoogle size={20} />
    </Button>
  )
}