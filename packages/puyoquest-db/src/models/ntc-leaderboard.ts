import { z } from 'zod';
import { Sql } from 'postgres';

export const NtcLeaderboard = z.object({
  userId: z.string(),
  serverId: z.string(),
  correct: z.number().int(),
  updatedAt: z.date(),
});
export type NtcLeaderboard = z.infer<typeof NtcLeaderboard>;
export type NtcLeaderboardWithRanking = NtcLeaderboard & { ranking: number };

export class NtcLeaderboardModel {
  tableName = 'ntc_leaderboard';

  constructor(private sql: Sql) {}

  async getServerPlayerCount(serverId: string): Promise<number> {
    const results = await this.sql<{ count: string }[]>`
      SELECT COUNT(*)
      FROM ntc_leaderboard
      WHERE server_id = ${serverId}
    `;

    return Number(results.at(0)?.count) ?? 0;
  }

  async getUserRanking(params: {
    userId: string;
    serverId: string;
  }): Promise<NtcLeaderboardWithRanking | undefined> {
    const { userId, serverId } = params;

    const results = await this.sql<NtcLeaderboardWithRanking[]>`
      SELECT server_rankings.*
      FROM (
        SELECT user_id, server_id, correct, updated_at, CAST (ROW_NUMBER() OVER (ORDER BY correct DESC, updated_at ASC) AS INTEGER) ranking
        FROM ntc_leaderboard
        WHERE server_id = ${serverId}
      ) as server_rankings
      WHERE server_rankings.user_id = ${userId}
    `;

    return results.at(0);
  }

  async getRange(params: {
    serverId: string;
    start: number;
    end: number;
  }): Promise<NtcLeaderboardWithRanking[]> {
    const { serverId, start, end } = params;

    const rankings = await this.sql<NtcLeaderboardWithRanking[]>`
      SELECT server_rankings.*
      FROM (
        SELECT user_id, server_id, correct, updated_at, CAST (ROW_NUMBER() OVER (ORDER BY correct DESC, updated_at ASC) AS INTEGER) ranking
        FROM ntc_leaderboard
        WHERE server_id = ${serverId}
      ) as server_rankings
      WHERE ranking >= ${start} AND ranking <= ${end};
    `;

    return rankings;
  }

  async getTop10(serverId: string): Promise<NtcLeaderboardWithRanking[]> {
    const playerCount = await this.getServerPlayerCount(serverId);
    if (playerCount === 0) {
      return [];
    }

    const start = 0;
    const end = Math.min(playerCount, 10);

    return this.getRange({ serverId, start, end });
  }

  async getRangeFocusUser(params: {
    userId: string;
    serverId: string;
  }): Promise<NtcLeaderboardWithRanking[]> {
    const { userId, serverId } = params;

    const playerCount = await this.getServerPlayerCount(serverId);
    if (playerCount === 0) {
      return [];
    }

    const userRanking = await this.getUserRanking({ userId, serverId });
    if (!userRanking) {
      return [];
    }

    // Get start and end positions around the user,
    // and expand if they're near the very top or very bottom of the rankings.
    const ranking = userRanking.ranking;
    let start = Math.max(ranking - 5, 0);
    let end = Math.min(ranking + 4, playerCount);
    if (end - ranking < 4) {
      start -= 4 - (end - ranking);
    }

    if (ranking - start < 5) {
      end += 5 - (ranking - start);
    }

    return this.getRange({ serverId, start, end });
  }

  async incrementCorrect(params: { serverId: string; userId: string }): Promise<NtcLeaderboard> {
    const { userId, serverId } = params;

    const [result] = await this.sql<NtcLeaderboard[]>`
      INSERT INTO ntc_leaderboard (server_id, user_id, correct)
      VALUES (${serverId}, ${userId}, 1)
      ON CONFLICT (server_id, user_id)
      DO UPDATE
        SET correct = ntc_leaderboard.correct + 1
        WHERE ntc_leaderboard.user_id = EXCLUDED.user_id
          AND ntc_leaderboard.server_id = EXCLUDED.server_id
      RETURNING *
    `;

    return result;
  }
}
