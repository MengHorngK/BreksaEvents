import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import connectToDatabase from "@/lib/mongodb";
import User from "@/database/user.model";

const ProfilePage = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/sign-in");
    }

    await connectToDatabase();

    const dbUser = await User.findOne({
        email: session.user.email.toLowerCase().trim(),
    }).lean();

    const role = dbUser?.role === "mentor" ? "Mentor" : "Mentee";
    const isTelegramUser =
        dbUser?.provider === "telegram" ||
        dbUser?.email?.startsWith("telegram_");

    const contactLabel = isTelegramUser ? "Telegram Username" : "Email";
    const contactValue = isTelegramUser
        ? dbUser?.username
            ? `@${dbUser.username}`
            : "Not added yet"
        : session.user.email;


    return (
        <main className="min-h-screen bg-[#F3EEE9] px-5 py-16 text-[#12244A]">
            <section className="mx-auto max-w-6xl rounded-[32px] bg-white p-12 shadow-lg">
                <div className="flex items-center gap-6 border-b border-[#E7DED6] pb-8">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#F3EEE9]">
                        <Image
                            src="/icons/account.png"
                            alt="Profile"
                            width={60}
                            height={60}
                        />
                    </div>

                    <div className="flex flex-1 items-start justify-between gap-4">
                        <div>
                            <h1 className="text-5xl font-black text-[#12244A]">
                                My Profile
                            </h1>

                            <p className="mt-3 max-w-md text-lg text-[#12244A]/60">
                                Manage your account and complete your profile.
                            </p>
                        </div>

                        <LogoutButton />
                    </div>
                </div>

                <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
                    <div className="space-y-6">
                        <div className="flex items-center gap-5 border-b border-[#E7DED6] pb-5">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EEE9]">
                                <Image
                                    src="/icons/account.png"
                                    alt="Name"
                                    width={28}
                                    height={28}
                                />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[#12244A]/50">
                                    Name
                                </p>
                                <p className="mt-1 text-xl font-bold text-[#12244A]">
                                    {dbUser?.name || session.user.name || "No name"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 border-b border-[#E7DED6] pb-5">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EEE9]">
                                <Image
                                    src={isTelegramUser ? "/icons/telegram.png" : "/icons/email.png"}
                                    alt={contactLabel}
                                    width={28}
                                    height={28}
                                />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[#12244A]/50">
                                    {contactLabel}
                                </p>

                                <p className="mt-1 text-xl font-bold text-[#12244A]">
                                    {contactValue}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 border-b border-[#E7DED6] pb-5">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EEE9]">
                                <Image
                                    src="/icons/account-type.png"
                                    alt="Account Type"
                                    width={38}
                                    height={38}
                                />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[#12244A]/50">
                                    Account Type
                                </p>
                                <p className="mt-1 text-xl font-bold text-[#12244A]">
                                    {role}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="rounded-3xl bg-[#F7F5FF] p-7">
                            <p className="text-sm font-bold text-[#12244A]/60">
                                Profile Status
                            </p>

                            <div className="mt-5">
                                <h2 className="text-2xl font-bold text-[#12244A]">
                                    Your profile is incomplete
                                </h2>

                                <p className="mt-2 text-[#12244A]/60">
                                    Complete your profile to unlock all features.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/complete-profile"
                            className="mt-6 flex items-center justify-between rounded-2xl bg-[#12244A] px-7 py-5 text-lg font-bold text-white transition hover:bg-[#0d1b38]"
                        >
                            <span>Complete your profile</span>
                            <span>→</span>
                        </Link>

                        <div className="mt-6 flex gap-4 rounded-3xl bg-[#F8F4EF] p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDE7FF] font-bold text-[#12244A]">
                                ?
                            </div>

                            <div>
                                <h3 className="font-bold text-[#12244A]">
                                    Why complete your profile?
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-[#12244A]/60">
                                    Completing your profile helps us personalize your mentorship experience and match you with better opportunities.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ProfilePage;