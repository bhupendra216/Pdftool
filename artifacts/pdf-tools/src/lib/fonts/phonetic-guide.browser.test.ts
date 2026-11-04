import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it } from 'vitest';
import {
  PHONETIC_COMBINATIONS,
  PHONETIC_GUIDE_ITEMS,
  PHONETIC_LAYOUTS,
  PHONETIC_KEY_ROWS,
  getPhoneticKeyMapping,
  transliterateDevanagari,
} from './devanagari-input';
import { PhoneticGuide, PhoneticKeyboardDock } from '../../pages/PhoneticGuide';

it('keeps every guide mapping, keyboard key, shift key, and combination aligned with the converter', () => {
  for (const mappings of Object.values(PHONETIC_GUIDE_ITEMS)) {
    for (const mapping of mappings) {
      if (mapping.kind === 'rule') {
        expect(transliterateDevanagari('kk')).toContain(mapping.output);
      } else {
        expect(transliterateDevanagari(mapping.input), mapping.input).toBe(mapping.output);
      }
    }
  }

  const representedInputs = new Set([
    ...Object.values(PHONETIC_GUIDE_ITEMS).flatMap((mappings) => mappings.map(({ input }) => input)),
    ...PHONETIC_KEY_ROWS.flatMap((row) => [...row].flatMap((key) => [key, key.toUpperCase()])),
    ...PHONETIC_COMBINATIONS,
  ]);
  for (const mapping of PHONETIC_LAYOUTS[0].tokens) {
    expect(representedInputs.has(mapping.input), `Guide or keyboard is missing ${mapping.input}`).toBe(true);
    expect(transliterateDevanagari(mapping.input), mapping.input).toBe(mapping.output);
  }

  for (const row of PHONETIC_KEY_ROWS) {
    for (const key of row) {
      expect(getPhoneticKeyMapping(key)?.output).toBe(transliterateDevanagari(key));
      expect(getPhoneticKeyMapping(key.toUpperCase())?.output)
        .toBe(transliterateDevanagari(key.toUpperCase()));
    }
  }

  for (const input of PHONETIC_COMBINATIONS) {
    expect(transliterateDevanagari(input), input).not.toBe('');
  }
});

it('renders guide and keyboard outputs from mapping data, searchable tabs, and a real-text table', async () => {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  let open = false;
  const onShowKeyboard = () => { open = !open; };

  try {
    await act(async () => root.render(createElement('div', null,
      createElement(PhoneticGuide, {
        onShowKeyboard,
        keyboardOpen: open,
        onPanelMouseDown: (event) => event.preventDefault(),
      }),
      createElement(PhoneticKeyboardDock, {
        open,
        onClose: () => { open = false; },
        shiftLayer: false,
        onShiftLayerChange: () => {},
      }),
    )));

    const search = container.querySelector<HTMLInputElement>('input[aria-label="Search phonetic guide"]')!;
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    await act(async () => {
      setValue?.call(search, 'kh');
      search.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(container.querySelector('[data-phonetic-input="kh"][data-phonetic-output="ख"]')).not.toBeNull();

    await act(async () => {
      setValue?.call(search, 'ksh');
      search.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(container.querySelector('[data-phonetic-input="ksh"][data-phonetic-output="क्ष"]')).not.toBeNull();

    const conjunctTab = [...container.querySelectorAll<HTMLButtonElement>('[role="tab"]')]
      .find((tab) => tab.textContent === 'Conjuncts')!;
    await act(async () => conjunctTab.click());
    await act(async () => {
      setValue?.call(search, '');
      search.dispatchEvent(new Event('input', { bubbles: true }));
    });
    const visibleConjuncts = container.querySelectorAll('[role="tabpanel"] [data-phonetic-input]');
    expect(visibleConjuncts.length).toBe(PHONETIC_GUIDE_ITEMS.conjuncts.length);
    for (const mapping of PHONETIC_GUIDE_ITEMS.conjuncts) {
      expect(container.querySelector(`[data-phonetic-input="${mapping.input}"][data-phonetic-output="${mapping.output}"]`)).not.toBeNull();
    }

    await act(async () => root.render(createElement(PhoneticKeyboardDock, {
      open: true,
      onClose: () => {},
      shiftLayer: false,
      onShiftLayerChange: () => {},
    })));
    const keys = container.querySelectorAll<HTMLElement>('.phonetic-key');
    expect(keys.length).toBe(PHONETIC_KEY_ROWS.join('').length);
    for (const key of keys) {
      const latin = key.querySelector<HTMLElement>('.phonetic-key-latin')?.textContent ?? '';
      const devanagari = key.querySelector<HTMLElement>('.phonetic-key-devanagari')?.textContent ?? '';
      expect(devanagari).toBe(transliterateDevanagari(latin));
    }
    for (const input of PHONETIC_COMBINATIONS) {
      const combination = container.querySelector<HTMLElement>(`.phonetic-combination[data-phonetic-input="${input}"]`);
      expect(combination?.getAttribute('data-phonetic-output')).toBe(transliterateDevanagari(input));
    }

    await act(async () => container.querySelector<HTMLButtonElement>('button[aria-pressed="false"]')?.click());
    const tableRows = container.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(PHONETIC_KEY_ROWS.join('').length + 1);
    expect(container.textContent).toContain('Shift output');
    for (const row of [...tableRows].slice(0, -1)) {
      const cells = row.querySelectorAll('td');
      const input = row.querySelector('th')?.textContent ?? '';
      expect(cells[0]?.textContent).toBe(transliterateDevanagari(input));
      expect(cells[2]?.textContent).toBe(transliterateDevanagari(input.toUpperCase()));
    }
    expect(tableRows[tableRows.length - 1].textContent).toContain('Shift + Spacespace');
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});
