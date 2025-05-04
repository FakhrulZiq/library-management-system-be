import { MigrationInterface, QueryRunner } from "typeorm";

export class Project1746337246796 implements MigrationInterface {
    name = 'Project1746337246796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`book\` (\`id\` varchar(36) NOT NULL, \`auditCreatedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`auditCreatedBy\` varchar(50) NOT NULL, \`auditModifiedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`auditModifiedBy\` varchar(50) NULL, \`auditDeletedDateTime\` datetime(6) NULL, \`auditDeletedBy\` varchar(50) NULL, \`title\` varchar(255) NULL, \`author\` varchar(255) NOT NULL, \`barcodeNo\` varchar(255) NOT NULL, \`published_year\` varchar(255) NOT NULL, \`quantity\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`borrowed_book\` (\`id\` varchar(36) NOT NULL, \`auditCreatedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`auditCreatedBy\` varchar(50) NOT NULL, \`auditModifiedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`auditModifiedBy\` varchar(50) NULL, \`auditDeletedDateTime\` datetime(6) NULL, \`auditDeletedBy\` varchar(50) NULL, \`borrow_date\` varchar(255) NOT NULL, \`return_date\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`user_id\` varchar(36) NULL, \`book_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`auditCreatedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`auditCreatedBy\` varchar(50) NOT NULL, \`auditModifiedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`auditModifiedBy\` varchar(50) NULL, \`auditDeletedDateTime\` datetime(6) NULL, \`auditDeletedBy\` varchar(50) NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`matricOrStaffNo\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`role\` varchar(255) NULL, \`refreshToken\` varchar(255) NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`borrowed_book\` ADD CONSTRAINT \`FK_b1209045307365edfbd5eaa0b33\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`borrowed_book\` ADD CONSTRAINT \`FK_81f8be6a38b92884b3f15f7df88\` FOREIGN KEY (\`book_id\`) REFERENCES \`book\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`borrowed_book\` DROP FOREIGN KEY \`FK_81f8be6a38b92884b3f15f7df88\``);
        await queryRunner.query(`ALTER TABLE \`borrowed_book\` DROP FOREIGN KEY \`FK_b1209045307365edfbd5eaa0b33\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`borrowed_book\``);
        await queryRunner.query(`DROP TABLE \`book\``);
    }

}
