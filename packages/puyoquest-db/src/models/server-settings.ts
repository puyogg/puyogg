import { z } from 'zod';
import { Model } from '../types/model.js';
import { Sql } from 'postgres';

export const ServerSettings = z.object({
  serverId: z.string(),
  leaderboardChannel: z.string().nullable(),
  updatedAt: z.date(),
});
export type ServerSettings = z.infer<typeof ServerSettings>;

export const ServerSettingsCreate = ServerSettings.partial({
  leaderboardChannel: true,
  updatedAt: true,
});
export type ServerSettingsCreate = z.infer<typeof ServerSettings>;

export class ServerSettingsModel extends Model<typeof ServerSettings, typeof ServerSettingsCreate> {
  constructor(sql: Sql) {
    super(sql, 'server_settings', ServerSettings, 'server_id');
  }
}
