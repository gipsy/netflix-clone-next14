import { authOptions } from "@/app/utils/auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth from "next-auth/next"
import prisma from "@/app/utils/db"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authOptions
})

export { handler as GET, handler as POST }
