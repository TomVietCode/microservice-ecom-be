import { Sequelize } from "sequelize"
import { MySQLUserRepository } from "./insfra/repository"
import { UserHTTPService } from "./insfra/transport/http-transport"
import { UserUseCase } from "./usecase"
import { init, modelName } from "./insfra/repository/dto"
import { Router } from "express"
import { ServiceContext } from "@share/interface/service-context"
import { UserRole } from "@share/interface"

export const setupUserHexagon = (sequelize: Sequelize, sctx: ServiceContext) => {
  init(sequelize)

  const repository = new MySQLUserRepository(sequelize, modelName)
  const useCase = new UserUseCase(repository)
  const httpService = new UserHTTPService(useCase)

  const router = Router()
  const mdlFactory = sctx.mdlFactory
  const adminChecker = mdlFactory.allowRoles([UserRole.ADMIN])

  router.post("/register", httpService.register.bind(httpService))
  router.post("/login", httpService.login.bind(httpService))
  router.get("/profile", httpService.profile.bind(httpService))

  router.get("/users", mdlFactory.auth, adminChecker, httpService.listApi.bind(httpService))
  router.patch("/users/:id", mdlFactory.auth, adminChecker, httpService.updateApi.bind(httpService))
  router.delete("/users/:id", mdlFactory.auth, adminChecker, httpService.deleteApi.bind(httpService))

  // RPC API
  router.post("/rpc/introspect", httpService.introspectApi.bind(httpService))
  return router
}
