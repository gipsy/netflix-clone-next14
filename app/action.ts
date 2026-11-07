"use server";

import { revalidatePath } from "next/cache";
import prisma from "./utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "./utils/auth";

export async function addToWatchList(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const movieId = Number(formData.get("movieId"));
  const pathname = formData.get("pathname") as string;
  if (!movieId || !pathname?.startsWith("/")) {
    throw new Error("Invalid request");
  }

  await prisma.watchList.create({
    data: {
      userId,
      movieId,
    },
  });

  revalidatePath(pathname);
}

export async function deleteFromWatchList(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const watchlistId = formData.get("watchlistId") as string;
  const pathname = formData.get("pathname") as string;
  if (!watchlistId || !pathname?.startsWith("/")) {
    throw new Error("Invalid request");
  }

  const deleted = await prisma.watchList.deleteMany({
    where: {
      id: watchlistId,
      userId,
    },
  });

  if (deleted.count === 0) {
    throw new Error("Not found");
  }

  revalidatePath(pathname);
}