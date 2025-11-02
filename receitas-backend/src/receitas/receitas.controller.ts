// src/receitas/receitas.controller.ts

import { Controller, Post, Body, Get } from '@nestjs/common';
import { ReceitasService } from './receitas.service';
import { CreateFichaTecnicaItemDto } from './dto/create-ficha-tecnica-item.dto';

// DTO de teste para simular o corpo da requisição
class TestCreateReceitaDto {
    titulo: string;
    modoDeFazer: string;
    categoria: string;
    itensFichaTecnica: CreateFichaTecnicaItemDto[];
}

@Controller('receitas')
export class ReceitasController {
  constructor(private readonly receitasService: ReceitasService) {}

  @Post()
  async create(@Body() createReceitaDto: TestCreateReceitaDto) {
    // Nota: É importante que o ingredienteId seja um ID válido
    return this.receitasService.create(createReceitaDto as any);
  }
  // Endpoint para a visualização completa do livro
  @Get('completo')
  async findAllCompleto() {
    return this.receitasService.findAllCompleto();
  }
  
}