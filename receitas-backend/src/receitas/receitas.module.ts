// src/receitas/receitas.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receita } from './entities/receita.entity';
import { FichaTecnicaItem } from './entities/ficha-tecnica-item.entity';
import { ReceitasController } from './receitas.controller';
import { ReceitasService } from './receitas.service';
import { TabelaNutricional } from './entities/tabela-nutricional.entity';
import { Comentario } from './entities/comentario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receita,FichaTecnicaItem, TabelaNutricional, Comentario]) // Registra a entidade neste módulo
  ],
  controllers: [ReceitasController],
  providers: [ReceitasService]
})
export class ReceitasModule {}