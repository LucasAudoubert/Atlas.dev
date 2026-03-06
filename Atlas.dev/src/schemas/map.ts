export const mapSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    image_url: { type: "string", format: "uri" },
    created_at: { type: "string", format: "date-time" },
    updated_at: { type: "string", format: "date-time" },
  },
};

export type Map = {
  id: string;
  name: string;
    description: string;
    image_url: string;
    created_at: string;
    updated_at: string;
};