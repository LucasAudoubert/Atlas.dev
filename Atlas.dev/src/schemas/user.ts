export const userSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    email: { type: "string", format: "email" },
    name: { type: "string" },   
    avatar_url: { type: "string", format: "uri" },
    created_at: { type: "string", format: "date-time" },
    updated_at: { type: "string", format: "date-time" },
    }
};

export type User = {
  id: string;
  email: string;
    name: string;
    avatar_url: string;
    created_at: string;
    updated_at: string;
};