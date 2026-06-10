"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Opportunity = {
    _id: string;
    title: string;
    slug: string;
    shortdescription?: string;
    level: string;
    type: string;
    funding: string;
    region: string;
    country?: string;
    area: string[];
    featured: boolean;
};

type Career = {
    _id: string;
    industry: string;
    job_title: string;
    slug: string;
    description: string;
    region: string;
    country: string;
    specialization: string[];
    tags: string[];
    featured: boolean;
};

const formatLabel = (text?: string) => {
    if (!text) return "N/A";
    return text.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const getUnique = (values: (string | undefined | null)[]) => {
    return Array.from(new Set(values.filter(Boolean))) as string[];
};

const InfoHubPage = () => {
    const [activeTab, setActiveTab] = useState<"academic" | "career">("academic");

    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [careers, setCareers] = useState<Career[]>([]);

    const [level, setLevel] = useState("");
    const [type, setType] = useState("");
    const [funding, setFunding] = useState("");
    const [region, setRegion] = useState("");
    const [area, setArea] = useState("");

    const [industry, setIndustry] = useState("");
    const [job, setJob] = useState("");
    const [careerRegion, setCareerRegion] = useState("");
    useEffect(() => {
        const fetchInfoHubData = async () => {
            try {
                const careerRes = await fetch("/api/careers", {
                    cache: "no-store",
                });

                const careerData = await careerRes.json();

                console.log("Career API:", careerData);

                const careerArray = Array.isArray(careerData)
                    ? careerData
                    : Array.isArray(careerData.careers)
                        ? careerData.careers
                        : [];

                setCareers(careerArray);
            } catch (error) {
                console.log("Career fetch error:", error);
                setCareers([]);
            }

            try {
                const opportunityRes = await fetch("/api/opportunities", {
                    cache: "no-store",
                });

                const opportunityData = await opportunityRes.json();

                console.log("Opportunity API:", opportunityData);

                const opportunityArray = Array.isArray(opportunityData)
                    ? opportunityData
                    : Array.isArray(opportunityData.opportunities)
                        ? opportunityData.opportunities
                        : [];

                setOpportunities(opportunityArray);
            } catch (error) {
                console.log("Opportunity fetch error:", error);
                setOpportunities([]);
            }
        };

        fetchInfoHubData();
    }, []);



    const availableLevels = useMemo(() => {
        return getUnique(opportunities.map((item) => item.level));
    }, [opportunities]);

    const availableTypes = useMemo(() => {
        return getUnique(
            opportunities
                .filter((item) => !level || item.level === level)
                .map((item) => item.type)
        );
    }, [opportunities, level]);

    const availableFunding = useMemo(() => {
        return getUnique(
            opportunities
                .filter((item) => !level || item.level === level)
                .filter((item) => !type || item.type === type)
                .map((item) => item.funding)
        );
    }, [opportunities, level, type]);

    const availableRegions = useMemo(() => {
        return getUnique(
            opportunities
                .filter((item) => !level || item.level === level)
                .filter((item) => !type || item.type === type)
                .filter((item) => !funding || item.funding === funding)
                .map((item) => item.region)
        );
    }, [opportunities, level, type, funding]);

    const availableAreas = useMemo(() => {
        return getUnique(
            opportunities
                .filter((item) => !level || item.level === level)
                .filter((item) => !type || item.type === type)
                .flatMap((item) => item.area || [])
        );
    }, [opportunities, level, type]);

    const filteredOpportunities = useMemo(() => {
        return opportunities.filter((item) => {
            return (
                (!level || item.level === level) &&
                (!type || item.type === type) &&
                (!funding || item.funding === funding) &&
                (!region || item.region === region) &&
                (!area || item.area?.includes(area))
            );
        });
    }, [opportunities, level, type, funding, region, area]);

    const availableIndustries = useMemo(() => {
        return getUnique(careers.map((item) => item.industry));
    }, [careers]);

    const availableJobs = useMemo(() => {
        return getUnique(
            careers
                .filter((item) => !industry || item.industry === industry)
                .map((item) => item.job_title)
        );
    }, [careers, industry]);

    const availableCareerRegions = useMemo(() => {
        return getUnique(
            careers
                .filter((item) => !industry || item.industry === industry)
                .filter((item) => !job || item.job_title === job)
                .map((item) => item.region)
        );
    }, [careers, industry, job]);

    const filteredCareers = useMemo(() => {
        return careers.filter((item) => {
            return (
                (!industry || item.industry === industry) &&
                (!job || item.job_title === job) &&
                (!careerRegion || item.region === careerRegion)
            );
        });
    }, [careers, industry, job, careerRegion]);

    return (
        <main className="min-h-screen bg-[#F3EEE9] px-5 py-8">
            <section className="mx-auto max-w-7xl">
                <div className="mb-6 rounded-3xl bg-white/70 p-8 shadow-sm">
                    <div className="grid items-center gap-6 md:grid-cols-[1fr_360px]">
                        <div>
                            <p className="mb-4 w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#12244A]">
                                InfoHub
                            </p>

                            <h1 className="text-4xl font-bold text-[#12244A] md:text-6xl">
                                Find opportunities and career paths
                            </h1>

                            <p className="mt-4 max-w-2xl text-lg text-[#12244A]/70">
                                Explore academic opportunities and career pathways based on your goals.
                            </p>
                        </div>

                        <div className="hidden justify-end md:flex">
                            <Image
                                src="/icons/book-stack.png"
                                alt="Education illustration"
                                width={900}
                                height={820}
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-2">
                    {/* Academic */}
                    <button
                        onClick={() => setActiveTab("academic")}
                        className={`min-h-[150px] rounded-3xl p-7 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 ${
                            activeTab === "academic"
                                ? "bg-[#12244A] text-white"
                                : "bg-white text-[#12244A]"
                        }`}
                    >
                        <div className="flex items-center gap-5">
                            <div
                                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${
                                    activeTab === "academic"
                                        ? "bg-[#2A3E63]"
                                        : "bg-[#F3EEE9]"
                                }`}
                            >
                                <Image
                                    src={
                                        activeTab === "academic"
                                            ? "/icons/academic_white.png"
                                            : "/icons/academic_blue.png"
                                    }
                                    alt="Academic"
                                    width={62}
                                    height={62}
                                />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-2xl font-bold">
                                    Academic Opportunity
                                </h2>

                                <p className="mt-2 text-sm leading-6 opacity-80">
                                    Scholarships, boarding schools, exchange programs,
                                    competitions, and more.
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Career */}
                    <button
                        onClick={() => setActiveTab("career")}
                        className={`min-h-[150px] rounded-3xl p-7 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 ${
                            activeTab === "career"
                                ? "bg-[#12244A] text-white"
                                : "bg-white text-[#12244A]"
                        }`}
                    >
                        <div className="flex items-center gap-5">
                            <div
                                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${
                                    activeTab === "career"
                                        ? "bg-[#2A3E63]"
                                        : "bg-[#F3EEE9]"
                                }`}
                            >
                                <Image
                                    src={
                                        activeTab === "career"
                                            ? "/icons/career_white.png"
                                            : "/icons/career_blue.png"
                                    }
                                    alt="Career"
                                    width={48}
                                    height={48}
                                />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-2xl font-bold">
                                    Career Pathway
                                </h2>

                                <p className="mt-2 text-sm leading-6 opacity-80">
                                    Explore career pathways by industry, job, and region.
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
                {activeTab === "academic" && (
                    <section className="grid gap-6 lg:grid-cols-[290px_1fr]">
                        <aside className="sticky top-28 h-fit rounded-3xl border border-[#E7DED6] bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Image
                                    src="/icons/filter.png"
                                    alt="Filter"
                                    width={24}
                                    height={24}
                                />

                                <h3 className="text-xl font-bold text-[#12244A]">
                                    Filter Academic
                                </h3>
                                <div className="mt-8 space-y-4">
                                   ...
                                </div>
                            </div>

                            <div className=" space-y-4">
                                <div className="relative">
                                    <Image
                                        src="/icons/academic_blue.png"
                                        alt="Level"
                                        width={35}
                                        height={35}
                                        className="pointer-events-none absolute left-2 top-1/2 z-10 -translate-y-1/2"
                                    />

                                    <select
                                        value={level}
                                        onChange={(e) => {
                                            setLevel(e.target.value);
                                            setType("");
                                            setFunding("");
                                            setRegion("");
                                            setArea("");
                                        }}
                                        className="
                                                w-full
                                                appearance-none
                                                rounded-2xl
                                                border
                                                border-[#E7DED6]
                                                bg-white
                                                py-4
                                                pl-12
                                                pr-10
                                                font-medium
                                                text-[#12244A]
                                                outline-none
                                                transition
                                                hover:border-[#C3A97E]
                                                focus:border-[#12244A]
                                            "
                                                                        >
                                        <option value="">Any Level</option>

                                        {availableLevels.map((item) => (
                                            <option key={item} value={item}>
                                                {formatLabel(item)}
                                            </option>
                                        ))}
                                    </select>

                                    <Image
                                        src="/icons/dropdown.png"
                                        alt="Dropdown"
                                        width={16}
                                        height={16}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                                    />
                                </div>

                                {/* Type */}
                                <div className="relative">
                                    <Image
                                        src="/icons/type.png"
                                        alt="Type"
                                        width={28}
                                        height={28}
                                        className="pointer-events-none absolute left-2 top-1/2 z-10 -translate-y-1/2"
                                    />

                                    <select
                                        value={type}
                                        onChange={(e) => {
                                            setType(e.target.value);
                                            setArea("");
                                        }}
                                        className="w-full appearance-none rounded-2xl border border-[#E7DED6] bg-white py-4 pl-12 pr-12 font-medium text-[#12244A] outline-none transition hover:border-[#C3A97E] focus:border-[#12244A]"
                                    >
                                        <option value="">Any Type</option>
                                        {availableTypes.map((item) => (
                                            <option key={item} value={item}>
                                                {formatLabel(item)}
                                            </option>
                                        ))}
                                    </select>

                                    <Image
                                        src="/icons/dropdown.png"
                                        alt=""
                                        width={16}
                                        height={16}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                                    />
                                </div>

                                {/* Funding */}
                                <div className="relative">
                                    <Image
                                        src="/icons/money.png"
                                        alt="Funding"
                                        width={18}
                                        height={18}
                                        className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2"
                                    />

                                    <select
                                        value={funding}
                                        onChange={(e) => setFunding(e.target.value)}
                                        className="w-full appearance-none rounded-2xl border border-[#E7DED6] bg-white py-4 pl-12 pr-12 font-medium text-[#12244A] outline-none transition hover:border-[#C3A97E] focus:border-[#12244A]"
                                    >
                                        <option value="">Any Funding</option>
                                        {availableFunding.map((item) => (
                                            <option key={item} value={item}>
                                                {formatLabel(item)}
                                            </option>
                                        ))}
                                    </select>

                                    <Image
                                        src="/icons/dropdown.png"
                                        alt=""
                                        width={16}
                                        height={16}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                                    />
                                </div>

                                {/* Region */}
                                <div className="relative">
                                    <Image
                                        src="/icons/region.png"
                                        alt="Region"
                                        width={18}
                                        height={18}
                                        className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2"
                                    />

                                    <select
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}
                                        className="w-full appearance-none rounded-2xl border border-[#E7DED6] bg-white py-4 pl-12 pr-12 font-medium text-[#12244A] outline-none transition hover:border-[#C3A97E] focus:border-[#12244A]"
                                    >
                                        <option value="">Any Region</option>
                                        {availableRegions.map((item) => (
                                            <option key={item} value={item}>
                                                {formatLabel(item)}
                                            </option>
                                        ))}
                                    </select>

                                    <Image
                                        src="/icons/dropdown.png"
                                        alt=""
                                        width={16}
                                        height={16}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                                    />
                                </div>

                                {/* Area */}
                                <div className="relative">
                                    <Image
                                        src="/icons/location.png"
                                        alt="Area"
                                        width={30}
                                        height={30}
                                        className="pointer-events-none absolute left-2 top-1/2 z-10 -translate-y-1/2"
                                    />

                                    <select
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        className="w-full appearance-none rounded-2xl border border-[#E7DED6] bg-white py-4 pl-12 pr-12 font-medium text-[#12244A] outline-none transition hover:border-[#C3A97E] focus:border-[#12244A]"
                                    >
                                        <option value="">Any Area</option>
                                        {availableAreas.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>

                                    <Image
                                        src="/icons/dropdown.png"
                                        alt=""
                                        width={16}
                                        height={16}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        setLevel("");
                                        setType("");
                                        setFunding("");
                                        setRegion("");
                                        setArea("");
                                    }}
                                    className="w-full rounded-xl border border-[#12244A] py-3 font-semibold text-[#12244A]"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </aside>

                        <div>
                            <h3 className="mb-4 text-xl font-bold text-[#12244A]">
                                {filteredOpportunities.length} Academic Opportunities
                            </h3>

                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 text-[#12244A] ">
                                {filteredOpportunities.map((item) => (
                                    <Link
                                        key={item._id || item.slug}
                                        href={`/infohub/opportunity/${item.slug}`}
                                        className="flex min-h-[380px] flex-col rounded-3xl border border-[#E7DED6] bg-white p-6 text-[#12244A] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="mb-4 flex flex-wrap gap-2">
                                            {item.featured && (
                                                <span className="rounded-full bg-[#12244A] px-3 py-1 text-xs font-semibold text-white">
                                                      Featured
                                                    </span>
                                                                                        )}

                                            <span className="rounded-full bg-[#EFE3FF] px-3 py-1 text-xs font-semibold text-[#12244A]">
                                                {formatLabel(item.type)}
                                              </span>
                                        </div>

                                        <h4 className="min-h-[64px] text-xl font-bold leading-tight text-[#12244A]">
                                            {item.title}
                                        </h4>

                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#12244A]/70">
                                            {item.shortdescription || "No description available."}
                                        </p>

                                        <div className="mt-auto">
                                            <div className="mt-5 space-y-2 border-t border-[#E7DED6] pt-4 text-sm text-[#12244A]/70">
                                                <div className="flex items-center gap-2">
                                                    <Image src="/icons/location.png" alt="Location" width={17} height={17} />
                                                    <span>{item.country || "Unknown country"}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Image src="/icons/money.png" alt="Funding" width={17} height={17} />
                                                    <span>{formatLabel(item.funding)}</span>
                                                </div>
                                            </div>

                                            <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-[#F3EEE9] py-3 text-sm font-bold text-[#12244A] transition hover:bg-[#E7DED6]">
                                                View Details
                                                <Image src="/icons/right_arrow.png" alt="" width={16} height={16} />
                                            </div>
                                        </div>
                                    </Link>
                                ))} </div>
                        </div>
                    </section>
                )}
                {activeTab === "career" && (
                    <section className="grid gap-6 lg:grid-cols-[290px_1fr]">
                        <aside className="h-fit rounded-3xl bg-white p-5 shadow-sm">
                            <div className="mb-6 flex items-center gap-3">
                                <Image
                                    src="/icons/filter.png"
                                    alt="Filter"
                                    width={22}
                                    height={22}
                                />

                                <h3 className="text-xl font-bold text-[#12244A]">
                                    Filter Career
                                </h3>
                            </div>
                            <div className="space-y-4 text-[#12244A]">
                                <div className="relative">
                                    <Image
                                        src="/icons/career_blue.png"
                                        alt="Industry"
                                        width={20}
                                        height={20}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                                    />

                                    <select
                                        value={industry}
                                        onChange={(e) => {
                                            setIndustry(e.target.value);
                                            setJob("");
                                            setCareerRegion("");
                                        }}
                                        className="w-full appearance-none rounded-2xl border border-[#E7DED6] bg-white py-4 pl-12 pr-12 font-medium text-[#12244A] outline-none transition hover:border-[#C3A97E] focus:border-[#12244A]"
                                    >
                                        <option value="">Any Industry</option>
                                        {availableIndustries.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>

                                    <Image
                                        src="/icons/dropdown.png"
                                        alt=""
                                        width={24}
                                        height={24}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                                    />
                                </div>

                                <div className="relative">
                                    <Image
                                        src="/icons/job.png"
                                        alt="Job"
                                        width={20}
                                        height={20}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                                    />

                                    <select
                                        value={job}
                                        onChange={(e) => {
                                            setJob(e.target.value);
                                            setCareerRegion("");
                                        }}
                                        className="w-full appearance-none rounded-2xl border border-[#E7DED6] bg-white py-4 pl-12 pr-12 font-medium text-[#12244A] outline-none transition hover:border-[#C3A97E] focus:border-[#12244A]"
                                    >
                                        <option value="">Any Job</option>
                                        {availableJobs.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>

                                    <Image
                                        src="/icons/dropdown.png"
                                        alt=""
                                        width={16}
                                        height={16}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                                    />
                                </div>
                                <div className="relative">
                                    <Image
                                        src="/icons/region.png"
                                        alt="Region"
                                        width={20}
                                        height={20}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                                    />

                                    <select
                                        value={careerRegion}
                                        onChange={(e) => setCareerRegion(e.target.value)}
                                        className="w-full appearance-none rounded-2xl border border-[#E7DED6] bg-white py-4 pl-12 pr-12 font-medium text-[#12244A] outline-none transition hover:border-[#C3A97E] focus:border-[#12244A]"
                                    >
                                        <option value="">Any Region</option>
                                        {availableCareerRegions.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>

                                    <Image
                                        src="/icons/dropdown.png"
                                        alt=""
                                        width={16}
                                        height={16}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        setIndustry("");
                                        setJob("");
                                        setCareerRegion("");
                                    }}
                                    className="w-full rounded-xl border border-[#12244A] py-3 font-semibold text-[#12244A]"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </aside>

                        <div>
                            <h3 className="mb-4 text-xl font-bold text-[#12244A]">
                                {filteredCareers.length} Career Pathways
                            </h3>
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {filteredCareers.map((item) => (
                                    <Link
                                        key={item._id || item.slug}
                                        href={`/infohub/career/${item.slug}`}
                                        className="flex min-h-[380px] flex-col rounded-3xl border border-[#E7DED6] bg-white p-6 text-[#12244A] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="mb-4 flex flex-wrap gap-2">
                                            {item.featured && (
                                                <span className="rounded-full bg-[#12244A] px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
                                            )}

                                            <span className="rounded-full bg-[#EFE3FF] px-3 py-1 text-xs font-semibold text-[#12244A]">
          {item.industry}
        </span>
                                        </div>

                                        <h4 className="min-h-[64px] text-xl font-bold leading-tight text-[#12244A]">
                                            {item.job_title}
                                        </h4>

                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#12244A]/70">
                                            {item.description || "No description available."}
                                        </p>

                                        <div className="mt-auto">
                                            <div className="mt-5 space-y-2 border-t border-[#E7DED6] pt-4 text-sm text-[#12244A]/70">
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        src="/icons/location.png"
                                                        alt="Location"
                                                        width={17}
                                                        height={17}
                                                    />
                                                    <span>{item.country || "Multiple countries"}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        src="/icons/region.png"
                                                        alt="Region"
                                                        width={17}
                                                        height={17}
                                                    />
                                                    <span>{item.region || "Global"}</span>
                                                </div>
                                            </div>

                                            <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-[#F3EEE9] py-3 text-sm font-bold text-[#12244A] transition hover:bg-[#E7DED6]">
                                                View Details
                                                <Image
                                                    src="/icons/right_arrow.png"
                                                    alt=""
                                                    width={16}
                                                    height={16}
                                                />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                        </div>
                    </section>
                )}
            </section>
        </main>
    );
};

export default InfoHubPage;