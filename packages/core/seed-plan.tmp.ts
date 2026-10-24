import { writeFileSync } from 'node:fs';
import { createBackup, emptyPlan, emptyPerson, emptyPet, emptyNeighbor } from './src/index';
const plan = emptyPlan();
plan.owner = {
  name: 'Famille Muller',
  address: '12, rue des Tilleuls',
  city: 'L-4123 Esch-sur-Alzette',
};
plan.healthConsent = true;
plan.adults = 2;
plan.children = 1;
const id = () => Math.random().toString(36).slice(2);
plan.people = [
  {
    ...emptyPerson(id()),
    lastName: 'Muller',
    firstName: 'Camille',
    phone: '+352 621 123 456',
    languages: 'Français, luxembourgeois',
    bloodType: 'O+',
    matricule: '1985 0312 456',
    allergies: 'Pénicilline',
    medication: 'Lévothyrox 75 µg le matin',
  },
  {
    ...emptyPerson(id()),
    lastName: 'Muller',
    firstName: 'Jo',
    phone: '+352 691 987 654',
    languages: 'Luxembourgeois, allemand',
  },
  {
    ...emptyPerson(id()),
    lastName: 'Muller',
    firstName: 'Léa',
    languages: 'Français',
    remarks: 'École fondamentale, cycle 3',
  },
];
plan.pets = [
  {
    ...emptyPet(id()),
    species: 'Chat',
    name: 'Mimi',
    info: 'Croquettes dans le placard de l’entrée',
  },
];
plan.home.spots.water = { where: 'Cave, à gauche de l’escalier', comment: 'Robinet bleu' } as never;
plan.home.altExit = 'Porte du jardin';
plan.home.extraKey = 'Chez Mme Weber, n° 14';
plan.helpers = [
  {
    ...emptyNeighbor(id()),
    name: 'Mme Weber',
    help: 'Garde Léa',
    phone: '+352 26 12 34',
    address: 'n° 14',
  },
];
plan.emergency.meeting1 = 'Parc du Gaalgebierg, entrée principale';
plan.emergency.meeting2 = 'Église Saint-Joseph';
plan.emergency.contact1 = { name: 'Paul Muller (frère)', phone: '+352 661 222 333' };
plan.emergency.school1 = { name: 'École Brill', phone: '+352 54 73 83' };
plan.providers.electricity = { name: 'Enovos', customerNo: '0012345', phone: '8006 6000' } as never;
plan.createdAt = '2026-10-01';
plan.updatedAt = '2026-10-24';
const backup = createBackup({
  household: {
    members: [
      { id: 'a1', type: 'adult' },
      { id: 'a2', type: 'adult' },
      { id: 'c1', type: 'child' },
      { id: 'p1', type: 'pet', petSpecies: 'cat' },
    ],
    durationDays: 3,
  },
  kits: [{ id: 'home', type: 'home', name: 'Réserve maison' }],
  items: [],
  extras: [],
  bought: [],
  level: 'essential',
  plan,
  tasks: {},
  barcodes: [],
  achievements: {},
  activities: {},
});
writeFileSync(process.argv[2]!, JSON.stringify(backup));
