export type PhoneticCategory = 'vowels' | 'consonants' | 'signs' | 'conjuncts' | 'numbers' | 'examples';

export type PhoneticMapping = {
  input: string;
  output: string;
  category: PhoneticCategory;
  kind?: 'consonant' | 'vowel' | 'mark' | 'example' | 'rule' | 'number';
  description?: string;
};

export type PhoneticLayoutData = {
  id: string;
  label: string;
  tokens: readonly PhoneticMapping[];
  examples: readonly PhoneticMapping[];
  conjunctExamples: readonly string[];
  keyRows: readonly string[];
  combinations: readonly string[];
};

type Phoneme = { type: 'consonant' | 'vowel' | 'mark'; value: string };
const VIRAMA = '्';

const layoutTokens: PhoneticMapping[] = [
  { input: 'ksh', output: 'क्ष', category: 'conjuncts', kind: 'consonant' },
  { input: 'gya', output: 'ज्ञ', category: 'conjuncts', kind: 'consonant' },
  { input: 'gy', output: 'ज्ञ', category: 'conjuncts', kind: 'consonant' },
  { input: 'kh', output: 'ख', category: 'consonants', kind: 'consonant' },
  { input: 'gh', output: 'घ', category: 'consonants', kind: 'consonant' },
  { input: 'chh', output: 'छ', category: 'consonants', kind: 'consonant' },
  { input: 'ch', output: 'च', category: 'consonants', kind: 'consonant' },
  { input: 'jh', output: 'झ', category: 'consonants', kind: 'consonant' },
  { input: 'th', output: 'थ', category: 'consonants', kind: 'consonant' },
  { input: 'dh', output: 'ध', category: 'consonants', kind: 'consonant' },
  { input: 'ph', output: 'फ', category: 'consonants', kind: 'consonant' },
  { input: 'bh', output: 'भ', category: 'consonants', kind: 'consonant' },
  { input: 'sh', output: 'श', category: 'consonants', kind: 'consonant' },
  { input: 'aa', output: 'आ', category: 'vowels', kind: 'vowel' },
  { input: 'ii', output: 'ई', category: 'vowels', kind: 'vowel' },
  { input: 'ee', output: 'ई', category: 'vowels', kind: 'vowel' },
  { input: 'uu', output: 'ऊ', category: 'vowels', kind: 'vowel' },
  { input: 'oo', output: 'ऊ', category: 'vowels', kind: 'vowel' },
  { input: 'ai', output: 'ऐ', category: 'vowels', kind: 'vowel' },
  { input: 'au', output: 'औ', category: 'vowels', kind: 'vowel' },
  { input: 'M', output: 'ं', category: 'signs', kind: 'mark', description: 'Anusvara' },
  { input: '~', output: 'ँ', category: 'signs', kind: 'mark', description: 'Chandrabindu' },
  { input: 'a', output: 'अ', category: 'vowels', kind: 'vowel' },
  { input: 'i', output: 'इ', category: 'vowels', kind: 'vowel' },
  { input: 'u', output: 'उ', category: 'vowels', kind: 'vowel' },
  { input: 'e', output: 'ए', category: 'vowels', kind: 'vowel' },
  { input: 'o', output: 'ओ', category: 'vowels', kind: 'vowel' },
  { input: 'k', output: 'क', category: 'consonants', kind: 'consonant' },
  { input: 'g', output: 'ग', category: 'consonants', kind: 'consonant' },
  { input: 'c', output: 'क', category: 'consonants', kind: 'consonant' },
  { input: 'j', output: 'ज', category: 'consonants', kind: 'consonant' },
  { input: 'T', output: 'ट', category: 'consonants', kind: 'consonant' },
  { input: 'D', output: 'ड', category: 'consonants', kind: 'consonant' },
  { input: 'N', output: 'ण', category: 'consonants', kind: 'consonant' },
  { input: 't', output: 'त', category: 'consonants', kind: 'consonant' },
  { input: 'd', output: 'द', category: 'consonants', kind: 'consonant' },
  { input: 'n', output: 'न', category: 'consonants', kind: 'consonant' },
  { input: 'p', output: 'प', category: 'consonants', kind: 'consonant' },
  { input: 'b', output: 'ब', category: 'consonants', kind: 'consonant' },
  { input: 'm', output: 'म', category: 'consonants', kind: 'consonant' },
  { input: 'y', output: 'य', category: 'consonants', kind: 'consonant' },
  { input: 'r', output: 'र', category: 'consonants', kind: 'consonant' },
  { input: 'l', output: 'ल', category: 'consonants', kind: 'consonant' },
  { input: 'v', output: 'व', category: 'consonants', kind: 'consonant' },
  { input: 'w', output: 'व', category: 'consonants', kind: 'consonant' },
  { input: 's', output: 'स', category: 'consonants', kind: 'consonant' },
  { input: 'h', output: 'ह', category: 'consonants', kind: 'consonant' },
  { input: 'f', output: 'फ़', category: 'consonants', kind: 'consonant' },
  { input: 'q', output: 'क़', category: 'consonants', kind: 'consonant' },
  { input: 'x', output: 'क्ष', category: 'conjuncts', kind: 'consonant' },
  { input: 'z', output: 'ज़', category: 'consonants', kind: 'consonant' },
];

