import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, address1, address2, city, stateProvince, postalCode, country, phone } = await request.json();

    if (!email || !firstName || !lastName || !address1 || !city || !stateProvince || !postalCode || !country || !phone) {
      return NextResponse.json({ error: "Missing required user information" }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email: email },
      update: {
        firstName,
        lastName,
        address1,
        address2,
        city,
        stateProvince,
        postalCode,
        country,
        phone,
        name: `${firstName} ${lastName}`,
      },
      create: {
        email,
        firstName,
        lastName,
        address1,
        address2,
        city,
        stateProvince,
        postalCode,
        country,
        phone,
        name: `${firstName} ${lastName}`,
      },
    });

    return NextResponse.json({ userId: user.id });
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
