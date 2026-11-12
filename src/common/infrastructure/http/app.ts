import express from 'express'
import cors from 'cors'
import { routes } from './routes'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(cors())
app.use(express.json()) // considerando padrao json nos dados
app.use(routes) // rotas da aplicacao
app.use(errorHandler) // middleware de tratamento de erros

export { app }
