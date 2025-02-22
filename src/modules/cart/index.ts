import { ServiceContext } from "@share/interface/service-context";
import { Sequelize } from "sequelize";
import { CartHTTPService } from "./infras/transport/http-service";
import { CartUseCase } from "./usecase";
import { CartRepository } from "./infras/repository/mysql";
import { init, modelName } from "./infras/repository/mysql/dto";
import { CartProductRPCRepo } from "./infras/repository/rpc";
import { config } from "@share/components/config";
import { Router } from 'express';

export function setupCartHexagon(sequelize: Sequelize, sctx: ServiceContext) {
  init(sequelize)

  const cartRepo = new CartRepository(modelName, sequelize)
  const cartProductRPCRepo = new CartProductRPCRepo(config.rpc.product)
  const cartUseCase = new CartUseCase(cartRepo, cartRepo, cartProductRPCRepo)
  const cartHTTPService = new CartHTTPService(cartUseCase)

  const mdlFactory = sctx.mdlFactory

  const router = Router()  

  router.post("/carts", mdlFactory.auth, cartHTTPService.addProductToCartAPI.bind(cartHTTPService))
  router.delete("/carts/:id", mdlFactory.auth, cartHTTPService.removeProductFromCartAPI.bind(cartHTTPService))

  return router
}