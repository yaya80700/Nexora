import { NextResponse } from "next/server";
import { getSiteContent, isStaffUser } from "../../../lib/nexora/siteContent";

const publicPages = new Set(["home", "formations", "abonnements", "projets", "about", "services", "sites", "contact"]);

export async function GET(req) {
  const page = new URL(req.url).searchParams.get("page") || "home";
  if (!publicPages.has(page)) {
    return NextResponse.json({ error: "Page introuvable" }, { status: 404 });
  }

  const content = await getSiteContent(page);
  if (content?.published === false && !(await isStaffUser())) {
    return NextResponse.json({ error: "Page indisponible" }, { status: 404 });
  }

  return NextResponse.json(content, {
    headers: { "Cache-Control": "no-store" },
  });
}
