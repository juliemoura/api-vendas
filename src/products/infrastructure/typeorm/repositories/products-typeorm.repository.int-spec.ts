import { testDataSource } from '@/common/infrastructure/typeorm/testing/data-source'
import { ProductsTypeOrmRepository } from './products-typeorm.repository'
import { Product } from '../entities/products.entity'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { randomUUID } from 'crypto'
import { ProductsDataBuilder } from '@/common/infrastructure/testing/helpers/products-data-builder'
import { ConflictError } from '@/common/domain/errors/conflict-error'

describe('ProductsTypeormRepository Integration Tests', () => {
  let ormRepository: ProductsTypeOrmRepository

  beforeAll(async () => {
    await testDataSource.initialize()
  })

  afterAll(async () => {
    await testDataSource.destroy()
  })

  beforeEach(async () => {
    await testDataSource.manager.query('DELETE FROM products')
    ormRepository = new ProductsTypeOrmRepository()
    ormRepository.productsRepository = testDataSource.getRepository(Product)
  })

  // findById
  describe('findById', () => {
    it('should generate an error when the product is not found', async () => {
      const id = randomUUID()
      await expect(ormRepository.findById(id)).rejects.toThrow(
        new NotFoundError(`Product with id ${id} not found`),
      )
    })

    it('should finds a product by id', async () => {
      const data = ProductsDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      const result = await ormRepository.findById(product.id)
      expect(result.id).toEqual(product.id)
      expect(result.name).toEqual(product.name)
    })
  })

  // create
  describe('create', () => {
    it('should create a new product object', () => {
      const data = ProductsDataBuilder({ name: 'Product 1' })
      const product = ormRepository.create(data)
      expect(product.name).toEqual(data.name)
    })
  })

  // insert
  describe('insert', () => {
    it('should insert a new product object', async () => {
      const data = ProductsDataBuilder({ name: 'Product 1' })
      const product = await ormRepository.insert(data)
      expect(product.name).toEqual(data.name)
    })
  })

  // update
  describe('update', () => {
    it('should generate an error when the product is not found', async () => {
      const data = ProductsDataBuilder()
      await expect(ormRepository.update(data)).rejects.toThrow(
        new NotFoundError(`Product with id ${data.id} not found`),
      )
    })

    it('should update a product', async () => {
      const data = ProductsDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)
      product.name = 'Updated Product'

      const result = await ormRepository.update(product)
      expect(result.name).toEqual('Updated Product')
    })
  })

  // delete
  describe('delete', () => {
    it('should generate an error when the product is not found', async () => {
      const id = randomUUID()
      await expect(ormRepository.delete(id)).rejects.toThrow(
        new NotFoundError(`Product with id ${id} not found`),
      )
    })

    it('should delete a product', async () => {
      const data = ProductsDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      await ormRepository.delete(product.id)

      const result = await testDataSource.manager.findOne(Product, {
        where: { id: product.id },
      })
      expect(result).toBeNull()
    })
  })

  // findByName
  describe('findByName', () => {
    it('should generate an error when the product is not found', async () => {
      const name = 'Product 1'
      await expect(ormRepository.findByName(name)).rejects.toThrow(
        new NotFoundError(`Product with name ${name} not found`),
      )
    })

    it('should finds a product by name', async () => {
      const data = ProductsDataBuilder({ name: 'Product 1' })
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      const result = await ormRepository.findByName(data.name)
      expect(result.name).toEqual('Product 1')
    })
  })

  // conflictingName
  describe('conflictingName', () => {
    it('should generate an error when the product is found', async () => {
      const data = ProductsDataBuilder({ name: 'Product 1' })
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      await expect(ormRepository.conflictingName('Product 1')).rejects.toThrow(
        new ConflictError(`Product with name ${data.name} already exists`),
      )
    })
  })
})
