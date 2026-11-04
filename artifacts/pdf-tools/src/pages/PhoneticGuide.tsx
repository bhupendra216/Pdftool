import { useMemo, useState } from 'react';
import { Keyboard, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PHONETIC_COMBINATIONS,
  PHONETIC_GUIDE_ITEMS,
  PHONETIC_KEY_ROWS,
  getPhoneticKeyMapping,
  getPhoneticSequencesForKey,
  transliterateDevanagari,
  type PhoneticCategory,
  type PhoneticMapping,
} from '../lib/fonts/devanagari-input';
import './phonetic-guide.css';

const categories: Array<{ id: PhoneticCategory; label: string }> = [
  { id: 'vowels', label: 'Vowels' },
  { id: 'consonants', label: 'Consonants' },
  { id: 'signs', label: 'Signs' },
  { id: 'conjuncts', label: 'Conjuncts' },
  { id: 'numbers', label: 'Numbers' },
  { id: 'examples', label: 'Examples' },
];

function visibleOutput(mapping: PhoneticMapping) {
  return mapping.kind === 'mark' || mapping.kind === 'rule' ? `◌${mapping.output}` : mapping.output;
}

function MappingChips({ mappings }: { mappings: readonly PhoneticMapping[] }) {
  return <div className="flex min-w-0 flex-wrap gap-1.5">
    {mappings.map((mapping) => (
      <span
        key={`${mapping.input}-${mapping.output}`}
        className="phonetic-guide-chip"
        title={mapping.description}
        data-phonetic-input={mapping.input}
        data-phonetic-output={mapping.output}
      >
        <span className="phonetic-guide-latin">{mapping.input}</span>
        <span aria-hidden="true" className="text-muted-foreground">→</span>
        <span lang="hi" className="phonetic-guide-devanagari">{visibleOutput(mapping)}</span>
      </span>
    ))}
  </div>;
}

