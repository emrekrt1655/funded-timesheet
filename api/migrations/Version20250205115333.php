<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250205115333 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'create day and year tables';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE SEQUENCE day_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE year_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE day (id INT NOT NULL, year_id INT NOT NULL, date DATE NOT NULL, public_holiday VARCHAR(255) DEFAULT NULL, hours INT DEFAULT NULL, off VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_E5A0299040C1FEA7 ON day (year_id)');
        $this->addSql('COMMENT ON COLUMN day.date IS \'(DC2Type:date_immutable)\'');
        $this->addSql('CREATE TABLE year (id INT NOT NULL, year INT NOT NULL, region VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE day ADD CONSTRAINT FK_E5A0299040C1FEA7 FOREIGN KEY (year_id) REFERENCES year (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP SEQUENCE day_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE year_id_seq CASCADE');
        $this->addSql('ALTER TABLE day DROP CONSTRAINT FK_E5A0299040C1FEA7');
        $this->addSql('DROP TABLE day');
        $this->addSql('DROP TABLE year');
    }
}
