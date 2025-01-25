import { PagingDTO } from "@share/models/base-model";
import { IUserUseCase } from "../interface";
import { UserRegistrationDTO, UserLoginDTO, User, UserCondDTO, UserUpdateDTO, UserRegistrationDTOSchema, Status, Gender, UserRole, UserLoginDTOSchema, userUpdateDTOSchema, userCondDTOSchema } from "../model/model";
import { IRepository, TokenPayload } from "@share/interface";
import { ErrEmailExisted, ErrInvalidEmailAndPassword, ErrInvalidToken, ErrUserInactivated, ErrUserNotFound } from "../model/error";
import * as bcrypt from 'bcrypt';
import { v7 } from "uuid";
import { jwtProvider } from "@share/components/jwt";

export class UserUseCase implements IUserUseCase {
  constructor(private readonly repository: IRepository<User, UserUpdateDTO, UserCondDTO>) {}

  async register(data: UserRegistrationDTO): Promise<string> {
    const dtoData = UserRegistrationDTOSchema.parse(data)

    // Check if email already existed
    const existedEmail = await this.repository.findByCond({ email: dtoData.email })
    if(existedEmail) {
      throw ErrEmailExisted
    }

    // Gen salt and hash password
    const salt = bcrypt.genSaltSync(10)
    const hashedPass = await bcrypt.hash(dtoData.password, salt)

    const newId = v7()
    const newUser: User = {
      ...dtoData,
      id: newId,
      status: Status.ACTIVE,
      gender: Gender.UNKNOWN,
      role: UserRole.USER,
      salt: salt,
      password: hashedPass,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await this.repository.insert(newUser)
    
    return newId
  }

  async login(data: UserLoginDTO): Promise<string> {
    const dto = UserLoginDTOSchema.parse(data)

    const user = await this.repository.findByCond({ email: dto.email })
    if(!user) throw ErrInvalidEmailAndPassword

    const isPasswordMatch = bcrypt.compare(dto.password, user.password)
    if(!isPasswordMatch) throw ErrInvalidEmailAndPassword

    if(user.status == Status.DELETED || user.status === Status.BANNED || user.status === Status.INACTIVE) {
      throw ErrUserInactivated
    }

    // Return token
    const role = user.role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.USER
    const token = jwtProvider.generateToken({
      sub: user.id,
      role: role
    })
    return token
  }

  async profile(userId: string): Promise<User> {
    const user = await this.repository.get(userId)
    if(!user || user.status === Status.INACTIVE || user.status === Status.DELETED) {
      throw ErrUserInactivated
    }

    const { salt, password, ...otherProps } = user
    return otherProps as User
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    const payload = await jwtProvider.verifyToken(token)
    if(!payload) throw ErrInvalidToken

    const user = await this.repository.get(payload.sub)
    if(!user || user.status === Status.INACTIVE || user.status === Status.DELETED) {
      throw ErrUserNotFound
    }

    return {
      sub: user.id,
      role: payload.role
    }
  }
  
  async create(data: UserRegistrationDTO): Promise<string> {
    return await this.register(data)
  }

  async getDetail(id: string): Promise<User | null> {
    const user = await this.profile(id)
    return user as User
  }

  async update(id: string, data: UserUpdateDTO): Promise<boolean> {
    const dto = userUpdateDTOSchema.parse(data)

    const user = await this.repository.get(id)
    if (!user || user.status === Status.DELETED) {
      throw ErrUserNotFound;
    }
    return await this.repository.update(id, dto)
  }

  async delete(id: string): Promise<boolean> {
    const user = await this.repository.get(id)
    if (!user || user.status === Status.DELETED) {
      throw ErrUserNotFound;
    }

    return await this.repository.delete(id, false)
  }

  async list(cond: UserCondDTO, paging: PagingDTO): Promise<User[]> {
    const parsedCond = userCondDTOSchema.parse(cond)

    const data = await this.repository.list(parsedCond, paging)

    const users = data.map(({ salt, password, ...rest }) => rest)
    
    return users as User[]
  }
}