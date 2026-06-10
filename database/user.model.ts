import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            default: "",
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            default: null,
        },

        image: {
            type: String,
            default: "",
        },

        provider: {
            type: String,
            enum: ["credentials", "google", "facebook", "telegram"],
            default: "credentials",
        },
        role: {
            type: String,
            enum: ["mentee", "mentor"],
            default: "mentee",
        },

        // Mentorship workflow
        kickoffStatus: {
            type: String,
            enum: ["not_started", "submitted", "completed"],
            default: "not_started",
        },

        canBookMentor: {
            type: Boolean,
            default: false,
        },

        // Profile information
        school: {
            type: String,
            default: "",
        },

        grade: {
            type: String,
            default: "",
        },

        intendedMajor: {
            type: String,
            default: "",
        },

        studyDestination: {
            type: String,
            default: "",
        },

        country: {
            type: String,
            default: "",
        },
        username: {
            type: String,
            default: "",
        },

        // Admin
        isApprovedMentor: {
            type: Boolean,
            default: false,
        },
        profileCompleted: {
            type: Boolean,
            default: false,
        },

        personalInfo: {
            firstName: { type: String, default: "" },
            lastName: { type: String, default: "" },
            dateOfBirth: { type: String, default: "" },
            gender: { type: String, default: "" },
            phoneNumber: { type: String, default: "" },
            address: { type: String, default: "" },
        },

        educationBackground: {
            schoolName: { type: String, default: "" },
            grade: { type: String, default: "" },
            academicResultType: { type: String, default: "" },
            englishLevel: { type: String, default: "" },
            hasEnglishTest: { type: String, default: "No" },

            englishTestInfo: {
                // IELTS
                ieltsOverallBand: {
                    type: String,
                    default: "",
                },

                ieltsSpeaking: {
                    type: String,
                    default: "",
                },

                ieltsListening: {
                    type: String,
                    default: "",
                },

                ieltsReading: {
                    type: String,
                    default: "",
                },

                ieltsWriting: {
                    type: String,
                    default: "",
                },

                // TOEFL iBT
                toeflTotalScore: {
                    type: String,
                    default: "",
                },

                toeflSpeaking: {
                    type: String,
                    default: "",
                },

                toeflListening: {
                    type: String,
                    default: "",
                },

                toeflReading: {
                    type: String,
                    default: "",
                },

                toeflWriting: {
                    type: String,
                    default: "",
                },

                // SAT
                satScore: {
                    type: String,
                    default: "",
                },

                // ACT
                actScore: {
                    type: String,
                    default: "",
                },
            },

            volunteerWorks: [
                {
                    programName: String,
                    position: String,
                    duration: String,
                    description: String,
                },
            ],

            awards: [
                {
                    name: String,
                    receivedWhen: String,
                    level: String,
                    description: String,
                },
            ],
        },

        academicPlan: {
            knowsMajor: { type: String, default: "" },
            major: { type: String, default: "" },
            interestedFields: [{ type: String }],
            otherField: { type: String, default: "" },
            fieldReason: { type: String, default: "" },
            bestSubject: { type: String, default: "" },
            otherSubject: { type: String, default: "" },
            freeTime: { type: String, default: "" },
            workEnvironment: { type: String, default: "" },
            anythingElse: { type: String, default: "" },

            knowsUniversity: { type: String, default: "" },
            schoolQualities: [{ type: String }],
            yearlyBudget: { type: String, default: "" },

            wantsScholarshipAbroad: { type: String, default: "" },
            studyCountry: { type: String, default: "" },
            otherCountry: { type: String, default: "" },
            hasCountryApplicationInfo: { type: String, default: "" },
        },







    },
    {
        timestamps: true,
    }

);

const User =
    models.User || model("User", UserSchema);

export default User;