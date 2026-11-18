import { describe, it, expect, beforeEach } from '@jest/globals'
import { ProductsInMemoryRepository } from './products-in-memory.repository'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { ProductsDataBuilder } from '@/common/infrastructure/testing/helpers/products-data-builder'

describe('ProductsInMemoryRepository Unit Tests', () => {
  let sut: ProductsInMemoryRepository

  beforeEach(() => {
    sut = new ProductsInMemoryRepository()
  })

  // findByName
  describe('findByName', () => {
    it('should throw a error when product is not found', async () => {
      await expect(() => sut.findByName('fake_name')).rejects.toBeInstanceOf(
        NotFoundError,
      )
    })

    it('should find a product by name', async () => {
      const data = ProductsDataBuilder({ name: 'Julie Moura' })
      sut.items.push(data)
      const result = await sut.findByName('Julie Moura')
      expect(result).toStrictEqual(data)
    })
  })
})
