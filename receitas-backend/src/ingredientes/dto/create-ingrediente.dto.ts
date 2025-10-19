// src/ingredientes/dto/create-ingrediente.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

export class CreateIngredienteDto {
  @IsString()
  @IsNotEmpty()
  nome: string; 

  @IsString()
  @IsNotEmpty()
  unidadePadrao: string; 

  @IsString()
  @IsNotEmpty()
  categoria: string; 
}