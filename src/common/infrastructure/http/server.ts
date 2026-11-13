import { env } from '@/common/env'
import { app } from './app'
import { dataSource } from '../typeorm'

dataSource
  .initialize()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`)
      console.log(
        `Swagger UI is available at http://localhost:${env.PORT}/docs`,
      )
    })
  })
  .catch(error => {
    console.error('Error during Data Source initialization', error)
  })

// arquivo de inicializacao do servidor, importando a aplicacao e iniciando o servidor na porta especificada.
