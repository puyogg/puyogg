import { z } from 'zod';
import { Model } from '../types/model.js';
import { Sql } from 'postgres';

export const Character = z.object({
  charId: z.string(),
  name: z.string(),
  jpName: z.string(),
  linkName: z.string(),
  mainColor: z.string().nullable(),
  sideColor: z.string().nullable(),
  type1: z.string().nullable(),
  type2: z.string().nullable(),
  voiceTrans: z.string().nullable(),
  updatedAt: z.date(),
});
export type Character = z.infer<typeof Character>;

export const CharacterCreate = Character.partial({
  mainColor: true,
  sideColor: true,
  type1: true,
  type2: true,
  voiceTrans: true,
  updatedAt: true,
});

export class CharacterModel extends Model<typeof Character, typeof CharacterCreate> {
  constructor(sql: Sql) {
    super(sql, 'character', Character, 'char_id');
  }
}
