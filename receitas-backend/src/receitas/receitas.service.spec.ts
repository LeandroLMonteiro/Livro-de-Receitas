// src/receitas/receitas.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ReceitasService } from './receitas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receita } from './entities/receita.entity';
import { FichaTecnicaItem } from './entities/ficha-tecnica-item.entity';
import { CreateFichaTecnicaItemDto } from './dto/create-ficha-tecnica-item.dto';

// Mock das classes de Repository do TypeORM
const mockReceitaRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

const mockFichaTecnicaItemRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

describe('ReceitasService', () => {
  let service: ReceitasService;
  let receitasRepository: Repository<Receita>;
  let itensRepository: Repository<FichaTecnicaItem>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceitasService,
        // Provedores de mock para os repositórios
        {
          provide: getRepositoryToken(Receita),
          useFactory: mockReceitaRepository,
        },
        {
          provide: getRepositoryToken(FichaTecnicaItem),
          useFactory: mockFichaTecnicaItemRepository,
        },
      ],
    }).compile();

    service = module.get<ReceitasService>(ReceitasService);
    // Recupera os mocks para possíveis espionagens futuras (se necessário)
    receitasRepository = module.get<Repository<Receita>>(getRepositoryToken(Receita));
    itensRepository = module.get<Repository<FichaTecnicaItem>>(getRepositoryToken(FichaTecnicaItem));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  // Espiona a função privada calcularItem para testá-la isoladamente
  // A função é 'private' no TypeScript, mas ainda acessível via bracket notation
  // ou usando 'any' para testar a implementação.
  const calcularItemSpy = (itemDto: CreateFichaTecnicaItemDto, totalBrutoReceita: number) => {
      // Cria uma instância do service e acessa a função privada
      return (service as any).calcularItem(itemDto, totalBrutoReceita);
  };


  describe('calcularItem', () => {
    // Caso 1: Ingrediente com perda (desperdício) e sem alteração no peso de cocção
    it('deve calcular corretamente QL, QC e Participação para ingrediente com desperdício', () => {
      const item: CreateFichaTecnicaItemDto = {
        ingredienteId: 'mock-id-1',
        quantidadeBruta: 125, // 125g brutos
        unidadeDeMedida: 'g',
        fatorCorrecao: 1.25, // 25% de desperdício
        indiceCoccao: 1.0,  // Sem ganho/perda de peso na cocção
      };
      const totalBruto = 250; // Total de todos os ingredientes

      const resultado = calcularItemSpy(item, totalBruto);

      // QL = QB / FC = 125 / 1.25 = 100
      expect(resultado.quantidadeLiquida).toBe(100.00); 

      // QC = QL * IC = 100 * 1.0 = 100
      expect(resultado.quantidadeCalculada).toBe(100.00); 
      
      // % Partic = (QB / Total Bruto) * 100 = (125 / 250) * 100 = 50.00
      expect(resultado.percentualParticipacao).toBe(50.00); 
    });

    // Caso 2: Ingrediente com ganho de peso (Ex: arroz que absorve água)
    it('deve calcular corretamente QL, QC e Participação para ingrediente com ganho de peso', () => {
      const item: CreateFichaTecnicaItemDto = {
        ingredienteId: 'mock-id-2',
        quantidadeBruta: 100,
        unidadeDeMedida: 'g',
        fatorCorrecao: 1.0, // Sem desperdício
        indiceCoccao: 2.5,  // Ganho de 150% de peso (2.5x)
      };
      const totalBruto = 250; 

      const resultado = calcularItemSpy(item, totalBruto);

      // QL = 100 / 1.0 = 100
      expect(resultado.quantidadeLiquida).toBe(100.00); 

      // QC = 100 * 2.5 = 250
      expect(resultado.quantidadeCalculada).toBe(250.00); 
      
      // % Partic = (100 / 250) * 100 = 40.00
      expect(resultado.percentualParticipacao).toBe(40.00); 
    });

    // Caso 3: Divisão por zero no percentual (caso de segurança)
    it('deve retornar 0 para percentual de participação se o total bruto for zero', () => {
      const item: CreateFichaTecnicaItemDto = {
        ingredienteId: 'mock-id-3',
        quantidadeBruta: 50,
        unidadeDeMedida: 'g',
        fatorCorrecao: 1.0,
        indiceCoccao: 1.0,
      };
      const totalBruto = 0; // Cenário onde o total é zero

      const resultado = calcularItemSpy(item, totalBruto);

      expect(resultado.percentualParticipacao).toBe(0.00); 
      expect(resultado.quantidadeCalculada).toBe(50.00); 
    });
  });
  
  // Testes para a função 'create' completa viriam aqui (para integração parcial)
});