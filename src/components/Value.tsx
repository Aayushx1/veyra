import type { V } from '../core/types';
import { show } from '../core/serialize';
import { changedCells, isArr, pointersFor, type ArrV } from '../lib/view';

const scalar = (v: V) => show(v);

function Cells({
  arr,
  prev,
  pointers,
}: {
  arr: ArrV;
  prev?: V;
  pointers?: Record<number, string[]>;
}) {
  const changed = changedCells(prev, arr);
  return (
    <ol className="cells" aria-label={`array of ${arr.items.length + arr.more} items`}>
      {arr.items.map((x, i) => (
        <li key={i} className={changed.has(i) ? 'cell changed' : 'cell'}>
          <span className="ptrs" aria-hidden={!pointers?.[i]}>
            {pointers?.[i]?.join(' ') ?? ''}
          </span>
          <span className="cellval">{typeof x === 'object' && x ? show(x) : scalar(x)}</span>
          <span className="idx">{i}</span>
        </li>
      ))}
      {arr.more > 0 && <li className="cell more">+{arr.more}</li>}
    </ol>
  );
}

/** Render a snapshot. Top-level arrays get pointer overlays and change highlighting. */
export function Value({
  v,
  prev,
  vars,
  name,
}: {
  v: V;
  prev?: V;
  vars?: Record<string, V>;
  name?: string;
}) {
  if (isArr(v)) {
    const pointers = vars && name ? pointersFor(v, vars, name) : undefined;
    return <Cells arr={v} prev={prev} pointers={pointers} />;
  }
  if (typeof v === 'object' && v !== null) {
    if (v.t === 'set') {
      return (
        <ul className="chips" aria-label="set">
          {v.items.map((x, i) => (
            <li key={i}>{show(x)}</li>
          ))}
          {v.more > 0 && <li>+{v.more}</li>}
          {v.items.length === 0 && <li className="empty">empty</li>}
        </ul>
      );
    }
    if (v.t === 'map' || v.t === 'obj') {
      const rows: [string, V][] =
        v.t === 'map' ? v.entries.map(([k, x]) => [show(k), x]) : v.entries;
      return (
        <table className="kv" aria-label={v.t === 'map' ? 'map' : 'object'}>
          <tbody>
            {rows.map(([k, x], i) => (
              <tr key={i}>
                <th scope="row">{k}</th>
                <td>{show(x)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="empty">empty</td>
              </tr>
            )}
            {v.more > 0 && (
              <tr>
                <td className="empty">+{v.more} more</td>
              </tr>
            )}
          </tbody>
        </table>
      );
    }
  }
  return <code className="scalar">{scalar(v)}</code>;
}
