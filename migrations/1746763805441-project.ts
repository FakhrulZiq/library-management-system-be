import { MigrationInterface, QueryRunner } from "typeorm";

export class Project1746763805441 implements MigrationInterface {
    name = 'Project1746763805441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`book\` ADD \`isbn\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`book\` DROP COLUMN \`isbn\``);
    }

}
