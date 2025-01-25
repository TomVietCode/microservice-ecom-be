import { Handler, NextFunction, Request, Response } from "express"
import { ITokenIntrospect, Requester } from "../interface"
import { ErrUnauthorized, responseErr } from "../app-error"

export function authMiddleware(introspector: ITokenIntrospect): Handler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Get token from header
      const token = req.headers.authorization?.split(" ")[1]

      if (!token) {
        responseErr(new Error("No JWT Token found"), res)
        return
      }

      // 2. Introspect token
      const { isOk, payload, error } = await introspector.introspect(token)

      if (!isOk) {
        responseErr(ErrUnauthorized, res)
        return 
      }

      res.locals["requester"] = payload as Requester

      return next()
    } catch (error) {
      responseErr(ErrUnauthorized, res)
      return
    }
  }
}
