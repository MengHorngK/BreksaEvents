"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TelegramLoginButton from "@/components/TelegramLoginButton";

const SignUpPage = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("mentee");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleRegister = async (e: React.FormEvent) => {
            e.preventDefault();
            setError("");

            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }

            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

            if (!strongPasswordRegex.test(password)) {
                setError("Password must be at least 8 characters and include uppercase, lowercase, and a number.");
                return;
            }

            try {
                setLoading(true);

                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        phone,
                        email,
                        password,
                        role,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Registration failed.");
                    return;
                }

                router.push("/sign-in");
            } catch (error) {
                console.error(error);
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F3EEE9] px-5 py-10">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">

                <h1 className="text-center text-3xl font-bold text-[#12244A]">
                    Create Account
                </h1>

                <p className="mt-2 text-center text-[#12244A]/60">
                    Join Project IVY and start your journey with us!
                </p>
                {error && (
                    <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <form
                    onSubmit={handleRegister}
                    className="mt-8 space-y-4"
                >
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-[#E7DED6] px-4 py-3 outline-none focus:border-[#12244A]"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-[#E7DED6] px-4 py-3 outline-none focus:border-[#12244A]"
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-[#E7DED6] px-4 py-3 outline-none focus:border-[#12244A]"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-[#E7DED6] px-4 py-3 outline-none focus:border-[#12244A]"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border border-[#E7DED6] px-4 py-3 outline-none focus:border-[#12244A]"
                        required
                    />

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#12244A]">
                            Account Type
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole("mentee")}
                                className={`rounded-xl border py-3 font-semibold ${
                                    role === "mentee"
                                        ? "border-[#12244A] bg-[#12244A] text-white"
                                        : "border-[#E7DED6]"
                                }`}
                            >
                                Mentee
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("mentor")}
                                className={`rounded-xl border py-3 font-semibold ${
                                    role === "mentor"
                                        ? "border-[#12244A] bg-[#12244A] text-white"
                                        : "border-[#E7DED6]"
                                }`}
                            >
                                Mentor
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-[#12244A] py-4 font-semibold text-white"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={() =>
                        signIn("google", { callbackUrl: "/choose-role" })
                    }
                    className="mt-4 w-full rounded-2xl border border-[#12244A] py-4 font-semibold text-[#12244A]"
                >
                    Continue with Google
                </button>
                <button
                    type="button"
                    onClick={() => signIn("facebook", { callbackUrl: "/profile" })}
                    className="mt-4 w-full rounded-2xl border border-[#1877F2] py-4 font-semibold text-[#1877F2]"
                >
                    Continue with Facebook
                </button>
                <TelegramLoginButton />

                <p className="mt-6 text-center text-sm text-[#12244A]/70">
                    Already have an account?{" "}
                    <Link
                        href="/sign-in"
                        className="font-bold text-[#12244A]"
                    >
                        Log In
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default SignUpPage;