// src/receitas/entities/comentario.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Receita } from './receita.entity';

@Entity('comentarios')
export class Comentario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  texto: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  data: Date;

  // Relacionamento N:1 com Receita (vários comentários para uma receita)
  @ManyToOne(() => Receita, (receita) => receita.comentarios, { onDelete: 'CASCADE' })
  receita: Receita;
  
  // Campo opcional para identificar o autor (se houver sistema de usuários)
  @Column({ nullable: true })
  autor: string; 
}