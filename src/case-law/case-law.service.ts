import { Injectable } from '@nestjs/common';
import { CaseLaw } from './case-law.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CaseLawService {
    constructor(
        @InjectRepository(CaseLaw)
        private readonly caseLawRepository: Repository<CaseLaw>
    ) { }

    async create(caseLaw: CaseLaw): Promise<CaseLaw> {
        return this.caseLawRepository.save(caseLaw);
    }

    async delete(id: number): Promise<void> {
        await this.caseLawRepository.delete(id);
    }

    async get(id: number): Promise<CaseLaw | null> {
        return await this.caseLawRepository.findOne({ where: { id } });
    }

    async getBySha256(sha256: string): Promise<CaseLaw | null> {
        return await this.caseLawRepository.findOne({ where: { sha256 } });
    }

    async list(): Promise<CaseLaw[]> {
        return await this.caseLawRepository.find();
    }
}