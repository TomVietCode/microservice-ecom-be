import { ModelStatus } from "@share/models/base-model"
import { z } from "zod"
import { ErrBrandIdMustBeValidUUID, ErrCategoryIdMustBeValidUUID, ErrNameMustBeAtLeast2Characters, ErrPriceMustBePositive, ErrSalePriceMustBeNonnegative } from "./error"

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, ErrNameMustBeAtLeast2Characters),
  thumbnail: z.string().optional(),
  images: z.string().nullable().optional(),
  price: z.number().positive(ErrPriceMustBePositive),
  salePrice: z.number().nonnegative(ErrSalePriceMustBeNonnegative),
  colors: z.string().nullable().optional(),
  categoryId: z.string().uuid(ErrBrandIdMustBeValidUUID).nullable().optional(),
  brandId: z.string().uuid(ErrCategoryIdMustBeValidUUID).nullable().optional(),
  description: z.string().nullable().optional(),
  rating: z.number().min(0).max(5),
  saleCount: z.number().int().nonnegative(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Product = z.infer<typeof ProductSchema> & { brand?: ProductBrand | null, category?: ProductCategory | null }

export const ProductCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, ErrNameMustBeAtLeast2Characters),
})

export type ProductCategory = z.infer<typeof ProductCategorySchema>

export const ProductBrandSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, ErrNameMustBeAtLeast2Characters),
})

export type ProductBrand = z.infer<typeof ProductBrandSchema>