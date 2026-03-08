// ─── Map Layer Definitions ────────────────────────────────────────────────────
//
// All styles are free / no API key required.

export const MAP_LAYERS = [
  {
    id: "dark",
    label: "Sombre",
    description: "Dark Matter",
    url: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  },
  {
    id: "light",
    label: "Clair",
    description: "Positron",
    url: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  },
  {
    id: "voyager",
    label: "Voyager",
    description: "Style coloré",
    url: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  },
  {
    id: "terrain",
    label: "Relief",
    description: "Topographie",
    url: "https://demotiles.maplibre.org/style.json",
  },
  {
    id: "bright",
    label: "Bright",
    description: "OpenFreeMap",
    url: "https://tiles.openfreemap.org/styles/bright",
  },
  {
    id: "liberty",
    label: "Liberty",
    description: "Style détaillé",
    url: "https://tiles.openfreemap.org/styles/liberty",
  },
] as const;

export type MapLayerId = (typeof MAP_LAYERS)[number]["id"];

export const DEFAULT_MAP_STYLE = MAP_LAYERS[0].url;
