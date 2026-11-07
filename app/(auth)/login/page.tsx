import GithubSignInButton from "@/app/components/GithubSigninButton";
import GoogleSignInButton from "@/app/components/GoogleSigninButton";
import { authOptions } from "@/app/utils/auth";
import EmailAuthForm from "@/app/components/EmailAuthForm";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getServerSession(authOptions);

  if(session) {
    return redirect("/home")
  }
  return (
    <div className="mt-24 rounded bg-black/80 py-10 px-6 md:mt-0 md:max-w-sm md:x-14">
      <h1 className="text-3xl font-semibold text-white">Log In</h1>
      <EmailAuthForm submitLabel="Log In" />

      <div className="text-gray-500 text-sm mt-2">
        Do not have an account? <Link className="text-white hover:underline" href="/sign-up">Create one now!</Link>
      </div>

      <div className="flex w-full justify-center items-center gap-x-3 mt-6">
        <GoogleSignInButton />
        <GithubSignInButton />
      </div>
    </div>
  )
}