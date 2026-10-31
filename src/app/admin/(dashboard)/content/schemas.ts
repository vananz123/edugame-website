export type FieldType = "text" | "textarea" | "list" | "items";

export type FieldDef = { name: string; label: string; type: FieldType };

export type ContentSchema = {
  key: string;
  label: string;
  description: string;
  fields: FieldDef[];
};

// Khớp với shape content { vi, en } trong site_content (xem 0002_seed.sql).
export const CONTENT_SCHEMAS: ContentSchema[] = [
  {
    key: "hero",
    label: "Hero",
    description: "The top banner: badge, headline, description and CTAs.",
    fields: [
      { name: "badge", label: "Badge", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "ctaPrimary", label: "Primary button", type: "text" },
      { name: "ctaSecondary", label: "Secondary button", type: "text" },
    ],
  },
  {
    key: "about",
    label: "About",
    description: "Personal introduction: name, role, bio and motivation.",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "motivation", label: "Motivation", type: "textarea" },
    ],
  },
  {
    key: "product",
    label: "Product",
    description: "What EduGame Studio is, plus a bullet list of points.",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "points", label: "Points (one per line)", type: "list" },
    ],
  },
  {
    key: "features",
    label: "Features",
    description: "Feature grid: heading and repeatable title/description items.",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "items", label: "Feature items", type: "items" },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    description: "GitHub link and email shown in About and Footer.",
    fields: [
      { name: "github", label: "GitHub URL", type: "text" },
      { name: "email", label: "Email", type: "text" },
    ],
  },
];

export const SCHEMA_BY_KEY: Record<string, ContentSchema> = Object.fromEntries(
  CONTENT_SCHEMAS.map((s) => [s.key, s])
);