import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsertable1739207220177 implements MigrationInterface {
    name = 'UpdateUsertable1739207220177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`email_validated\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`email_validated\``);
    }

}
