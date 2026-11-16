import { randomUUID } from 'crypto'
import { NotFoundError } from '../errors/not-found-error'
import {
  RepositoryInterface,
  SearchInput,
  SearchOutput,
} from './repository.interface'

export type ModelProps = {
  id?: string
  [key: string]: any // permite que o objeto tenha propriedades adicionais de qualquer tipo
}

export type CreateProps = {
  [key: string]: any
}

export abstract class InMemoryRepository<Model extends ModelProps>
  implements RepositoryInterface<Model, CreateProps>
{
  items: Model[] = []

  // campos que podem ser usados para ordenação
  sortableFields: string[] = []

  create(props: CreateProps): Model {
    const model = {
      id: randomUUID(),
      create_at: new Date(),
      update_at: new Date(),
      ...props,
    }
    return model as unknown as Model
  }

  async insert(model: Model): Promise<Model> {
    this.items.push(model)
    return model
  }

  async findById(id: string): Promise<Model> {
    return this._get(id)
  }

  async update(model: Model): Promise<Model> {
    await this._get(model.id) // verifica se o modelo existe, lançando NotFoundError se não encontrado

    const index = this.items.findIndex(item => item.id === model.id)
    this.items[index] = model
    return model
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    const index = this.items.findIndex(item => item.id === id)
    this.items.splice(index, 1)
  }

  async search(props: SearchInput): Promise<SearchOutput<Model>> {
    const page = props.page ?? 1
    const per_page = props.per_page ?? 15
    const sort = props.sort ?? null
    const sort_dir = props.sort_dir ?? null
    const filter = props.filter ?? null

    // aplica filtros, ordenação e paginação aos itens
    const filteredItems = await this.applyFilter(this.items, filter)
    const orderedItems = await this.applySort(filteredItems, sort, sort_dir)
    const paginatedItems = await this.applyPaginate(
      orderedItems,
      page,
      per_page,
    )

    return {
      items: paginatedItems,
      total: filteredItems.length,
      current_page: page,
      per_page: per_page,
      sort,
      sort_dir,
      filter,
    }
  }

  // função protegida abstrata para aplicar filtros aos itens com base nos parâmetros fornecidos
  protected abstract applyFilter(
    items: Model[],
    filter: string | null,
  ): Promise<Model[]>

  // função protegida para aplicar ordenação aos itens com base nos parâmetros fornecidos
  protected async applySort(
    items: Model[],
    sort: string | null,
    sort_dir: string | null,
  ): Promise<Model[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items
    }
    return [...items].sort((a, b) => {
      if (a[sort] < b[sort]) {
        return sort_dir === 'asc' ? 1 : -1
      }
      if (a[sort] > b[sort]) {
        return sort_dir === 'asc' ? -1 : 1
      }
      return 0
    })
  }

  // função protegida para aplicar paginação aos itens com base nos parâmetros fornecidos
  protected async applyPaginate(
    items: Model[],
    page: number,
    per_page: number,
  ): Promise<Model[]> {
    const start = (page - 1) * per_page
    const limit = start + per_page
    return items.slice(start, limit) as unknown as Model[]
  }

  // função protegida para obter um modelo pelo id, lançando NotFoundError se não encontrado
  protected async _get(id: string): Promise<Model> {
    const model = this.items.find(item => item.id === id)
    if (!model) {
      throw new NotFoundError(`Model with id ${id} not found`)
    }
    return model
  }
}
