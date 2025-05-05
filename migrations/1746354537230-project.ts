import { MigrationInterface, QueryRunner } from "typeorm";

export class Project1746354537230 implements MigrationInterface {
    name = 'Project1746354537230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`borrowed_book\` ADD \`due_date\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`borrowed_book\` DROP COLUMN \`due_date\``);
    }

}
