import { AppError, ErrForbidden } from "@share/app-error";
import { ICartCommandRepository, ICartQueryRepository, ICartUseCase, IProductQueryRepository } from "../interface";
import { AddCartItemDTO, addCartItemDTOSchema, CartItem } from "../model";
import { ErrCartItemNotFound, ErrProductNotEnoughQuantity, ErrProductNotFound } from "../model/error";
import { v7 } from "uuid";

export class CartUseCase implements ICartUseCase {
  constructor(
    private readonly cartQueryRepo: ICartQueryRepository,
    private readonly cartCommandRepo: ICartCommandRepository,
    private readonly productQueryRepo: IProductQueryRepository
  ) {}

  async addProductToCart(dto: AddCartItemDTO): Promise<boolean> {
    const dataDTO = addCartItemDTOSchema.parse(dto)
    const { userId, productId, attribute, quantity } = dataDTO

    // Get product
    const product = await this.productQueryRepo.findById(productId)
    if(!product) {
      throw AppError.from(ErrProductNotFound, 400)
    }

    // Check if product is already in cart
    const existingItem = await this.cartQueryRepo.findByCond({ userId, productId, attribute })
    if(existingItem) {
      const newQuantity = existingItem.quantity + quantity
      if(product.quantity < newQuantity ) {
        throw AppError.from(ErrProductNotEnoughQuantity, 400)
      }

      await this.cartCommandRepo.update(existingItem.id, { ...existingItem, quantity: newQuantity })
    } else {
      if(product.quantity < quantity ) {
        throw AppError.from(ErrProductNotEnoughQuantity, 400)
      }

      const newId = v7()
      const newItem = { ...dataDTO, id: newId, createdAt: new Date(), updatedAt: new Date() }
      await this.cartCommandRepo.create(newItem)
    }

    return true
  }
  async removeProductFromCart(id: string, requesterId: string): Promise<boolean> {
    const existingItem = await this.cartQueryRepo.get(id)

    if(!existingItem) throw AppError.from(ErrCartItemNotFound, 400)
    if(existingItem.userId != requesterId) {
      throw ErrForbidden.withLog("This cart item do not belong to this user")
    }

    await this.cartCommandRepo.remove(existingItem.id, true)
    return true
  }
  async listItems(requesterId: string): Promise<Array<CartItem> | null> {
    const items = await this.cartQueryRepo.listItems(requesterId)

    // 1. Get cart products by ids
    // 2. Map cart products to cart items
    
    return items
  }
}