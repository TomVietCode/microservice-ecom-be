import { z } from "zod";
import { ModelStatus } from "../../../share/models/base-model";
import { BrandNameTooShort } from "./errors";

export const BrandCreateDTOSchema = z.object({
  name: z.string().min(2, BrandNameTooShort.message),
  image: z.string().nullable().optional(),
  tagLine: z.string().nullable().optional(),
  description: z.string().nullable().optional(),

})

export type BrandCreateDTO = z.infer<typeof BrandCreateDTOSchema>

export const BrandUpdateDTOSchema = z.object({
  name: z.string().min(2, BrandNameTooShort.message).optional(),
  image: z.string().nullable().optional(),
  tagLine: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.nativeEnum(ModelStatus)
})

export type BrandUpdateDTO = z.infer<typeof BrandUpdateDTOSchema>

export type BrandCondDTO = {}