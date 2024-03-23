import { z } from 'zod';
import { Model } from '../types/model.js';
import { Sql } from 'postgres';

export const ImageCache = z.object({
  externalUrl: z.string(),
  filePath: z.string(),
  updatedAt: z.date(),
});
export type ImageCache = z.infer<typeof ImageCache>;

export const ImageCacheCreate = ImageCache.partial({
  updatedAt: true,
});
export type ImageCacheCreate = z.infer<typeof ImageCacheCreate>;

export class ImageCacheModel extends Model<typeof ImageCache, typeof ImageCacheCreate> {
  constructor(sql: Sql) {
    super(sql, 'image_cache', ImageCache, 'external_url');
  }

  async upsert(params: ImageCacheCreate): Promise<ImageCache> {
    const insert = ImageCacheCreate.parse(params);

    const [imageCache] = await this.sql<ImageCache[]>`
      INSERT INTO ${this.sql(this.tableName)}
      ${this.sql(insert)}
      ON CONFLICT (external_url)
      DO UPDATE SET file_path = EXCLUDED.file_path
      RETURNING *
    `;

    return ImageCache.parse(imageCache);
  }
}
