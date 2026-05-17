/**
 * Quiz domain logic.
 *
 * Defines the questions, the scoring algorithm, the resulting persona labels
 * (pure or "mix") and per-persona presentation data (image, description).
 */

export type Axis = 'boro' | 'pariolino' | 'coatto';
export type Score = Record<Axis, number>;

export type QuestionId = 'nome' | 'zona' | 'abitazione' | 'capelli' | 'piatto';

export type Risposte = {
  nome: string;
  zona?: string;
  abitazione?: string;
  capelli?: string;
  piatto?: string;
};

export type QuestionOption = {
  value: string;
  label: string;
  weight: Score;
};

export type Question =
  | { id: 'nome'; label: string; type: 'text' }
  | { id: Exclude<QuestionId, 'nome'>; label: string; type: 'select'; options: QuestionOption[] };

export const questions: Question[] = [
  { id: 'nome', label: 'Come te chiami?', type: 'text' },
  {
    id: 'zona',
    label: 'De che zona sei?',
    type: 'select',
    options: [
      { value: 'roma_centro', label: 'Roma Centro', weight: { boro: 2, pariolino: 1, coatto: 0 } },
      { value: 'roma_nord', label: 'Roma Nord', weight: { boro: 0, pariolino: 2, coatto: 0 } },
      { value: 'roma_ovest', label: 'Roma Ovest e dintorni', weight: { boro: 2, pariolino: 1, coatto: 0 } },
      { value: 'roma_est', label: 'Da Pignetown a Anagnina', weight: { boro: 1, pariolino: 0, coatto: 2 } },
      { value: 'roma_sud', label: 'Eur Garba e zone lì', weight: { boro: 0, pariolino: 0, coatto: 2 } },
      { value: 'fuori_gra', label: 'Fuori dar GRA', weight: { boro: 2, pariolino: 0, coatto: 0 } },
    ],
  },
  {
    id: 'abitazione',
    label: 'Casa tua:',
    type: 'select',
    options: [
      { value: 'attico', label: 'Attico naamio', weight: { boro: 0, pariolino: 2, coatto: 0 } },
      { value: 'condominio', label: 'Classico condominio', weight: { boro: 2, pariolino: 0, coatto: 0 } },
      { value: 'villino', label: 'Villino con giardino', weight: { boro: 1, pariolino: 2, coatto: 0 } },
      { value: 'lotti', label: 'Lotti', weight: { boro: 0, pariolino: 0, coatto: 2 } },
      { value: 'popolare', label: 'Casa popolare', weight: { boro: 0, pariolino: 0, coatto: 2 } },
    ],
  },
  {
    id: 'capelli',
    label: 'Taglio de capelli?',
    type: 'select',
    options: [
      { value: 'doppio_taglio', label: 'Doppio taglio', weight: { boro: 2, pariolino: 0, coatto: 0 } },
      { value: 'ciuffo', label: 'Ciuffo', weight: { boro: 0, pariolino: 2, coatto: 0 } },
      { value: 'boccia', label: 'Sei er boccia', weight: { boro: 2, pariolino: 0, coatto: 1 } },
      { value: 'isolotto', label: 'Isolotto', weight: { boro: 0, pariolino: 0, coatto: 2 } },
      { value: 'ricci', label: 'Ricci scomposti', weight: { boro: 1, pariolino: 0, coatto: 2 } },
      { value: 'liscia', label: 'Piega liscia', weight: { boro: 0, pariolino: 2, coatto: 0 } },
    ],
  },
  {
    id: 'piatto',
    label: 'Top magnata?',
    type: 'select',
    options: [
      { value: 'osteria', label: 'Osteria romana', weight: { boro: 2, pariolino: 0, coatto: 1 } },
      { value: 'ape', label: 'Aperitivo', weight: { boro: 1, pariolino: 2, coatto: 0 } },
      { value: 'sushi', label: 'Sushi', weight: { boro: 0, pariolino: 2, coatto: 0 } },
      { value: 'kebab', label: 'Kebab de notte', weight: { boro: 0, pariolino: 0, coatto: 2 } },
      { value: 'pizza', label: 'Pizza ar taglio', weight: { boro: 2, pariolino: 0, coatto: 0 } },
    ],
  },
];

