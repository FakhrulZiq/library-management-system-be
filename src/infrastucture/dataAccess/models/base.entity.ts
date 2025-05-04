import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn()
  auditCreatedDateTime: string;

  @Column({ type: 'varchar', length: 50 })
  auditCreatedBy: string;

  @UpdateDateColumn()
  auditModifiedDateTime?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  auditModifiedBy?: string;

  @DeleteDateColumn()
  auditDeletedDateTime?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  auditDeletedBy?: string;
}
