"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

type EmailAuthFormProps = {
  submitLabel: string;
};

export default function EmailAuthForm({ submitLabel }: EmailAuthFormProps) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await signIn("email", {
        email,
        callbackUrl: "/home",
      });
    } catch {
      setError(
        "Could not send sign-in link. Check your database connection and email (SMTP) settings, then restart the dev server."
      );
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4 mt-5">
        <Input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#333] placeholder:text-xs placeholder:text-gray-400 w-full inline-block"
        />
        {error ? (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <Button
          className="w-full bg-[#e50914]"
          variant="destructive"
          type="submit"
          disabled={pending}
        >
          {pending ? "Sending link…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
