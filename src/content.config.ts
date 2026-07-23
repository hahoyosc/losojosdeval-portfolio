import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/works" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(["photo", "video", "design"]),
      subtitle: z.string(),
      year: z.number(),
      images: z
        .array(
          z.object({
            src: image(),
            orientation: z.enum(["landscape", "portrait"]).default("portrait"),
          }),
        )
        .optional(),
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
