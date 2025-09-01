"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { deleteSession } from "../../../actions/auth-actions";

function Submit({ children, className = "", ...rest }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      {...rest}
    >
      {pending ? "Signing out..." : children}
    </button>
  );
}

// avatar=true = render as a menu item (used in dropdown)
// avatar=false = render as a normal button (used in sidebar etc.)
export default function LogoutBtn({ avatar = false, className = "", ...props }) {
  if (avatar) {
    return (
      <form action={deleteSession}>
        <Submit
          className={`block w-full text-left rounded-lg px-3 py-2 font-medium text-red-500 transition-colors hover:bg-red-500/10 dark:hover:bg-red-500/20 ${className}`}
          {...props}
        >
          Sign Out
        </Submit>
      </form>
    );
  }

  return (
    <form action={deleteSession}>
      <Submit
        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-red-600 ring-1 ring-red-200 transition-colors hover:bg-red-50 dark:text-red-400 dark:ring-red-700/50 dark:hover:bg-red-500/10 ${className}`}
        {...props}
      >
        Sign Out
      </Submit>
    </form>
  );
}
