import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CaseLawModule } from './case-law/case-law.module';
import { appDataSourceConfig } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(appDataSourceConfig),
    CaseLawModule,
  ],
})
export class AppModule { }
