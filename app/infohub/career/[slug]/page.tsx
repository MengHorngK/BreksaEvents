import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Career from "@/database/career.model";

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

const formatLabel = (text?: string | null) => {
    if (!text) return "N/A";
    return text.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const CareerDetailPage = async ({ params }: PageProps) => {
    const { slug } = await params;

    await connectToDatabase();

    const career = await Career.findOne({ slug }).lean();

    if (!career) {
        return (
            <main className="min-h-screen bg-[#F3EEE9] px-5 py-10">
                <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8">
                    <h1 className="text-2xl font-bold text-[#12244A]">
                        Career pathway not found
                    </h1>

                    <Link href="/infohub" className="mt-5 inline-block text-[#12244A]">
                        Back to InfoHub
                    </Link>
                </div>
            </main>
        );
    }

    const item = JSON.parse(JSON.stringify(career));

    return (
        <main className="min-h-screen px-5 py-8">
            <section className="mx-auto max-w-5xl">
                <Link
                    href="/infohub"
                    className="mb-5 inline-block text-sm font-semibold text-[#12244A]"
                >
                    ← Back to InfoHub
                </Link>

                <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
                    <div className="mb-4 flex flex-wrap gap-2">
                        {item.featured && (
                            <span className="rounded-full bg-[#12244] px-3 py-1 text-xs font-semibold text-white">
                Featured
              </span>
                        )}

                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-[#12244A]">
              {item.industry || "Career Path"}
            </span>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {item.region || "Global"}
            </span>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {item.requires_license
                  ? `License: ${item.requires_license}`
                  : "License: N/A"}
            </span>
                    </div>

                    <h1 className="text-3xl font-bold text-[#12244A] md:text-5xl">
                        {item.job_title}
                    </h1>

                    <p className="mt-4 text-gray-600">
                        {item.description || "No description available."}
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
                                {item.region || "N/A"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#F8F4EF] p-4">
                            <p className="text-xs font-semibold text-gray-500">
                                License Required
                            </p>
                            <p className="mt-1 font-bold text-[#12244A]">
                                {item.requires_license || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-6">
                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-[#12244A]">
                                Career Pathway
                            </h2>

                            <p className="mt-4 text-gray-700">
                                {item.pathway || "No pathway information available."}
                            </p>

                            {item.exam_or_license_body && (
                                <div className="mt-4 rounded-2xl bg-[#F8F4EF] p-4">
                                    <p className="text-sm font-semibold text-gray-500">
                                        Exam / License Body
                                    </p>
                                    <p className="mt-1 font-bold text-[#12244A]">
                                        {item.exam_or_license_body}
                                    </p>
                                </div>
                            )}
                        </section>

                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-[#12244A]">
                                Specializations
                            </h2>

                            {item.specialization?.length > 0 ? (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {item.specialization.map((text: string, index: number) => (
                                        <span
                                            key={index}
                                            className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-[#12244A]"
                                        >
                      {text}
                    </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-4 text-gray-500">
                                    No specialization information available.
                                </p>
                            )}
                        </section>

                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-[#12244A]">
                                Relevant Majors
                            </h2>

                            {item.relevant_majors?.length > 0 ? (
                                <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
                                    {item.relevant_majors.map((text: string, index: number) => (
                                        <li key={index}>{text}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-4 text-gray-500">
                                    No relevant majors available.
                                </p>
                            )}
                        </section>

                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-[#12244A]">
                                Relevant Universities
                            </h2>

                            {item.relevant_universities?.length > 0 ? (
                                <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
                                    {item.relevant_universities.map(
                                        (text: string, index: number) => (
                                            <li key={index}>{text}</li>
                                        )
                                    )}
                                </ul>
                            ) : (
                                <p className="mt-4 text-gray-500">
                                    No university information available.
                                </p>
                            )}
                        </section>

                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-[#12244A]">
                                High School Preparation
                            </h2>

                            <div className="mt-4 grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl bg-[#F8F4EF] p-4">
                                    <h3 className="font-bold text-[#12244A]">Subjects</h3>
                                    {item.hs_subjects?.length > 0 ? (
                                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
                                            {item.hs_subjects.map((text: string, index: number) => (
                                                <li key={index}>{text}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="mt-3 text-sm text-gray-500">N/A</p>
                                    )}
                                </div>

                                <div className="rounded-2xl bg-[#F8F4EF] p-4">
                                    <h3 className="font-bold text-[#12244A]">Activities</h3>
                                    {item.hs_activities?.length > 0 ? (
                                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
                                            {item.hs_activities.map((text: string, index: number) => (
                                                <li key={index}>{text}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="mt-3 text-sm text-gray-500">N/A</p>
                                    )}
                                </div>

                                <div className="rounded-2xl bg-[#F8F4EF] p-4">
                                    <h3 className="font-bold text-[#12244A]">Skills</h3>
                                    {item.hs_skills?.length > 0 ? (
                                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
                                            {item.hs_skills.map((text: string, index: number) => (
                                                <li key={index}>{text}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="mt-3 text-sm text-gray-500">N/A</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-[#12244A]">Resources</h2>

                            {item.resources?.length > 0 ? (
                                <ul className="mt-4 space-y-3">
                                    {item.resources.map((resource: string, index: number) => (
                                        <li
                                            key={index}
                                            className="rounded-2xl bg-[#F8F4EF] p-4 text-sm text-gray-700"
                                        >
                                            {resource}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-4 text-gray-500">No resources available.</p>
                            )}
                        </section>
                    </div>

                    <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-[#12244A]">Career Summary</h2>

                        <div className="mt-4 space-y-4 text-sm">
                            <div>
                                <p className="font-semibold text-gray-500">Industry</p>
                                <p className="text-gray-800">{item.industry || "N/A"}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-500">Job Title</p>
                                <p className="text-gray-800">{item.job_title || "N/A"}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-500">Region</p>
                                <p className="text-gray-800">{item.region || "N/A"}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-500">Country</p>
                                <p className="text-gray-800">{item.country || "N/A"}</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-500">Requires License</p>
                                <p className="text-gray-800">
                                    {item.requires_license || "N/A"}
                                </p>
                            </div>
                        </div>

                        {item.tags?.length > 0 && (
                            <div className="mt-6">
                                <p className="mb-3 font-semibold text-gray-500">Tags</p>

                                <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag: string, index: number) => (
                                        <span
                                            key={index}
                                            className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-[#12244A]"
                                        >
                      {tag}
                    </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </section>
        </main>
    );
};

export default CareerDetailPage;