import { NextRequest, NextResponse } from "next/server";

// YouTube Data API v3 — video statistics fetcher
// Required env var: YOUTUBE_API_KEY
// Add to Vercel environment variables and local .env.local

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3/videos";

// Cache responses for 1 hour to minimise API quota usage
const CACHE_TTL_SECONDS = 3600;

interface YouTubeVideoItem {
  id: string;
  statistics: {
    viewCount: string;
  };
}

interface YouTubeApiResponse {
  items?: YouTubeVideoItem[];
  error?: { message: string };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json(
      { error: "Missing ids parameter" },
      { status: 400 }
    );
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "YouTube API key not configured" },
      { status: 503 }
    );
  }

  // Validate that ids are plausible YouTube video IDs (alphanumeric + - _)
  const idList = ids.split(",").slice(0, 50); // cap at 50 IDs
  const validIdPattern = /^[a-zA-Z0-9_-]{1,20}$/;
  const sanitisedIds = idList.filter((id) => validIdPattern.test(id));

  if (sanitisedIds.length === 0) {
    return NextResponse.json(
      { error: "No valid video IDs provided" },
      { status: 400 }
    );
  }

  try {
    const url = new URL(YOUTUBE_API_BASE);
    url.searchParams.set("part", "statistics");
    url.searchParams.set("id", sanitisedIds.join(","));
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString(), {
      next: { revalidate: CACHE_TTL_SECONDS },
    });

    if (!res.ok) {
      const err: YouTubeApiResponse = await res.json();
      console.error("[youtube-stats] API error:", err.error?.message);
      return NextResponse.json(
        { error: "YouTube API request failed" },
        { status: 502 }
      );
    }

    const data: YouTubeApiResponse = await res.json();

    // Build a map of videoId → view count (as number)
    const stats: Record<string, number> = {};
    for (const item of data.items ?? []) {
      const views = parseInt(item.statistics?.viewCount ?? "0", 10);
      if (!isNaN(views)) {
        stats[item.id] = views;
      }
    }

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=60`,
      },
    });
  } catch (err) {
    console.error("[youtube-stats] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
