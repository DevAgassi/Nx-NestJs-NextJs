import { Module } from '@nestjs/common'
import { CourseResolver } from './resolvers/course.resolver'
import { CourseService } from './course.service'
import { LessonResolver } from './resolvers/lesson.resolver'
import { PrismaService } from '@pet-project/prisma'
import { UserService } from '@pet-project/user'
import { JwtService } from '@nestjs/jwt'

@Module({
  controllers: [],
  imports: [],
  providers: [CourseResolver, CourseService, LessonResolver, PrismaService, UserService, JwtService],
  exports: [],
})
export class CourseModule {}