import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Streams a Spaces object back with Content-Disposition: attachment so the
// browser downloads it in place instead of navigating away. Only allows the
// configured Spaces origin to avoid becoming an open proxy.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const name = (searchParams.get("name") || "download").replace(
    /[^\w.\- ]+/g,
    "_",
  );

  if (!url) {
    return NextResponse.json({ error: "Missing url." }, { status: 400 });
  }

  const allowed = [
    process.env.DO_SPACE_ORIGIN_ENDPOINT,
    process.env.DO_SPACE_ENDPOINT,
  ].filter(Boolean) as string[];

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return NextResponse.json({ error: "Bad url." }, { status: 400 });
  }

  const ok = allowed.some((base) => {
    try {
      return target.hostname.endsWith(new URL(base).hostname.split(".").slice(-3).join("."));
    } catch {
      return false;
    }
  });
  if (!ok) {
    return NextResponse.json({ error: "URL not allowed." }, { status: 403 });
  }

  const upstream = await fetch(target.toString());
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "File not found." }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/octet-stream",
      "Content-Length": upstream.headers.get("content-length") ?? "",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "private, max-age=0",
    },
  });
}
