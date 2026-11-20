
import { connection, NextResponse } from "next/server";
import { DEMO_USER_ID } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";

function formatInterests(value: string): string[] {
  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }
  } catch {
    // Support older comma-separated records.
  }

  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export async function GET() {
  await connection();

  try {
    const profiles = await prisma.profile.findMany({
      where: {
        swipes: {
          none: { userId: DEMO_USER_ID },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        age: true,
        photo: true,
        bio: true,
        city: true,
        interests: true,
      },
    });

    const formattedProfiles = profiles.map((profile) => ({
      ...profile,
      interests: formatInterests(profile.interests),
    }));

    return NextResponse.json(formattedProfiles);
  } catch (error) {
    console.error("FEED API ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load feed" },
      { status: 500 }
    );
  }
}
