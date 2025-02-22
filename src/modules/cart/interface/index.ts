import { AddCartItemDTO, CartItem, CartItemCondDTO, CartProduct } from "../model";

export interface ICartUseCase {
  addProductToCart(dto: AddCartItemDTO): Promise<boolean>
  removeProductFromCart(id: string, requesterId: string): Promise<boolean>
  listItems(requesterId: string): Promise<Array<CartItem> | null>
}

export interface ICartQueryRepository {
  get(id: string): Promise<CartItem | null>
  listItems(requesterId: string): Promise<Array<CartItem> | null>
  findByCond(cond: CartItemCondDTO): Promise<CartItem | null>
}

export interface ICartCommandRepository {
  create(dto: AddCartItemDTO): Promise<boolean>
  update(id: string, data: CartItem): Promise<boolean>
  remove(id: string, isHard: boolean): Promise<boolean>
}

export interface IProductQueryRepository {
  findById(id: string): Promise<CartProduct | null>
  findByIds(ids: string[]): Promise<Array<CartProduct>>
}