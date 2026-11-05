import type { Problem } from '../types';

/** Builds a real node graph from a level-order array (null = missing child). Prepended to every solution. */
const BUILD = `function build(vals) {
  if (vals.length === 0 || vals[0] === null) return null;
  const root = { val: vals[0], left: null, right: null };
  const queue = [root];
  let head = 0;
  let i = 1;
  while (i < vals.length) {
    const node = queue[head];
    head++;
    if (i < vals.length && vals[i] !== null) {
      node.left = { val: vals[i], left: null, right: null };
      queue.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] !== null) {
      node.right = { val: vals[i], left: null, right: null };
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

`;

/** Turns a node graph back into a trimmed level-order array. */
const TOLEVEL = `function toLevel(root) {
  const out = [];
  if (root === null) return out;
  const queue = [root];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head];
    head++;
    if (node === null) {
      out.push(null);
    } else {
      out.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  while (out.length > 0 && out[out.length - 1] === null) {
    out.pop();
  }
  return out;
}

`;

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
/** Right-leaning chain 1 -> 2 -> ... -> n as a level-order array. */
const chain = (n: number) => {
  const a: (number | null)[] = [1];
  for (let i = 2; i <= n; i++) a.push(null, i);
  return a;
};
const SIZES = [4, 8, 16, 32, 48];

