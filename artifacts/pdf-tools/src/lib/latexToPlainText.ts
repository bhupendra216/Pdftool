const GREEK_MAP: Record<string, string> = {
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  Gamma: 'Γ',
  delta: 'δ',
  Delta: 'Δ',
  epsilon: 'ε',
  zeta: 'ζ',
  eta: 'η',
  theta: 'θ',
  Theta: 'Θ',
  iota: 'ι',
  kappa: 'κ',
  lambda: 'λ',
  Lambda: 'Λ',
  mu: 'μ',
  nu: 'ν',
  xi: 'ξ',
  Xi: 'Ξ',
  pi: 'π',
  Pi: 'Π',
  rho: 'ρ',
  sigma: 'σ',
  Sigma: 'Σ',
  tau: 'τ',
  upsilon: 'υ',
  phi: 'φ',
  Phi: 'Φ',
  chi: 'χ',
  psi: 'ψ',
  Psi: 'Ψ',
  omega: 'ω',
  Omega: 'Ω',
  vartheta: 'θ',
  varphi: 'φ',
  varpi: 'π',
  varsigma: 'ς',
  varepsilon: 'ε',
};

const SYMBOL_MAP: Record<string, string> = {
  '\\pm': '±',
  '\\mp': '∓',
  '\\cdot': '·',
  '\\times': '×',
  '\\div': '÷',
  '\\neq': '≠',
  '\\leq': '≤',
  '\\geq': '≥',
  '\\approx': '≈',
  '\\equiv': '≡',
  '\\infty': '∞',
  '\\partial': '∂',
  '\\nabla': '∇',
  '\\in': '∈',
  '\\subset': '⊂',
  '\\cup': '∪',
  '\\cap': '∩',
  '\\forall': '∀',
  '\\exists': '∃',
  '\\to': '→',
  '\\rightarrow': '→',
  '\\Rightarrow': '⇒',
  '\\sqrt': '√',
  '\\ldots': '…',
  '\\dots': '…',
};

const SUPER_MAP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
  A: 'ᴬ', B: 'ᴮ', C: 'ᶜ', D: 'ᴰ', E: 'ᴱ', F: 'ᶠ', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ', J: 'ᴶ', K: 'ᴷ', L: 'ᴸ', M: 'ᴹ', N: 'ᴺ', O: 'ᴼ', P: 'ᴾ', R: 'ᴿ', S: 'ˢ', T: 'ᵀ', U: 'ᵁ', V: 'ⱽ', W: 'ᵂ', X: 'ˣ', Y: 'ʸ', Z: 'ᶻ',
};

const SUB_MAP: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', o: 'ₒ', p: 'ₚ', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ',
  A: 'ₐ', E: 'ₑ', H: 'ₕ', I: 'ᵢ', J: 'ⱼ', K: 'ₖ', L: 'ₗ', M: 'ₘ', N: 'ₙ', O: 'ₒ', P: 'ₚ', R: 'ᵣ', S: 'ₛ', T: 'ₜ', U: 'ᵤ', V: 'ᵥ', X: 'ₓ',
};

function readGroup(text: string, startIndex: number): { value: string; endIndex: number } {
  if (text[startIndex] !== '{') return { value: '', endIndex: startIndex };
  let depth = 0;
  let cursor = startIndex;
  let value = '';
  while (cursor < text.length) {
    const ch = text[cursor];
    if (ch === '{') {
      depth += 1;
      if (depth > 1) value += ch;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return { value, endIndex: cursor + 1 };
      value += ch;
    } else {
      value += ch;
    }
    cursor += 1;
  }
  return { value, endIndex: text.length };
}

function readCommand(text: string, startIndex: number): { command: string; endIndex: number } {
  if (text[startIndex] !== '\\') return { command: '', endIndex: startIndex };
  let cursor = startIndex + 1;
  let command = '';
  while (cursor < text.length && /[A-Za-z]/.test(text[cursor])) {
    command += text[cursor];
    cursor += 1;
  }
  return { command, endIndex: cursor };
}

function applyScript(base: string, script: string, marker: '^' | '_'): string {
  const map = marker === '^' ? SUPER_MAP : SUB_MAP;
  return base + Array.from(script).map((char) => map[char] ?? char).join('');
}

