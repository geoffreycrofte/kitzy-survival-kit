import { describe, expect, it } from 'vitest';
import { emptyPlan, planInfo } from './plan';
import {
  addPasskeyToLock,
  createPlanLock,
  isPlanLock,
  isProtectedBackup,
  openJson,
  protectBackup,
  randomBytes,
  removePasskeyFromLock,
  sealJson,
  unlockWithCode,
  unlockWithPasskey,
  unprotectBackup,
} from './vault';

describe('protected backup', () => {
  it('opens with the right code only', async () => {
    const text = JSON.stringify({ app: 'kitzy', note: 'Groupe sanguin O+' });
    const locked = await protectBackup(text, '482913');
    expect(isProtectedBackup(locked)).toBe(true);
    expect(isProtectedBackup(text)).toBe(false);
    expect(locked).not.toContain('Groupe sanguin');
    expect(await unprotectBackup(locked, '482913')).toBe(text);
    expect(await unprotectBackup(locked, '482914')).toBeNull();
  });

  it('detects any change to the file', async () => {
    const locked = JSON.parse(await protectBackup('{"a":1}', 'code-123')) as { data: string };
    const flipped = locked.data.startsWith('A') ? 'B' : 'A';
    const tampered = JSON.stringify({ ...locked, data: flipped + locked.data.slice(1) });
    expect(await unprotectBackup(tampered, 'code-123')).toBeNull();
  });

  it('refuses a file asking for an absurd amount of work', async () => {
    const locked = JSON.parse(await protectBackup('{}', 'code-123')) as {
      kdf: { iterations: number };
    };
    locked.kdf.iterations = 1e12;
    expect(isProtectedBackup(JSON.stringify(locked))).toBe(false);
    expect(await unprotectBackup(JSON.stringify(locked), 'code-123')).toBeNull();
  });
});

describe('plan lock', () => {
  it('seals the plan and unlocks it with the code or the passkey secret', async () => {
    const plan = emptyPlan();
    plan.people.push({
      id: 'p1',
      lastName: 'Muller',
      firstName: 'Camille',
      phone: '',
      languages: '',
      bloodType: 'O+',
      matricule: '1990010112345',
      disability: '',
      allergies: '',
      medication: '',
      remarks: '',
    });
    const { lock, key } = await createPlanLock('482913');
    expect(isPlanLock(lock)).toBe(true);
    const sealed = await sealJson(key, plan);
    expect(JSON.stringify(sealed)).not.toContain('1990010112345');

    const fromCode = await unlockWithCode(lock, '482913');
    expect(fromCode && (await openJson(fromCode, sealed))).toEqual(plan);
    expect(await unlockWithCode(lock, '000000')).toBeNull();

    const secret = randomBytes(32);
    const withPasskey = await addPasskeyToLock(lock, key, {
      credentialId: 'cred',
      prfSalt: 'salt',
      secret,
    });
    const fromPasskey = await unlockWithPasskey(withPasskey, secret);
    expect(fromPasskey && (await openJson(fromPasskey, sealed))).toEqual(plan);
    expect(await unlockWithPasskey(withPasskey, randomBytes(32))).toBeNull();
    // Le code reste un moyen de secours, même avec une clé d'accès.
    expect(await unlockWithCode(withPasskey, '482913')).toEqual(key);
    expect(removePasskeyFromLock(withPasskey).passkey).toBeUndefined();
  });

  it('keeps only progress and dates in the clear summary', () => {
    const plan = { ...emptyPlan(), updatedAt: '2026-10-24' };
    plan.emergency.meeting1 = 'Le parc';
    const info = planInfo(plan);
    expect(info).toEqual({
      steps: expect.any(Object),
      meetingPoint: true,
      updatedAt: '2026-10-24',
    });
    expect(JSON.stringify(info)).not.toContain('parc');
    expect(planInfo(info)).toBe(info);
  });
});
