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
import { ServiceContext } from "@share/interface/service-context"
import { UserRole } from "@share/interface"

export const setupProductHexagon = (sequelize: Sequelize, sctx: ServiceContext): Router => {
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
  const mdlFactory = sctx.mdlFactory
  const adminChecker = mdlFactory.allowRoles([UserRole.ADMIN])

  router.post("/products/", mdlFactory.auth, adminChecker, productHTTPService.createApi.bind(productHTTPService))
  router.get("/products/:id", productHTTPService.getDetailApi.bind(productHTTPService))
  router.patch("/products/:id", mdlFactory.auth, adminChecker, productHTTPService.updateApi.bind(productHTTPService))
  router.delete("/products/:id", mdlFactory.auth, adminChecker, productHTTPService.deleteApi.bind(productHTTPService))
  router.get("/products/", productHTTPService.listApi.bind(productHTTPService))

  return router
}
