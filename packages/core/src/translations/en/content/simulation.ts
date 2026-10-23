/** English translation of the 72-hour simulation (steps and options by id, checks by id). */
import type { ContentTranslation } from '../../types';

export const simulation: ContentTranslation['simulation'] = {
  steps: {
    'jour1-travail': {
      when: 'Day 1, 10 am',
      story: [
        'A Monday in January. You are at work when everything goes off: the screens, the lights, the heating.',
        'Your phone still shows a signal, but calls don’t go through: the lines are overloaded.',
      ],
      question: 'How can you find out what is happening?',
      options: {
        a: {
          text: 'I call 112 to ask.',
          feedback:
            '112 must stay free for emergencies. Information comes through LU-Alert and the radio.',
        },
        b: {
          text: 'I check LU-Alert and listen to the radio.',
          feedback:
            'Well spotted. A LU-Alert message actually advises listening to RTL or radio 100,7.',
        },
        c: {
          text: 'I trust the first message forwarded on a messaging app.',
          feedback: 'During a crisis, many messages are false. Check with official sources first.',
        },
      },
    },
    'jour1-retour': {
      when: 'Day 1, 3 pm',
      story: [
        'There are no more trains. A colleague offers to drive you home.',
        'The rest of the household may be at school or at work, with no way of reaching you.',
      ],
      question: 'How will you find each other?',
      options: {
        a: {
          text: 'Everyone goes to the meeting point we chose together.',
          feedback:
            'That is exactly what the emergency plan is for: a place everyone knows, and someone to pick up the children.',
        },
        b: {
          text: 'I wait at the station for the trains to start again.',
          feedback:
            'Nobody knows how long it will last. Better to go home and join your household.',
        },
        c: {
          text: 'I keep trying to call everyone, over and over.',
          feedback:
            'The lines are overloaded and the battery runs down. A meeting point decided in advance avoids that.',
        },
      },
    },
    'jour1-soir': {
      when: 'Day 1, 6 pm',
      story: [
        'Night falls early in January. At home, everything is dark and the electric cooker no longer works.',
      ],
      question: 'How will you get light and eat something hot?',
      options: {
        a: {
          text: 'I get the barbecue out in the living room.',
          feedback:
            'Never: a barbecue or fire pit indoors gives off carbon monoxide, an invisible and deadly gas.',
        },
        b: {
          text: 'A head torch, and the stove in a well-ventilated room.',
          feedback:
            'Perfect. A torch for each person, and a tin you can eat cold if the gas runs out.',
        },
        c: {
          text: 'Candles in every room.',
          feedback: 'Candles help out, but a torch is safer. Never leave a lit candle unattended.',
        },
      },
    },
    'jour2-eau': {
      when: 'Day 2',
      story: [
        'When you wake up, nothing comes out of the tap. The house got colder during the night.',
      ],
      question: 'How will you get through the day?',
      options: {
        a: {
          text: 'I wait for the water to come back before getting organised.',
          feedback:
            'Nobody knows when it will come back. Better to organise your supply straight away.',
        },
        b: {
          text: 'I drink my supply, close the shutters and get out jumpers and blankets.',
          feedback: 'Yes. Allow about 3 L per person per day, and keep the warmth inside.',
        },
      },
    },
    'jour2-rumeur': {
      when: 'Day 2, 2 pm',
      story: [
        'A message is going around: “The tap water is poisoned, pass it on!” There is no source and no date.',
      ],
      question: 'What do you do with this message?',
      options: {
        a: {
          text: 'I share it to warn my loved ones.',
          feedback:
            'Even to “warn” people, you don’t share an alert that no official source confirms.',
        },
        b: {
          text: 'I check on the radio or on LU-Alert, and only share official information.',
          feedback:
            'Exactly. Who published it, when, where does it come from? Do other reliable sources say the same?',
        },
      },
    },
    'jour3-entraide': {
      when: 'Day 3',
      story: [
        'The neighbourhood is getting organised. The municipality opens a heated hall where people can have a hot drink, get information and charge their phones.',
        'Your elderly neighbour lives alone. You haven’t seen her since the power cut began.',
      ],
      question: 'What do you do?',
      options: {
        a: {
          text: 'I knock on her door to check how she is.',
          feedback:
            'That is the heart of helping one another: people who are alone or vulnerable first.',
        },
        b: {
          text: 'I don’t disturb her: someone else will see to it.',
          feedback:
            'The emergency services can’t be everywhere. An attentive neighbour often makes the difference.',
        },
      },
    },
  },
  checks: {
    'task-lu-alert': 'The LU-Alert app installed',
    'item-crank-radio': 'A battery or wind-up radio',
    'plan-meeting': 'A meeting point written in your plan',
    'plan-urgence': 'The “In an emergency” step of the plan completed',
    'essential-light': 'Light (firefly lit)',
    'item-camping-stove': 'A camping stove',
    'essential-food': 'Meals for 72 hours (firefly lit)',
    'essential-water': 'Water for 72 hours (firefly lit)',
    'essential-warmth': 'Warmth (firefly lit)',
    'item-power-bank': 'A charged power bank',
    'plan-quartier': 'The people to help written in your plan',
  },
};
