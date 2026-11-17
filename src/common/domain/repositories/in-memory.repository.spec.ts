import { InMemoryRepository } from './in-memory.repository'
import { describe, it, expect, beforeEach } from '@jest/globals'
import { randomUUID } from 'crypto'
import { NotFoundError } from '../errors/not-found-error'

type StubModelProps = {
  id: string
  name: string
  price: number
  created_at: Date
  updated_at: Date
}

const items = [
  {
    id: randomUUID(),
    name: 'test',
    price: 10,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: randomUUID(),
    name: 'TEST',
    price: 20,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: randomUUID(),
    name: 'fake',
    price: 30,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

const itemsB = [
  {
    id: randomUUID(),
    name: 'b',
    price: 10,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: randomUUID(),
    name: 'a',
    price: 20,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: randomUUID(),
    name: 'c',
    price: 30,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

const itemsC = [
  {
    id: randomUUID(),
    name: 'b',
    price: 10,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: randomUUID(),
    name: 'a',
    price: 20,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: randomUUID(),
    name: 'c',
    price: 30,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: randomUUID(),
    name: 'd',
    price: 40,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: randomUUID(),
    name: 'e',
    price: 50,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

class StubInMemoryRepository extends InMemoryRepository<StubModelProps> {
  constructor() {
    super()
    this.sortableFields = ['name']
  }

  protected async applyFilter(
    items: StubModelProps[],
    filter: string | null,
  ): Promise<StubModelProps[]> {
    if (!filter) return items

    return items.filter(item => {
      return item.name.toLowerCase().includes(filter.toLowerCase())
    })
  }
}

describe('InMemoryRepository Unit Tests', () => {
  let sut: StubInMemoryRepository
  let model: StubModelProps
  let props: any
  let created_at: Date
  let updated_at: Date

  beforeEach(() => {
    sut = new StubInMemoryRepository() // nova instância do repositório antes de cada teste
    created_at = new Date()
    updated_at = new Date()
    props = {
      name: 'test name',
      price: 10,
    }

    model = {
      id: randomUUID(),
      created_at,
      updated_at,
      ...props,
    }
  })

  // create
  describe('create', () => {
    it('should create a new model', async () => {
      const result = await sut.create(props)
      expect(result.name).toStrictEqual('test name')
    })
  })

  // insert
  describe('insert', () => {
    it('should inserts a new model', async () => {
      const result = await sut.insert(model)
      expect(result).toStrictEqual(sut.items[0])
    })
  })

  // findById
  describe('findById', () => {
    it('should throw error when id not found', async () => {
      await expect(sut.findById(model.id)).rejects.toThrow(
        new NotFoundError(`Model with id ${model.id} not found`),
      )
    })

    it('should find a model by id', async () => {
      const data = await sut.insert(model)
      const result = await sut.findById(data.id)
      expect(result).toStrictEqual(sut.items[0])
    })
  })

  // update
  describe('update', () => {
    it('should throw error when id not found', async () => {
      await expect(sut.update(model)).rejects.toThrow(
        new NotFoundError(`Model with id ${model.id} not found`),
      )
    })

    it('should update a model', async () => {
      const data = await sut.insert(model)
      const modelUpdated = {
        id: data.id,
        name: 'updated name',
        price: 2000,
        created_at,
        updated_at,
      }
      const result = await sut.update(modelUpdated)
      expect(result).toStrictEqual(sut.items[0])
    })
  })

  // delete
  describe('delete', () => {
    it('should throw error when id not found', async () => {
      await expect(sut.delete('fake_id')).rejects.toThrow(
        new NotFoundError(`Model with id fake_id not found`),
      )

      const id = randomUUID()
      await expect(sut.delete(id)).rejects.toThrow(
        new NotFoundError(`Model with id ${id} not found`),
      )
    })

    it('should delete an model', async () => {
      const data = await sut.insert(model)
      expect(sut.items.length).toBe(1)
      await sut.delete(data.id)
      expect(sut.items.length).toBe(0)
    })
  })

  // applyFilter
  describe('applyFilter', () => {
    it('should no filter items when filter param is null', async () => {
      const items = [model]
      const spyFilterMethod = jest.spyOn(items, 'filter' as any)
      const result = await sut['applyFilter'](items, null)
      expect(spyFilterMethod).not.toHaveBeenCalled()
      expect(result).toStrictEqual(items)
    })

    it('should filter the data using filter param', async () => {
      const spyFilterMethod = jest.spyOn(items, 'filter' as any)
      let result = await sut['applyFilter'](items, 'TEST')
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)
      expect(result).toStrictEqual([items[0], items[1]])

      result = await sut['applyFilter'](items, 'test')
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)
      expect(result).toStrictEqual([items[0], items[1]])

      result = await sut['applyFilter'](items, 'no-filter')
      expect(spyFilterMethod).toHaveBeenCalledTimes(3)
      expect(result).toHaveLength(0)
    })
  })

  // applySort
  describe('applySort', () => {
    it('should not sort items', async () => {
      let result = await sut['applySort'](items, null, null)
      expect(result).toStrictEqual(items)

      result = await sut['applySort'](items, 'id', 'asc')
      expect(result).toStrictEqual(items)
    })

    it('should sort items', async () => {
      let result = await sut['applySort'](itemsB, 'name', 'desc')
      expect(result).toStrictEqual([itemsB[2], itemsB[0], itemsB[1]])

      result = await sut['applySort'](itemsB, 'name', 'asc')
      expect(result).toStrictEqual([itemsB[1], itemsB[0], itemsB[2]])
    })
  })

  // applyPaginate
  describe('applyPaginate', () => {
    it('should paginate items', async () => {
      // page 1
      let result = await sut['applyPaginate'](itemsC, 1, 2)
      expect(result).toStrictEqual([itemsC[0], itemsC[1]])

      // page 2
      result = await sut['applyPaginate'](itemsC, 2, 2)
      expect(result).toStrictEqual([itemsC[2], itemsC[3]])

      // page 3
      result = await sut['applyPaginate'](itemsC, 2, 3)
      expect(result).toStrictEqual([itemsC[3], itemsC[4]])
    })
  })

  // search
  describe('search ', () => {
    it('should paginate items', async () => {
      const items = Array(16).fill(model)
      sut.items = items
      const result = await sut.search({})
      expect(result).toStrictEqual({
        items: Array(15).fill(model),
        total: 16,
        current_page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      })
    })

    it('should apply paginate and filter', async () => {
      const itemsD = [
        {
          id: randomUUID(),
          name: 'test',
          price: 10,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: randomUUID(),
          name: 'a',
          price: 20,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: randomUUID(),
          name: 'TEST',
          price: 30,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: randomUUID(),
          name: 'd',
          price: 40,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: randomUUID(),
          name: 'TeSt',
          price: 50,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]
      sut.items = itemsD
      const result = await sut.search({ page: 1, per_page: 2, filter: 'test' })

      expect(result).toStrictEqual({
        items: [itemsD[0], itemsD[2]],
        total: 3,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: 'test',
      })
    })

    it('should apply paginate and sort', async () => {
      const itemsD = [
        {
          id: randomUUID(),
          name: 'b',
          price: 10,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: randomUUID(),
          name: 'a',
          price: 20,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: randomUUID(),
          name: 'd',
          price: 30,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: randomUUID(),
          name: 'e',
          price: 40,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: randomUUID(),
          name: 'c',
          price: 50,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]
      sut.items = itemsD

      let result = await sut.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
      })

      expect(result).toStrictEqual({
        items: [itemsD[1], itemsD[0]],
        total: 5,
        current_page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: null,
      })

      result = await sut.search({
        page: 2,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
      })

      expect(result).toStrictEqual({
        items: [itemsD[4], itemsD[2]],
        total: 5,
        current_page: 2,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: null,
      })
    })
  })
})
