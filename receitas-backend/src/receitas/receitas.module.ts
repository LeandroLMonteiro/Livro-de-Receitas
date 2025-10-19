// src/receitas/receitas.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receita } from './entities/receita.entity';
import { FichaTecnicaItem } from './entities/ficha-tecnica-item.entity';
import { ReceitasController } from './receitas.controller';
import { ReceitasService } from './receitas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receita,FichaTecnicaItem]) // Registra a entidade neste módulo
  ],
  controllers: [ReceitasController],
  providers: [ReceitasService]
})
export class ReceitasModule {}