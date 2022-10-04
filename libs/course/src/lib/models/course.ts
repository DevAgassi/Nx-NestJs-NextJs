import { Field, ObjectType, ID} from '@nestjs/graphql';
import { Lesson } from './lesson';

@ObjectType({ description: 'course' })
export class Course {
  @Field(type => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [Lesson], { nullable: true })
  lessons?: Lesson[];
}
