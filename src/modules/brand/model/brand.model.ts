import { z } from "zod"
import { ModelStatus } from "../../../share/models/base-model"

export const BrandSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  tagLine: z.string().nullable().optional(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Brand = z.infer<typeof BrandSchema> & { children?: Brand[] }