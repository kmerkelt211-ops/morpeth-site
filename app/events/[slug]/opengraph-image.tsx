import { ImageResponse } from "next/og";
import { client } from "../../../sanity/client";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const QUERY = `
*[_type == "event" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  title,
  start,
  location,
  audience
}
`;

type EventCard = {
  title?: string;
  start?: string;
  location?: string;
  audience?: string;
};

function normaliseSlug(rawSlug: string | string[] | undefined) {
  return decodeURIComponent((Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) || "").trim();
}

async function getEventBySlug(slug: string) {
  let event = await client.fetch<EventCard | null>(QUERY, { slug });
  if (!event && slug && slug !== slug.toLowerCase()) {
    event = await client.fetch<EventCard | null>(QUERY, { slug: slug.toLowerCase() });
  }
  return event;
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = normaliseSlug(rawSlug);
  const event = slug ? await getEventBySlug(slug) : null;

  const title = (event?.title || "Morpeth School Event").slice(0, 110);
  const dateLabel = event?.start
    ? new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(event.start))
    : "Upcoming";

  const subtitle = [event?.audience, event?.location].filter(Boolean).join(" · ") || "Morpeth School calendar";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 20% 20%, rgba(88,137,214,0.45), rgba(13,31,97,0.95) 45%), linear-gradient(135deg, #0d1f61, #173f7a)",
          color: "white",
          padding: "44px 56px",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-70px",
            bottom: "-110px",
            width: "320px",
            height: "320px",
            borderRadius: "999px",
            background: "rgba(210,226,252,0.18)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxWidth: "920px",
            zIndex: 1,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              opacity: 0.82,
              fontWeight: 700,
            }}
          >
            Morpeth School Event
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: 66,
              lineHeight: 1.05,
              letterSpacing: "0.02em",
              fontWeight: 800,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 30,
              lineHeight: 1.25,
              color: "rgba(255,255,255,0.88)",
              maxWidth: "960px",
            }}
          >
            {subtitle}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 22,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              opacity: 0.9,
              fontWeight: 700,
            }}
          >
            {dateLabel}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 24,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
              opacity: 0.9,
            }}
          >
            morpeth.school
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
