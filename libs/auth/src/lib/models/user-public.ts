import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserPublic {
  @Field()
  uuid: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  roles?: string
}
