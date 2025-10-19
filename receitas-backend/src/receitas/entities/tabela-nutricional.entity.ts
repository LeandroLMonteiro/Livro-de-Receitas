// src/receitas/entities/tabela-nutricional.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Receita } from './receita.entity';

@Entity('tabela_nutricional')
export class TabelaNutricional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relação 1:1 com Receita
  @OneToOne(() => Receita, { onDelete: 'CASCADE' })
  @JoinColumn() // Define esta tabela como a dona da chave
  receita: Receita;

  // Campos Nutricionais Principais (valores por 100g ou por porção)
  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  calorias: number; // kcal

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  carboidratos: number; // g

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  proteinas: number; // g

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  gordurasTotais: number; // g
  
  // Você pode adicionar dezenas de outros campos conforme a necessidade
  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  sodio: number; // mg
}
