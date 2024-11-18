import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  GetObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { GLOBAL_CONFIG } from 'src/shared/constants/global-config.constant';
import { Folder } from './enums/folder.enum';
import { NodeJsClient } from '@smithy/types';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow<string>(GLOBAL_CONFIG.AWS_REGION),
  }) as NodeJsClient<S3Client>;

  async upload(
    folder: Folder,
    key: string,
    file: Express.Multer.File,
  ): Promise<void> {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.getOrThrow<string>(
            GLOBAL_CONFIG.AWS_BUCKET_NAME,
          ),
          Key: `${folder}/${key}.${file.originalname.split('.').pop()}`,
          Body: file.buffer,
        }),
      );
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async get(folder: Folder, key: string): Promise<Uint8Array> {
    try {
      const result: GetObjectCommandOutput = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.configService.getOrThrow<string>(
            GLOBAL_CONFIG.AWS_BUCKET_NAME,
          ),
          Key: `${folder}/${key}`,
        }),
      );
      return await result.Body.transformToByteArray();
    } catch (error) {
      if (error instanceof Error) throw new NotFoundException(error.message);
    }
  }

  async delete(folder: Folder, key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.configService.getOrThrow<string>(
            GLOBAL_CONFIG.AWS_BUCKET_NAME,
          ),
          Key: `${folder}/${key}`,
        }),
      );
    } catch (error) {
      if (error instanceof Error) throw new NotFoundException(error.message);
    }
  }

  async update(
    folder: Folder,
    key: string,
    file: Express.Multer.File,
  ): Promise<void> {
    await this.delete(folder, key);
    await this.upload(folder, key, file);
  }
}
