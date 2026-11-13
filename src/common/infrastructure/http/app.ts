import express from 'express'
import cors from 'cors'
import { routes } from './routes'
import { errorHandler } from './middlewares/errorHandler'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Vendas',
      version: '1.0.0',
      description: 'Documentação da API de Vendas',
    },
  },
  apis: [],
}

const swaggerSpec = swaggerJSDoc(options)

const app = express()

app.use(cors())
app.use(express.json()) // considerando padrao json nos dados
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec)) // rota para acessar a documentação da API
app.use(routes) // rotas da aplicacao
app.use(errorHandler) // middleware de tratamento de erros

export { app }
