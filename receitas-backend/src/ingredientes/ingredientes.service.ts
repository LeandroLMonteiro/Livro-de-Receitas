// src/ingredientes/ingredientes.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingrediente } from './entities/ingrediente.entity';
import { CreateIngredienteDto } from './dto/create-ingrediente.dto';

@Injectable()
export class IngredientesService {
  constructor(
    @InjectRepository(Ingrediente)
    private ingredientesRepository: Repository<Ingrediente>,
  ) {}

  async create(createIngredienteDto: CreateIngredienteDto): Promise<Ingrediente> {
    const ingrediente = this.ingredientesRepository.create(createIngredienteDto);
    return this.ingredientesRepository.save(ingrediente);
  }

  async findAll(): Promise<Ingrediente[]> {
    return this.ingredientesRepository.find();
  }

  async findOne(id: string): Promise<Ingrediente> {
    const ingrediente = await this.ingredientesRepository.findOne({ where: { id } });
    if (!ingrediente) {
      throw new NotFoundException(`Ingrediente com ID ${id} não encontrado.`);
    }
    return ingrediente;
  }
}