import { CronLastUpdated } from './cron-last-updated.js';
import { afterEach, describe, expect, test } from 'vitest';

describe('CronLastUpdated', () => {
  afterEach(async ({ sql, models }) => {
    await sql`DELETE FROM ${sql(models.cronLastUpdatedModel.tableName)}`;
  });

  test('creates a valid cron entry', async ({ models }) => {
    const { cronLastUpdatedModel } = models;

    const cron = await cronLastUpdatedModel.create({
      task: 'update-index',
      updatedAt: new Date(0),
    });

    expect(() => {
      CronLastUpdated.parse(cron);
    }).not.toThrow();
  });
});
