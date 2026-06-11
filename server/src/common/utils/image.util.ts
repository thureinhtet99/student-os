import { CloudinaryService } from '../../integrations/cloudinary/cloudinary.service';

export function resolveImageUrl(
  image: string | null | undefined,
  cloudinary: CloudinaryService,
): string | null {
  if (!image) return null;

  const trimmed = image.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  return cloudinary.getCloudinaryUrl(trimmed);
}
