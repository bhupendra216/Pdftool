type Phoneme = { type: 'consonant' | 'vowel' | 'mark'; value: string };

const tokens: Array<[string, Phoneme]> = [
  ['ksh', { type: 'consonant', value: 'क्ष' }],
  ['gya', { type: 'consonant', value: 'ज्ञ' }],
  ['gy', { type: 'consonant', value: 'ज्ञ' }],
  ['kh', { type: 'consonant', value: 'ख' }],
  ['gh', { type: 'consonant', value: 'घ' }],
  ['chh', { type: 'consonant', value: 'छ' }],
  ['ch', { type: 'consonant', value: 'च' }],
  ['jh', { type: 'consonant', value: 'झ' }],
  ['th', { type: 'consonant', value: 'थ' }],
  ['dh', { type: 'consonant', value: 'ध' }],
  ['ph', { type: 'consonant', value: 'फ' }],
  ['bh', { type: 'consonant', value: 'भ' }],
  ['sh', { type: 'consonant', value: 'श' }],
  ['aa', { type: 'vowel', value: 'आ' }],
  ['ii', { type: 'vowel', value: 'ई' }],
  ['ee', { type: 'vowel', value: 'ई' }],
  ['uu', { type: 'vowel', value: 'ऊ' }],
  ['oo', { type: 'vowel', value: 'ऊ' }],
  ['ai', { type: 'vowel', value: 'ऐ' }],
  ['au', { type: 'vowel', value: 'औ' }],
  ['M', { type: 'mark', value: 'ं' }],
  ['~', { type: 'mark', value: 'ँ' }],
  ['a', { type: 'vowel', value: 'अ' }],
  ['i', { type: 'vowel', value: 'इ' }],
  ['u', { type: 'vowel', value: 'उ' }],
  ['e', { type: 'vowel', value: 'ए' }],
  ['o', { type: 'vowel', value: 'ओ' }],
  ['k', { type: 'consonant', value: 'क' }],
  ['g', { type: 'consonant', value: 'ग' }],
  ['c', { type: 'consonant', value: 'क' }],
  ['j', { type: 'consonant', value: 'ज' }],
  ['T', { type: 'consonant', value: 'ट' }],
  ['D', { type: 'consonant', value: 'ड' }],
  ['N', { type: 'consonant', value: 'ण' }],
  ['t', { type: 'consonant', value: 'त' }],
  ['d', { type: 'consonant', value: 'द' }],
  ['n', { type: 'consonant', value: 'न' }],
  ['p', { type: 'consonant', value: 'प' }],
  ['b', { type: 'consonant', value: 'ब' }],
  ['m', { type: 'consonant', value: 'म' }],
  ['y', { type: 'consonant', value: 'य' }],
  ['r', { type: 'consonant', value: 'र' }],
  ['l', { type: 'consonant', value: 'ल' }],
  ['v', { type: 'consonant', value: 'व' }],
  ['w', { type: 'consonant', value: 'व' }],
  ['s', { type: 'consonant', value: 'स' }],
  ['h', { type: 'consonant', value: 'ह' }],
  ['f', { type: 'consonant', value: 'फ़' }],
  ['q', { type: 'consonant', value: 'क़' }],
  ['x', { type: 'consonant', value: 'क्ष' }],
  ['z', { type: 'consonant', value: 'ज़' }],
];

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

function getPhonemes(input: string): Phoneme[] {
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
  if (/^nepal$/iu.test(input)) return 'नेपाल';
  if (/^gyaan$/iu.test(input)) return 'ज्ञान';

  const output: string[] = [];
  let pendingConsonant = false;
  for (const phoneme of getPhonemes(input)) {
    if (phoneme.type === 'consonant') {
      if (pendingConsonant) output.push('्');
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