/** Maximum score gap that still counts as a "mix" between two axes. */
const MIX_THRESHOLD = 1;

const EMPTY_SCORE: Score = { boro: 0, pariolino: 0, coatto: 0 };

export function getQuestion(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

export function getOptions(id: string): QuestionOption[] {
  const question = getQuestion(id);
  return question && question.type === 'select' ? question.options : [];
}

function computeScore(risposte: Risposte): Score {
  return questions.reduce<Score>((score, question) => {
    if (question.type !== 'select') return score;
    const answer = risposte[question.id as Exclude<QuestionId, 'nome'>];
    const option = question.options.find((o) => o.value === answer);
    if (!option) return score;
    return {
      boro: score.boro + option.weight.boro,
      pariolino: score.pariolino + option.weight.pariolino,
      coatto: score.coatto + option.weight.coatto,
    };
  }, { ...EMPTY_SCORE });
}

function pickPersona(score: Score): string {
  const [first, second] = (Object.entries(score) as [Axis, number][]).sort(
    (a, b) => b[1] - a[1],
  );

  if (!first || first[1] === 0) return 'boro';
  if (second && first[1] - second[1] <= MIX_THRESHOLD && second[1] > 0) {
    return `${first[0]}-${second[0]} mix`;
  }
  return first[0];
}

export function calcolaPunteggio(risposte: Risposte): {
  persona: string;
  scores: Score;
} {
  const scores = computeScore(risposte);
  return { persona: pickPersona(scores), scores };
}

export const personaCopy: Record<string, string> = {
  boro:
    'Boro autentico: diretto, verace e senza filtri. Vivi Roma come un campo da calcetto e l\u2019amicizia come un sacramento.',
  pariolino:
    'Pariolino di razza: estetica curata, Spritz sempre pieno e convinzione che la vita inizi a Ponte Milvio.',
  coatto:
    'Coatto leggendario: un concentrato de romanit\u00e0 e rumore. Parli col cuore e cammini come se stessi sempre girando un video musicale.',
  'boro-pariolino mix':
    'Pariolino col cuore da boro: scarpe lucide ma battuta pronta. C\u2019hai classe e panino con la porchetta insieme.',
  'boro-coatto mix':
    'Coatto zen: te scazzi con chiunque ma poi mediti sul raccordo. Caos organizzato e pace interiore in tuta Adidas.',
  'pariolino-coatto mix':
    'Boro soft-touch: sembri tranquillo, ma bastano due battute e diventi un meme vivente. L\u2019equilibrio tra eleganza e casino.',
};

export type Persona = keyof typeof personaCopy;

/** Maps a persona label (including mixes) to the corresponding NFT artwork. */
const PERSONA_IMAGES: Record<Axis, string> = {
  boro: '/Boro.png',
  pariolino: '/Pariolino.png',
  coatto: '/Coatto.png',
};

export function getPersonaImage(persona: string): string {
  if (persona.includes('boro')) return PERSONA_IMAGES.boro;
  if (persona.includes('pariolino')) return PERSONA_IMAGES.pariolino;
  if (persona.includes('coatto')) return PERSONA_IMAGES.coatto;
  return PERSONA_IMAGES.boro;
}

/** Returns the persona data exposed in the NFT metadata endpoint. */
export function getPersonaForTokenId(tokenId: number): {
  axis: Axis;
  name: string;
  image: string;
  description: string;
} {
  const axes: Axis[] = ['boro', 'pariolino', 'coatto'];
  const axis = axes[(tokenId - 1) % axes.length];
  return {
    axis,
    name: axis.charAt(0).toUpperCase() + axis.slice(1),
    image: PERSONA_IMAGES[axis],
    description: personaCopy[axis],
  };
}
