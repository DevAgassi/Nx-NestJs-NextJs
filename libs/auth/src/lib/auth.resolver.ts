import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthLoginInput } from './dto/auth-login.input';
import { AuthRegisterInput } from './dto/auth-register.input';
import { UserToken } from './models/user-token';

@Resolver()
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Mutation(() => UserToken)
  async login(
    @Args({ name: 'input', type: () => AuthLoginInput }) input: AuthLoginInput
  ): Promise<UserToken> {
    return this.service.login(input);
  }

  @Mutation(() => UserToken)
  async register(
    @Args({ name: 'input', type: () => AuthRegisterInput })
    input: AuthRegisterInput
  ): Promise<UserToken> {
    return this.service.register(input);
  }
}
