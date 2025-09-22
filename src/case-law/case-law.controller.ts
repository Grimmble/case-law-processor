import { BadRequestException, Controller, Delete, FileTypeValidator, Get, HttpCode, HttpStatus, Logger, NotFoundException, Param, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CaseLawService } from './case-law.service';
import { AIService } from './ai.service';
import { getFileChecksum, extractTextFromPdf } from '../utils';
import { CaseLaw } from './case-law.entity';


@Controller('case-law')
export class CaseLawController {
    log: Logger;
    constructor(
        private readonly appService: CaseLawService,
        private readonly aiService: AIService) {
        this.log = new Logger(CaseLawController.name);
    }

    @Get()
    async listAllCaseLaws() {
        const caseLaws = await this.appService.list();
        return caseLaws;
    }

    @Post('upload')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new FileTypeValidator({ fileType: 'application/pdf|text/html', fallbackToMimetype: true }),
            ],
        })
    ) file: Express.Multer.File) {
        // If file has already been processed, return early
        const sha256 = getFileChecksum(file);
        const existingCaseLaw = await this.appService.getBySha256(sha256);
        if (existingCaseLaw) {
            this.log.log(`Found exisiting case law with id ${existingCaseLaw.id} based on checksum`);
            return { message: 'Found exisiting case law based on checksum', id: existingCaseLaw.id };
        }

        // PDFs need to be converted to text
        const fileContents = file.mimetype === 'application/pdf' ? await extractTextFromPdf(file.buffer) : file.buffer.toString('utf-8');
        let caseLawData;
        try {
            caseLawData = await this.aiService.extractCaseLawData(fileContents);
        } catch (error) {
            throw new Error('Extraction failed');
        }

        // Create case law object and store it
        let caseLaw = new CaseLaw();
        caseLaw.title = caseLawData.title;
        caseLaw.decisionType = caseLawData.decisionType;
        caseLaw.date = caseLawData.date;
        caseLaw.caseNumber = caseLawData.caseNumber;
        caseLaw.office = caseLawData.office;
        caseLaw.court = caseLawData.court;
        caseLaw.summary = caseLawData.summary;
        caseLaw.sha256 = sha256;

        const persistedCaseLaw = await this.appService.create(caseLaw);
        this.log.log(`Created new case law with id ${persistedCaseLaw.id}`);

        return { message: 'Case law extracted', id: persistedCaseLaw.id };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCaseLaw(@Param('id') id: string) {
        const caseLawId = parseInt(id, 10);

        if (isNaN(caseLawId)) {
            throw new BadRequestException('Invalid ID format');
        }

        const existingCaseLaw = await this.appService.get(caseLawId);
        if (!existingCaseLaw) {
            throw new NotFoundException('Case law not found');
        }

        await this.appService.delete(caseLawId);
        this.log.log(`Deleted case law with id ${caseLawId}`);
    }

    @Get(':id')
    async getCaseLaw(@Param('id') id: string) {
        const caseLawId = parseInt(id, 10);
        const caseLaw = await this.appService.get(caseLawId);
        if (!caseLaw) {
            throw new NotFoundException('Case law not found');
        }
        return caseLaw;
    }
}