export function PhoneticKeyboardDock({
  open,
  onClose,
  shiftLayer,
  onShiftLayerChange,
}: {
  open: boolean;
  onClose: () => void;
  shiftLayer: boolean;
  onShiftLayerChange: (enabled: boolean) => void;
}) {
  const [tableView, setTableView] = useState(false);
  const keys = PHONETIC_KEY_ROWS.flatMap((row) => [...row]).map((key) => {
    const input = shiftLayer ? key.toUpperCase() : key;
    const mapping = getPhoneticKeyMapping(input);
    const output = mapping?.output ?? transliterateDevanagari(input);
    const sequences = getPhoneticSequencesForKey(key);
    return { key, input, output, sequences };
  });
  const sequenceHelp = keys
    .filter(({ sequences }) => sequences.length)
    .map(({ key, sequences }) => `${key} → ${transliterateDevanagari(key)}, ${sequences.map(({ input, output }) => `${input} → ${output}`).join(', ')}`);
  const combinationMappings = PHONETIC_COMBINATIONS.map((input) => ({
    input,
    output: transliterateDevanagari(input),
  }));
  const tableMappings = keys.map(({ input, output }) => ({ input, output }));

  return (
    <section
      id="edit-pdf-phonetic-keyboard-dock"
      aria-label="Phonetic keyboard layout reference"
      data-phonetic-keyboard-dock
      hidden={!open}
      className="phonetic-keyboard-dock"
    >
      <div className="mx-auto flex h-full max-w-screen-2xl flex-col gap-2 px-3 py-2 sm:px-5">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Phonetic keyboard layout</h3>
            <span className="hidden text-xs text-muted-foreground sm:inline">Reference only — keys do not type</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs text-foreground">
              <input
                type="checkbox"
                checked={shiftLayer}
                onChange={(event) => onShiftLayerChange(event.target.checked)}
                aria-label="Preview Shift layer"
              />
              Shift layer
            </label>
            <Button
              type="button"
              variant={tableView ? 'default' : 'outline'}
              size="sm"
              aria-pressed={tableView}
              onClick={() => setTableView((visible) => !visible)}
            >{tableView ? 'Hide table' : 'View as table'}</Button>
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>Close</Button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {tableView ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <caption className="sr-only">Every phonetic keyboard key and its output</caption>
                <thead><tr className="border-b border-border text-xs text-muted-foreground">
                  <th scope="col" className="p-1.5">Key input</th>
                  <th scope="col" className="p-1.5">Devanagari output</th>
                  <th scope="col" className="p-1.5">Shift input</th>
                  <th scope="col" className="p-1.5">Shift output</th>
                </tr></thead>
                <tbody>{PHONETIC_KEY_ROWS.flatMap((row) => [...row]).map((key) => {
                  const base = getPhoneticKeyMapping(key);
                  const shifted = getPhoneticKeyMapping(key.toUpperCase());
                  return <tr key={key} className="border-b border-border/70">
                    <th scope="row" className="p-1.5 font-mono">{key}</th>
                    <td lang="hi" className="phonetic-guide-devanagari p-1.5">{base?.output ?? transliterateDevanagari(key)}</td>
                    <td className="p-1.5 font-mono">{key.toUpperCase()}</td>
                    <td lang="hi" className="phonetic-guide-devanagari p-1.5">{shifted?.output ?? transliterateDevanagari(key.toUpperCase())}</td>
                  </tr>;
                })}
                  <tr className="border-b border-border/70">
                    <th scope="row" className="p-1.5">Space</th>
                    <td className="p-1.5">space</td>
                    <td className="p-1.5">Shift + Space</td>
                    <td className="p-1.5">space</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="phonetic-key-rows" aria-label="QWERTY keyboard reference">
                {PHONETIC_KEY_ROWS.map((row) => <div key={row} className="phonetic-key-row">
                  {[...row].map((key) => {
                    const item = keys.find((candidate) => candidate.key === key)!;
                    const shown = shiftLayer ? getPhoneticKeyMapping(key.toUpperCase()) : getPhoneticKeyMapping(key);
                    return <div
                      key={key}
                      className="phonetic-key"
                      title={item.sequences.length
                        ? sequenceHelp.find((help) => help.startsWith(`${key} →`))
                        : `${item.input} → ${shown?.output ?? item.output}`}
                      aria-label={`${item.input} types ${shown?.output ?? item.output}${item.sequences.length ? `. Sequences: ${item.sequences.map(({ input, output }) => `${input} to ${output}`).join('; ')}` : ''}`}
                      tabIndex={0}
                      data-sequence-start={item.sequences.length > 0 || undefined}
                    >
                      <span className="phonetic-key-latin">{item.input}</span>
                      {item.sequences.length > 0 && <span aria-hidden="true" className="phonetic-key-sequence-dot" />}
                      <span lang="hi" className="phonetic-key-devanagari">
                        {shown?.output ?? transliterateDevanagari(item.input)}
                      </span>
                      <span lang="hi" className="phonetic-key-shift">
                        {getPhoneticKeyMapping(key.toUpperCase())?.output ?? transliterateDevanagari(key.toUpperCase())}
                      </span>
                    </div>;
                  })}
                </div>)}
                <div className="phonetic-key-row phonetic-key-row-space">
                  <span className="phonetic-space-key">
                    <span className="phonetic-key-latin">Space</span>
                    <span lang="hi" className="phonetic-space-output">space</span>
                  </span>
                </div>
              </div>
              <div className="flex min-w-0 flex-wrap items-center gap-1.5 border-t border-border pt-1.5">
                <span className="mr-1 text-xs font-medium text-foreground">Combinations</span>
                {combinationMappings.map(({ input, output }) => (
                  <span
                    key={input}
                    className="phonetic-combination"
                    title={`${input} → ${output}`}
                    data-phonetic-input={input}
                    data-phonetic-output={output}
                  ><span>{input}</span><span aria-hidden="true">→</span><span lang="hi" className="phonetic-guide-devanagari">{output}</span></span>
                ))}
              </div>
              <p className="text-[11px] leading-tight text-muted-foreground">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-primary align-middle" />A dot marks a key that begins a sequence. Focus or hover a dotted key for its sequences.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function PhoneticGuide({
  onShowKeyboard,
  keyboardOpen,
  onPanelMouseDown,
}: {
  onShowKeyboard: () => void;
  keyboardOpen: boolean;
  onPanelMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  const [category, setCategory] = useState<PhoneticCategory>('vowels');
  const [search, setSearch] = useState('');
  const items = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const categoriesToSearch = query ? categories : categories.filter((entry) => entry.id === category);
    return categoriesToSearch.flatMap(({ id }) =>
      PHONETIC_GUIDE_ITEMS[id]
        .filter((mapping) => !query ||
          `${mapping.input} ${mapping.output} ${mapping.description ?? ''}`.toLocaleLowerCase().includes(query))
        .map((mapping) => ({ ...mapping, category: id })));
  }, [category, search]);

  return <section className="min-w-0" aria-label="Phonetic guide">
    <div className="mb-2 flex min-w-0 flex-wrap items-center justify-between gap-2">
      <h4 className="text-sm font-semibold text-foreground">Phonetic guide</h4>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 max-w-full shrink-0 gap-1.5 px-2"
        aria-expanded={keyboardOpen}
        aria-controls="edit-pdf-phonetic-keyboard-dock"
        onMouseDown={onPanelMouseDown}
        onClick={onShowKeyboard}
      >
        <Keyboard className="h-4 w-4" aria-hidden="true" />
        <span>Show keyboard layout</span>
      </Button>
    </div>
    <label className="relative mb-2 block">
      <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input
        type="search"
        aria-label="Search phonetic guide"
        placeholder="type kh to find it"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-2 text-sm text-foreground"
      />
    </label>
    <div role="tablist" aria-label="Phonetic guide categories" className="mb-2 flex min-w-0 flex-wrap gap-1">
      {categories.map(({ id, label }) => <button
        key={id}
        type="button"
        role="tab"
        aria-selected={category === id}
        aria-controls="phonetic-guide-items"
        onMouseDown={onPanelMouseDown}
        onClick={() => setCategory(id)}
        className={`rounded-md border px-2 py-1 text-xs ${category === id
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-foreground hover:bg-accent'}`}
      >{label}</button>)}
    </div>
    <div id="phonetic-guide-items" role="tabpanel" className="min-w-0">
      {items.length
        ? <MappingChips mappings={items} />
        : <p className="text-xs text-muted-foreground">No matches in {search ? 'the guide' : categories.find(({ id }) => id === category)?.label}.</p>}
    </div>
  </section>;
}
