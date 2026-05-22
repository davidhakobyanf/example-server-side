import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports:[
    ServeStaticModule.forRoot({
      rootPath:`${path}/uploads`,
      serveRoot:"/uploads"
    })
  ]
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
