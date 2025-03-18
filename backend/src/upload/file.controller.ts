import { Controller, Post, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Express, Response } from 'express';


@Controller()
export class FileController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = uuidv4() + ext;
        cb(null, filename);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    const fileUrl = `/uploads/${file.filename}`;
    return res.json({ fileName: file.originalname, fileUrl });
  }
}
