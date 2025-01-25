import { ITokenProvider, TokenPayload } from "../interface"
import * as jwt from "jsonwebtoken"
import { config } from "./config"

class JWTService implements ITokenProvider {
  private readonly secretKey: string
  private readonly expiresIn: string | number

  constructor(secretKey: string, expiresIn: string | number) {
    this.secretKey = secretKey
    this.expiresIn = expiresIn
  }
  async generateToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn })
  }
  async verifyToken(token: string): Promise<TokenPayload | null> {
    const decoded = jwt.verify(token, this.secretKey) as TokenPayload;
    return decoded;
  }
}

export const jwtProvider = new JWTService(
  config.acecessToken.secretKey,
  config.acecessToken.expiresIn
)
