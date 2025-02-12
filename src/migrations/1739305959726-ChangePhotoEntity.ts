import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePhotoEntity1739305959726 implements MigrationInterface {
  name = "ChangePhotoEntity1739305959726";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`photo\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`descripcion\` varchar(255) NOT NULL, \`image_path\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`photo\``);
  }
}
