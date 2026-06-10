import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/database/user.model";

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const { name, phone, email, password, role } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Name, email, and password are required." },
                { status: 400 }
            );
        }

        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!strongPasswordRegex.test(password)) {
            return NextResponse.json(
                {
                    message:
                        "Password must be at least 8 characters and include uppercase, lowercase, and a number.",
                },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return NextResponse.json(
                { message: "This email is already registered." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            name: name.trim(),
            phone,
            email: normalizedEmail,
            password: hashedPassword,
            role: role === "mentor" ? "mentor" : "mentee",
            provider: "credentials",
            kickoffStatus: "not_started",
            canBookMentor: false,
        });

        return NextResponse.json(
            {
                message: "User registered successfully.",
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);

        return NextResponse.json(
            { message: "Registration failed." },
            { status: 500 }
        );
    }
}