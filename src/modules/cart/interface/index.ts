import { AddCartItemDTO, CartItem, CartItemCondDTO, CartProduct, UpdateCartItemDTO } from "../model";

export interface ICartUseCase {
  addProductToCart(dto: AddCartItemDTO): Promise<boolean>
  removeProductFromCart(id: string, requesterId: string): Promise<boolean>
  updateProductQuantities(dto: UpdateCartItemDTO[], requesterId: string): Promise<boolean>
}

export interface ICartQueryRepository {
  get(id: string): Promise<CartItem | null>
  listItems(requesterId: string): Promise<Array<CartItem>>
  findByCond(cond: CartItemCondDTO): Promise<CartItem | null>
}

export interface ICartCommandRepository {
  create(dto: AddCartItemDTO): Promise<boolean>
  update(id: string, data: CartItem): Promise<boolean>
  updateMany(dto: UpdateCartItemDTO[], userId: string): Promise<boolean>
  remove(id: string, isHard: boolean): Promise<boolean>
}

export interface IProductQueryRepository {
  findById(id: string): Promise<CartProduct | null>
  findByIds(ids: string[]): Promise<Array<CartProduct>>
}