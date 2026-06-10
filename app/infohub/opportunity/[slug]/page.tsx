import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Opportunity from "@/database/opportunity.model";

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

const formatLabel = (text?: string | null) => {
    if (!text) return "N/A";
    return text.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const OpportunityDetailPage = async ({ params }: PageProps) => {
    const { slug } = await params;

    await connectToDatabase();

    const opportunity = await Opportunity.findOne({ slug }).lean();

    if (!opportunity) {
        return (
            <main className="min-h-screen bg-[#F3EEE9] px-5 py-10">
                <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8">
                    <h1 className="text-2xl font-bold text-[#12244A]">
                        Opportunity not found
                    </h1>

                    <Link href="/infohub" className="inline-flex items-center gap-2 text-[#12244A] font-medium hover:opacity-80 transition">
                        Back to InfoHub
                    </Link>
                </div>
            </main>
        );
    }

    const item = JSON.parse(JSON.stringify(opportunity));

    return (
        <main className="min-h-screen bg-[#F3EEE9] px-5 py-8">
            <section className="mx-auto max-w-5xl">
                <Link href="/infohub" className="mb-5 inline-block text-sm font-semibold text-[#12244A]">
                    ← Back to InfoHub
                </Link>

                <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
                    <div className="mb-4 flex flex-wrap gap-2">
                        {item.featured && (
                            <span className="rounded-full bg-[#12244A] px-3 py-1 text-xs font-semibold text-white">
                Featured
              </span>
                        )}

                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-[#12244A]">
              {formatLabel(item.type)}
            </span>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {formatLabel(item.funding)}
            </span>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {formatLabel(item.level)}
            </span>
                    </div>

                    <h1 className="text-3xl font-bold text-[#12244A] md:text-5xl">
                        {item.title}
                    </h1>

                    <p className="mt-4 text-gray-600">
                        {item.shortdescription || "No description available."}
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl bg-[#F8F4EF] p-4">
                            <p className="text-xs font-semibold text-gray-500">Country</p>
                            <p className="mt-1 font-bold text-[#12244A]">
                                {item.country || "N/A"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#F8F4EF] p-4">
                            <p className="text-xs font-semibold text-gray-500">Region</p>
                            <p className="mt-1 font-bold text-[#12244A]">
                                {formatLabel(item.region)}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#F8F4EF] p-4">
                            <p className="text-xs font-semibold text-gray-500">Deadline</p>
                            <p className="mt-1 font-bold text-[#12244A]">
                                {item.deadline || "Not specified"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-6">
                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-[#12244A]">Eligibility</h2>

                            {item.eligibility?.length > 0 ? (
                                <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
                                    {item.eligibility.map((text: string, index: number) => (
                                        <li key={index}>{text}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-4 text-gray-500">No eligibility information available.</p>
                            )}
                        </section>

                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-[#12244A]">Benefits</h2>

                            {item.benefits?.length > 0 ? (
                                <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
                                    {item.benefits.map((text: string, index: number) => (
                                        <li key={index}>{text}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-4 text-gray-500">No benefits information available.</p>
                            )}
                        </section>

                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-[#12244A]">Areas</h2>

                            {item.area?.length > 0 ? (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {item.area.map((text: string, index: number) => (
                                        <span
                                            key={index}
                                            className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-[#12244A]"
                                        >
                      {text}
                    </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-4 text-gray-500">No area tags available.</p>
                            )}
                        </section>
                    </div>

                    <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-[#12244A]">
                            Application Info
                        </h2>

                        <div className="mt-4 space-y-4 text-sm">
                            <div>
                                <p className="font-semibold text-gray-500">Level</p>
                                <p className="text-gray-800">{formatLabel(item.level)}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-500">Type</p>
                                <p className="text-gray-800">{formatLabel(item.type)}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-500">Funding</p>
                                <p className="text-gray-800">{formatLabel(item.funding)}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-500">Deadline</p>
                                <p className="text-gray-800">{item.deadline || "Not specified"}</p>
                            </div>
                        </div>

                        {item.applicationlink ? (
                            <a
                                href={
                                    item.applicationlink.startsWith("http")
                                        ? item.applicationlink
                                        : `https://${item.applicationlink}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 block rounded-xl bg-[#12244A] px-5 py-3 text-center font-semibold text-white"
                            >
                                Apply / Learn More
                            </a>
                        ) : (
                            <button
                                disabled
                                className="mt-6 block w-full rounded-xl bg-gray-200 px-5 py-3 text-center font-semibold text-gray-500"
                            >
                                Application Link Unavailable
                            </button>
                        )}
                    </aside>
                </div>
            </section>
        </main>
    );
};

export default OpportunityDetailPage;