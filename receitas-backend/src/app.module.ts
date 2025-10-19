// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReceitasModule } from './receitas/receitas.module';
import { IngredientesModule } from './ingredientes/ingredientes.module';

@Module({
  imports: [
    // Configuração para carregar .env files
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Configuração do TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        // O Neon usa uma URL de conexão completa.
        url: config.get<string>('DATABASE_URL'), 
        
        // Define onde estão as entidades (serão criadas no próximo passo)
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        
        // Sincronização automática (bom para desenvolvimento, desabilitar em produção)
        synchronize: true, 
        
        // Logs no console
        logging: true, 
        
        // Configurações para deploy em ambientes como Vercel/Render, etc.
        ssl: {
          rejectUnauthorized: false, // Necessário para a maioria dos provedores serverless como Neon/Vercel
        }
      }),
    }),
    
    // Módulos da aplicação (serão criados depois)
    // ReceitasModule, FichaTecnicaModule, etc.
    ReceitasModule,
    IngredientesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}