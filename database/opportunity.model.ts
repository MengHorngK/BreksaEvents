import mongoose, { Schema, models, model } from "mongoose";

export interface IOpportunity {
    mainlabel: string;
    title: string;
    slug: string;
    shortdescription?: string;
    level: string;
    type: string;
    funding: string;
    region: string;
    country?: string;
    eligibility: string[];
    benefits: string[];
    deadline?: string;
    applicationlink?: string;
    area: string[];
    featured: boolean;
}

const OpportunitySchema = new Schema<IOpportunity>(
    {
        mainlabel: { type: String, default: "academic_opportunity" },
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        shortdescription: { type: String },
        level: { type: String, required: true },
        type: { type: String, required: true },
        funding: { type: String, required: true },
        region: { type: String, required: true },
        country: { type: String },
        eligibility: [{ type: String }],
        benefits: [{ type: String }],
        deadline: { type: String },
        applicationlink: { type: String },
        area: [{ type: String }],
        featured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Opportunity =
    models.Opportunity ||
    model<IOpportunity>("Opportunity", OpportunitySchema, "opportunities");

export default Opportunity;