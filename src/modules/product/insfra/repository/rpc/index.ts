import { IBrandQueryRepository, ICategoryQueryRepository } from "@modules/product/interface";
import { ProductBrand, ProductBrandSchema, ProductCategory, ProductCategorySchema } from "@modules/product/model/model";
import axios from "axios";

export class RPCProductBrandRepository implements IBrandQueryRepository {
  constructor(private readonly baseURL: string) {}
  async get(id: string): Promise<ProductBrand | null> {
    try {
      const { data } = await axios.get(`${this.baseURL}/v1/brands/${id}`)
      
      const brandData = ProductBrandSchema.parse(data.data)

      return brandData

    } catch (error) {
      console.error(error)
      return null
    }
  }
}

export class RPCProductCategoryRepository implements ICategoryQueryRepository {
  constructor(private readonly baseURL: string) {}

  async get(id: string): Promise<ProductCategory | null> {
    try {
      const { data } = await axios.get(`${this.baseURL}/v1/categories/${id}`)  

      const categoryData = ProductCategorySchema.parse(data.data)

      return categoryData
    } catch (error) {
      console.error(error)
      return null
    }
  }
}

// proxy pattern
export class ProxyProductBrandRepository implements IBrandQueryRepository {
  constructor(private readonly origin: IBrandQueryRepository) {}

  private cached: Record<string, ProductBrand> = {};

  async get(id: string): Promise<ProductBrand | null> {
    try {
      if (this.cached[id]) {
        return this.cached[id];
      }
      
      const brand = await this.origin.get(id);

      if (brand) {
        this.cached[id] = brand;
      }

      return brand;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}