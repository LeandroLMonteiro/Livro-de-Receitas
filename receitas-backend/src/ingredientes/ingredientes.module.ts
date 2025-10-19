// src/ingredientes/ingredientes.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingrediente } from './entities/ingrediente.entity';
import { IngredientesController } from './ingredientes.controller';
import { IngredientesService } from './ingredientes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingrediente]) // Registra a entidade
  ],
  controllers: [IngredientesController], // A serem criados no próximo passo
  providers: [IngredientesService],      // A serem criados no próximo passo
  exports: [IngredientesService]         // Exporta para uso em outros módulos (ex: Receitas)
})
export class IngredientesModule {}