import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ColorController } from './color.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ColorController],
  providers: [ColorService],
})
export class ColorModule {}
