/** English translation of the quiz (by question id; options by id). */
import type { ContentTranslation } from '../../types';

export const quiz: ContentTranslation['quiz'] = {
  'sirene-test': {
    prompt:
      'First Monday of the month, noon: the siren gives a continuous tone for one minute. What do you do?',
    options: {
      a: 'Nothing: it is the monthly test.',
      b: 'I take shelter straight away.',
      c: 'I call 112 to find out what is happening.',
    },
    explanation:
      'The test takes place on the first Monday of every month at noon: a continuous one-minute tone. If it lasts longer, or happens at another time, find out more.',
  },
  'sirene-alerte': {
    prompt: 'The siren gives a continuous tone, always at the same pitch, for two minutes. It is…',
    options: {
      a: 'The end of an alarm.',
      b: 'The warning signal: I get to safety and find out more.',
      c: 'A test that doesn’t matter.',
    },
    explanation:
      'Two minutes of continuous tone: get to safety, find out more with LU-Alert, the radio or the television, then follow the instructions.',
  },
  'sirene-alarme': {
    prompt: 'A tone that rises and falls, non-stop, for one minute. What should you do?',
    options: {
      a: 'Go outside to see what is happening.',
      b: 'Go back to my activities: the danger is over.',
      c: 'Take shelter as quickly as possible, in a solid, closed building.',
    },
    explanation:
      'This is the national alarm signal. The all-clear sounds similar, but it is broken up by short pauses.',
  },
  'sirene-doute': {
    prompt: 'A siren sounds and you are not sure. What is the right reflex?',
    options: {
      a: 'Turn on the radio or open LU-Alert.',
      b: 'Call 112 or 113 to ask.',
      c: 'Ask on social media.',
    },
    explanation:
      'The 112 and 113 lines must stay free for emergencies. The radio and LU-Alert tell you what is happening.',
  },
  'vigilance-violet': {
    prompt: 'Which alert level means “imminent danger, you must act straight away”?',
    options: {
      a: 'The red level.',
      b: 'The purple level.',
      c: 'The orange level.',
    },
    explanation:
      'Yellow, orange and red follow a situation that gets worse little by little. Purple signals danger that is very close.',
  },
  radio: {
    prompt: 'No more power and no mobile network. Where can you find official information?',
    options: {
      a: 'In messages forwarded by friends.',
      b: 'On the radio: RTL or radio 100,7, with a battery or wind-up radio, or the car radio.',
      c: 'Nowhere: you have to wait for the power to come back.',
    },
    explanation:
      'The radio often keeps working when everything else is down. It is the most reliable channel.',
  },
  monoxyde: {
    prompt:
      'The house is getting colder. Can you heat yourself with a barbecue or a fire pit in the living room?',
    options: {
      a: 'Yes, if you open the window a little.',
      b: 'Yes, for one hour at most.',
      c: 'Never: they give off carbon monoxide, an invisible and deadly gas.',
    },
    explanation:
      'Appliances meant for outdoors never go indoors. To keep warm: shutters closed, jumpers and blankets.',
  },
  rumeur: {
    prompt:
      'A message says the tap water is poisoned, without saying where it comes from. What do you do?',
    options: {
      a: 'I share it quickly to warn my loved ones.',
      b: 'I check with official sources before believing or sharing it.',
      c: 'I believe it if it includes a photo.',
    },
    explanation:
      'Who published it, when, where does it come from, do other reliable sources say the same? An image can be faked. Without official confirmation, don’t share it.',
  },
  iode: {
    prompt: 'When should you take iodine tablets?',
    options: {
      a: 'Only when the authorities tell you to.',
      b: 'As soon as you hear about an accident, just in case.',
      c: 'Once a year, to stay protected.',
    },
    explanation:
      'Never before, and never just in case. Keep them in the kit and wait for the instruction.',
  },
  cyber: {
    prompt: 'A message from “your bank” asks for your code via a link. What should you do?',
    options: {
      a: 'Click and reply quickly to avoid your account being blocked.',
      b: 'Reply to the message to ask if it is genuine.',
      c: 'Don’t click, and contact the bank myself using its official contact details.',
    },
    explanation:
      'Never give out your passwords or codes. If in doubt, contact the organisation yourself.',
  },
};
