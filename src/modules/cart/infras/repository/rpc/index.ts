import { CartProduct } from "@/modules/cart/model";
import { IProductQueryRepository } from "@modules/cart/interface";
import axios from "axios";

export class CartProductRPCRepo implements IProductQueryRepository{
  constructor(private readonly productServiceUrl: string) {}
  async findById(id: string): Promise<CartProduct | null> {
    try {
      const { data } = await axios.get(`${this.productServiceUrl}/v1/products/${id}`);
      const product = data.data;

    // convert product model -> cart product model
    // Ex: data mapper or adapter
    return {
      id: product.id,
      name: product.name,
      images: product.images,
      salePrice: product.salePrice,
      price: product.price,
      quantity: product.quantity
      };
    } catch (error) {
      return null;
    }
  }
  async findByIds(ids: string[]): Promise<Array<CartProduct>> {
    const { data } = await axios.post(`${this.productServiceUrl}/v1/products/by-ids`, { ids })
    const products = data.data

    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      images: product.images,
      salePrice: product.salePrice,
      price: product.price,
      quantity: product.quantity
    }));
  }
  
}