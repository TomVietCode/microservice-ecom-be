import { z } from "zod";
import { ErrQuantityMustBePositive } from "./error";

export const cartProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  images: z.array(z.string()).nullable(),
  price: z.number(),
  salePrice: z.number(),
  quantity: z.number()
})

export const cartItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  userId: z.string().uuid(),
  attribute: z.string().nullable().optional().default(''),
  quantity: z.number().min(1, ErrQuantityMustBePositive).default(1),
  product: cartProductSchema.optional()
})

// DTOs
export const addCartItemDTOSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  attribute: z.string().nullable().optional().default(""),
  quantity: z.number().min(1, ErrQuantityMustBePositive).default(1)
})

export const updateCartItemDTOSchema = z.object({
  productId: z.string().uuid(),
  attribute: z.string().nullable().optional().default(""),
  quantity: z.number().min(1)
})

export const cartItemCondDTOSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  attribute: z.string().nullable().optional().default('')
})

export type CartProduct = z.infer<typeof cartProductSchema>
export type CartItem = z.infer<typeof cartItemSchema>

export type AddCartItemDTO = z.infer<typeof addCartItemDTOSchema>
export type UpdateCartItemDTO = z.infer<typeof updateCartItemDTOSchema>
export type CartItemCondDTO = z.infer<typeof cartItemCondDTOSchema>
