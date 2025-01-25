import axios from "axios";
import { ITokenIntrospect, TokenIntrospectResult, TokenPayload } from "../interface";

export class TokenIntrospectRPCClient implements ITokenIntrospect {
  constructor(private readonly url: string) {}
  
  async introspect(token: string): Promise<TokenIntrospectResult> {
    try {
      const response = await axios.post(`${this.url}`, { token })
      const { sub, role } = response.data.data
      
      return {
        isOk: true,
        payload: { sub, role } as TokenPayload
      }
    } catch (error) {
      return {
        isOk: false,
        error: (error as Error),
        payload: null
      }
    }
  }
}