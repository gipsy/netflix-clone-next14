"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { FaGithub } from "react-icons/fa"

export default function GithubSignInButton() {
  return (
    <Button onClick={() => signIn('github', { callbackUrl: '/' })} variant="outline" size="icon">
      <FaGithub size={20} />
    </Button>
  )
}