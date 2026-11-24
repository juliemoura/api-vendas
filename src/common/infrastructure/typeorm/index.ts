import { env } from '@/common/infrastructure/env'
import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  schema: env.DB_SCHEMA,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASS,
  entities: ['**/entities/**/*.ts'],
  migrations: ['**/migrations/**/*.ts'],
  synchronize: false, // não utilizar em produção, apenas para desenvolvimento por que ele cria as tabelas automaticamente, podendo causar perda de dados
  logging: false, // habilitar logs de queries do TypeORM, útil para depuração e análise de desempenho, mas por enquanto deixar false para não poluir o console com logs desnecessários
})

// arquivo de configuração do TypeORM, definindo as informações de conexão com o banco de dados e as entidades que serão utilizadas na aplicação
