import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CONSTANT } from '../../common/constants/app.constant';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: CLOUDINARY_CONSTANT.CLOUD_NAME,
      api_key: CLOUDINARY_CONSTANT.API_KEY,
      api_secret: CLOUDINARY_CONSTANT.API_SECRET,
    });
  }

  async uploadToCloudinary(
    file: File,
    folder: string = CLOUDINARY_CONSTANT.FOLDER.PROFILE,
  ): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return await new Promise<string>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder,
              resource_type: 'auto',
              transformation: [
                {
                  width: 400,
                  height: 400,
                  crop: 'fill',
                  gravity: 'face',
                  quality: 'auto',
                  format: 'auto',
                },
              ],
            },
            (error, result) => {
              if (error) {
                reject(
                  new Error(
                    `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                  ),
                );
                return;
              }

              if (result) {
                resolve(result.secure_url);
                return;
              }

              reject(new Error('Upload failed: no result returned'));
            },
          )
          .end(buffer);
      });
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Upload failed');
    }
  }

  async deleteFromCloudinary(imageUrl: string): Promise<void> {
    try {
      if (!imageUrl) return;

      const publicId = this.extractPublicId(imageUrl);

      if (!publicId) return;

      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
    }
  }

  getCloudinaryUrl(publicId: string, transformation?: string): string {
    if (!publicId) return '';

    const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONSTANT.CLOUD_NAME}/image/upload/`;

    if (transformation) return `${baseUrl}${transformation}/${publicId}`;

    return `${baseUrl}${publicId}`;
  }

  private extractPublicId(imageUrl: string): string | null {
    const trimmedUrl = imageUrl.trim();

    if (!trimmedUrl) return null;

    const parts = trimmedUrl.split('/');
    const fileName = parts.at(-1);

    if (!fileName) return null;

    const folder = parts.at(-2);
    const name = fileName.split('.')[0];

    return folder ? `${folder}/${name}` : name;
  }
}

export default CloudinaryService;
