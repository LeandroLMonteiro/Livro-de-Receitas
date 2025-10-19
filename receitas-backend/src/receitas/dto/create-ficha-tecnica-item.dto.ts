// src/receitas/dto/create-ficha-tecnica-item.dto.ts

// Usaremos 'class-validator' e 'class-transformer' para DTOs
import { IsUUID, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateFichaTecnicaItemDto {
  @IsUUID()
  @IsNotEmpty()
  ingredienteId: string; // ID do ingrediente

  @IsNumber()
  @IsNotEmpty()
  quantidadeBruta: number; // Qtd. inicial

  @IsString()
  @IsNotEmpty()
  unidadeDeMedida: string;

  @IsNumber()
  @IsNotEmpty()
  fatorCorrecao: number; // FC (informado pelo usuário/sistema)

  @IsNumber()
  @IsNotEmpty()
  indiceCoccao: number; // IC (informado pelo usuário/sistema)

  @IsString()
  dadosComplementares?: string;
}