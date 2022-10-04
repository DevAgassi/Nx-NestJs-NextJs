import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class AuthRegisterInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Field()
  @IsNotEmpty()
  @MinLength(2)
  name: string

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string
}
