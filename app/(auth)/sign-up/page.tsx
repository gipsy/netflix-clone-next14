import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Signup() {
  return (
    <div className="mt-24 rounded bg-black/80 py-10 px-6 md:mt-0 md:max-w-sm md:x-14">
      <form>
        <h1 className="text-3xl font-semibold text-white">Sign Up</h1>
        <div className="space-y-4 mt-5">
          <Input 
            type="email" 
            name="email" 
            placeholder="Email" 
            className="bg-[#333] placeholder:text-xs placeholder:text-gray-400 w-full inline-block" 
          />
          <Input 
            type="password" 
            name="password" 
            placeholder="Password" 
            className="bg-[#333] placeholder:text-xs placeholder:text-gray-400 w-full inline-block" 
          />
          <Button
            className="w-full bg-[#e50914]"
            variant="destructive"
            type="submit"
          >Sign Up</Button>
        </div>
      </form>

      <div className="text-gray-500 text-sm mt-2">
        Already have an account? <Link className="text-white hover:underline" href="/login">Log in now!</Link>
      </div>

      <div className="flex w-full justify-center items-center gap-x-3 mt-6">
        <Button variant="outline" size="icon">
          <FcGoogle size={20} />
        </Button>
        <Button variant="outline" size="icon">
          <FaGithub size={20} />
        </Button>
      </div>
    </div>
  )
}