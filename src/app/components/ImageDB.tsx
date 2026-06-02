"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  supabase,
  isSupabaseConfigured,
  IMAGE_BUCKET,
  ENTRIES_TABLE,
} from "@/lib/supabase";
import { sounds } from "@/lib/sounds";

interface Entry {
  id: string;
  prompt: string;
  image_url: string;
  image_path: string;
  created_at: string;
}

export default function ImageDB() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New-entry form state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadEntries = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from(ENTRIES_TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setEntries((data as Entry[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Keep a local object-URL preview for the selected file.
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function pickFile(f: File | undefined | null) {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("That file isn't an image.");
      return;
    }
    setError(null);
    setFile(f);
  }

  async function handleSave() {
    if (!file || !prompt.trim()) {
      setError("Add both an image and a prompt before saving.");
      return;
    }
    if (!isSupabaseConfigured) {
      setError("Supabase isn't configured yet — add your keys to .env.local.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);

      const { data: inserted, error: insertError } = await supabase
        .from(ENTRIES_TABLE)
        .insert({ prompt: prompt.trim(), image_url: publicUrl, image_path: path })
        .select()
        .single();
      if (insertError) throw insertError;

      setEntries((prev) => [inserted as Entry, ...prev]);
      setFile(null);
      setPrompt("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong saving.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(entry: Entry) {
    setEntries((prev) => prev.filter((x) => x.id !== entry.id));
    await supabase.storage.from(IMAGE_BUCKET).remove([entry.image_path]);
    await supabase.from(ENTRIES_TABLE).delete().eq("id", entry.id);
  }

  function copyPrompt(text: string) {
    navigator.clipboard?.writeText(text);
    sounds.buttonSecondary?.();
  }

  return (
    <div className="mx-auto w-full max-w-content flex flex-col gap-6 sm:gap-8">
      {/* ── Section header ─────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <h2 className="text-ds-h1 text-ds-neutral-900">Image library</h2>
        <p className="text-ds-small text-ds-neutral-500">
          Save an image with the prompt you used to make it.
        </p>
      </div>

      {/* ── New entry: image left, prompt right ────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 rounded-2xl border border-ds-neutral-200 bg-ds-neutral-50 p-3 sm:p-4">
        {/* Left: image input */}
        <div className="w-full sm:w-1/2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pickFile(e.dataTransfer.files?.[0]);
            }}
            className={`group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-dashed transition-colors ${
              dragging
                ? "border-[#0099FF] bg-[#0099FF]/5"
                : "border-ds-neutral-300 bg-ds-neutral-0 hfine:hover:border-ds-neutral-400"
            }`}
          >
            {preview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Selected"
                  className="h-full w-full object-contain"
                />
                <span className="text-ds-small absolute bottom-2 right-2 rounded-full bg-ds-neutral-1000/70 px-3 py-1 text-ds-neutral-0 opacity-100 transition-opacity hfine:opacity-0 hfine:group-hover:opacity-100">
                  Change
                </span>
              </>
            ) : (
              <span className="text-ds-small px-6 text-center text-ds-neutral-450">
                Click or drop an image here
              </span>
            )}
          </button>
        </div>

        {/* Right: prompt input */}
        <div className="flex w-full sm:w-1/2 flex-col gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste the prompt you used to make this image…"
            className="text-ds-body min-h-[120px] sm:min-h-[140px] flex-1 resize-none rounded-xl border border-ds-neutral-200 bg-ds-neutral-0 p-3 sm:p-4 text-ds-neutral-900 outline-none transition-colors placeholder:text-ds-neutral-450 focus:border-ds-neutral-400"
          />
          <button
            type="button"
            onClick={handleSave}
            onMouseDown={sounds.buttonPrimary}
            disabled={saving}
            className="text-ds-buttons inline-flex h-11 items-center justify-center rounded-full px-4 text-ds-neutral-0 transition-[transform,opacity] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:opacity-90 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background:
                "linear-gradient(rgb(112, 169, 255) 0%, rgb(0, 95, 237) 50.4808%)",
              boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 4px 0px",
              border: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          >
            {saving ? "Saving…" : "Save to library"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-ds-small text-[var(--alert-error-text)]">{error}</p>
      )}

      {!isSupabaseConfigured && (
        <div className="text-ds-small rounded-xl border border-[var(--alert-warning-border)] bg-[var(--alert-warning-bg)] p-4 text-[var(--alert-warning-text)]">
          Supabase isn&apos;t connected yet. Add your project URL and anon key to{" "}
          <code>.env.local</code> and restart the dev server.
        </div>
      )}

      {/* ── Saved library ──────────────────────────────────────── */}
      {loading ? (
        <p className="text-ds-small text-ds-neutral-500">Loading your library…</p>
      ) : entries.length === 0 ? (
        isSupabaseConfigured && (
          <p className="text-ds-small text-ds-neutral-500">
            Nothing saved yet. Add your first image + prompt above.
          </p>
        )
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 rounded-2xl border border-ds-neutral-200 bg-ds-neutral-0 p-3 sm:p-4"
            >
              <a
                href={entry.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-1/2 shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entry.image_url}
                  alt={entry.prompt.slice(0, 60)}
                  className="aspect-square w-full rounded-xl border border-ds-neutral-200 object-contain bg-ds-neutral-50"
                />
              </a>
              <div className="flex w-full sm:w-1/2 flex-col gap-3">
                <p className="text-ds-body flex-1 whitespace-pre-wrap break-words text-ds-neutral-900">
                  {entry.prompt}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyPrompt(entry.prompt)}
                    className="text-ds-small inline-flex h-9 items-center justify-center rounded-full border border-ds-neutral-200 bg-ds-neutral-0 px-4 text-ds-neutral-700 transition-colors hfine:hover:bg-ds-neutral-100 active:scale-[0.96]"
                  >
                    Copy prompt
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry)}
                    className="text-ds-small inline-flex h-9 items-center justify-center rounded-full px-4 text-[var(--alert-error-text)] transition-colors hfine:hover:bg-[var(--alert-error-bg)] active:scale-[0.96]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
