// ─── Mapillary Graph API helper ───────────────────────────────────────────────

const BASE = "https://graph.mapillary.com";

/**
 * Fetches the ID of the closest Mapillary image to the given coordinates.
 * Returns null if none found within ~100 m radius or if the request fails.
 */
export async function fetchClosestImageId(
  lng: number,
  lat: number,
): Promise<string | null> {
  const token = import.meta.env.VITE_MAPILLARY_ACCESS_TOKEN as
    | string
    | undefined;
  if (!token || token === "your_token_here") {
    console.warn(
      "[Mapillary] VITE_MAPILLARY_ACCESS_TOKEN is not set. " +
        "Add it to .env.local — get yours at https://www.mapillary.com/dashboard/developers",
    );
    return null;
  }

  try {
    const url = new URL(`${BASE}/images`);
    url.searchParams.set("fields", "id");
    // closeto accepts lon,lat (longitude first)
    url.searchParams.set("closeto", `${lng},${lat}`);
    // Search within 1 km radius for best chances of finding coverage
    url.searchParams.set("radius", "1000");
    url.searchParams.set("limit", "1");
    url.searchParams.set("access_token", token);

    console.log("[Mapillary] Searching near", lng, lat);
    const res = await fetch(url.toString());

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[Mapillary] HTTP ${res.status}:`, body);
      return null;
    }

    const json = (await res.json()) as { data?: { id: string }[] };
    console.log("[Mapillary] Response:", json);
    const id = json.data?.[0]?.id ?? null;
    if (!id) console.warn("[Mapillary] No images found near this location.");
    return id;
  } catch (err) {
    console.error("[Mapillary] Failed to fetch closest image:", err);
    return null;
  }
}
