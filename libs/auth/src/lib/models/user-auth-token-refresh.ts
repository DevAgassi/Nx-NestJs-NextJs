import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
export class UserAuthTokenRefresh {
  @Field()
  @IsNotEmpty()
  refresh_token: string;

  @Field()
  @IsNotEmpty()
  expiresIn: number;
}
