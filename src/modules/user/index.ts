import { Sequelize } from "sequelize"
import { MySQLUserRepository } from "./insfra/repository"
import { UserHTTPService } from "./insfra/transport/http-transport"
import { UserUseCase } from "./usecase"
import { init, modelName } from "./insfra/repository/dto"
import { Router } from "express"

export const setupUserHexagon = (sequelize: Sequelize) => {
  init(sequelize)

  const repository = new MySQLUserRepository(sequelize, modelName)
  const useCase = new UserUseCase(repository)
  const httpService = new UserHTTPService(useCase)

  const router = Router()

  router.post("/register", httpService.register.bind(httpService))
  router.post("/login", httpService.login.bind(httpService))
  router.get("/profile", httpService.profile.bind(httpService))

  router.get("/users", httpService.listApi.bind(httpService))
  router.patch("/users/:id", httpService.updateApi.bind(httpService))
  router.delete("/users/:id", httpService.deleteApi.bind(httpService))
  return router
}
