import { ProductModel } from '@/products/domain/models/products.model'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('products') // nome da tabela no banco de dados
export class Product implements ProductModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar') // coluna do tipo varchar no banco de dados
  name: string

  @Column('decimal') // coluna do tipo decimal no banco de dados
  price: number

  @Column('int')
  quantity: number

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  created_at: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updated_at: Date
}
