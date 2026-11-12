import { env } from '@/common/env'
import { app } from './app'

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`)
})

// arquivo de inicializacao do servidor, importando a aplicacao e iniciando o servidor na porta especificada
