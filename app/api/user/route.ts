import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from "zod";

const userschema = z.object({
    username: z.string().min(1, "Username is required").max(20),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long").min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, username, password } = userschema.parse(body);

        const existingUser = await db.user.findFirst({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ user: null, message: "User already exists" }, { status: 409 });
        }

        const existingUsername = await db.user.findFirst({
            where: { username },
        });

        if (existingUsername) {
            return NextResponse.json({ user: null, message: "Username already exists" }, { status: 409 });
        }

        const hashedPassword = await hash(password, 10);
        const newuser = await db.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });

        const user = { email: newuser.email, username: newuser.username }; // Manually exclude password
        return NextResponse.json({ user, message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error); 
        return NextResponse.json({ message: "Something Went Wrong" }, { status: 500 });
    }
}
