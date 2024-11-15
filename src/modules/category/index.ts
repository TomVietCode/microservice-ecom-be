import { Router } from 'express';
import { init, modelName } from './infras/repository/dto';
import { Sequelize } from 'sequelize';
import { CategoryHttpService } from './infras/transport/http-service';
import { CategoryUseCase } from './usecase';
import { MySQLCategoryRepository } from './infras/repository/repo';

export const setupCategoryHexagon = (sequelize: Sequelize) => {
  init(sequelize)

  const router = Router()

  const repository = new MySQLCategoryRepository(sequelize, modelName)
  const useCase = new CategoryUseCase(repository)
  const httpService = new CategoryHttpService(useCase)
  
  router.get("/categories", httpService.getListCategoriesAPI.bind(httpService))

  router.get("/categories/:id", httpService.getDetailCategoryAPI.bind(httpService))

  router.post("/categories", httpService.createNewCategoryAPI.bind(httpService))

  router.patch("/categories/:id", httpService.updateCategoryAPI.bind(httpService))
  
  router.delete("/categories/:id", httpService.deleteCategoryAPI.bind(httpService))

  return router
}