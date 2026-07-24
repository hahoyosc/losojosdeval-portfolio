import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const localizedString = z.object({
  es: z.string(),
  en: z.string().optional(),
});

const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/works" }),
  schema: ({ image }) =>
    z.object({
      title: localizedString,
      category: z.enum(["photo", "video", "design"]),
      subtitle: localizedString,
      description: localizedString.optional(),
      year: z.number(),
      images: z
        .array(
          z.object({
            src: image(),
            orientation: z.enum(["landscape", "portrait"]).default("portrait"),
          }),
        )
        .optional(),
      randomize: z.boolean().default(true),
      video: z
        .object({
          src: z.string(),
          orientation: z.enum(["landscape", "portrait"]).default("landscape"),
          thumbnail: image(),
        })
        .optional(),
    }),
});

export const collections = { works };
