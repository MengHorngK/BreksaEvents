import mongoose, { Schema, models, model } from "mongoose";

export interface ICareer {
    main_label: string;
    industry: string;
    job_title: string;
    slug: string;
    description: string;
    region: string;
    country: string;
    specialization: string[];
    requires_license: string;
    relevant_majors: string[];
    relevant_universities: string[];
    pathway: string;
    exam_or_license_body: string;
    hs_subjects: string[];
    hs_activities: string[];
    hs_skills: string[];
    resources: string[];
    tags: string[];
    featured: boolean;
}

const CareerSchema = new Schema<ICareer>(
    {
        main_label: { type: String, default: "Career Path" },
        industry: { type: String, required: true },
        job_title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        region: { type: String },
        country: { type: String },
        specialization: [{ type: String }],
        requires_license: { type: String },
        relevant_majors: [{ type: String }],
        relevant_universities: [{ type: String }],
        pathway: { type: String },
        exam_or_license_body: { type: String },
        hs_subjects: [{ type: String }],
        hs_activities: [{ type: String }],
        hs_skills: [{ type: String }],
        resources: [{ type: String }],
        tags: [{ type: String }],
        featured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Career =
    models.Career || model<ICareer>("Career", CareerSchema, "careers");

export default Career;