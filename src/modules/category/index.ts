import { Router } from 'express';
import { init, modelName } from './infras/repository/dto';
import { Sequelize } from 'sequelize';
import { CategoryHttpService } from './infras/transport/http-service';
import { CategoryUseCase } from './usecase';
import { MySQLCategoryRepository } from './infras/repository/repo';
import { ServiceContext } from '@share/interface/service-context';
import { UserRole } from '@share/interface';

export const setupCategoryHexagon = (sequelize: Sequelize, sctx: ServiceContext) => {
  init(sequelize)

  const router = Router()

  const repository = new MySQLCategoryRepository(sequelize, modelName)
  const useCase = new CategoryUseCase(repository)
  const httpService = new CategoryHttpService(useCase)

  const mdlFactory = sctx.mdlFactory
  const adminChecker = mdlFactory.allowRoles([UserRole.ADMIN])
  
  router.get("/categories", httpService.getListCategoriesAPI.bind(httpService))

  router.get("/categories/:id", httpService.getDetailCategoryAPI.bind(httpService))

  router.post("/categories", mdlFactory.auth, adminChecker, httpService.createNewCategoryAPI.bind(httpService))

  router.patch("/categories/:id", mdlFactory.auth, adminChecker, httpService.updateCategoryAPI.bind(httpService))
  
  router.delete("/categories/:id", mdlFactory.auth, adminChecker, httpService.deleteCategoryAPI.bind(httpService))

  return router
}