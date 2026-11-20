
import { connection, NextResponse } from "next/server";
import { DEMO_USER_ID } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";

function formatInterests(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // Fall back to comma-separated interests.
  }

  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export async function GET() {
  await connection();

  try {
    const matches = await prisma.incomingLike.findMany({
      where: {
        userId: DEMO_USER_ID,
        profile: {
          swipes: {
            some: { userId: DEMO_USER_ID, action: "LIKE" },
          },
        },
      },
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedMatches = matches.map((item) => ({
      id: item.profile.id,
      name: item.profile.name,
      age: item.profile.age,
      photo: item.profile.photo,
      bio: item.profile.bio,
      city: item.profile.city,
      interests: formatInterests(item.profile.interests),
    }));

    return NextResponse.json(formattedMatches);
  } catch (error) {
    console.error("MATCHES API ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load matches." },
      { status: 500 }
    );
  }
}
