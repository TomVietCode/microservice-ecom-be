import { z } from "zod"

export enum ModelStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DELETED = "deleted"
}

export const PagingDTOShema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  total: z.number().min(0).optional(),
})

export type PagingDTO = z.infer<typeof PagingDTOShema>