import { Sql } from 'postgres';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { z } from 'zod';
import { Model } from './model.js';

const Sample = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.date(),
});

const SampleCreate = Sample.omit({
  id: true,
  createdAt: true,
});

class SampleModel extends Model<typeof Sample, typeof SampleCreate> {
  constructor(sql: Sql) {
    super(sql, 'sample', Sample, 'id');
  }
}

describe('Base DB Model', () => {
  let sampleModel: SampleModel;

  beforeEach(async ({ sql }) => {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`CREATE TABLE IF NOT EXISTS sample (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      name text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT NOW()
    )`;

    sampleModel = new SampleModel(sql);
  });

  afterEach(async ({ sql }) => {
    await sql`TRUNCATE sample`;
  });

  test('creates a Sample', async () => {
    const sample = await sampleModel.create({ name: 'Yotarou' });

    expect(sample).toBeDefined();
    expect(sample.id).toHaveLength(36);
    expect(sample.name).toEqual('Yotarou');
  });

  test('updates a Sample', async () => {
    const sample = await sampleModel.create({ name: 'Yotarou' });
    const updatedSample = await sampleModel.updateOne(sample.id, { name: 'Ryoma' });

    expect(updatedSample).toEqual(
      expect.objectContaining({
        id: sample.id,
        name: 'Ryoma',
      }),
    );
  });

  test('finds a Sample', async () => {
    const sample = await sampleModel.create({ name: 'Yotarou' });
    const foundSample = await sampleModel.findOne(sample.id);

    expect(foundSample).toBeDefined();
    expect(foundSample).toEqual(sample);
  });

  test('finds multiple samples by primary key', async () => {
    const sample1 = await sampleModel.create({ name: 'Yotarou' });
    const sample2 = await sampleModel.create({ name: 'Ryoma' });
    const sample3 = await sampleModel.create({ name: 'unko' });

    const samples = await sampleModel.findMany([sample1.id, sample2.id, sample3.id]);

    expect(samples).toEqual(expect.arrayContaining([sample3, sample2, sample1]));
  });

  test('deletes a Sample', async () => {
    const sample = await sampleModel.create({ name: 'Yotarou' });
    const deleteCount = await sampleModel.deleteOne(sample.id);

    expect(deleteCount).toEqual(1);
  });
});
