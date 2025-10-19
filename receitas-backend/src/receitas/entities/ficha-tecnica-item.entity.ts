// src/receitas/entities/ficha-tecnica-item.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Receita } from './receita.entity';
import { Ingrediente } from '../../ingredientes/entities/ingrediente.entity';

@Entity('ficha_tecnica_itens')
export class FichaTecnicaItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Chaves Estrangeiras ---

  // Relação N:1 com Receita (Vários itens para Uma Receita)
  @ManyToOne(() => Receita, (receita) => receita.fichaTecnica, { onDelete: 'CASCADE' })
  receita: Receita;

  // Relação N:1 com Ingrediente (Vários itens para Um Ingrediente)
  @ManyToOne(() => Ingrediente, (ingrediente) => ingrediente.fichaTecnicaItens)
  ingrediente: Ingrediente;

  // --- Dados de Entrada (Bruta) ---
  
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  quantidadeBruta: number; // Quantidade inicial (com casca, talo, etc.)

  @Column()
  unidadeDeMedida: string; // Unidade usada na receita (ex: 'colheres', 'xícaras', 'g')

  @Column({ nullable: true })
  dadosComplementares: string; // Ex: 'cortado em cubos', 'temperatura ambiente'
  
  // --- Dados para Cálculo ---
  
  @Column({ type: 'numeric', precision: 10, scale: 2, default: 1 })
  fatorCorrecao: number; // Ex: 1.25 (Para 100g Líquido, preciso de 125g Bruto)

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 1 })
  indiceCoccao: number; // Ex: 0.8 (100g Bruto vira 80g Cozido)

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  quantidadeLiquida: number; // Quantidade após Fator de Correção (sem desperdício)

  // --- Dados de Saída (Cálculos) ---

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  quantidadeCalculada: number; // Quantidade final após Cocção (Qtd Líquida * Índice Cocção)

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  percentualParticipacao: number; // % do peso total dos ingredientes na receita
}