import { parse } from 'acorn';

/* The AST is walked generically, so nodes are typed loosely on purpose. */
/* eslint-disable @typescript-eslint/no-explicit-any */
type N = any;

export class InstrumentError extends Error {
  constructor(
    message: string,
    public line?: number,
  ) {
    super(message);
  }
}

/** Collect identifier names bound by a pattern (params, destructuring, declarations). */
function patternNames(p: N, out: string[]): void {
  if (!p) return;
  switch (p.type) {
    case 'Identifier':
      out.push(p.name);
      break;
    case 'ObjectPattern':
      p.properties.forEach((x: N) => patternNames(x.type === 'RestElement' ? x.argument : x.value, out));
      break;
    case 'ArrayPattern':
      p.elements.forEach((x: N) => patternNames(x, out));
      break;
    case 'RestElement':
      patternNames(p.argument, out);
      break;
    case 'AssignmentPattern':
      patternNames(p.left, out);
      break;
  }
}

/** `var` declarations hoist to the function scope; scan without entering nested functions. */
function hoistedVars(n: N, out: string[]): void {
  if (!n || typeof n.type !== 'string') return;
  if (/^Function|^Arrow/.test(n.type)) return;
  if (n.type === 'VariableDeclaration' && n.kind === 'var') {
    n.declarations.forEach((d: N) => patternNames(d.id, out));
  }
  for (const k of Object.keys(n)) {
    const c = n[k];
    if (Array.isArray(c)) c.forEach((x) => hoistedVars(x, out));
    else if (c && typeof c.type === 'string') hoistedVars(c, out);
  }
}

/** Block-level declarations directly inside a statement list. */
function lexicalNames(body: N[]): string[] {
  const out: string[] = [];
  for (const s of body) {
    if (s.type === 'VariableDeclaration' && s.kind !== 'var') {
      s.declarations.forEach((d: N) => patternNames(d.id, out));
    } else if (s.type === 'FunctionDeclaration' || s.type === 'ClassDeclaration') {
      out.push(s.id.name);
    }
  }
  return out;
}

const RESERVED = new Set(['arguments', 'eval']);

function snapshotCall(line: number, scopes: string[][]): string {
  const names = [...new Set(scopes.flat())].filter((n) => !RESERVED.has(n) && !n.startsWith('__'));
  const reads = names.map((n) => `try{o[${JSON.stringify(n)}]=${n}}catch(e){}`).join('');
  return `__s(${line},()=>{const o={};${reads}return o});`;
}

export interface Instrumented {
  code: string;
  /** Last top-level function declaration, if any. */
  entry?: string;
}

/** Rewrite source so a snapshot callback runs before every statement. */
export function instrument(source: string): Instrumented {
  let ast: N;
  try {
    ast = parse(source, { ecmaVersion: 2022, sourceType: 'script', locations: true });
  } catch (e) {
    const err = e as { message: string; loc?: { line: number } };
    throw new InstrumentError(err.message.replace(/\s*\(\d+:\d+\)$/, ''), err.loc?.line);
  }

  const edits: { pos: number; text: string; i: number }[] = [];
  const add = (pos: number, text: string) => edits.push({ pos, text, i: edits.length });

  /** Snapshot before each statement, then descend into it. */
  const list = (stmts: N[], scopes: string[][]): void => {
    for (const s of stmts) {
      if (s.type !== 'FunctionDeclaration' && s.type !== 'ClassDeclaration' && !s.directive) {
        add(s.start, snapshotCall(s.loc.start.line, scopes));
      }
      visit(s, scopes);
    }
  };

  /** Body of if/for/while: wrap lone statements in a block so a snapshot fits. */
  const body = (b: N, scopes: string[][]): void => {
    if (!b) return;
    if (b.type === 'BlockStatement') return visit(b, scopes);
    add(b.start, '{' + snapshotCall(b.loc.start.line, scopes));
    visit(b, scopes);
    add(b.end, '}');
  };

  const fn = (f: N, scopes: string[][]): void => {
    const names: string[] = [];
    f.params.forEach((p: N) => patternNames(p, names));
    if (f.type === 'FunctionExpression' && f.id) names.push(f.id.name);
    f.params.forEach((p: N) => expr(p, [...scopes, names])); // default values may hold closures
    if (f.body.type === 'BlockStatement') {
      hoistedVars(f.body, names);
      names.push(...lexicalNames(f.body.body));
      list(f.body.body, [...scopes, names]);
    } else {
      expr(f.body, [...scopes, names]);
    }
  };

  const visit = (s: N, scopes: string[][]): void => {
    switch (s.type) {
      case 'BlockStatement': {
        const inner = [...scopes, lexicalNames(s.body)];
        return list(s.body, inner);
      }
      case 'IfStatement':
        expr(s.test, scopes);
        body(s.consequent, scopes);
        return body(s.alternate, scopes);
      case 'ForStatement': {
        const names: string[] = [];
        if (s.init?.type === 'VariableDeclaration') s.init.declarations.forEach((d: N) => patternNames(d.id, names));
        const inner = [...scopes, names];
        [s.init, s.test, s.update].forEach((x) => x && expr(x, inner));
        return body(s.body, inner);
      }
      case 'ForInStatement':
      case 'ForOfStatement': {
        const names: string[] = [];
        if (s.left.type === 'VariableDeclaration') s.left.declarations.forEach((d: N) => patternNames(d.id, names));
        const inner = [...scopes, names];
        expr(s.right, inner);
        return body(s.body, inner);
      }
      case 'WhileStatement':
      case 'DoWhileStatement':
        expr(s.test, scopes);
        return body(s.body, scopes);
      case 'LabeledStatement':
        return body(s.body, scopes);
      case 'TryStatement': {
        visit(s.block, scopes);
        if (s.handler) {
          const names: string[] = [];
          patternNames(s.handler.param, names);
          visit(s.handler.body, [...scopes, names]);
        }
        if (s.finalizer) visit(s.finalizer, scopes);
        return;
      }
      case 'SwitchStatement': {
        expr(s.discriminant, scopes);
        for (const c of s.cases) {
          if (c.test) expr(c.test, scopes);
          list(c.consequent, [...scopes, lexicalNames(c.consequent)]);
        }
        return;
      }
      case 'FunctionDeclaration':
        return fn(s, scopes);
      default:
        return expr(s, scopes);
    }
  };

  /** Generic walk that only cares about nested functions (closures, methods, callbacks). */
  const expr = (n: N, scopes: string[][]): void => {
    if (!n || typeof n.type !== 'string') return;
    if (n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression' || n.type === 'FunctionDeclaration') {
      return fn(n, scopes);
    }
    for (const k of Object.keys(n)) {
      const c = n[k];
      if (Array.isArray(c)) c.forEach((x) => expr(x, scopes));
      else if (c && typeof c.type === 'string') expr(c, scopes);
    }
  };

  const top: string[] = [];
  hoistedVars(ast, top);
  top.push(...lexicalNames(ast.body));
  list(ast.body, [top]);

  // Apply edits in position order; ties keep insertion order (outer wrappers open first).
  const ordered = [...edits].sort((a, b) => a.pos - b.pos || a.i - b.i);
  let out = '';
  let last = 0;
  for (const e of ordered) {
    out += source.slice(last, e.pos) + e.text;
    last = e.pos;
  }
  out += source.slice(last);

  const decls = ast.body.filter((s: N) => s.type === 'FunctionDeclaration');
  return { code: out, entry: decls.length ? decls[decls.length - 1].id.name : undefined };
}