function parseExpression(source: string, compact = false): string {
  let output = '';
  let lastToken = '';
  let index = 0;

  while (index < source.length) {
    const ch = source[index];

    if (/\s/.test(ch)) {
      index += 1;
      continue;
    }

    if (ch === '{') {
      const group = readGroup(source, index);
      output += parseExpression(group.value, compact);
      index = group.endIndex;
      continue;
    }

    if (ch === '}') {
      index += 1;
      continue;
    }

    if (ch === '\\') {
      const { command, endIndex } = readCommand(source, index);
      index = endIndex;

      if (!command) {
        output += '\\';
        lastToken = '\\';
        continue;
      }

      if (command === 'frac') {
        const numeratorGroup = readGroup(source, index);
        const denominatorGroup = readGroup(source, numeratorGroup.endIndex);
        const numerator = parseExpression(numeratorGroup.value, true);
        const denominator = parseExpression(denominatorGroup.value, true);
        const token = `(${numerator}) / (${denominator})`;
        output += token;
        lastToken = token;
        index = denominatorGroup.endIndex;
        continue;
      }

      if (command === 'sqrt') {
        const bodyGroup = readGroup(source, index);
        const body = parseExpression(bodyGroup.value, true);
        const token = `√(${body})`;
        output += token;
        lastToken = token;
        index = bodyGroup.endIndex;
        continue;
      }

      if (command === 'sum') {
        let lower = '';
        let upper = '';
        if (source[index] === '_') {
          index += 1;
          const group = readGroup(source, index);
          lower = parseExpression(group.value, true);
          index = group.endIndex;
        }
        if (source[index] === '^') {
          index += 1;
          const group = readGroup(source, index);
          upper = parseExpression(group.value, true);
          index = group.endIndex;
        }
        const token = `Σ(${lower}${upper ? ` to ${upper}` : ''})`;
        output += token;
        lastToken = token;
        continue;
      }

      if (command in GREEK_MAP) {
        const token = GREEK_MAP[command];
        output += token;
        lastToken = token;
        continue;
      }

      const symbolKey = '\\' + command;
      if (symbolKey in SYMBOL_MAP) {
        const token = SYMBOL_MAP[symbolKey];
        output += token === '±' ? ' ± ' : token;
        lastToken = token;
        continue;
      }

      if (command === 'left' || command === 'right' || command === 'big' || command === 'Big' || command === 'bigg' || command === 'Bigg') {
        if (source[index] === '.') index += 1;
        continue;
      }

      output += command;
      lastToken = command;
      continue;
    }

    if (ch === '^' || ch === '_') {
      const marker = ch as '^' | '_';
      let script = '';
      let nextIndex = index + 1;
      if (source[nextIndex] === '{') {
        const group = readGroup(source, nextIndex);
        script = parseExpression(group.value, true);
        nextIndex = group.endIndex;
      } else {
        while (nextIndex < source.length && !/[\\{}\s^_+\-=]/.test(source[nextIndex])) {
          script += source[nextIndex];
          nextIndex += 1;
        }
      }

      if (!lastToken) {
        output += marker === '^' ? `^(${script})` : `_${script}`;
        lastToken = marker === '^' ? `^(${script})` : `_${script}`;
      } else {
        const replacement = applyScript(lastToken, script, marker);
        const lastIndex = output.lastIndexOf(lastToken);
        output = output.slice(0, lastIndex) + replacement + output.slice(lastIndex + lastToken.length);
        lastToken = replacement;
      }
      index = nextIndex;
      continue;
    }

    if (ch === '+') {
      output += compact ? '+' : ' + ';
      lastToken = '+';
      index += 1;
      continue;
    }

    if (ch === '=') {
      output += compact ? '=' : ' = ';
      lastToken = '=';
      index += 1;
      continue;
    }

    if (ch === '-') {
      output += '-';
      lastToken = '-';
      index += 1;
      continue;
    }

    if (!compact && output && /[\)A-Za-z0-9α-ω]/.test(output[output.length - 1]) && /[A-Za-z0-9α-ω]/.test(ch)) {
      output += ' ';
    }

    output += ch;
    lastToken = ch;
    index += 1;
  }

  return output.replace(/\s{2,}/g, ' ').trim();
}

export function stripOuterLatexDelimiters(value: string): string {
  let text = (value ?? '').replace(/\u200b/g, '').trim();
  const pairs: Array<[string, string]> = [['$$', '$$'], ['$', '$'], ['\\[', '\\]'], ['\\(', '\\)']];

  for (const [open, close] of pairs) {
    if (text.startsWith(open) && text.endsWith(close) && text.length >= open.length + close.length) {
      const inner = text.slice(open.length, text.length - close.length).trim();
      if (inner) return stripOuterLatexDelimiters(inner);
    }
  }

  return text.replace(/\r\n?/g, ' ').replace(/\n\s*/g, ' ').replace(/\s+/g, ' ').trim();
}

export function convertLatexToPlainText(input: string): string {
  const source = stripOuterLatexDelimiters(input);
  if (!source) return '';
  return parseExpression(source, false).replace(/\s+/g, ' ').trim();
}
