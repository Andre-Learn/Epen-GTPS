'use client';

import { useId, useState } from 'react';
import styles from './admin.module.css';

export function Field({ label, hint, error, wide, htmlFor, children }) {
  return (
    <div className={`${styles.field}${wide ? ` ${styles.wide}` : ''}${error ? ` ${styles.invalid}` : ''}`}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error
        ? <div className={styles.fieldError} role="alert">{error}</div>
        : hint ? <div className={styles.fieldHint}>{hint}</div> : null}
    </div>
  );
}

export function TextField({ label, value, onChange, error, hint, placeholder, multiline = false, rows = 3, wide, type = 'text', mono }) {
  const id = useId();
  const common = {
    id,
    value: value ?? '',
    placeholder,
    'aria-invalid': error ? 'true' : undefined,
    onChange: event => onChange(event.target.value),
    className: mono ? styles.mono : undefined
  };
  return (
    <Field label={label} hint={hint} error={error} wide={wide || multiline} htmlFor={id}>
      {multiline
        ? <textarea rows={rows} spellCheck={false} {...common} />
        : <input type={type} autoComplete="off" spellCheck={false} {...common} />}
    </Field>
  );
}

export function NumberField({ label, value, onChange, error, hint, min = 0, max }) {
  const id = useId();
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id}>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value ?? ''}
        aria-invalid={error ? 'true' : undefined}
        onChange={event => onChange(event.target.value === '' ? '' : Number(event.target.value))}
      />
    </Field>
  );
}

export function SelectField({ label, value, onChange, options, hint }) {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <select id={id} value={value} onChange={event => onChange(event.target.value)}>
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </Field>
  );
}

export function CheckField({ label, checked, onChange, hint }) {
  const id = useId();
  return (
    <div className={`${styles.wide} ${styles.checkWrap}`}>
      <label className={styles.check} htmlFor={id}>
        <input id={id} type="checkbox" checked={Boolean(checked)} onChange={event => onChange(event.target.checked)} />
        <span>{label}</span>
      </label>
      {hint ? <div className={styles.fieldHint}>{hint}</div> : null}
    </div>
  );
}

export function Section({ title, hint, children }) {
  return (
    <section className={styles.section}>
      {title ? (
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {hint ? <div className={styles.hint}>{hint}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export const Grid = ({ children }) => <div className={styles.grid}>{children}</div>;

// Daftar item yang bisa ditambah, dihapus, dan diurutkan. Tiap item berupa <details>.
export function ListEditor({ items, onChange, makeItem, itemTitle, itemMeta, renderItem, addLabel, emptyText, noun }) {
  const [justAdded, setJustAdded] = useState(-1);

  const replace = (index, next) => onChange(items.map((item, i) => (i === index ? next : item)));
  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setJustAdded(-1);
    onChange(copy);
  };
  const remove = index => {
    if (!window.confirm(`Hapus ${noun} “${itemTitle(items[index], index)}”?`)) return;
    setJustAdded(-1);
    onChange(items.filter((_, i) => i !== index));
  };
  const add = () => {
    setJustAdded(items.length);
    onChange([...items, makeItem(items)]);
  };

  return (
    <div>
      {items.length === 0 ? <div className={styles.empty}>{emptyText}</div> : null}
      {items.map((item, index) => (
        // key = posisi, bukan isi: mengetik di kolom ID tidak boleh membuat item dibuat ulang.
        <details key={index} className={styles.item} open={index === justAdded ? true : undefined}>
          <summary>
            <span className={styles.itemTitle}>{itemTitle(item, index) || `${noun} ${index + 1}`}</span>
            {itemMeta ? <span className={styles.itemMeta}>{itemMeta(item)}</span> : null}
          </summary>
          <div className={styles.itemBody}>
            <div className={styles.itemActions}>
              <button type="button" className={`${styles.ghost} ${styles.btnSm}`} onClick={() => move(index, -1)} disabled={index === 0}>↑ Naik</button>
              <button type="button" className={`${styles.ghost} ${styles.btnSm}`} onClick={() => move(index, 1)} disabled={index === items.length - 1}>↓ Turun</button>
              <button type="button" className={`${styles.danger} ${styles.btnSm}`} onClick={() => remove(index)}>Hapus</button>
            </div>
            <Grid>{renderItem(item, next => replace(index, next), index)}</Grid>
          </div>
        </details>
      ))}
      <button type="button" className={styles.ghost} onClick={add}>+ {addLabel}</button>
    </div>
  );
}
