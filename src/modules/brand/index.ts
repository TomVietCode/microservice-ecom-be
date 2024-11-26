import { Router } from "express"
import { Sequelize } from "sequelize"
import { BrandHttpService } from "./infras/transport"
import { BrandRepository } from "./infras/repository/sequelize"
import { init } from "./infras/repository/sequelize/dto"
import { CreateBrandCmdHandler } from "./usecase/create-brand"
import { GetBrandDetailQuery } from "./usecase/get-brand-detail"
import { UpdateBrandCmdHandler } from "./usecase/update-brand"
import { DeleteBrandCmdHandler } from "./usecase/delete-brand"
import { ListBrandQuery } from "./usecase/list-brand"

export const setupBrandHexagon = (sequelize: Sequelize) => {
  init(sequelize)
  const router = Router()

  const repository = new BrandRepository(sequelize)

  const createBrandHandler = new CreateBrandCmdHandler(repository)
  const getBrandDetailHandler = new GetBrandDetailQuery(repository)
  const updateBrandHandler = new UpdateBrandCmdHandler(repository)
  const deleteBrandHandler = new DeleteBrandCmdHandler(repository)
  const listBrandHandler = new ListBrandQuery(repository)

  const httpService = new BrandHttpService(
    createBrandHandler, 
    getBrandDetailHandler,
    updateBrandHandler,
    deleteBrandHandler,
    listBrandHandler,
  )

  router.post("/brands", httpService.createApi.bind(httpService))

  router.get("/brands/:id", httpService.getApi.bind(httpService))

  router.patch("/brands/:id", httpService.updateApi.bind(httpService))

  router.delete("/brands/:id", httpService.deleteApi.bind(httpService))

  router.get("/brands", httpService.listApi.bind(httpService))

  return router
} 