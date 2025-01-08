import { BaseRepositorySequelize } from "@share/repository/repo-sequelize";
import { User, UserCondDTO, UserUpdateDTO } from "../../model/model";
import { Sequelize } from "sequelize";

export class MySQLUserRepository extends BaseRepositorySequelize<User, UserUpdateDTO, UserCondDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName)
  }
}