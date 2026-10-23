/** English translation of the actions (by task id). */
import type { ContentTranslation } from '../../types';

export const tasks: ContentTranslation['tasks'] = {
  'lu-alert': {
    title: 'Install LU-Alert',
    hint: 'The official alert app. Choose the municipalities that matter to you: home, work, school.',
  },
  plan: {
    title: 'Fill in my personal emergency plan',
    hint: 'Who to call, where to meet, where the valves are. Then print it.',
  },
  sirens: {
    title: 'Recognise the siren signals',
    hint: 'They are tested on the first Monday of every month at noon.',
  },
  shutoffs: {
    title: 'Know how to turn off the gas, water and electricity',
    hint: 'Find the valves and the fuse box, and try it once.',
  },
  'flood-zones': {
    title: 'Check whether my home is in a flood zone',
    hint: 'The flood zone map is on the water geoportal.',
  },
  'meeting-point': {
    title: 'Choose two meeting points',
    hint: 'One near home, another outside the neighbourhood, in case the household gets separated.',
  },
  'nearby-services': {
    title: 'Find the nearest emergency centre, police station and hospital',
    hint: 'Near home and near work.',
  },
  radio: {
    title: 'Write down the frequencies of RTL and radio 100,7',
    hint: 'The official stations in a crisis. Frequencies vary by region.',
  },
  'garage-exit': {
    title: 'Know how to open the garage door without electricity',
    hint: 'And plan another way out if the main door is blocked.',
  },
  neighbors: {
    title: 'Note who can help, and who will need help',
    hint: 'A neighbour who is handy with tools, an elderly neighbour who lives alone…',
  },
  'car-tank': {
    title: 'Keep the car’s tank at least half full',
    hint: 'Petrol stations stop working without electricity.',
  },
  backups: {
    title: 'Make copies of my documents and photos',
    hint: 'On a USB stick in the kit, and another copy somewhere else.',
  },
  passwords: {
    title: 'Use a password manager and two-factor authentication',
    hint: 'The best protection against cyberattacks.',
  },
  'first-aid': {
    title: 'Take a first-aid course',
    hint: 'The Red Cross and the CGDIS run them all year round.',
  },
  'empty-bag': {
    title: 'Get an empty bag ready to fill',
    hint: 'To take the essentials with you in a few minutes if you have to evacuate.',
  },
  talk: {
    title: 'Talk about the kit with my loved ones',
    hint: 'Especially elderly or isolated people. “Talk about it with the people around you.”',
  },
};
