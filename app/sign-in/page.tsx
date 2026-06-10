"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TelegramLoginButton from "@/components/TelegramLoginButton";

const SignInPage = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);

            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Please sign up first or check your email and password.");
                return;
            }

            router.push("/profile");
        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F3EEE9] px-5 py-10">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
                <h1 className="text-center text-3xl font-bold text-[#12244A]">
                    Welcome to Project IVY!
                </h1>

                <p className="mt-2 text-center text-[#12244A]/60">
                    Where we turn your ambition into admission! <br />
                    Log in to start your journey with us.
                </p>

                {error && (
                    <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <form onSubmit={handleEmailLogin} className="mt-8 space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#12244A]">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-[#E7DED6] px-4 py-3 text-[#12244A] outline-none focus:border-[#12244A]"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#12244A]">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-[#E7DED6] px-4 py-3 text-[#12244A] outline-none focus:border-[#12244A]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-[#12244A] py-4 font-semibold text-white disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={() =>
                        signIn("google", {
                            callbackUrl: "/choose-role",
                        })
                    }
                    className="mt-4 w-full rounded-2xl border border-[#12244A] py-4 font-semibold text-[#12244A]"
                >
                    Continue with Google
                </button>
                <button
                    type="button"
                    onClick={() => signIn("facebook", {
                        callbackUrl: "/choose-role",
                    })}
                    className="mt-4 w-full rounded-2xl border border-[#1877F2] py-4 font-semibold text-[#1877F2]"
                >
                    Continue with Facebook
                </button>
                <TelegramLoginButton />

                <p className="mt-6 text-center text-sm text-[#12244A]/70">
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" className="font-bold text-[#12244A]">
                        Sign up
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default SignInPage;