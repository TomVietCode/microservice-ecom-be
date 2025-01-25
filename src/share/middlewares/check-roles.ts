import { Handler, NextFunction, Request, Response } from "express"
import { UserRole } from "../interface"
import {  AppError, ErrForbidden, ErrUnauthorized, responseErr } from "../app-error"

export function allowRoles(roles: UserRole[]): Handler {
  return (req: Request, res: Response, next: NextFunction) => {
    if(!res.locals.requester) {
      responseErr(ErrUnauthorized, res)
      return
    }
    
    const requester = res.locals.requester

    if(roles.indexOf(requester.role) === -1) {
      responseErr(ErrForbidden.withLog(`This user has role: ${requester.role}`), res)
      return
    }

    next()
  }
}