import z from "zod";

export const addSongSchema = z.object({
  title: z.string().max(256, "Max title lengh is 256"),
  body: z.string().min(10),
});

export type CreatePostInput = z.TypeOf<typeof addSongSchema>;

export const getSingleSongSchema = z.object({
  songId: z.string().uuid(),
});
