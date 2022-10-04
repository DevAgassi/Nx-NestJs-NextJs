import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from '@pet-project/core';
import { AuthModule } from '@pet-project/auth';
import { CourseModule } from '@pet-project/course';
import { PrismaService } from '@pet-project/prisma';
import { RecipesModule } from '@pet-project/recipes';

@Module({
  imports: [CoreModule, AuthModule, CourseModule, RecipesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
