import { NtcLeaderboard, NtcLeaderboardModel } from './ntc-leaderboard.js';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

describe('NtcLeaderboard', () => {
  let ntcLeaderboardModel: NtcLeaderboardModel;

  beforeEach(async ({ models }) => {
    ntcLeaderboardModel = models.ntcLeaderboardModel;
  });

  afterEach(async ({ sql, models }) => {
    await sql`DELETE FROM ${sql(models.ntcLeaderboardModel.tableName)}`;
  });

  test(`incrementCorrect - upserts and increments a player's score`, async () => {
    const userRankingStart = await ntcLeaderboardModel.incrementCorrect({
      serverId: 'server1',
      userId: 'user1',
    });

    expect(userRankingStart.correct).toEqual(1);

    const userRankingUpdate = await ntcLeaderboardModel.incrementCorrect({
      serverId: 'server1',
      userId: 'user1',
    });

    expect(userRankingUpdate.correct).toEqual(2);
  });

  test('getServerPlayerCount', async () => {
    await ntcLeaderboardModel.incrementCorrect({
      serverId: 'server1',
      userId: 'user1',
    });
    await ntcLeaderboardModel.incrementCorrect({
      serverId: 'server1',
      userId: 'user1',
    });
    await ntcLeaderboardModel.incrementCorrect({
      serverId: 'server1',
      userId: 'user2',
    });
    await ntcLeaderboardModel.incrementCorrect({
      serverId: 'server1',
      userId: 'user3',
    });
    await ntcLeaderboardModel.incrementCorrect({
      serverId: 'server2',
      userId: 'user1',
    });

    const server1PlayerCount = await ntcLeaderboardModel.getServerPlayerCount('server1');
    expect(server1PlayerCount).toEqual(3);

    const server2PlayerCount = await ntcLeaderboardModel.getServerPlayerCount('server2');
    expect(server2PlayerCount).toEqual(1);

    const server3PlayerCount = await ntcLeaderboardModel.getServerPlayerCount('server3');
    expect(server3PlayerCount).toEqual(0);
  });

  test('getUserRanking - get ranking for specific user+server', async () => {
    await ntcLeaderboardModel.incrementCorrect({ serverId: 'server1', userId: 'user1' });
    await ntcLeaderboardModel.incrementCorrect({ serverId: 'server1', userId: 'user1' });
    await ntcLeaderboardModel.incrementCorrect({ serverId: 'server1', userId: 'user1' });

    await ntcLeaderboardModel.incrementCorrect({ serverId: 'server1', userId: 'user3' });

    await ntcLeaderboardModel.incrementCorrect({ serverId: 'server1', userId: 'user2' });
    await ntcLeaderboardModel.incrementCorrect({ serverId: 'server1', userId: 'user2' });

    const ranking = await ntcLeaderboardModel.getUserRanking({
      serverId: 'server1',
      userId: 'user2',
    });
    expect(ranking).toEqual(
      expect.objectContaining({
        correct: 2,
        ranking: 2,
      }),
    );
  });

  test('getRange - get a range of users and their rankings (inclusive)', async () => {
    await ntcLeaderboardModel.incrementCorrect({ serverId: 'server1', userId: 'user1' });
    await ntcLeaderboardModel.incrementCorrect({ serverId: 'server1', userId: 'user1' });
    await ntcLeaderboardModel.incrementCorrect({ serverId: 'server1', userId: 'user1' });

    await ntcLeaderboardModel.incrementCorrect({ serverId: 'server1', userId: 'user3' });

    await ntcLeaderboardModel.incrementCorrect({ serverId: 'server1', userId: 'user2' });
    await ntcLeaderboardModel.incrementCorrect({ serverId: 'server1', userId: 'user2' });

    await ntcLeaderboardModel.incrementCorrect({ serverId: 'server1', userId: 'user4' });

    const rankings = await ntcLeaderboardModel.getRange({ serverId: 'server1', start: 2, end: 4 });
    expect(rankings).toEqual([
      expect.objectContaining({ serverId: 'server1', userId: 'user2', correct: 2, ranking: 2 }),
      expect.objectContaining({ serverId: 'server1', userId: 'user3', correct: 1, ranking: 3 }),
      expect.objectContaining({ serverId: 'server1', userId: 'user4', correct: 1, ranking: 4 }),
    ]);
  });

  describe('getTop10', () => {
    test(`returns all server users when there's less than 10 players`, async ({ sql }) => {
      const seed: NtcLeaderboard[] = [
        { serverId: 'server1', userId: 'user1', correct: 5, updatedAt: new Date(0) },
        { serverId: 'server1', userId: 'user2', correct: 7, updatedAt: new Date(2) },
        { serverId: 'server1', userId: 'user3', correct: 9, updatedAt: new Date(0) },
        { serverId: 'server1', userId: 'user4', correct: 1, updatedAt: new Date(0) },
        { serverId: 'server1', userId: 'user5', correct: 7, updatedAt: new Date(1) },
      ];

      await sql`
        INSERT INTO ${sql(ntcLeaderboardModel.tableName)} ${sql(seed, [
          'serverId',
          'userId',
          'correct',
          'updatedAt',
        ])}
      `;

      const rankings = await ntcLeaderboardModel.getTop10('server1');
      const sortedSeed = seed
        .slice()
        .sort((a, b) => {
          if (a.correct === b.correct) {
            return a.updatedAt.valueOf() - b.updatedAt.valueOf();
          }
          return b.correct - a.correct;
        })
        .map((row, i) => ({ ...row, ranking: i + 1 }));
      expect(rankings).toEqual(sortedSeed);
    });

    test('returns only the top 10', async ({ sql }) => {
      const seed: NtcLeaderboard[] = [
        { serverId: 'server1', userId: 'user1', correct: 5, updatedAt: new Date(0) },
        { serverId: 'server1', userId: 'user2', correct: 7, updatedAt: new Date(1) },
        { serverId: 'server1', userId: 'user3', correct: 9, updatedAt: new Date(1) },
        { serverId: 'server1', userId: 'user4', correct: 1, updatedAt: new Date(0) },
        { serverId: 'server1', userId: 'user5', correct: 7, updatedAt: new Date(0) },
        { serverId: 'server1', userId: 'user6', correct: 8, updatedAt: new Date(1) },
        { serverId: 'server1', userId: 'user7', correct: 9, updatedAt: new Date(0) },
        { serverId: 'server1', userId: 'user8', correct: 1, updatedAt: new Date(6) },
        { serverId: 'server1', userId: 'user9', correct: 7, updatedAt: new Date(2) },
        { serverId: 'server1', userId: 'user10', correct: 1, updatedAt: new Date(4) },
        { serverId: 'server1', userId: 'user11', correct: 1, updatedAt: new Date(10) },
      ];

      await sql`
        INSERT INTO ${sql(ntcLeaderboardModel.tableName)} ${sql(seed, [
          'serverId',
          'userId',
          'correct',
          'updatedAt',
        ])}
      `;

      const rankings = await ntcLeaderboardModel.getTop10('server1');

      const sortedSeedTop10 = seed
        .slice()
        .sort((a, b) => {
          if (a.correct === b.correct) {
            return a.updatedAt.valueOf() - b.updatedAt.valueOf();
          }
          return b.correct - a.correct;
        })
        .slice(0, 10)
        .map((row, i) => ({ ...row, ranking: i + 1 }));

      expect(rankings).toEqual(sortedSeedTop10);
    });
  });

  describe('getRangeFocusUser', () => {
    const smallLeaderboard: NtcLeaderboard[] = [
      { serverId: 'server1', userId: 'user1', correct: 20, updatedAt: new Date(0) },
      { serverId: 'server1', userId: 'user2', correct: 19, updatedAt: new Date(0) },
      { serverId: 'server1', userId: 'user3', correct: 18, updatedAt: new Date(0) },
      { serverId: 'server1', userId: 'user4', correct: 17, updatedAt: new Date(0) },
      { serverId: 'server1', userId: 'user5', correct: 16, updatedAt: new Date(0) },
      { serverId: 'server1', userId: 'user6', correct: 15, updatedAt: new Date(0) },
      { serverId: 'server1', userId: 'user7', correct: 14, updatedAt: new Date(0) },
      { serverId: 'server1', userId: 'user8', correct: 13, updatedAt: new Date(0) },
    ].map((row, i) => ({ ...row, ranking: i + 1 }));

    const bigLeaderboard: NtcLeaderboard[] = [
      ...smallLeaderboard,
      { serverId: 'server1', userId: 'user9', correct: 12, updatedAt: new Date(0) },
      { serverId: 'server1', userId: 'user10', correct: 11, updatedAt: new Date(0) },
      { serverId: 'server1', userId: 'user11', correct: 10, updatedAt: new Date(0) },
      { serverId: 'server1', userId: 'user12', correct: 9, updatedAt: new Date(0) },
      { serverId: 'server1', userId: 'user13', correct: 8, updatedAt: new Date(0) },
      { serverId: 'server1', userId: 'user14', correct: 7, updatedAt: new Date(0) },
      { serverId: 'server1', userId: 'user15', correct: 6, updatedAt: new Date(0) },
    ].map((row, i) => ({ ...row, ranking: i + 1 }));

    test('gets all 8 players for 7th player in small leaderboard', async ({ sql }) => {
      await sql`
        INSERT INTO ${sql(ntcLeaderboardModel.tableName)} ${sql(smallLeaderboard, [
          'serverId',
          'userId',
          'correct',
          'updatedAt',
        ])}
      `;

      const rankings = await ntcLeaderboardModel.getRangeFocusUser({
        serverId: 'server1',
        userId: 'user7',
      });
      expect(rankings).toEqual(smallLeaderboard);
    });

    test('gets bottom 10 players for 14 of 15 player in big leaderboard', async ({ sql }) => {
      await sql`
        INSERT INTO ${sql(ntcLeaderboardModel.tableName)} ${sql(bigLeaderboard, [
          'serverId',
          'userId',
          'correct',
          'updatedAt',
        ])}
      `;

      const rankings = await ntcLeaderboardModel.getRangeFocusUser({
        serverId: 'server1',
        userId: 'user14',
      });
      expect(rankings).toEqual(bigLeaderboard.slice(5, 15));
    });

    test('gets all 8 players for 2nd player in small leaderboard', async ({ sql }) => {
      await sql`
        INSERT INTO ${sql(ntcLeaderboardModel.tableName)} ${sql(smallLeaderboard, [
          'serverId',
          'userId',
          'correct',
          'updatedAt',
        ])}
      `;

      const rankings = await ntcLeaderboardModel.getRangeFocusUser({
        serverId: 'server1',
        userId: 'user2',
      });
      expect(rankings).toEqual(smallLeaderboard);
    });

    test('gets top 9(!!) players for 2nd player in big leaderboard', async ({ sql }) => {
      await sql`
        INSERT INTO ${sql(ntcLeaderboardModel.tableName)} ${sql(bigLeaderboard, [
          'serverId',
          'userId',
          'correct',
          'updatedAt',
        ])}
      `;

      const rankings = await ntcLeaderboardModel.getRangeFocusUser({
        serverId: 'server1',
        userId: 'user2',
      });
      expect(rankings).toEqual(bigLeaderboard.slice(0, 9));
    });

    test('gets 5 players before and 4 players after a user in the middle of a big leaderboard', async ({
      sql,
    }) => {
      await sql`
        INSERT INTO ${sql(ntcLeaderboardModel.tableName)} ${sql(bigLeaderboard, [
          'serverId',
          'userId',
          'correct',
          'updatedAt',
        ])}
      `;

      const rankings = await ntcLeaderboardModel.getRangeFocusUser({
        serverId: 'server1',
        userId: 'user8',
      });
      expect(rankings).toEqual(bigLeaderboard.slice(2, 12));
    });
  });
});
