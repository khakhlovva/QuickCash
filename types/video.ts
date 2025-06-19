import type { z } from "zod";
import type { createVideoSchema } from "~/schemas/create-video";
import type { Profile } from "./profile";

export type Video = {
  id: string;
  title: string | null;
  thumbnail_url: string | null;
  url: string | null;
  prompt: string | null;
  creator_id: string | null;
  created_at: string | null;
};

export type VideoWithCreator = {
  creator: Profile;
} & Omit<Video, 'creator_id'>;

export type CreateVideoParams = z.infer<typeof createVideoSchema>;
