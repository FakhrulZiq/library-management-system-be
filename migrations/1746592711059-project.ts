import { MigrationInterface, QueryRunner } from "typeorm";

export class Project1746592711059 implements MigrationInterface {
    name = 'Project1746592711059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`book\` ADD \`price\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`book\` DROP COLUMN \`price\``);
    }

}
