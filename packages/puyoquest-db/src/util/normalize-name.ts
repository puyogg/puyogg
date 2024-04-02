import { z } from 'zod';

export const normalizeName = z.string().transform((v) => {
  return v
    .trim()
    .replace(/\sS$/, '')
    .replace(/・S$/, '')
    .replace('☆', ' ')
    .replace(/\/★.*/, '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s\s+/g, ' ')
    .replace(/\s/g, ' ')
    .toLowerCase()
    .trim();
});
