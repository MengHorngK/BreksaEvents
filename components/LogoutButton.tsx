"use client";

import { signOut } from "next-auth/react";

const LogoutButton = () => {
    return (
        <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
            className="rounded-xl border border-[#12244A] px-4 py-2 text-sm font-semibold text-[#12244A] transition hover:bg-[#12244A] hover:text-white"
        >
            Log out
        </button>
    );
};

export default LogoutButton;