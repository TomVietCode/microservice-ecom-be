import { z } from "zod"
import { ModelStatus } from "../../../share/models/base-model"

export const BrandCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  tagLine: z.string().nullable().optional()
})

export type BrandCreateDTO = z.infer<typeof BrandCreateSchema>

export const BrandUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  tagLine: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional()
})

export type BrandUpdateDTO = z.infer<typeof BrandUpdateSchema>

export type BrandCondDTO = {}