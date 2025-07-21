import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { id, email, name, firstName, lastName, address1, address2, city, stateProvince, postalCode, country, phone } = await request.json();

    if (!id || !email || !firstName || !lastName || !address1 || !city || !stateProvince || !postalCode || !country || !phone) {
      return NextResponse.json({ error: "Missing required user profile information" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        id, // Use the ID from Supabase Auth
        email,
        name: name || `${firstName} ${lastName}`,
        firstName,
        lastName,
        address1,
        address2,
        city,
        stateProvince,
        postalCode,
        country,
        phone,
      },
    });

    return NextResponse.json({ userId: user.id, message: "User profile created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating user profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
