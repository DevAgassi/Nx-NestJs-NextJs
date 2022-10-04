import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@pet-project/prisma'
import { Prisma, Courses } from '@prisma/client';
import { CreateCourseInput } from './dto/create-course.input'
import { CreateLessonInput } from './dto/create-lesson.input'
import { UpdateCourseInput } from './dto/update-course.input'
import { UpdateLessonInput } from './dto/update-lesson.input'

@Injectable()
export class CourseService {
  private readonly courseIncludes = {
    author: true,
    lessons: true,
  }

  constructor(private readonly prisma: PrismaService) {}
  public courses() {
    return this.prisma.courses.findMany();//findMany({ include: this.courseIncludes })
  }

  public async course(id: number) {
    const found = await this.prisma.courses.findUniqueOrThrow({
      where: { id },
      include: this.courseIncludes,
    })
    if (!found) {
      throw new NotFoundException(`Course with id ${id} not found!`)
    }
    return found
  }

  public createCourse(userId: number, input: CreateCourseInput) {
    return this.prisma.courses.create({
      data: {
        author: {
          connect: { id: userId }
        },
        ...input,
      },
    })
  }

  public async updateCourse(userId: number, id: number, input: UpdateCourseInput) {
    const course = await this.course(id)

    return this.prisma.courses.update({
      where: { id: course.id },
      data: { ...input },
    })
  }

  public async deleteCourse(userId: number, id: number) {
    const deleted = await this.prisma.courses.delete({
      where: {
        id,
      },
    })
    return !!deleted
  }

  public async createLesson(userId: number, courseId: number, input: CreateLessonInput) {
    const course = await this.course(courseId)

    return this.prisma.lesson.create({
      data: {
        courses: {
          connect: { id: course.id },
        },
        ...input,
      },
    })
  }

  public updateLesson(userId: number, lessonId: number, input: UpdateLessonInput) {
    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: { ...input },
    })
  }

  public async deleteLesson(userId: number, lessonId: number) {
    // TODO: Check if userId can actually delete this?
    const deleted = await this.prisma.lesson.delete({ where: { id: lessonId } })

    return !!deleted
  }
}