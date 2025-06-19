import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE, MAX_VIDEO_FILE_SIZE } from '~/constants';

export const createVideoSchema = z.object({
  title: z.string().min(5, { message: "Title should contain at least 5 characters." }),
  video: z
    .any()
    .refine((file) => file, "Video is required.")
    .refine((file) => file?.size <= MAX_VIDEO_FILE_SIZE, `Max file size is ${MAX_VIDEO_FILE_SIZE / 1024 / 1024}MB.`),
  thumbnail: z
    .any()
    .refine((file) => file, "Thumbnail is required.")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.mimeType ? file.mimeType : file?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."),
  prompt: z.string().min(1, { message: 'Prompt is required' }),
});