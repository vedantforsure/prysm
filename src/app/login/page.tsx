"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PrimaryButton from "@/app/components/PrimaryButton";
import LoginBackground from "@/app/components/LoginBackground";

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
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
        // Play the immersive warp, then navigate once it has essentially
        // finished — so the route render doesn't contend with the animation.
        onSuccess();
        setTimeout(() => {
          router.replace(from);
          router.refresh();
        }, 1100);
      } else {
        setError(true);
        setPassword("");
        setLoading(false);
      }
    } catch {
      setError(true);
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
        <p className="text-ds-body text-ds-neutral-600">
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

      <PrimaryButton type="submit" disabled={loading || !password} className="w-full">
        {loading ? "Checking…" : "Enter"}
      </PrimaryButton>
    </form>
  );
}

export default function LoginPage() {
  const [launching, setLaunching] = useState(false);

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-20">
      <LoginBackground launching={launching} />
      <div
        className="relative z-10 w-full transition-[opacity,transform] duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
        style={{
          opacity: launching ? 0 : 1,
          transform: launching ? "scale(1.06)" : "scale(1)",
        }}
      >
        <Suspense fallback={null}>
          <LoginForm onSuccess={() => setLaunching(true)} />
        </Suspense>
      </div>
    </main>
  );
}
