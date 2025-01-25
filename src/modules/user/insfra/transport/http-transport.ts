import { BaseHttpService } from "@share/transport/http-service"
import { User, UserCondDTO, UserRegistrationDTO, UserUpdateDTO } from "../../model/model"
import { Request, Response } from "express"
import { IUserUseCase } from "../../interface"
import { jwtProvider } from "@share/components/jwt"

export class UserHTTPService extends BaseHttpService<
  UserRegistrationDTO,
  UserUpdateDTO,
  User,
  UserCondDTO
> {
  constructor(private readonly usecase: IUserUseCase) {
    super(usecase)
  }

  async register(req: Request, res: Response) {
    await this.createApi(req, res)
  }

  async login(req: Request, res: Response) {
    try {
      const token = await this.usecase.login(req.body)
      res.status(200).json({ data: token })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      })
    }
  }

  async profile(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1]
      if (!token) {
        res.status(201).json({ error: "Unauthorized" })
        return
      }

      const payload = await jwtProvider.verifyToken(token)

      if (!payload) {
        res.status(201).json({ error: "Unauthorized" })
        return
      }

      const { sub } = payload
      const user = await this.usecase.profile(sub as string)

      res.status(200).json({ data: user })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      })
    }
  }

  async introspectApi(req: Request, res: Response) {
    try {
      const { token } = req.body
      const result = await this.usecase.verifyToken(token)

      res.status(200).json({ data: result })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      })
    }
  }
}
