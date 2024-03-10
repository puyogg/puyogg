import { z } from 'zod';
import { Model } from '../types/model.js';
import { Sql } from 'postgres';

export const CronLastUpdated = z.object({
  task: z.string(),
  updatedAt: z.date(),
});
export type CronLastUpdated = z.infer<typeof CronLastUpdated>;

export class CronLastUpdatedModel extends Model<typeof CronLastUpdated> {
  constructor(sql: Sql) {
    super(sql, 'cron_last_updated', CronLastUpdated, 'task');
  }
}
