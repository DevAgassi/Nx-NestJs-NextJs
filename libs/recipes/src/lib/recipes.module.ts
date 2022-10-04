import { Module } from '@nestjs/common';
//import { DateScalar } from '@nest+graphql/core';
import { RecipesResolver } from './recipes.resolver';
import { RecipesService } from './recipes.service';

@Module({
  providers: [RecipesResolver, RecipesService],
})
export class RecipesModule {}