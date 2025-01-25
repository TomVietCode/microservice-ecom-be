import { IUseCase, TokenPayload } from "@share/interface";
import { User, UserCondDTO, UserLoginDTO, UserRegistrationDTO, UserUpdateDTO } from "../model/model";

export interface IUserUseCase extends IUseCase<UserRegistrationDTO, UserUpdateDTO, User, UserCondDTO> {
  register(data: UserRegistrationDTO): Promise<string>
  login(data: UserLoginDTO): Promise<string>
  profile(userId: string): Promise<User>
  verifyToken(token: string): Promise<TokenPayload>
}