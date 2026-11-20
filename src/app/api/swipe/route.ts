
import { NextResponse } from "next/server";
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

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const swipeRequest = body as Record<string, unknown>;
    const profileId = swipeRequest.profileId;
    const action = swipeRequest.action;

    if (
      typeof profileId !== "string" ||
      typeof action !== "string" ||
      !["LIKE", "PASS"].includes(action)
    ) {
      return NextResponse.json(
        { error: "Invalid profileId or action." },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 }
      );
    }

    await prisma.swipe.upsert({
      where: {
        userId_profileId: {
          userId: DEMO_USER_ID,
          profileId,
        },
      },
      update: { action },
      create: {
        userId: DEMO_USER_ID,
        profileId,
        action,
      },
    });

    const incomingLike =
      action === "LIKE"
        ? await prisma.incomingLike.findUnique({
            where: {
              userId_profileId: {
                userId: DEMO_USER_ID,
                profileId,
              },
            },
          })
        : null;

    const matched = Boolean(incomingLike);

    const match = matched
      ? {
          id: profile.id,
          name: profile.name,
          age: profile.age,
          photo: profile.photo,
          bio: profile.bio,
          city: profile.city,
          interests: formatInterests(profile.interests),
        }
      : null;

    return NextResponse.json({
      success: true,
      matched,
      match,
      message: matched ? "It's a match!" : "Swipe saved.",
    });
  } catch (error) {
    console.error("SWIPE API ERROR:", error);

    return NextResponse.json(
      { error: "Unable to process swipe." },
      { status: 500 }
    );
  }
}
