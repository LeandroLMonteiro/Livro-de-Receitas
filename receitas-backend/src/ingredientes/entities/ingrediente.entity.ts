// src/ingredientes/entities/ingrediente.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FichaTecnicaItem } from '../../receitas/entities/ficha-tecnica-item.entity';

@Entity('ingredientes')
export class Ingrediente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string; // Ex: 'Tomate', 'Farinha de Trigo'

  @Column({ nullable: true })
  unidadePadrao: string; // Ex: 'g', 'ml', 'unid'

  @Column({ nullable: true })
  categoria: string; // Ex: 'Laticínios', 'Vegetais', 'Cereais'

  // Relação N:M através da FichaTecnicaItem
  @OneToMany(() => FichaTecnicaItem, (item) => item.ingrediente)
  fichaTecnicaItens: FichaTecnicaItem[];
}