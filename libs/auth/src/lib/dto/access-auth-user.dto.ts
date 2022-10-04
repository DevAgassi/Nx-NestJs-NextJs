import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AccessAuthUserDto {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  @Field()
  expiresIn: number;
}
