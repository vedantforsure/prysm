"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  supabase,
  isSupabaseConfigured,
  IMAGE_BUCKET,
  ENTRIES_TABLE,
} from "@/lib/supabase";
import { sounds } from "@/lib/sounds";
import { toast } from "sonner";
import PrimaryButton from "./PrimaryButton";

interface Entry {
  id: string;
  prompt: string;
  image_url: string;
  image_path: string;
  created_at: string;
}

/* ── Lightweight modal shell ──────────────────────────────── */
const MODAL_EXIT_MS = 200;

function Modal({
  open,
  onClose,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  // Stay mounted through the exit transition so closing animates too.
  const [render, setRender] = useState(open);
  if (open && !render) setRender(true); // mount immediately on open (render-phase)

  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setRender(false), MODAL_EXIT_MS);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!render) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [render, onClose]);

  if (!render || typeof document === "undefined") return null;

  // Portal to <body> so the fixed overlay isn't trapped by a transformed
  // ancestor (RevealSection keeps a transform/filter on its wrapper).
  // `data-open` drives the enter (@starting-style) and exit transitions.
  return createPortal(
    <div
      onClick={onClose}
      data-open={open}
      className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-ds-neutral-1000/50 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        data-open={open}
        className={`modal-panel max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-ds-neutral-200 bg-ds-neutral-0 p-4 sm:p-5 ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export default function ImageDB() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Entry | null>(null);

  // Detail-modal prompt editing
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [updating, setUpdating] = useState(false);

  // Search
  const [query, setQuery] = useState("");

  // New-entry form state
  const [file, setFile] = useState<File | null>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  const [prompt, setPrompt] = useState("");
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from(ENTRIES_TABLE)
        .select("*")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error) setError(error.message);
      else setEntries((data as Entry[]) ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Revoke the object URL when the selected file changes / unmounts.
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function resetForm() {
    setFile(null);
    setPrompt("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

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
      resetForm();
      setAddOpen(false);
      toast.success("Saved to library");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong saving.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(entry: Entry) {
    const previous = entries;
    setEntries((prev) => prev.filter((x) => x.id !== entry.id));
    setSelected(null);
    setEditing(false);
    try {
      const { error: storageError } = await supabase.storage
        .from(IMAGE_BUCKET)
        .remove([entry.image_path]);
      if (storageError) throw storageError;
      const { error: deleteError } = await supabase
        .from(ENTRIES_TABLE)
        .delete()
        .eq("id", entry.id);
      if (deleteError) throw deleteError;
      toast.success("Deleted");
    } catch (e) {
      setEntries(previous); // roll back the optimistic removal
      toast.error(e instanceof Error ? e.message : "Couldn't delete that entry.");
    }
  }

  function copyPrompt(text: string) {
    navigator.clipboard?.writeText(text);
    sounds.buttonSecondary?.();
    toast.success("Prompt copied");
  }

  function closeDetail() {
    setSelected(null);
    setEditing(false);
  }

  function startEditing(entry: Entry) {
    setDraft(entry.prompt);
    setEditing(true);
  }

  async function handleUpdate() {
    if (!selected) return;
    const next = draft.trim();
    if (!next) {
      toast.error("Prompt can’t be empty.");
      return;
    }
    if (next === selected.prompt) {
      setEditing(false);
      return;
    }
    setUpdating(true);
    const previous = entries;
    const updated: Entry = { ...selected, prompt: next };
    // Optimistic update.
    setEntries((prev) => prev.map((e) => (e.id === selected.id ? updated : e)));
    setSelected(updated);
    try {
      const { error: updateError } = await supabase
        .from(ENTRIES_TABLE)
        .update({ prompt: next })
        .eq("id", selected.id);
      if (updateError) throw updateError;
      setEditing(false);
      toast.success("Prompt updated");
    } catch (e) {
      setEntries(previous); // roll back
      setSelected(selected);
      toast.error(e instanceof Error ? e.message : "Couldn’t update the prompt.");
    } finally {
      setUpdating(false);
    }
  }

  // Keyword search over prompts — every token must appear in the prompt.
  const filtered = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return entries;
    return entries.filter((entry) => {
      const prompt = entry.prompt.toLowerCase();
      return tokens.every((t) => prompt.includes(t));
    });
  }, [entries, query]);

  return (
    <div className="mx-auto w-full max-w-[1080px] flex flex-col gap-6 sm:gap-8">
      {/* ── Search ─────────────────────────────────────────────── */}
      <div className="flex justify-end">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search prompts…"
          className="text-ds-small h-10 w-full rounded-full border border-ds-neutral-200 bg-ds-neutral-0 px-4 text-ds-neutral-900 outline-none transition-colors placeholder:text-ds-neutral-450 focus:border-ds-neutral-400 sm:w-72"
        />
      </div>

      {!isSupabaseConfigured && (
        <div className="text-ds-small rounded-xl border border-[var(--alert-warning-border)] bg-[var(--alert-warning-bg)] p-4 text-[var(--alert-warning-text)]">
          Supabase isn&apos;t connected yet. Add your project URL and anon key to{" "}
          <code>.env.local</code> and restart the dev server.
        </div>
      )}

      {/* ── Pinterest-style masonry ────────────────────────────── */}
      {loading ? (
        <p className="text-ds-small text-ds-neutral-500">Loading your library…</p>
      ) : entries.length === 0 ? (
        isSupabaseConfigured && (
          <p className="text-ds-small text-ds-neutral-500">
            Nothing saved yet. Add your first image + prompt above.
          </p>
        )
      ) : filtered.length === 0 ? (
        <p className="text-ds-small text-ds-neutral-500">
          No prompts match “{query.trim()}”.
        </p>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [column-fill:_balance]">
          {filtered.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setSelected(entry)}
              onMouseEnter={sounds.cardHover}
              onMouseDown={sounds.cardPress}
              className="masonry-item group relative mb-3 block w-full overflow-hidden rounded-xl border border-black/10 bg-ds-neutral-50 break-inside-avoid transition-transform duration-200 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hfine:hover:scale-[1.01] active:scale-[0.97] motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.image_url}
                alt={entry.prompt.slice(0, 60)}
                loading="lazy"
                onLoad={() =>
                  setLoaded((prev) => ({ ...prev, [entry.id]: true }))
                }
                className="w-full transition-opacity duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]"
                style={{ opacity: loaded[entry.id] ? 1 : 0 }}
              />
              {/* hover overlay with a peek of the prompt */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-ds-neutral-1000/70 to-transparent p-3 pt-10 opacity-100 transition-opacity duration-200 hfine:opacity-0 hfine:group-hover:opacity-100">
                <p className="text-ds-small line-clamp-2 text-left text-ds-neutral-0">
                  {entry.prompt}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Add-entry modal ────────────────────────────────────── */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        className="max-w-[640px]"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-ds-h1 text-ds-neutral-900">Add image</h3>
              <p className="text-ds-small text-ds-neutral-500">
                Pick an image and paste the prompt that made it.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              aria-label="Close"
              className="text-ds-small inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ds-neutral-500 transition-colors hfine:hover:bg-ds-neutral-100 active:scale-[0.96]"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            {/* image input */}
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

            {/* prompt input */}
            <div className="flex w-full flex-col gap-3 sm:w-1/2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Paste the prompt you used to make this image…"
                className="text-ds-body min-h-[160px] flex-1 resize-none rounded-xl border border-ds-neutral-200 bg-ds-neutral-0 p-3 sm:p-4 text-ds-neutral-900 outline-none transition-colors placeholder:text-ds-neutral-450 focus:border-ds-neutral-400"
              />
            </div>
          </div>

          {error && (
            <p className="text-ds-small text-[var(--alert-error-text)]">{error}</p>
          )}

          <PrimaryButton onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving…" : "Save to library"}
          </PrimaryButton>
        </div>
      </Modal>

      {/* ── Detail modal ───────────────────────────────────────── */}
      <Modal open={selected !== null} onClose={closeDetail} className="max-w-[860px]">
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-end">
              <button
                type="button"
                onClick={closeDetail}
                aria-label="Close"
                className="text-ds-small inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ds-neutral-500 transition-colors hfine:hover:bg-ds-neutral-100 active:scale-[0.96]"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
              <a
                href={selected.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full shrink-0 sm:w-1/2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.image_url}
                  alt={selected.prompt.slice(0, 60)}
                  className="w-full rounded-xl border border-black/10 bg-ds-neutral-50 object-contain"
                />
              </a>
              <div className="flex w-full flex-col gap-3 sm:w-1/2">
                {editing ? (
                  <>
                    <textarea
                      value={draft}
                      autoFocus
                      onChange={(e) => setDraft(e.target.value)}
                      className="text-ds-body min-h-[160px] flex-1 resize-none rounded-xl border border-ds-neutral-200 bg-ds-neutral-0 p-3 text-ds-neutral-900 outline-none transition-colors placeholder:text-ds-neutral-450 focus:border-ds-neutral-400 sm:p-4"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <PrimaryButton onClick={handleUpdate} disabled={updating}>
                        {updating ? "Saving…" : "Save"}
                      </PrimaryButton>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="text-ds-small inline-flex h-10 items-center justify-center rounded-full border border-ds-neutral-200 bg-ds-neutral-0 px-4 text-ds-neutral-700 transition-colors hfine:hover:bg-ds-neutral-100 active:scale-[0.96]"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-ds-body flex-1 whitespace-pre-wrap break-words text-ds-neutral-900">
                      {selected.prompt}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyPrompt(selected.prompt)}
                        className="text-ds-small inline-flex h-10 items-center justify-center rounded-full border border-ds-neutral-200 bg-ds-neutral-0 px-4 text-ds-neutral-700 transition-colors hfine:hover:bg-ds-neutral-100 active:scale-[0.96]"
                      >
                        Copy prompt
                      </button>
                      <button
                        type="button"
                        onClick={() => startEditing(selected)}
                        className="text-ds-small inline-flex h-10 items-center justify-center rounded-full border border-ds-neutral-200 bg-ds-neutral-0 px-4 text-ds-neutral-700 transition-colors hfine:hover:bg-ds-neutral-100 active:scale-[0.96]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(selected)}
                        className="text-ds-small inline-flex h-10 items-center justify-center rounded-full px-4 text-[var(--alert-error-text)] transition-colors hfine:hover:bg-[var(--alert-error-bg)] active:scale-[0.96]"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Fixed bottom CTA (portaled past RevealSection's transform) ── */}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-5">
            <div className="cta-fade pointer-events-auto">
              <PrimaryButton
                onClick={() => {
                  setError(null);
                  setAddOpen(true);
                }}
              >
                + Add image
              </PrimaryButton>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