export const trees: Problem[] = [
  {
    id: 'maximum-depth-of-binary-tree',
    category: 'trees',
    lc: 'maximum-depth-of-binary-tree',
    n: 104,
    tags: ['dfs', 'bfs'],
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    pattern: 'Tree recursion',
    summary: 'Given a tree, count how many nodes lie on its longest root-to-leaf route.',
    hook: 'Depth of a node = 1 + the deeper of its two children; an empty tree is 0.',
    real: 'Computing nesting depth of a document or UI component tree to cap how far a renderer will recurse.',
    input: '[[3, 9, 20, null, null, 15, 7]]',
    expected: '3',
    cases: [
      { input: '[[]]', expected: '0' },
      { input: '[[1]]', expected: '1' },
      { input: '[[1, null, 2, null, 3]]', expected: '3' },
    ],
    solutions: [
      {
        label: 'Recursive DFS',
        complexity: 'O(n)',
        code:
          BUILD +
          `function depth(node) {
  if (node === null) return 0;
  return 1 + Math.max(depth(node.left), depth(node.right));
}

function maxDepth(vals) {
  const root = build(vals);
  return depth(root);
}`,
      },
      {
        label: 'Level by level (BFS)',
        complexity: 'O(n)',
        code:
          BUILD +
          `function maxDepth(vals) {
  const root = build(vals);
  if (root === null) return 0;
  let level = [root];
  let depth = 0;
  while (level.length > 0) {
    const next = [];
    for (const node of level) {
      if (node.left !== null) {
        next.push(node.left);
      }
      if (node.right !== null) {
        next.push(node.right);
      }
    }
    level = next;
    depth++;
  }
  return depth;
}`,
      },
    ],
  },
  {
    id: 'invert-binary-tree',
    category: 'trees',
    lc: 'invert-binary-tree',
    n: 226,
    tags: ['dfs'],
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    pattern: 'Tree recursion',
    summary: 'Mirror a tree left-to-right and return the mirrored tree as a level-order array.',
    hook: 'Swap the two children at every node; the recursion does the rest.',
    real: 'Flipping a layout tree for right-to-left languages swaps children at every level the same way.',
    input: '[[4, 2, 7, 1, 3, 6, 9]]',
    expected: '[4, 7, 2, 9, 6, 3, 1]',
    cases: [
      { input: '[[]]', expected: '[]' },
      { input: '[[1, 2]]', expected: '[1, null, 2]' },
      { input: '[[2, 1, 3]]', expected: '[2, 3, 1]' },
    ],
    solutions: [
      {
        label: 'Recursive swap',
        complexity: 'O(n)',
        code:
          BUILD +
          TOLEVEL +
          `function invert(node) {
  if (node === null) return null;
  const l = invert(node.left);
  const r = invert(node.right);
  node.left = r;
  node.right = l;
  return node;
}

function invertTree(vals) {
  const root = build(vals);
  return toLevel(invert(root));
}`,
      },
      {
        label: 'Explicit stack',
        complexity: 'O(n)',
        code:
          BUILD +
          TOLEVEL +
          `function invertTree(vals) {
  const root = build(vals);
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node === null) {
      continue;
    }
    const tmp = node.left;
    node.left = node.right;
    node.right = tmp;
    stack.push(node.left);
    stack.push(node.right);
  }
  return toLevel(root);
}`,
      },
    ],
  },
  {
    id: 'same-tree',
    category: 'trees',
    lc: 'same-tree',
    n: 100,
    tags: ['dfs'],
    title: 'Same Tree',
    difficulty: 'Easy',
    pattern: 'Parallel traversal',
    summary:
      'Decide whether two trees have identical shape and identical values at every position.',
    hook: 'Walk both trees in lockstep; any mismatch in shape or value ends it.',
    real: 'Structural diffing of two config or AST trees starts by walking them side by side.',
    input: '[[1, 2, 3], [1, 2, 3]]',
    expected: 'true',
    cases: [
      { input: '[[1, 2], [1, null, 2]]', expected: 'false' },
      { input: '[[], []]', expected: 'true' },
      { input: '[[1, 2, 1], [1, 1, 2]]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Recursive',
        complexity: 'O(n)',
        code:
          BUILD +
          `function same(a, b) {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  if (a.val !== b.val) return false;
  return same(a.left, b.left) && same(a.right, b.right);
}

function isSameTree(p, q) {
  return same(build(p), build(q));
}`,
      },
      {
        label: 'Stack of pairs',
        complexity: 'O(n)',
        code:
          BUILD +
          `function isSameTree(p, q) {
  const stack = [[build(p), build(q)]];
  while (stack.length > 0) {
    const pair = stack.pop();
    const x = pair[0];
    const y = pair[1];
    if (x === null && y === null) {
      continue;
    }
    if (x === null || y === null || x.val !== y.val) {
      return false;
    }
    stack.push([x.left, y.left]);
    stack.push([x.right, y.right]);
  }
  return true;
}`,
      },
    ],
  },
  {
    id: 'symmetric-tree',
    category: 'trees',
    lc: 'symmetric-tree',
    n: 101,
    tags: ['dfs', 'bfs'],
    title: 'Symmetric Tree',
    difficulty: 'Easy',
    pattern: 'Parallel traversal',
    summary: 'Check whether a tree reads the same as its own mirror image.',
    hook: 'Compare left.left with right.right and left.right with right.left.',
    real: 'Validating that a mirrored UI layout really is a faithful reflection of the original.',
    input: '[[1, 2, 2, 3, 4, 4, 3]]',
    expected: 'true',
    cases: [
      { input: '[[1, 2, 2, null, 3, null, 3]]', expected: 'false' },
      { input: '[[1]]', expected: 'true' },
      { input: '[[1, 2, 3]]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Recursive mirror check',
        complexity: 'O(n)',
        code:
          BUILD +
          `function mirror(a, b) {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  if (a.val !== b.val) return false;
  return mirror(a.left, b.right) && mirror(a.right, b.left);
}

function isSymmetric(vals) {
  const root = build(vals);
  if (root === null) return true;
  return mirror(root.left, root.right);
}`,
      },
      {
        label: 'Queue of pairs',
        complexity: 'O(n)',
        code:
          BUILD +
          `function isSymmetric(vals) {
  const root = build(vals);
  if (root === null) return true;
  const queue = [[root.left, root.right]];
  let head = 0;
  while (head < queue.length) {
    const pair = queue[head];
    head++;
    const a = pair[0];
    const b = pair[1];
    if (a === null && b === null) {
      continue;
    }
    if (a === null || b === null || a.val !== b.val) {
      return false;
    }
    queue.push([a.left, b.right]);
    queue.push([a.right, b.left]);
  }
  return true;
}`,
      },
    ],
  },
  {
    id: 'diameter-of-binary-tree',
    category: 'trees',
    lc: 'diameter-of-binary-tree',
    n: 543,
    tags: ['dfs', 'height'],
    title: 'Diameter of Binary Tree',
    difficulty: 'Easy',
    pattern: 'Post-order with side result',
    summary: 'Find the number of edges on the longest path between any two nodes in the tree.',
    hook: 'Best path bending at a node = left height + right height; track it while computing heights.',
    real: 'Estimating the worst-case hop count between two machines in a tree-shaped network.',
    input: '[[1, 2, 3, 4, 5]]',
    expected: '3',
    cases: [
      { input: '[[1]]', expected: '0' },
      { input: '[[1, 2]]', expected: '1' },
      { input: '[[]]', expected: '0' },
      { input: '[[1, null, 2, null, 3]]', expected: '2' },
      { input: '[[1, 2, 3, 4, null, null, 5, 6, null, null, 7]]', expected: '6' },
    ],
    solutions: [
      {
        label: 'Recompute heights per node',
        complexity: 'O(n²)',
        code:
          BUILD +
          `function height(node) {
  if (node === null) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

function widest(node) {
  if (node === null) return 0;
  const through = height(node.left) + height(node.right);
  return Math.max(through, widest(node.left), widest(node.right));
}

function diameter(vals) {
  return widest(build(vals));
}`,
      },
      {
        label: 'Single pass',
        complexity: 'O(n)',
        code:
          BUILD +
          `function depth(node, best) {
  if (node === null) return 0;
  const l = depth(node.left, best);
  const r = depth(node.right, best);
  if (l + r > best[0]) {
    best[0] = l + r;
  }
  return 1 + Math.max(l, r);
}

function diameter(vals) {
  const root = build(vals);
  const best = [0];
  depth(root, best);
  return best[0];
}`,
      },
    ],
    scale: { sizes: SIZES, make: (n) => JSON.stringify([chain(n)]) },
  },
  {
    id: 'balanced-binary-tree',
    category: 'trees',
    lc: 'balanced-binary-tree',
    n: 110,
    tags: ['dfs', 'height'],
    title: 'Balanced Binary Tree',
    difficulty: 'Easy',
    pattern: 'Post-order with early exit',
    summary: 'Check that at every node the two subtree heights differ by at most one.',
    hook: 'Return the height, or -1 as a poison value the moment any subtree is unbalanced.',
    real: 'Self-balancing indexes such as AVL trees rely on exactly this height-difference invariant.',
    input: '[[3, 9, 20, null, null, 15, 7]]',
    expected: 'true',
    cases: [
      { input: '[[1, 2, 2, 3, 3, null, null, 4, 4]]', expected: 'false' },
      { input: '[[]]', expected: 'true' },
      { input: '[[1, 2, null, 3]]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Top-down, heights recomputed',
        complexity: 'O(n log n)',
        code:
          BUILD +
          `function height(node) {
  if (node === null) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

function balancedNaive(node) {
  if (node === null) return true;
  const diff = Math.abs(height(node.left) - height(node.right));
  if (diff > 1) return false;
  return balancedNaive(node.left) && balancedNaive(node.right);
}

function isBalanced(vals) {
  return balancedNaive(build(vals));
}`,
      },
      {
        label: 'Bottom-up with -1 sentinel',
        complexity: 'O(n)',
        code:
          BUILD +
          `function check(node) {
  if (node === null) return 0;
  const l = check(node.left);
  if (l === -1) return -1;
  const r = check(node.right);
  if (r === -1) return -1;
  if (Math.abs(l - r) > 1) return -1;
  return 1 + Math.max(l, r);
}

function isBalanced(vals) {
  return check(build(vals)) !== -1;
}`,
      },
    ],
    scale: { sizes: [4, 8, 16, 32, 63], make: (n) => JSON.stringify([range(n)]) },
  },
  {
    id: 'path-sum',
    category: 'trees',
    lc: 'path-sum',
    n: 112,
    tags: ['dfs'],
    title: 'Path Sum',
    difficulty: 'Easy',
    pattern: 'DFS carrying a remainder',
    summary: 'Does any route from the root down to a leaf add up to the target value?',
    hook: 'Subtract as you descend; at a leaf the remainder must be exactly zero.',
    real: 'Checking whether any chain of costs from a root request down to a leaf service fits a budget.',
    input: '[[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], 22]',
    expected: 'true',
    cases: [
      { input: '[[1, 2, 3], 5]', expected: 'false' },
      { input: '[[], 0]', expected: 'false' },
      { input: '[[1, 2], 1]', expected: 'false' },
      { input: '[[1], 1]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Recursive',
        complexity: 'O(n)',
        code:
          BUILD +
          `function has(node, remaining) {
  if (node === null) return false;
  const rest = remaining - node.val;
  if (node.left === null && node.right === null) return rest === 0;
  return has(node.left, rest) || has(node.right, rest);
}

function hasPathSum(vals, target) {
  return has(build(vals), target);
}`,
      },
      {
        label: 'Stack of (node, remainder)',
        complexity: 'O(n)',
        code:
          BUILD +
          `function hasPathSum(vals, target) {
  const root = build(vals);
  if (root === null) return false;
  const stack = [[root, target]];
  while (stack.length > 0) {
    const item = stack.pop();
    const node = item[0];
    const rest = item[1] - node.val;
    if (node.left === null && node.right === null && rest === 0) {
      return true;
    }
    if (node.left !== null) {
      stack.push([node.left, rest]);
    }
    if (node.right !== null) {
      stack.push([node.right, rest]);
    }
  }
  return false;
}`,
      },
    ],
  },
  {
    id: 'binary-tree-level-order-traversal',
    category: 'trees',
    lc: 'binary-tree-level-order-traversal',
    n: 102,
    tags: ['bfs', 'dfs'],
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    pattern: 'BFS by level',
    summary: 'List the node values row by row, from the top of the tree to the bottom.',
    hook: 'Freeze the queue size at the start of each round; that many nodes make one level.',
    real: 'Rendering an org chart or a file explorer one depth at a time uses breadth-first rows.',
    input: '[[3, 9, 20, null, null, 15, 7]]',
    expected: '[[3], [9, 20], [15, 7]]',
    cases: [
      { input: '[[]]', expected: '[]' },
      { input: '[[1]]', expected: '[[1]]' },
      { input: '[[1, 2, null, 3]]', expected: '[[1], [2], [3]]' },
    ],
    solutions: [
      {
        label: 'DFS bucketed by depth',
        complexity: 'O(n)',
        code:
          BUILD +
          `function walk(node, depth, out) {
  if (node === null) return;
  if (depth === out.length) {
    out.push([]);
  }
  out[depth].push(node.val);
  walk(node.left, depth + 1, out);
  walk(node.right, depth + 1, out);
}

function levelOrder(vals) {
  const out = [];
  walk(build(vals), 0, out);
  return out;
}`,
      },
      {
        label: 'BFS with a queue',
        complexity: 'O(n)',
        code:
          BUILD +
          `function levelOrder(vals) {
  const root = build(vals);
  const out = [];
  if (root === null) return out;
  const queue = [root];
  let head = 0;
  while (head < queue.length) {
    const size = queue.length - head;
    const row = [];
    for (let k = 0; k < size; k++) {
      const node = queue[head];
      head++;
      row.push(node.val);
      if (node.left !== null) {
        queue.push(node.left);
      }
      if (node.right !== null) {
        queue.push(node.right);
      }
    }
    out.push(row);
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'validate-binary-search-tree',
    category: 'trees',
    lc: 'validate-binary-search-tree',
    n: 98,
    tags: ['bst', 'dfs'],
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    pattern: 'DFS with value bounds',
    summary:
      'Decide whether every node is greater than all values on its left and smaller than all on its right.',
    hook: 'Pass a (low, high) window down; each step narrows it. Checking only direct children is a trap.',
    real: 'Database index checkers verify that every key in a B-tree page respects the bounds set by its ancestors.',
    input: '[[5, 1, 4, null, null, 3, 6]]',
    expected: 'false',
    cases: [
      { input: '[[2, 1, 3]]', expected: 'true' },
      { input: '[[]]', expected: 'true' },
      { input: '[[5, 4, 6, null, null, 3, 7]]', expected: 'false' },
      { input: '[[2, 2, 2]]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Scan subtrees at every node',
        complexity: 'O(n²)',
        code:
          BUILD +
          `function allLess(node, limit) {
  if (node === null) return true;
  return node.val < limit && allLess(node.left, limit) && allLess(node.right, limit);
}

function allGreater(node, limit) {
  if (node === null) return true;
  return node.val > limit && allGreater(node.left, limit) && allGreater(node.right, limit);
}

function check(node) {
  if (node === null) return true;
  if (!allLess(node.left, node.val)) return false;
  if (!allGreater(node.right, node.val)) return false;
  return check(node.left) && check(node.right);
}

function isValidBST(vals) {
  return check(build(vals));
}`,
      },
      {
        label: 'Narrowing bounds',
        complexity: 'O(n)',
        code:
          BUILD +
          `function ok(node, lo, hi) {
  if (node === null) return true;
  if (lo !== null && node.val <= lo) return false;
  if (hi !== null && node.val >= hi) return false;
  return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
}

function isValidBST(vals) {
  return ok(build(vals), null, null);
}`,
      },
    ],
    scale: { sizes: SIZES, make: (n) => JSON.stringify([chain(n)]) },
  },
  {
    id: 'lowest-common-ancestor-of-a-binary-search-tree',
    category: 'trees',
    lc: 'lowest-common-ancestor-of-a-binary-search-tree',
    n: 235,
    tags: ['bst'],
    title: 'Lowest Common Ancestor of a BST',
    difficulty: 'Medium',
    pattern: 'BST descent',
    summary:
      'In a search tree, find the deepest node that has both given values beneath it (or equal to it).',
    hook: 'Both values smaller go left, both larger go right; the first split point is the answer.',
    real: 'Finding the nearest shared category of two items in a sorted taxonomy index.',
    input: '[[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8]',
    expected: '6',
    cases: [
      { input: '[[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4]', expected: '2' },
      { input: '[[2, 1], 2, 1]', expected: '2' },
      { input: '[[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 3, 5]', expected: '4' },
    ],
    solutions: [
      {
        label: 'Recursive descent',
        complexity: 'O(h)',
        code:
          BUILD +
          `function lca(node, p, q) {
  if (p < node.val && q < node.val) return lca(node.left, p, q);
  if (p > node.val && q > node.val) return lca(node.right, p, q);
  return node.val;
}

function lowestCommonAncestor(vals, p, q) {
  return lca(build(vals), p, q);
}`,
      },
      {
        label: 'Iterative descent',
        complexity: 'O(h)',
        code:
          BUILD +
          `function lowestCommonAncestor(vals, p, q) {
  let node = build(vals);
  while (node !== null) {
    if (p < node.val && q < node.val) {
      node = node.left;
    } else if (p > node.val && q > node.val) {
      node = node.right;
    } else {
      return node.val;
    }
  }
  return null;
}`,
      },
    ],
  },
  {
    id: 'lowest-common-ancestor-of-a-binary-tree',
    category: 'trees',
    lc: 'lowest-common-ancestor-of-a-binary-tree',
    n: 236,
    tags: ['dfs'],
    title: 'Lowest Common Ancestor of a Binary Tree',
    difficulty: 'Medium',
    pattern: 'Post-order bubbling',
    summary:
      'In an unordered tree, find the deepest node that sits above (or is) both of two given values.',
    hook: 'If one side reports a hit and the other side reports a hit, you are standing on the answer.',
    real: 'Version-control tools find the merge base of two commits by looking for the nearest shared ancestor.',
    input: '[[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1]',
    expected: '3',
    cases: [
      { input: '[[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4]', expected: '5' },
      { input: '[[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 6, 4]', expected: '5' },
      { input: '[[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 7, 8]', expected: '3' },
      { input: '[[1, 2], 1, 2]', expected: '1' },
    ],
    solutions: [
      {
        label: 'Compare two root paths',
        complexity: 'O(n)',
        code:
          BUILD +
          `function findPath(node, target, path) {
  if (node === null) return false;
  path.push(node.val);
  if (node.val === target) return true;
  if (findPath(node.left, target, path) || findPath(node.right, target, path)) {
    return true;
  }
  path.pop();
  return false;
}

function lowestCommonAncestor(vals, p, q) {
  const root = build(vals);
  const pa = [];
  const pb = [];
  findPath(root, p, pa);
  findPath(root, q, pb);
  let i = 0;
  while (i + 1 < pa.length && i + 1 < pb.length && pa[i + 1] === pb[i + 1]) {
    i++;
  }
  return pa[i];
}`,
      },
      {
        label: 'Single recursive pass',
        complexity: 'O(n)',
        code:
          BUILD +
          `function lca(node, p, q) {
  if (node === null) return null;
  if (node.val === p || node.val === q) return node;
  const l = lca(node.left, p, q);
  const r = lca(node.right, p, q);
  if (l !== null && r !== null) return node;
  return l !== null ? l : r;
}

function lowestCommonAncestor(vals, p, q) {
  const found = lca(build(vals), p, q);
  return found.val;
}`,
      },
    ],
  },
  {
    id: 'kth-smallest-element-in-a-bst',
    category: 'trees',
    lc: 'kth-smallest-element-in-a-bst',
    n: 230,
    tags: ['bst', 'inorder'],
    title: 'Kth Smallest Element in a BST',
    difficulty: 'Medium',
    pattern: 'Inorder traversal',
    summary: 'Return the k-th smallest value stored in a search tree (k starts at 1).',
    hook: 'Inorder on a BST yields sorted order, so stop after k visits.',
    real: 'Paging through an ordered index to fetch the k-th row without sorting the whole table.',
    input: '[[3, 1, 4, null, 2], 1]',
    expected: '1',
    cases: [
      { input: '[[5, 3, 6, 2, 4, null, null, 1], 3]', expected: '3' },
      { input: '[[1], 1]', expected: '1' },
      { input: '[[2, 1, 3], 3]', expected: '3' },
    ],
    solutions: [
      {
        label: 'Collect everything, then index',
        complexity: 'O(n)',
        code:
          BUILD +
          `function walk(node, out) {
  if (node === null) return;
  walk(node.left, out);
  out.push(node.val);
  walk(node.right, out);
}

function kthSmallest(vals, k) {
  const out = [];
  walk(build(vals), out);
  return out[k - 1];
}`,
      },
      {
        label: 'Iterative inorder, stop at k',
        complexity: 'O(h + k)',
        code:
          BUILD +
          `function kthSmallest(vals, k) {
  let node = build(vals);
  const stack = [];
  let count = 0;
  while (node !== null || stack.length > 0) {
    while (node !== null) {
      stack.push(node);
      node = node.left;
    }
    node = stack.pop();
    count++;
    if (count === k) {
      return node.val;
    }
    node = node.right;
  }
  return null;
}`,
      },
    ],
  },
  {
    id: 'binary-tree-right-side-view',
    category: 'trees',
    lc: 'binary-tree-right-side-view',
    n: 199,
    tags: ['bfs', 'dfs'],
    title: 'Binary Tree Right Side View',
    difficulty: 'Medium',
    pattern: 'BFS by level',
    summary: 'Imagine standing to the right of the tree and list the value you see at each depth.',
    hook: 'The last node of every level is visible, or visit right-first and keep the first per depth.',
    real: 'Picking one representative per layer, such as the front-most element in a stacked rendering tree.',
    input: '[[1, 2, 3, null, 5, null, 4]]',
    expected: '[1, 3, 4]',
    cases: [
      { input: '[[]]', expected: '[]' },
      { input: '[[1, null, 3]]', expected: '[1, 3]' },
      { input: '[[1, 2]]', expected: '[1, 2]' },
      { input: '[[1, 2, 3, 4]]', expected: '[1, 3, 4]' },
    ],
    solutions: [
      {
        label: 'BFS, keep last of each level',
        complexity: 'O(n)',
        code:
          BUILD +
          `function rightSideView(vals) {
  const root = build(vals);
  const out = [];
  if (root === null) return out;
  let level = [root];
  while (level.length > 0) {
    out.push(level[level.length - 1].val);
    const next = [];
    for (const node of level) {
      if (node.left !== null) {
        next.push(node.left);
      }
      if (node.right !== null) {
        next.push(node.right);
      }
    }
    level = next;
  }
  return out;
}`,
      },
      {
        label: 'DFS, right child first',
        complexity: 'O(n)',
        code:
          BUILD +
          `function dfs(node, depth, out) {
  if (node === null) return;
  if (depth === out.length) {
    out.push(node.val);
  }
  dfs(node.right, depth + 1, out);
  dfs(node.left, depth + 1, out);
}

function rightSideView(vals) {
  const out = [];
  dfs(build(vals), 0, out);
  return out;
}`,
      },
    ],
  },
  {
    id: 'binary-tree-inorder-traversal',
    category: 'trees',
    lc: 'binary-tree-inorder-traversal',
    n: 94,
    tags: ['dfs', 'stack'],
    title: 'Binary Tree Inorder Traversal',
    difficulty: 'Easy',
    pattern: 'Inorder traversal',
    summary: 'Return the node values in left, node, right order.',
    hook: 'Push the whole left spine, pop to visit, then move to the right child.',
    real: 'Walking a sorted index in key order, for example to stream out range-query results.',
    input: '[[1, null, 2, 3]]',
    expected: '[1, 3, 2]',
    cases: [
      { input: '[[]]', expected: '[]' },
      { input: '[[1]]', expected: '[1]' },
      { input: '[[2, 1, 3]]', expected: '[1, 2, 3]' },
    ],
    solutions: [
      {
        label: 'Recursive',
        complexity: 'O(n)',
        code:
          BUILD +
          `function walk(node, out) {
  if (node === null) return;
  walk(node.left, out);
  out.push(node.val);
  walk(node.right, out);
}

function inorder(vals) {
  const out = [];
  walk(build(vals), out);
  return out;
}`,
      },
      {
        label: 'Iterative with a stack',
        complexity: 'O(n)',
        code:
          BUILD +
          `function inorder(vals) {
  let node = build(vals);
  const stack = [];
  const out = [];
  while (node !== null || stack.length > 0) {
    while (node !== null) {
      stack.push(node);
      node = node.left;
    }
    node = stack.pop();
    out.push(node.val);
    node = node.right;
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'subtree-of-another-tree',
    category: 'trees',
    lc: 'subtree-of-another-tree',
    n: 572,
    tags: ['dfs', 'serialization'],
    title: 'Subtree of Another Tree',
    difficulty: 'Easy',
    pattern: 'Tree matching',
    summary:
      'Does the second tree appear, exactly, as the full subtree hanging off some node of the first?',
    hook: 'Either test sameness at every node, or flatten both trees to strings with null markers and search.',
    real: 'Detecting duplicated subtrees in a syntax tree by comparing their serialized forms.',
    input: '[[3, 4, 5, 1, 2], [4, 1, 2]]',
    expected: 'true',
    cases: [
      { input: '[[3, 4, 5, 1, 2, null, null, null, null, 0], [4, 1, 2]]', expected: 'false' },
      { input: '[[1], [1]]', expected: 'true' },
      { input: '[[1, 1], [1]]', expected: 'true' },
      { input: '[[1, 2], [1]]', expected: 'false' },
      { input: '[[], [1]]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Same-tree test at every node',
        complexity: 'O(n·m)',
        code:
          BUILD +
          `function same(a, b) {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  if (a.val !== b.val) return false;
  return same(a.left, b.left) && same(a.right, b.right);
}

function contains(node, sub) {
  if (node === null) return false;
  if (same(node, sub)) return true;
  return contains(node.left, sub) || contains(node.right, sub);
}

function isSubtree(root, subRoot) {
  const sub = build(subRoot);
  if (sub === null) return true;
  return contains(build(root), sub);
}`,
      },
      {
        label: 'Serialize and search',
        complexity: 'O(n·m)',
        code:
          BUILD +
          `function ser(node) {
  if (node === null) return ',#';
  return ',' + node.val + ser(node.left) + ser(node.right);
}

function isSubtree(root, subRoot) {
  const sub = build(subRoot);
  if (sub === null) return true;
  const text = ser(build(root));
  const needle = ser(sub);
  return text.includes(needle);
}`,
      },
    ],
  },
  {
    id: 'count-good-nodes-in-binary-tree',
    category: 'trees',
    lc: 'count-good-nodes-in-binary-tree',
    n: 1448,
    tags: ['dfs'],
    title: 'Count Good Nodes in Binary Tree',
    difficulty: 'Medium',
    pattern: 'DFS carrying state',
    summary:
      'Count nodes whose value is at least as large as every value on the path from the root to them.',
    hook: 'Carry the running maximum downward; a node is good when it ties or beats it.',
    real: 'Spotting new record highs along a chain of events, like the peak latency seen so far on a request path.',
    input: '[[3, 1, 4, 3, null, 1, 5]]',
    expected: '4',
    cases: [
      { input: '[[3, 3, null, 4, 2]]', expected: '3' },
      { input: '[[1]]', expected: '1' },
      { input: '[[]]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Recursive with running max',
        complexity: 'O(n)',
        code:
          BUILD +
          `function walk(node, max) {
  if (node === null) return 0;
  const good = node.val >= max ? 1 : 0;
  const m = Math.max(max, node.val);
  return good + walk(node.left, m) + walk(node.right, m);
}

function goodNodes(vals) {
  const root = build(vals);
  if (root === null) return 0;
  return walk(root, root.val);
}`,
      },
      {
        label: 'Stack of (node, max)',
        complexity: 'O(n)',
        code:
          BUILD +
          `function goodNodes(vals) {
  const root = build(vals);
  if (root === null) return 0;
  const stack = [[root, root.val]];
  let count = 0;
  while (stack.length > 0) {
    const item = stack.pop();
    const node = item[0];
    const max = item[1];
    if (node.val >= max) {
      count++;
    }
    const m = Math.max(max, node.val);
    if (node.left !== null) {
      stack.push([node.left, m]);
    }
    if (node.right !== null) {
      stack.push([node.right, m]);
    }
  }
  return count;
}`,
      },
    ],
  },
  {
    id: 'binary-tree-maximum-path-sum',
    category: 'trees',
    lc: 'binary-tree-maximum-path-sum',
    n: 124,
    tags: ['dfs', 'post-order'],
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    pattern: 'Post-order with side result',
    summary:
      'Find the largest total along any path that follows parent-child links, starting and ending anywhere.',
    hook: 'Each node reports its best downward gain (never below 0) while updating a global best bend.',
    real: 'Finding the most profitable stretch of a hierarchy, such as the best-scoring chain in a decision tree.',
    input: '[[-10, 9, 20, null, null, 15, 7]]',
    expected: '42',
    cases: [
      { input: '[[1, 2, 3]]', expected: '6' },
      { input: '[[-3]]', expected: '-3' },
      { input: '[[2, -1]]', expected: '2' },
      { input: '[[1, -2, 3]]', expected: '4' },
    ],
    solutions: [
      {
        label: 'Recompute gains at every node',
        complexity: 'O(n²)',
        code:
          BUILD +
          `function gain(node) {
  if (node === null) return 0;
  const l = gain(node.left);
  const r = gain(node.right);
  return Math.max(0, node.val + Math.max(l, r));
}

function bestAll(node) {
  if (node === null) return -Infinity;
  const here = node.val + gain(node.left) + gain(node.right);
  return Math.max(here, bestAll(node.left), bestAll(node.right));
}

function maxPathSum(vals) {
  return bestAll(build(vals));
}`,
      },
      {
        label: 'Single pass',
        complexity: 'O(n)',
        code:
          BUILD +
          `function gain(node, best) {
  if (node === null) return 0;
  const l = Math.max(0, gain(node.left, best));
  const r = Math.max(0, gain(node.right, best));
  const here = node.val + l + r;
  if (here > best[0]) {
    best[0] = here;
  }
  return node.val + Math.max(l, r);
}

function maxPathSum(vals) {
  const root = build(vals);
  const best = [root.val];
  gain(root, best);
  return best[0];
}`,
      },
    ],
    scale: { sizes: SIZES, make: (n) => JSON.stringify([chain(n)]) },
  },
  {
    id: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    category: 'trees',
    lc: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    n: 105,
    tags: ['dfs', 'hash map'],
    title: 'Construct Tree from Preorder and Inorder',
    difficulty: 'Medium',
    pattern: 'Divide and conquer',
    summary:
      'Rebuild a tree from its preorder and inorder listings and return it as a level-order array.',
    hook: 'Preorder names the root; its position in inorder splits left from right. Index that position once.',
    real: 'Reconstructing a tree from two serialized traversals, as some storage formats and debuggers do.',
    input: '[[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]]',
    expected: '[3, 9, 20, null, null, 15, 7]',
    cases: [
      { input: '[[1], [1]]', expected: '[1]' },
      { input: '[[1, 2], [2, 1]]', expected: '[1, 2]' },
      { input: '[[1, 2], [1, 2]]', expected: '[1, null, 2]' },
      { input: '[[], []]', expected: '[]' },
    ],
    solutions: [
      {
        label: 'Slice arrays and scan for the root',
        complexity: 'O(n²)',
        code:
          TOLEVEL +
          `function indexOfVal(arr, x) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === x) return i;
  }
  return -1;
}

function make(pre, ino) {
  if (pre.length === 0) return null;
  const rootVal = pre[0];
  const k = indexOfVal(ino, rootVal);
  const left = make(pre.slice(1, k + 1), ino.slice(0, k));
  const right = make(pre.slice(k + 1), ino.slice(k + 1));
  return { val: rootVal, left: left, right: right };
}

function buildTree(preorder, inorder) {
  return toLevel(make(preorder, inorder));
}`,
      },
      {
        label: 'Index map and moving pointer',
        complexity: 'O(n)',
        code:
          TOLEVEL +
          `function make(state, lo, hi) {
  if (lo > hi) return null;
  const rootVal = state.pre[state.next];
  state.next++;
  const k = state.index.get(rootVal);
  const left = make(state, lo, k - 1);
  const right = make(state, k + 1, hi);
  return { val: rootVal, left: left, right: right };
}

function buildTree(preorder, inorder) {
  const index = new Map();
  for (let i = 0; i < inorder.length; i++) {
    index.set(inorder[i], i);
  }
  const state = { pre: preorder, next: 0, index: index };
  return toLevel(make(state, 0, inorder.length - 1));
}`,
      },
    ],
    scale: {
      sizes: SIZES,
      make: (n) => JSON.stringify([range(n), range(n).reverse()]),
    },
  },
];
