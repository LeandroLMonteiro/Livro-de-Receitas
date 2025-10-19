// src/receitas/entities/receita.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FichaTecnicaItem } from './ficha-tecnica-item.entity';

@Entity('receitas')
export class Receita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  titulo: string;

  @Column({ nullable: true })
  fotoUrl: string; // Foto

  @Column('text')
  modoDeFazer: string;

  @Column({ default: 0 })
  classificacaoEstrelas: number; // 1-5 estrelas

  @Column()
  categoria: string; // Ex: Sobremesa, Jantar, Salgado

  @Column({ type: 'jsonb', nullable: true })
  marcas: string[]; // Ex: ['Vegano', 'Sem Glúten']

  // Relação com os ingredientes da ficha técnica
  @OneToMany(() => FichaTecnicaItem, (item) => item.receita)
  fichaTecnica: FichaTecnicaItem[];

  // Outras colunas, como Tabela Nutricional (pode ser uma relação OneToOne)
}