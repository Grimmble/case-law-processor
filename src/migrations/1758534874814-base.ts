import { MigrationInterface, QueryRunner } from "typeorm";

export class Base1758534874814 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "case_law" (
            "id" SERIAL PRIMARY KEY,
            "title" character varying NOT NULL,
            "decision_type" character varying NOT NULL,
            "date" date NOT NULL,
            "case_number" character varying NOT NULL,
            "office" character varying NOT NULL,
            "court" character varying NOT NULL,
            "summary" text NOT NULL,
            "sha256" character varying(64) NOT NULL UNIQUE)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "case_law"`);
    }

}
