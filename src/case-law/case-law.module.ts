import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseLaw } from './case-law.entity';
import { CaseLawController } from './case-law.controller';
import { CaseLawService } from './case-law.service';
import { AIService } from './ai.service';

@Module({
    imports: [TypeOrmModule.forFeature([CaseLaw])],
    controllers: [CaseLawController],
    providers: [CaseLawService, AIService],
    exports: [CaseLawService],
})
export class CaseLawModule { }
