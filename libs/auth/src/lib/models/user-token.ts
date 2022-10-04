import { Field, ObjectType } from '@nestjs/graphql'
import { UserPublic } from './user-public'
import { UserAuthTokenRefresh } from './user-auth-token-refresh';

@ObjectType()
export class UserToken {
  @Field()
  token: string

  @Field(() => UserAuthTokenRefresh)
  refreshToken: UserAuthTokenRefresh;

  @Field(() => UserPublic)
  user: UserPublic
}
