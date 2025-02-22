import { Request, Response } from "express";
import { ICartUseCase } from "../../interface";

export class CartHTTPService {
  constructor( private readonly cartUseCase: ICartUseCase) {}

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

  async listItemsAPI(req: Request, res: Response) {
    const requesterId = res.locals.requester.sub
    const result = await this.cartUseCase.listItems(requesterId)

    // Optional: get cart products by ids
    // ... mapping
    res.status(200).json({ data: result });
  }
}