import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('case_law')
export class CaseLaw {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'varchar', name: 'decision_type' })
    decisionType: string;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'varchar', name: 'case_number' })
    caseNumber: string;

    @Column({ type: 'varchar' })
    office: string;

    @Column({ type: 'varchar' })
    court: string;

    @Column({ type: 'text' })
    summary: string;

    @Column({ type: 'varchar', name: 'sha256', length: 64 })
    @Index({ unique: true })
    sha256: string;
}
