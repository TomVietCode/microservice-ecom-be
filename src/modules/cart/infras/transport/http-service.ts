import { Request, Response } from "express"
import { ICartQueryRepository, ICartUseCase, IProductQueryRepository } from "../../interface"
import { CartItem } from "../../model"

export class CartHTTPService {
  constructor(
    private readonly cartUseCase: ICartUseCase,
    private readonly cartQueryRepo: ICartQueryRepository,
    private readonly productRPCRepo: IProductQueryRepository,
  ) {}

  async addProductToCartAPI(req: Request, res: Response) {
    const requester = res.locals.requester
    const { sub: userId } = requester

    const result = await this.cartUseCase.addProductToCart({ ...req.body, userId })
    res.status(200).json({ data: result })
  }

  async removeProductFromCartAPI(req: Request, res: Response) {
    const { id } = req.params
    const requester = res.locals.requester
    const { sub: userId } = requester

    const result = await this.cartUseCase.removeProductFromCart(id, userId)
    res.status(200).json({ data: result })
  }

  async updateProductQuantitiesAPI(req: Request, res: Response) {
    const { sub: userId } = res.locals.requester
    const dto = req.body

    const result = await this.cartUseCase.updateProductQuantities(dto, userId)

    res.status(200).json({ data: result })
  }
  
  async listItemsAPI(req: Request, res: Response) {
    const requesterId = res.locals.requester.sub
    const cartItems = await this.cartQueryRepo.listItems(requesterId)

    const productIds = cartItems.map(item => item.productId)

    const cartItemMap = new Map<string, CartItem>() //productId -> CartItem
    cartItems.map(item => cartItemMap.set(item.productId, item))

    const products = await this.productRPCRepo.findByIds(productIds)

    products.forEach(product => {
      const item = cartItemMap.get(product.id)
      if(item) item.product = product
    })
    res.status(200).json({ data: cartItems })
  }
}
