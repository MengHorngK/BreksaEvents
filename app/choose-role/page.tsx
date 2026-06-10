"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChooseRolePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSelectRole = async (
        role: "mentor" | "mentee"
    ) => {
        try {
            setLoading(true);

            const response = await fetch("/api/user/role", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role }),
            });

            if (!response.ok) {
                alert("Failed to save role.");
                return;
            }

            router.push("/profile");
        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F3EEE9] px-5">
            <div className="w-full max-w-2xl rounded-[32px] bg-white p-10 shadow-sm">
                <h1 className="text-center text-4xl font-black text-[#12244A]">
                    Welcome to Project IVY
                </h1>

                <p className="mt-3 text-center text-lg text-[#12244A]/60">
                    Tell us how you would like to use the platform.
                </p>

                <div className="mt-10 grid gap-5 md:grid-cols-2">
                    <button
                        onClick={() => handleSelectRole("mentee")}
                        disabled={loading}
                        className="rounded-3xl border-2 border-[#12244A] p-8 text-left transition hover:bg-[#12244A] hover:text-white"
                    >
                        <h2 className="text-2xl font-bold">
                            I am a Mentee
                        </h2>

                        <p className="mt-3 text-sm opacity-80">
                            I want guidance, mentorship, and support for my educational journey.
                        </p>
                    </button>

                    <button
                        onClick={() => handleSelectRole("mentor")}
                        disabled={loading}
                        className="rounded-3xl border-2 border-[#12244A] p-8 text-left transition hover:bg-[#12244A] hover:text-white"
                    >
                        <h2 className="text-2xl font-bold">
                            I am a Mentor
                        </h2>

                        <p className="mt-3 text-sm opacity-80">
                            I want to support and mentor students through their journey.
                        </p>
                    </button>
                </div>

                {loading && (
                    <p className="mt-6 text-center text-[#12244A]/60">
                        Saving your account type...
                    </p>
                )}
            </div>
        </main>
    );
}