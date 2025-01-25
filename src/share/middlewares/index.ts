import { Handler } from "express";
import { ITokenIntrospect } from "../interface";
import { MdlFactory } from "../interface/service-context";
import { authMiddleware } from "./auth";
import { allowRoles } from "./check-roles";

export const setupMiddlewares = (introspector: ITokenIntrospect): MdlFactory => {
  const auth = authMiddleware(introspector)

  return {
    auth,
    allowRoles
  }
}