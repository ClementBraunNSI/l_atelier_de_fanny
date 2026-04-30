"use client";

import { FormEvent, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [status, setStatus] = useState<{
    kind: "idle" | "success" | "error";
    message: string;
  }>({ kind: "idle", message: "" });
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 6) {
      setStatus({
        kind: "error",
        message: "Le mot de passe doit contenir au moins 6 caractères.",
      });
      return;
    }
    if (password !== passwordConfirm) {
      setStatus({
        kind: "error",
        message: "Les deux mots de passe ne correspondent pas.",
      });
      return;
    }

    setIsPending(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsPending(false);

    if (error) {
      setStatus({
        kind: "error",
        message:
          "Impossible de changer le mot de passe (lien expiré ou invalide). Redemandez un lien de réinitialisation.",
      });
      return;
    }

    setPassword("");
    setPasswordConfirm("");
    setStatus({
      kind: "success",
      message: "Mot de passe mis à jour. Vous pouvez maintenant vous connecter.",
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-3">
      {status.kind !== "idle" ? (
        <p
          className={`rounded-xl border px-4 py-3 text-sm ${
            status.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {status.message}
        </p>
      ) : null}
      <label className="block text-sm text-stone-700">
        Nouveau mot de passe
        <input
          required
          minLength={6}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm outline-none ring-orange-200 focus:ring-2"
        />
      </label>
      <label className="block text-sm text-stone-700">
        Confirmer le mot de passe
        <input
          required
          minLength={6}
          type="password"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          className="mt-1 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm outline-none ring-orange-200 focus:ring-2"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex rounded-full bg-orange-300 px-5 py-2 text-sm font-semibold text-orange-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Mise à jour..." : "Mettre à jour le mot de passe"}
      </button>
    </form>
  );
}
