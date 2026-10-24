/**
 * Fichiers et liens venus d'ailleurs : une sauvegarde ou un lien de partage piégé
 * ne doit ni bloquer l'app, ni saturer la mémoire, ni injecter quoi que ce soit.
 */
import { deflateSync, strToU8 } from 'fflate';
import { describe, expect, it } from 'vitest';
import { toBase64Url } from './base64url';
import { parseBackup } from './backup';
import { buildIcs } from './ics';
import { decodeShare } from './share';

const backup = (extra: Record<string, unknown> = {}) => ({
  app: 'kitzy',
  schemaVersion: 2,
  exportedAt: '2026-10-24T10:00:00.000Z',
  household: null,
  kits: [{ id: 'home', type: 'home', name: 'Maison' }],
  items: [],
  extras: [],
  bought: [],
  level: 'essential',
  ...extra,
});

const powerBank = (intervalDays: number) => ({
  id: 'i1',
  kitId: 'home',
  templateId: 'power-bank',
  unit: 'piece',
  lots: [],
  battery: { lastChargedAt: '2026-01-01', intervalDays },
  updatedAt: '2026-10-24T10:00:00.000Z',
});

describe('backup import', () => {
  it('refuses a battery interval that would push dates off the calendar', () => {
    expect(parseBackup(JSON.stringify(backup({ items: [powerBank(2_000_000_000)] }))).ok).toBe(
      false,
    );
    expect(parseBackup(JSON.stringify(backup({ items: [powerBank(90)] }))).ok).toBe(true);
  });

  it('refuses oversized identifiers', () => {
    const kits = [{ id: 'x'.repeat(10_000), type: 'home', name: 'Maison' }];
    expect(parseBackup(JSON.stringify(backup({ kits }))).ok).toBe(false);
  });

  it('drops unknown keys and never touches prototypes', () => {
    const text =
      '{"app":"kitzy","schemaVersion":2,"exportedAt":"x","household":null,"kits":[],' +
      '"items":[],"extras":[],"bought":[],"level":"essential",' +
      '"tasks":{"__proto__":"2026-01-01"},"__proto__":{"polluted":1},"extra":"x"}';
    const result = parseBackup(text);
    expect(result.ok).toBe(true);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(result.ok && 'extra' in result.data).toBe(false);
  });
});

describe('share link', () => {
  it('stops a decompression bomb instead of filling memory', () => {
    // JSON valide, gonflé d'espaces : sans limite, il serait décompressé puis accepté.
    const json = '{"v":1,' + ' '.repeat(20 * 1024 * 1024) + '"type":"shopping","items":[]}';
    const bomb = deflateSync(strToU8(json), { level: 9 });
    const result = decodeShare('#k1.' + toBase64Url(bomb));
    expect(result.ok).toBe(false);
  });

  it('refuses an overly long link', () => {
    expect(decodeShare('#k1.' + 'A'.repeat(100_000)).ok).toBe(false);
  });
});

describe('calendar file', () => {
  it('escapes every kind of line break in names', () => {
    const ics = buildIcs(
      [
        {
          id: 'r1',
          kind: 'expiry',
          date: '2026-11-01',
          title: 'Eau\rBEGIN:VALARM\nX',
          alertDaysBefore: [],
        },
      ],
      { now: new Date('2026-10-24T10:00:00Z') },
    );
    expect(ics).not.toMatch(/\r(?!\n)/);
    expect(ics.split('\r\n').filter((l) => l === 'BEGIN:VALARM')).toHaveLength(0);
  });
});
