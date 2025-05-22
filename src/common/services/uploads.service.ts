import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { nanoid } from 'nanoid';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class UploadsService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveImage(file: Express.Multer.File): Promise<string> {
    const fileExt = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];

    if (!allowedExtensions.includes(fileExt))
      throw new HttpException(
        'Invalid image format. Only PNG, JPG and JPEG are allowed.',
        HttpStatus.BAD_REQUEST,
      );

    const fileName = `${Date.now()}-${nanoid(31)}.png`;
    const filePath = path.join(this.uploadDir, fileName);

    await sharp(file.buffer)
      .resize({ width: 500 })
      .png({ quality: 80 })
      .toFile(filePath);

    return fileName;
  }

  async removeImage(fileName: string) {
    const filePath = path.join(this.uploadDir, fileName);
    fs.unlink(filePath, () => {});
  }
}
