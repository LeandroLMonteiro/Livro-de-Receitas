// src/receitas/entities/receita.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { FichaTecnicaItem } from './ficha-tecnica-item.entity';
import { TabelaNutricional } from './tabela-nutricional.entity';
import { Comentario } from './comentario.entity';

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

  // Relação 1:1 com Tabela Nutricional
  @OneToOne(() => TabelaNutricional, (nutri) => nutri.receita)
  tabelaNutricional: TabelaNutricional; // Adicionado

  // Relação 1:N com Comentários
  @OneToMany(() => Comentario, (comentario) => comentario.receita)
  comentarios: Comentario[]; // Adicionado

}