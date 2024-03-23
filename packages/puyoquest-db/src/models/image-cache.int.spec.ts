import { ImageCache, ImageCacheModel } from './image-cache.js';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

describe('ImageCache', () => {
  let imageCacheModel: ImageCacheModel;

  beforeEach(({ models }) => {
    imageCacheModel = models.imageCacheModel;
  });

  afterEach(async ({ sql }) => {
    await sql`DELETE FROM ${sql(imageCacheModel.tableName)}`;
  });

  test('upserts a valid image cache entry', async ({ sql }) => {
    const entry = await imageCacheModel.upsert({
      externalUrl: 'externalUrl1',
      filePath: 's3:/home/file1',
    });

    expect(entry).toEqual(
      expect.objectContaining({
        externalUrl: 'externalUrl1',
        filePath: 's3:/home/file1',
      } satisfies Partial<ImageCache>),
    );

    const updatedEntry = await imageCacheModel.upsert({
      externalUrl: 'externalUrl1',
      filePath: 's3:/home/file2',
    });

    expect(updatedEntry).toEqual(
      expect.objectContaining({
        externalUrl: 'externalUrl1',
        filePath: 's3:/home/file2',
      } satisfies Partial<ImageCache>),
    );

    // Should only have 1 entry in the db
    const [result] = await sql<{ count: string }[]>`SELECT COUNT(*) FROM ${sql(
      imageCacheModel.tableName,
    )}`;
    expect(result.count).toEqual('1');

    expect(updatedEntry.updatedAt.valueOf()).toBeGreaterThan(entry.updatedAt.valueOf());
  });
});
