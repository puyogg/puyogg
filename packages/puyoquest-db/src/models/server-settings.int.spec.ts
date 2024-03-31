import { ServerSettings, ServerSettingsModel } from './server-settings.js';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

describe('ServerSettings', () => {
  let serverSettingsModel: ServerSettingsModel;

  beforeEach(({ models }) => {
    serverSettingsModel = models.serverSettingsModel;
  });

  afterEach(async ({ sql, models }) => {
    await sql`DELETE FROM ${sql(models.serverSettingsModel.tableName)}`;
  });

  test('creates a valid server setting row', async () => {
    const serverSetting = await serverSettingsModel.create({
      serverId: 'serverId',
      leaderboardChannel: 'channel123',
    });

    expect(() => {
      ServerSettings.parse(serverSetting);
    }).not.toThrow();
  });

  test('automatically updates updated_at timestamp', async () => {
    const serverSetting = await serverSettingsModel.create({
      serverId: 'serverId',
      leaderboardChannel: 'channel123',
    });

    const updatedSetting = await serverSettingsModel.updateOne(serverSetting.serverId, {
      leaderboardChannel: 'channel456',
    });

    expect(updatedSetting?.updatedAt).toBeDefined();
    expect(updatedSetting?.updatedAt.valueOf()).toBeGreaterThan(serverSetting.updatedAt.valueOf());
  });

  describe('findOrCreate', () => {
    test('finds existing server setting', async () => {
      const serverSetting = await serverSettingsModel.create({
        serverId: 'serverId',
        leaderboardChannel: 'channel123',
      });

      const foundSetting = await serverSettingsModel.findOrCreate(serverSetting.serverId);
      expect(foundSetting).toEqual(serverSetting);
    });

    test('creates setting if not exists', async () => {
      const foundSetting = await serverSettingsModel.findOrCreate('serverId');
      expect(foundSetting).toEqual(
        expect.objectContaining({
          serverId: 'serverId',
        }),
      );
    });
  });
});
