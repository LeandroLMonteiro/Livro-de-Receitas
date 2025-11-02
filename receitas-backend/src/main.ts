// receitas-backend/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Adicionar CORS para que o Frontend (domínio diferente) possa se comunicar
  app.enableCors({
    origin: true, // Ou a URL específica do seu frontend Vercel
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Se for ambiente Vercel, o Vercel gerencia a porta. 
  // Se for local, usa a porta padrão (3000 ou a definida no .env)
  const port = process.env.PORT || 3000; 

  await app.listen(port, () => {
    console.log(`Backend is running on port ${port}`);
  });
}

bootstrap();