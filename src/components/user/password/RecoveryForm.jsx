"use client";

import { useFormState } from "react-dom";
import { startPasswordReset } from "@/lib/actions";
import { toast } from "react-toastify";

const initialState = { type: "", message: "" };

export default function RecoveryForm() {
  const [state, formAction] = useFormState(startPasswordReset, initialState);

  if (state?.message) {
    const t = state.type === "success" ? "success" : "error";
    toast[t](state.message);
  }

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Email address"
          className="w-full border-b-2 border-slate-300 bg-transparent py-2 px-0 text-base focus:border-blue-600 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 font-bold text-white hover:scale-[1.02] transition"
      >
        RESET PASSWORD
      </button>

      {state?.message && (
        <p className={`text-sm ${state.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
