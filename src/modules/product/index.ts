import { Sequelize } from "sequelize"
import { init, modelName } from "./insfra/repository/mysql/dto-repo"
import { Router } from "express"
import { ProductHTTPService } from "./insfra/transport/http-transport"
import { ProductUseCase } from "./usecase"
import { MySQLProductRepository } from "./insfra/repository/mysql/mysql-repo"
import {
  ProxyProductBrandRepository,
  RPCProductBrandRepository,
  RPCProductCategoryRepository,
} from "./insfra/repository/rpc"
import { config } from "@share/components/config"

export const setupProductHexagon = (sequelize: Sequelize): Router => {
  init(sequelize)

  const productRepository = new MySQLProductRepository(sequelize, modelName)
  const productBrandRepository = new ProxyProductBrandRepository(
    new RPCProductBrandRepository(config.rpc.productBrand)
  )
  const productCategorydRepository = new RPCProductCategoryRepository(config.rpc.productCategory)

  const productUseCase = new ProductUseCase(
    productRepository,
    productBrandRepository,
    productCategorydRepository
  )

  const productHTTPService = new ProductHTTPService(
    productUseCase,
    productBrandRepository,
    productCategorydRepository
  )

  const router = Router()

  router.post("/products/", productHTTPService.createApi.bind(productHTTPService))
  router.get("/products/:id", productHTTPService.getDetailApi.bind(productHTTPService))
  router.patch("/products/:id", productHTTPService.updateApi.bind(productHTTPService))
  router.delete("/products/:id", productHTTPService.deleteApi.bind(productHTTPService))
  router.get("/products/", productHTTPService.listApi.bind(productHTTPService))

  return router
}