const explicitByInput = new Map(layoutTokens.map((entry) => [entry.input, entry]));
const lowercaseMappings = layoutTokens.filter((entry) => /^[a-z]$/u.test(entry.input));

const phoneticExamples: PhoneticMapping[] = [
  { input: 'nepal', output: 'नेपाल', category: 'examples', kind: 'example' },
  { input: 'namaste', output: 'नमस्ते', category: 'examples', kind: 'example' },
  { input: 'kshatriya', output: 'क्षत्रिय', category: 'examples', kind: 'example' },
  { input: 'gyaan', output: 'ज्ञान', category: 'examples', kind: 'example' },
];

export const PHONETIC_LAYOUTS: readonly PhoneticLayoutData[] = [{
  id: 'phonetic',
  label: 'Phonetic',
  tokens: [
    ...layoutTokens,
    ...lowercaseMappings
      .filter((entry) => !explicitByInput.has(entry.input.toUpperCase()))
      .map((entry) => ({
        ...entry,
        input: entry.input.toUpperCase(),
        description: 'Shift layer',
      })),
    ...Array.from({ length: 10 }, (_, digit) => ({
      input: String(digit),
      output: String.fromCodePoint(0x0966 + digit),
      category: 'numbers' as const,
      kind: 'number' as const,
    })),
  ],
  examples: phoneticExamples,
  conjunctExamples: ['tra', 'shra', 'ksha'],
  keyRows: ['1234567890', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'],
  combinations: [
    'aa', 'ii', 'uu', 'kh', 'gh', 'chh', 'th', 'dh', 'sh', 'ksh', 'tra', 'gy',
  ],
}] as const;

export const DEFAULT_PHONETIC_LAYOUT_ID = PHONETIC_LAYOUTS[0].id;

export function getPhoneticLayout(layoutId = DEFAULT_PHONETIC_LAYOUT_ID) {
  const layout = PHONETIC_LAYOUTS.find((entry) => entry.id === layoutId);
  if (!layout) throw new RangeError(`Unknown phonetic layout: ${layoutId}`);
  return layout;
}

export const PHONETIC_KEY_ROWS = PHONETIC_LAYOUTS[0].keyRows;
export const PHONETIC_COMBINATIONS = PHONETIC_LAYOUTS[0].combinations;

const vowelSigns: Record<string, string> = {
  अ: '',
  आ: 'ा',
  इ: 'ि',
  ई: 'ी',
  उ: 'ु',
  ऊ: 'ू',
  ए: 'े',
  ऐ: 'ै',
  ओ: 'ो',
  औ: 'ौ',
};

export function getPhoneticGuideItems(layoutId = DEFAULT_PHONETIC_LAYOUT_ID): Record<PhoneticCategory, readonly PhoneticMapping[]> {
  const layout = getPhoneticLayout(layoutId);
  return {
    vowels: layout.tokens.filter((entry) => entry.category === 'vowels' && entry.description !== 'Shift layer'),
    consonants: layout.tokens.filter((entry) =>
      entry.category === 'consonants' && entry.description !== 'Shift layer'),
    signs: [
      ...layout.tokens.filter((entry) => entry.category === 'signs'),
      { input: 'consonant + consonant', output: VIRAMA, category: 'signs', kind: 'rule', description: 'Virama joins consecutive consonants' },
    ],
    conjuncts: [
      ...layout.tokens.filter((entry) => entry.category === 'conjuncts'),
      ...layout.conjunctExamples.map((input) => ({
        input,
        output: transliterateDevanagariWithLayout(input, layout.id),
        category: 'conjuncts' as const,
        kind: 'example' as const,
      })),
    ],
    numbers: layout.tokens.filter((entry) => entry.category === 'numbers'),
    examples: layout.examples,
  };
}

export const PHONETIC_GUIDE_ITEMS = getPhoneticGuideItems();

export function getPhoneticKeyMapping(input: string, layoutId = DEFAULT_PHONETIC_LAYOUT_ID) {
  return getPhoneticLayout(layoutId).tokens.find((entry) => entry.input === input);
}

export function getPhoneticSequencesForKey(key: string, layoutId = DEFAULT_PHONETIC_LAYOUT_ID) {
  return getPhoneticLayout(layoutId).tokens
    .filter((entry) => entry.input.length > 1 && entry.input.startsWith(key))
    .map((entry) => entry);
}

export function getPhoneticMapping(input: string, layoutId = DEFAULT_PHONETIC_LAYOUT_ID) {
  const layout = getPhoneticLayout(layoutId);
  return layout.tokens.find((entry) => entry.input === input) ??
    layout.examples.find((entry) => entry.input === input);
}

function getPhonemes(input: string, layoutId: string): Phoneme[] {
  const tokens: Array<[string, Phoneme]> = getPhoneticLayout(layoutId).tokens.map((entry) => [
    entry.input,
    {
      type: entry.kind === 'consonant' ? 'consonant'
        : entry.kind === 'vowel' ? 'vowel' : 'mark',
      value: entry.output,
    },
  ]);
  const phonemes: Phoneme[] = [];
  for (let index = 0; index < input.length;) {
    const token = tokens.find(([key]) => input.startsWith(key, index));
    if (!token) {
      phonemes.push({ type: 'mark', value: input[index] });
      index += 1;
      continue;
    }
    phonemes.push(token[1]);
    index += token[0].length;
  }
  return phonemes;
}

export function transliterateDevanagari(input: string) {
  return transliterateDevanagariWithLayout(input, DEFAULT_PHONETIC_LAYOUT_ID);
}

export function transliterateDevanagariWithLayout(input: string, layoutId: string) {
  const layout = getPhoneticLayout(layoutId);
  const specialCase = layout.examples.find((entry) => entry.input.toLowerCase() === input.toLowerCase());
  if (specialCase) return specialCase.output;

  const output: string[] = [];
  let pendingConsonant = false;
  for (const phoneme of getPhonemes(input, layoutId)) {
    if (phoneme.type === 'consonant') {
      if (pendingConsonant) output.push(VIRAMA);
      output.push(phoneme.value);
      pendingConsonant = true;
    } else if (phoneme.type === 'vowel') {
      if (pendingConsonant) {
        output.push(vowelSigns[phoneme.value] ?? '');
      } else {
        output.push(phoneme.value);
      }
      pendingConsonant = false;
    } else {
      output.push(phoneme.value);
      if (phoneme.value !== 'ं' && phoneme.value !== 'ँ') pendingConsonant = false;
    }
  }
  return output.join('');
}
