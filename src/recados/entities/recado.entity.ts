import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Recado')
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  texto: string;

  //muitos recados podem ser eviados por uma unica Pessoa(emissor)
  @ManyToOne(() => Pessoa)
  //especifica a coluna que armazena o id da pessoa que enviou o recado
  @JoinColumn({ name: 'de' })
  de: Pessoa;

  //muitos recados podem ser eviados para uma unica Pessoa(destinatário)
  @ManyToOne(() => Pessoa)
  //especifica a coluna que armazena o id da pessoa que recebe o recado
  @JoinColumn({ name: 'para' })
  para: Pessoa;

  @Column({ default: false })
  lido: boolean;

  @Column()
  date: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
