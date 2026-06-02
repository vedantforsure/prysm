"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sounds } from "@/lib/sounds";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace(from);
        router.refresh();
      } else {
        setError(true);
        setPassword("");
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mx-auto flex w-full max-w-[360px] flex-col gap-4 ${
        error ? "animate-shake" : ""
      }`}
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-ds-h1 text-ds-neutral-900">Protected</h1>
        <p className="text-ds-small text-ds-neutral-500">
          Enter the password to access the image library.
        </p>
      </div>

      <input
        type="password"
        autoFocus
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError(false);
        }}
        placeholder="Password"
        className={`text-ds-body h-11 w-full rounded-full border bg-ds-neutral-0 px-4 text-ds-neutral-900 outline-none transition-colors placeholder:text-ds-neutral-450 ${
          error
            ? "border-[var(--alert-error-border)]"
            : "border-ds-neutral-200 focus:border-ds-neutral-400"
        }`}
      />

      {error && (
        <p className="text-ds-small text-[var(--alert-error-text)]">
          Incorrect password. Try again.
        </p>
      )}

      <button
        type="submit"
        onMouseDown={sounds.buttonPrimary}
        disabled={loading || !password}
        className="text-ds-buttons inline-flex h-11 items-center justify-center rounded-full px-4 text-ds-neutral-0 transition-[transform,opacity] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:opacity-90 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background:
            "linear-gradient(rgb(112, 169, 255) 0%, rgb(0, 95, 237) 50.4808%)",
          boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 4px 0px",
          border: "1px solid rgba(255, 255, 255, 0.04)",
        }}
      >
        {loading ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-20">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
