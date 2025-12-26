import { NextResponse } from "next/server";
import { fetchProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/auth/session
 * Returns current user session with profile data (similar to StudyOn.app)
 *
 * Response format:
 * {
 *   "user": {
 *     "id": "uuid",
 *     "email": "user@example.com",
 *     "name": "Full Name",
 *     "nickname": "username",
 *     "image": "avatar_url",
 *     "banner": "banner_url",
 *     "isProfilePublic": true,
 *     "timezone": "Asia/Ho_Chi_Minh"
 *   },
 *   "expires": "ISO date string"
 * }
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Get session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      return NextResponse.json(
        { error: "Failed to get session", details: sessionError.message },
        { status: 401 },
      );
    }

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get profile
    const profile = await fetchProfile(supabase, session.user.id);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Format response similar to StudyOn.app
    const response = {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: profile.full_name || profile.nickname,
        nickname: profile.nickname,
        image: profile.avatar_url || null,
        banner: profile.banner_url || null,
        isProfilePublic: profile.is_public ?? true,
        timezone: profile.timezone || "UTC",
        status: profile.status,
      },
      expires: session.expires_at
        ? new Date(session.expires_at * 1000).toISOString()
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
