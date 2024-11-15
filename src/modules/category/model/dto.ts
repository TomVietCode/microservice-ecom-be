import { z } from "zod"
import { ModelStatus } from "../../../share/models/base-model"

export const CategoryCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  parentId: z.string().min(36).nullable().optional()
})

export type CategoryCreateDTO = z.infer<typeof CategoryCreateSchema>

export const CategoryUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
  position: z.coerce.number().optional(),
  status: z.nativeEnum(ModelStatus).optional()
})

export type CategoryUpdateDTO = z.infer<typeof CategoryUpdateSchema>

export const CategoryCondSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  status: z.nativeEnum(ModelStatus).optional()
})

export type CategoryCondDTO = z.infer<typeof CategoryCondSchema>