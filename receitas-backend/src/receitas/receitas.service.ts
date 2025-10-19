// src/receitas/receitas.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receita } from './entities/receita.entity';
import { FichaTecnicaItem } from './entities/ficha-tecnica-item.entity';
import { CreateFichaTecnicaItemDto } from './dto/create-ficha-tecnica-item.dto';

// Para simplificar, vamos criar uma interface de DTO da Receita que inclui os itens.
interface CreateReceitaDto {
    titulo: string;
    modoDeFazer: string;
    categoria: string;
    itensFichaTecnica: CreateFichaTecnicaItemDto[];
    // Outros campos da Receita...
}

@Injectable()
export class ReceitasService {
  private readonly logger = new Logger(ReceitasService.name);

  constructor(
    @InjectRepository(Receita)
    private receitasRepository: Repository<Receita>,
    @InjectRepository(FichaTecnicaItem)
    private itensRepository: Repository<FichaTecnicaItem>,
  ) {}

  /**
   * 1. Calcula os campos derivados de um item da ficha técnica.
   * 2. Calcula o percentual de participação (precisa do total bruto).
   */
  private calcularItem(itemDto: CreateFichaTecnicaItemDto, totalBrutoReceita: number): Partial<FichaTecnicaItem> {
    const { quantidadeBruta, fatorCorrecao, indiceCoccao } = itemDto;

    // A) Quantidade Líquida (QL): Qtd Bruta / Fator Correção (FC)
    // Se FC=1.25, QL = QB / 1.25. (Ex: 125g / 1.25 = 100g)
    const quantidadeLiquida = quantidadeBruta / fatorCorrecao; 

    // B) Quantidade Calculada (QC): Qtd Líquida * Índice de Cocção (IC)
    // Se IC=0.8, QC = 100g * 0.8 = 80g (perda de peso no cozimento)
    const quantidadeCalculada = quantidadeLiquida * indiceCoccao;

    // C) Percentual de Participação: (Qtd Bruta / Total Bruto da Receita) * 100
    const percentualParticipacao = totalBrutoReceita 
      ? (quantidadeBruta / totalBrutoReceita) * 100
      : 0;

    return {
      ...itemDto as any, // Transfere os dados brutos
      quantidadeLiquida: parseFloat(quantidadeLiquida.toFixed(2)),
      quantidadeCalculada: parseFloat(quantidadeCalculada.toFixed(2)),
      percentualParticipacao: parseFloat(percentualParticipacao.toFixed(2)),
    };
  }

  /**
   * Cria uma nova Receita e seus Itens da Ficha Técnica.
   */
  async create(createReceitaDto: CreateReceitaDto): Promise<Receita> {
    // 1. Calcular o Total Bruto de Ingredientes
    const totalBruto = createReceitaDto.itensFichaTecnica.reduce(
      (sum, item) => sum + item.quantidadeBruta, 0
    );

    // 2. Criar a Receita (Sem os itens ainda)
    const novaReceita = this.receitasRepository.create({
        titulo: createReceitaDto.titulo,
        modoDeFazer: createReceitaDto.modoDeFazer,
        categoria: createReceitaDto.categoria,
        // ... outros campos (fotoUrl, estrelas, etc)
    });

    const receitaSalva = await this.receitasRepository.save(novaReceita);

    // 3. Processar e Salvar os Itens da Ficha Técnica
    const itensProcessados = createReceitaDto.itensFichaTecnica.map(itemDto => {
      // Calcula os campos derivados
      const dadosCalculados = this.calcularItem(itemDto, totalBruto);
      
      const itemFicha = this.itensRepository.create({
          ...dadosCalculados as FichaTecnicaItem,
          receita: receitaSalva, // Associa à Receita salva
          ingrediente: { id: itemDto.ingredienteId } as any, // Associa ao Ingrediente
      });
      return itemFicha;
    });

    await this.itensRepository.save(itensProcessados);

    this.logger.log(`Receita "${receitaSalva.titulo}" criada com sucesso!`);
    
    // Retorna a receita completa com os itens carregados
    return this.receitasRepository.findOneOrFail({ 
        where: { id: receitaSalva.id },
        relations: ['fichaTecnica', 'fichaTecnica.ingrediente']
    });
  }
  
  // Métodos CRUD básicos (findOne, findAll, update, remove) viriam aqui...
}