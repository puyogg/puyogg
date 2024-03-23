import type { Sql } from 'postgres';
import { CharacterModel } from './character.js';
import { CardModel } from './card.js';
import { AliasModel } from './alias.js';
import { CronLastUpdatedModel } from './cron-last-updated.js';
import { NtcLeaderboardModel } from './ntc-leaderboard.js';
import { ServerSettingsModel } from './server-settings.js';
import { ImageCacheModel } from './image-cache.js';

export const initModels = (sql: Sql) => {
  return {
    characterModel: new CharacterModel(sql),
    cardModel: new CardModel(sql),
    aliasModel: new AliasModel(sql),
    cronLastUpdatedModel: new CronLastUpdatedModel(sql),
    ntcLeaderboardModel: new NtcLeaderboardModel(sql),
    serverSettingsModel: new ServerSettingsModel(sql),
    imageCacheModel: new ImageCacheModel(sql),
  };
};

export type Models = ReturnType<typeof initModels>;
