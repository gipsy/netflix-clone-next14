import EmailAuthForm from "@/app/components/EmailAuthForm";
import Link from "next/link";
import GoogleSignInButton from "@/app/components/GoogleSigninButton";
import GithubSignInButton from "@/app/components/GithubSigninButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/auth";
import { redirect } from "next/navigation";

export default async function Signup() {
  const session = await getServerSession(authOptions);

  if(session) {
    return redirect("/home")
  }
  return (
    <div className="mt-24 rounded bg-black/80 py-10 px-6 md:mt-0 md:max-w-sm md:x-14">
      <h1 className="text-3xl font-semibold text-white">Sign Up</h1>
      <p className="text-gray-400 text-xs mt-2">
        We&apos;ll email you a magic link. New accounts are created automatically.
      </p>
      <EmailAuthForm submitLabel="Sign Up" />

      <div className="text-gray-500 text-sm mt-2">
        Already have an account? <Link className="text-white hover:underline" href="/login">Log in now!</Link>
      </div>

      <div className="flex w-full justify-center items-center gap-x-3 mt-6">
        <GoogleSignInButton />
        <GithubSignInButton />
      </div>
    </div>
  )
}