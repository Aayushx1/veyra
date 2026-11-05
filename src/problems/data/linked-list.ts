import type { Problem } from '../types';

// Shared helper text, prepended to each solution so every code string is self-contained.
const BUILD = `function build(vals) {
  var dummy = { val: 0, next: null };
  var tail = dummy;
  for (var i = 0; i < vals.length; i++) {
    tail.next = { val: vals[i], next: null };
    tail = tail.next;
  }
  return dummy.next;
}

`;

const TO_ARRAY = `function toArray(head) {
  var out = [];
  while (head !== null) {
    out.push(head.val);
    head = head.next;
  }
  return out;
}

`;

const H = BUILD + TO_ARRAY;

const BUILD_CYCLE = `function build(vals, pos) {
  var dummy = { val: 0, next: null };
  var tail = dummy;
  var nodes = [];
  for (var i = 0; i < vals.length; i++) {
    tail.next = { val: vals[i], next: null };
    tail = tail.next;
    nodes.push(tail);
  }
  if (pos >= 0 && pos < nodes.length) tail.next = nodes[pos];
  return dummy.next;
}

`;

const BUILD_ONTO = `function build(vals, rest) {
  var dummy = { val: 0, next: null };
  var tail = dummy;
  for (var i = 0; i < vals.length; i++) {
    tail.next = { val: vals[i], next: null };
    tail = tail.next;
  }
  tail.next = rest;
  return dummy.next;
}

`;

export const linkedList: Problem[] = [
  {
    id: 'reverse-linked-list',
    category: 'linked-list',
    lc: 'reverse-linked-list',
    n: 206,
    tags: ['pointers', 'in-place'],
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    pattern: 'Pointer reversal',
    summary: 'Flip the direction of every link so the last node becomes the head.',
    hook: 'Remember the next node before you overwrite the link that leads to it.',
    real: 'Undo stacks and rollback logs are replayed by walking a chain of records backwards.',
    input: '[[1, 2, 3, 4, 5]]',
    expected: '[5, 4, 3, 2, 1]',
    cases: [
      { input: '[[]]', expected: '[]' },
      { input: '[[7]]', expected: '[7]' },
      { input: '[[1, 2]]', expected: '[2, 1]' },
    ],
    solutions: [
      {
        label: 'Copy values, write back reversed',
        complexity: 'O(n)',
        code:
          H +
          `function reverseList(vals) {
  var head = build(vals);
  var stack = [];
  var cur = head;
  while (cur !== null) {
    stack.push(cur.val);
    cur = cur.next;
  }
  cur = head;
  while (cur !== null) {
    cur.val = stack.pop();
    cur = cur.next;
  }
  return toArray(head);
}`,
      },
      {
        label: 'Reverse the links in place',
        complexity: 'O(n)',
        code:
          H +
          `function reverseList(vals) {
  var head = build(vals);
  var prev = null;
  var cur = head;
  while (cur !== null) {
    var next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return toArray(prev);
}`,
      },
    ],
  },
  {
    id: 'merge-two-sorted-lists',
    category: 'linked-list',
    lc: 'merge-two-sorted-lists',
    n: 21,
    tags: ['merge', 'dummy node'],
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    pattern: 'Dummy node merge',
    summary: 'Splice two ascending lists into a single ascending list.',
    hook: 'A dummy head removes the special case for the first node; always take the smaller front.',
    real: 'External merge sort and LSM-tree compaction merge sorted runs exactly this way.',
    input: '[[1, 2, 4], [1, 3, 4]]',
    expected: '[1, 1, 2, 3, 4, 4]',
    cases: [
      { input: '[[], []]', expected: '[]' },
      { input: '[[], [0]]', expected: '[0]' },
      { input: '[[5, 6], [1, 2, 9]]', expected: '[1, 2, 5, 6, 9]' },
    ],
    solutions: [
      {
        label: 'Collect, sort, rebuild',
        complexity: 'O((n+m) log(n+m))',
        code:
          H +
          `function mergeTwoLists(a, b) {
  var x = build(a);
  var y = build(b);
  var all = [];
  while (x !== null) {
    all.push(x.val);
    x = x.next;
  }
  while (y !== null) {
    all.push(y.val);
    y = y.next;
  }
  all.sort(function (p, q) {
    return p - q;
  });
  return toArray(build(all));
}`,
      },
      {
        label: 'Two-pointer splice',
        complexity: 'O(n+m)',
        code:
          H +
          `function mergeTwoLists(a, b) {
  var x = build(a);
  var y = build(b);
  var dummy = { val: 0, next: null };
  var tail = dummy;
  while (x !== null && y !== null) {
    if (x.val <= y.val) {
      tail.next = x;
      x = x.next;
    } else {
      tail.next = y;
      y = y.next;
    }
    tail = tail.next;
  }
  tail.next = x !== null ? x : y;
  return toArray(dummy.next);
}`,
      },
    ],
  },
  {
    id: 'linked-list-cycle',
    category: 'linked-list',
    lc: 'linked-list-cycle',
    n: 141,
    tags: ['fast slow', 'cycle'],
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    pattern: 'Fast and slow pointers',
    summary: 'Decide whether following next links from the head ever loops back.',
    hook: 'A runner moving twice as fast must lap the walker if the track is a loop.',
    real: 'Garbage collectors and dependency resolvers need loop detection without extra memory.',
    input: '[[3, 2, 0, 4], 1]',
    expected: 'true',
    cases: [
      { input: '[[1, 2], -1]', expected: 'false' },
      { input: '[[1], 0]', expected: 'true' },
      { input: '[[], -1]', expected: 'false' },
      { input: '[[1, 2, 3, 4, 5], 4]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Remember visited nodes',
        complexity: 'O(n)',
        code:
          BUILD_CYCLE +
          `function hasCycle(vals, pos) {
  var head = build(vals, pos);
  var seen = new Set();
  var cur = head;
  while (cur !== null) {
    if (seen.has(cur)) return true;
    seen.add(cur);
    cur = cur.next;
  }
  return false;
}`,
      },
      {
        label: 'Floyd tortoise and hare',
        complexity: 'O(n)',
        code:
          BUILD_CYCLE +
          `function hasCycle(vals, pos) {
  var head = build(vals, pos);
  var slow = head;
  var fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
      },
    ],
  },
  {
    id: 'middle-of-the-linked-list',
    category: 'linked-list',
    lc: 'middle-of-the-linked-list',
    n: 876,
    tags: ['fast slow'],
    title: 'Middle of the Linked List',
    difficulty: 'Easy',
    pattern: 'Fast and slow pointers',
    summary:
      'Return the values from the middle node to the end (second middle if the length is even).',
    hook: 'When the fast pointer finishes, the slow pointer is halfway.',
    real: 'Splitting a stream or list in half for divide-and-conquer when its length is unknown.',
    input: '[[1, 2, 3, 4, 5]]',
    expected: '[3, 4, 5]',
    cases: [
      { input: '[[1, 2, 3, 4, 5, 6]]', expected: '[4, 5, 6]' },
      { input: '[[1]]', expected: '[1]' },
      { input: '[[9, 8]]', expected: '[8]' },
    ],
    solutions: [
      {
        label: 'Count, then walk half',
        complexity: 'O(n)',
        code:
          H +
          `function middleNode(vals) {
  var head = build(vals);
  var n = 0;
  var cur = head;
  while (cur !== null) {
    n++;
    cur = cur.next;
  }
  cur = head;
  for (var i = 0; i < Math.floor(n / 2); i++) {
    cur = cur.next;
  }
  return toArray(cur);
}`,
      },
      {
        label: 'Fast and slow pointers',
        complexity: 'O(n)',
        code:
          H +
          `function middleNode(vals) {
  var head = build(vals);
  var slow = head;
  var fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return toArray(slow);
}`,
      },
    ],
  },
  {
    id: 'remove-nth-node-from-end-of-list',
    category: 'linked-list',
    lc: 'remove-nth-node-from-end-of-list',
    n: 19,
    tags: ['two pointers', 'dummy node'],
    title: 'Remove Nth Node From End',
    difficulty: 'Medium',
    pattern: 'Gap between two pointers',
    summary: 'Delete the node that is n positions from the tail and return the remaining values.',
    hook: 'Keep a gap of n between two pointers; when the front hits the end, the back is at the target.',
    real: 'Trimming the last n entries of a log or history buffer when you can only move forward.',
    input: '[[1, 2, 3, 4, 5], 2]',
    expected: '[1, 2, 3, 5]',
    cases: [
      { input: '[[1], 1]', expected: '[]' },
      { input: '[[1, 2], 1]', expected: '[1]' },
      { input: '[[1, 2], 2]', expected: '[2]' },
    ],
    solutions: [
      {
        label: 'Two passes (count length)',
        complexity: 'O(n)',
        code:
          H +
          `function removeNthFromEnd(vals, n) {
  var head = build(vals);
  var len = 0;
  var cur = head;
  while (cur !== null) {
    len++;
    cur = cur.next;
  }
  var dummy = { val: 0, next: head };
  var prev = dummy;
  for (var i = 0; i < len - n; i++) {
    prev = prev.next;
  }
  prev.next = prev.next.next;
  return toArray(dummy.next);
}`,
      },
      {
        label: 'One pass with a gap',
        complexity: 'O(n)',
        code:
          H +
          `function removeNthFromEnd(vals, n) {
  var head = build(vals);
  var dummy = { val: 0, next: head };
  var fast = dummy;
  var slow = dummy;
  for (var i = 0; i < n; i++) {
    fast = fast.next;
  }
  while (fast.next !== null) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return toArray(dummy.next);
}`,
      },
    ],
  },
  {
    id: 'palindrome-linked-list',
    category: 'linked-list',
    lc: 'palindrome-linked-list',
    n: 234,
    tags: ['fast slow', 'reverse'],
    title: 'Palindrome Linked List',
    difficulty: 'Easy',
    pattern: 'Reverse second half',
    summary: 'Check whether the values read the same from both ends.',
    hook: 'Find the middle, flip the back half, then compare the two halves walking inward.',
    real: 'Symmetry checks on streamed data when you cannot afford a full copy.',
    input: '[[1, 2, 2, 1]]',
    expected: 'true',
    cases: [
      { input: '[[1, 2]]', expected: 'false' },
      { input: '[[1]]', expected: 'true' },
      { input: '[[1, 2, 3, 2, 1]]', expected: 'true' },
      { input: '[[1, 2, 3, 1]]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Copy to array, compare ends',
        complexity: 'O(n)',
        code:
          H +
          `function isPalindrome(vals) {
  var head = build(vals);
  var arr = toArray(head);
  var i = 0;
  var j = arr.length - 1;
  while (i < j) {
    if (arr[i] !== arr[j]) return false;
    i++;
    j--;
  }
  return true;
}`,
      },
      {
        label: 'Reverse the second half in place',
        complexity: 'O(n)',
        code:
          H +
          `function isPalindrome(vals) {
  var head = build(vals);
  var slow = head;
  var fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  var prev = null;
  while (slow !== null) {
    var next = slow.next;
    slow.next = prev;
    prev = slow;
    slow = next;
  }
  var a = head;
  var b = prev;
  while (b !== null) {
    if (a.val !== b.val) return false;
    a = a.next;
    b = b.next;
  }
  return true;
}`,
      },
    ],
  },
  {
    id: 'remove-duplicates-from-sorted-list',
    category: 'linked-list',
    lc: 'remove-duplicates-from-sorted-list',
    n: 83,
    tags: ['sorted'],
    title: 'Remove Duplicates From Sorted List',
    difficulty: 'Easy',
    pattern: 'Skip equal neighbors',
    summary: 'In a sorted list, keep only one node for each distinct value.',
    hook: 'Equal values sit side by side, so compare a node only with its next.',
    real: 'Deduplicating a sorted stream, such as consecutive repeated log lines.',
    input: '[[1, 1, 2, 3, 3]]',
    expected: '[1, 2, 3]',
    cases: [
      { input: '[[]]', expected: '[]' },
      { input: '[[1, 1, 1]]', expected: '[1]' },
      { input: '[[1, 2]]', expected: '[1, 2]' },
    ],
    solutions: [
      {
        label: 'Collect distinct values, rebuild',
        complexity: 'O(n)',
        code:
          H +
          `function deleteDuplicates(vals) {
  var head = build(vals);
  var kept = [];
  var cur = head;
  while (cur !== null) {
    if (kept.length === 0 || kept[kept.length - 1] !== cur.val) {
      kept.push(cur.val);
    }
    cur = cur.next;
  }
  return toArray(build(kept));
}`,
      },
      {
        label: 'Unlink duplicates in place',
        complexity: 'O(n)',
        code:
          H +
          `function deleteDuplicates(vals) {
  var head = build(vals);
  var cur = head;
  while (cur !== null && cur.next !== null) {
    if (cur.val === cur.next.val) {
      cur.next = cur.next.next;
    } else {
      cur = cur.next;
    }
  }
  return toArray(head);
}`,
      },
    ],
  },
  {
    id: 'add-two-numbers',
    category: 'linked-list',
    lc: 'add-two-numbers',
    n: 2,
    tags: ['math', 'carry'],
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    pattern: 'Digit-by-digit carry',
    summary:
      'Each list holds a number with the least significant digit first; produce the digits of their sum.',
    hook: 'Add column by column, carrying the overflow into the next node.',
    real: 'Big-integer libraries add arbitrarily long numbers limb by limb with a carry.',
    input: '[[2, 4, 3], [5, 6, 4]]',
    expected: '[7, 0, 8]',
    cases: [
      { input: '[[0], [0]]', expected: '[0]' },
      { input: '[[9, 9, 9], [1]]', expected: '[0, 0, 0, 1]' },
      { input: '[[5], [5]]', expected: '[0, 1]' },
    ],
    solutions: [
      {
        label: 'Convert to numbers, add, split',
        complexity: 'O(n+m)',
        code:
          H +
          `function addTwoNumbers(a, b) {
  var x = build(a);
  var y = build(b);
  var na = 0;
  var nb = 0;
  var mul = 1;
  while (x !== null) {
    na += x.val * mul;
    mul *= 10;
    x = x.next;
  }
  mul = 1;
  while (y !== null) {
    nb += y.val * mul;
    mul *= 10;
    y = y.next;
  }
  var sum = na + nb;
  var digits = [];
  if (sum === 0) digits.push(0);
  while (sum > 0) {
    digits.push(sum % 10);
    sum = (sum - (sum % 10)) / 10;
  }
  return toArray(build(digits));
}`,
      },
      {
        label: 'Single pass with carry',
        complexity: 'O(max(n, m))',
        code:
          H +
          `function addTwoNumbers(a, b) {
  var x = build(a);
  var y = build(b);
  var dummy = { val: 0, next: null };
  var tail = dummy;
  var carry = 0;
  while (x !== null || y !== null || carry > 0) {
    var s = carry;
    if (x !== null) {
      s += x.val;
      x = x.next;
    }
    if (y !== null) {
      s += y.val;
      y = y.next;
    }
    tail.next = { val: s % 10, next: null };
    tail = tail.next;
    carry = s >= 10 ? 1 : 0;
  }
  return toArray(dummy.next);
}`,
      },
    ],
  },
  {
    id: 'reorder-list',
    category: 'linked-list',
    lc: 'reorder-list',
    n: 143,
    tags: ['fast slow', 'reverse', 'merge'],
    title: 'Reorder List',
    difficulty: 'Medium',
    pattern: 'Split, reverse, interleave',
    summary: 'Rearrange the list as first, last, second, second-to-last, and so on.',
    hook: 'Three classics in a row: find the middle, reverse the back half, weave the halves together.',
    real: 'Interleaving two ordered sources, like alternating items from the head and tail of a queue.',
    input: '[[1, 2, 3, 4]]',
    expected: '[1, 4, 2, 3]',
    cases: [
      { input: '[[1, 2, 3, 4, 5]]', expected: '[1, 5, 2, 4, 3]' },
      { input: '[[1]]', expected: '[1]' },
      { input: '[[1, 2]]', expected: '[1, 2]' },
      { input: '[[]]', expected: '[]' },
    ],
    solutions: [
      {
        label: 'Store nodes in an array',
        complexity: 'O(n)',
        code:
          H +
          `function reorderList(vals) {
  var head = build(vals);
  if (head === null) return [];
  var nodes = [];
  var cur = head;
  while (cur !== null) {
    nodes.push(cur);
    cur = cur.next;
  }
  var i = 0;
  var j = nodes.length - 1;
  while (i < j) {
    nodes[i].next = nodes[j];
    i++;
    if (i === j) break;
    nodes[j].next = nodes[i];
    j--;
  }
  nodes[i].next = null;
  return toArray(head);
}`,
      },
      {
        label: 'Middle, reverse, merge',
        complexity: 'O(n)',
        code:
          H +
          `function reorderList(vals) {
  var head = build(vals);
  if (head === null || head.next === null) return toArray(head);
  var slow = head;
  var fast = head;
  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  var second = slow.next;
  slow.next = null;
  var prev = null;
  while (second !== null) {
    var nx = second.next;
    second.next = prev;
    prev = second;
    second = nx;
  }
  var a = head;
  var b = prev;
  while (b !== null) {
    var an = a.next;
    var bn = b.next;
    a.next = b;
    b.next = an;
    a = an;
    b = bn;
  }
  return toArray(head);
}`,
      },
    ],
  },
  {
    id: 'intersection-of-two-linked-lists',
    category: 'linked-list',
    lc: 'intersection-of-two-linked-lists',
    n: 160,
    tags: ['two pointers', 'hash set'],
    title: 'Intersection of Two Linked Lists',
    difficulty: 'Easy',
    pattern: 'Switch heads at the end',
    summary:
      'Two lists may share a common tail; return the value of the first shared node, or null.',
    hook: 'Walk A then B, and B then A: both pointers travel the same distance and meet at the join.',
    real: 'Finding the common ancestor of two version histories that branched from a shared commit.',
    input: '[[4, 1], [5, 6, 1], [8, 4, 5]]',
    expected: '8',
    cases: [
      { input: '[[1, 2], [3], []]', expected: 'null' },
      { input: '[[1], [2], [3, 4]]', expected: '3' },
      { input: '[[], [2], [3]]', expected: '3' },
    ],
    solutions: [
      {
        label: 'Set of nodes from list A',
        complexity: 'O(n+m)',
        code:
          BUILD_ONTO +
          `function getIntersection(prefA, prefB, common) {
  var shared = build(common, null);
  var a = build(prefA, shared);
  var b = build(prefB, shared);
  var seen = new Set();
  var cur = a;
  while (cur !== null) {
    seen.add(cur);
    cur = cur.next;
  }
  cur = b;
  while (cur !== null) {
    if (seen.has(cur)) return cur.val;
    cur = cur.next;
  }
  return null;
}`,
      },
      {
        label: 'Swap heads at the end',
        complexity: 'O(n+m)',
        code:
          BUILD_ONTO +
          `function getIntersection(prefA, prefB, common) {
  var shared = build(common, null);
  var a = build(prefA, shared);
  var b = build(prefB, shared);
  var pa = a;
  var pb = b;
  while (pa !== pb) {
    pa = pa === null ? b : pa.next;
    pb = pb === null ? a : pb.next;
  }
  return pa === null ? null : pa.val;
}`,
      },
    ],
  },
  {
    id: 'remove-linked-list-elements',
    category: 'linked-list',
    lc: 'remove-linked-list-elements',
    n: 203,
    tags: ['dummy node'],
    title: 'Remove Linked List Elements',
    difficulty: 'Easy',
    pattern: 'Dummy node deletion',
    summary: 'Delete every node holding a given value and return what remains.',
    hook: 'Trail one node behind so you can bypass a bad node; a dummy head covers deleting the first.',
    real: 'Purging expired or tombstoned entries from a chained hash bucket.',
    input: '[[1, 2, 6, 3, 4, 5, 6], 6]',
    expected: '[1, 2, 3, 4, 5]',
    cases: [
      { input: '[[7, 7, 7, 7], 7]', expected: '[]' },
      { input: '[[], 1]', expected: '[]' },
      { input: '[[1, 2], 3]', expected: '[1, 2]' },
    ],
    solutions: [
      {
        label: 'Filter values, rebuild',
        complexity: 'O(n)',
        code:
          H +
          `function removeElements(vals, target) {
  var head = build(vals);
  var kept = [];
  var cur = head;
  while (cur !== null) {
    if (cur.val !== target) kept.push(cur.val);
    cur = cur.next;
  }
  return toArray(build(kept));
}`,
      },
      {
        label: 'Bypass nodes with a dummy head',
        complexity: 'O(n)',
        code:
          H +
          `function removeElements(vals, target) {
  var head = build(vals);
  var dummy = { val: 0, next: head };
  var prev = dummy;
  while (prev.next !== null) {
    if (prev.next.val === target) {
      prev.next = prev.next.next;
    } else {
      prev = prev.next;
    }
  }
  return toArray(dummy.next);
}`,
      },
    ],
  },
  {
    id: 'odd-even-linked-list',
    category: 'linked-list',
    lc: 'odd-even-linked-list',
    n: 328,
    tags: ['pointers', 'in-place'],
    title: 'Odd Even Linked List',
    difficulty: 'Medium',
    pattern: 'Two interleaved chains',
    summary:
      'Group nodes at odd positions first, then those at even positions, keeping relative order.',
    hook: 'Build two chains in one pass, then bolt the even chain onto the odd chain.',
    real: 'Partitioning a sequence into two stable groups without allocating new records.',
    input: '[[1, 2, 3, 4, 5]]',
    expected: '[1, 3, 5, 2, 4]',
    cases: [
      { input: '[[2, 1, 3, 5, 6, 4, 7]]', expected: '[2, 3, 6, 7, 1, 5, 4]' },
      { input: '[[1]]', expected: '[1]' },
      { input: '[[]]', expected: '[]' },
      { input: '[[1, 2]]', expected: '[1, 2]' },
    ],
    solutions: [
      {
        label: 'Copy values by position, rebuild',
        complexity: 'O(n)',
        code:
          H +
          `function oddEvenList(vals) {
  var head = build(vals);
  var arr = toArray(head);
  var out = [];
  for (var i = 0; i < arr.length; i += 2) out.push(arr[i]);
  for (var j = 1; j < arr.length; j += 2) out.push(arr[j]);
  return toArray(build(out));
}`,
      },
      {
        label: 'Rewire two chains in place',
        complexity: 'O(n)',
        code:
          H +
          `function oddEvenList(vals) {
  var head = build(vals);
  if (head === null) return [];
  var odd = head;
  var even = head.next;
  var evenHead = even;
  while (even !== null && even.next !== null) {
    odd.next = even.next;
    odd = odd.next;
    even.next = odd.next;
    even = even.next;
  }
  odd.next = evenHead;
  return toArray(head);
}`,
      },
    ],
  },
  {
    id: 'swap-nodes-in-pairs',
    category: 'linked-list',
    lc: 'swap-nodes-in-pairs',
    n: 24,
    tags: ['pointers', 'dummy node'],
    title: 'Swap Nodes in Pairs',
    difficulty: 'Medium',
    pattern: 'Local pointer rewiring',
    summary: 'Swap every two adjacent nodes by changing links, not values.',
    hook: 'Hold the node before the pair, then rewire three links in the right order.',
    real: 'Reordering adjacent records in a chain, as in some cache replacement tweaks.',
    input: '[[1, 2, 3, 4]]',
    expected: '[2, 1, 4, 3]',
    cases: [
      { input: '[[1, 2, 3]]', expected: '[2, 1, 3]' },
      { input: '[[]]', expected: '[]' },
      { input: '[[1]]', expected: '[1]' },
    ],
    solutions: [
      {
        label: 'Swap values in an array, rebuild',
        complexity: 'O(n)',
        code:
          H +
          `function swapPairs(vals) {
  var head = build(vals);
  var arr = toArray(head);
  for (var i = 0; i + 1 < arr.length; i += 2) {
    var t = arr[i];
    arr[i] = arr[i + 1];
    arr[i + 1] = t;
  }
  return toArray(build(arr));
}`,
      },
      {
        label: 'Rewire links in place',
        complexity: 'O(n)',
        code:
          H +
          `function swapPairs(vals) {
  var head = build(vals);
  var dummy = { val: 0, next: head };
  var prev = dummy;
  while (prev.next !== null && prev.next.next !== null) {
    var a = prev.next;
    var b = a.next;
    a.next = b.next;
    b.next = a;
    prev.next = b;
    prev = a;
  }
  return toArray(dummy.next);
}`,
      },
    ],
  },
  {
    id: 'linked-list-cycle-ii',
    category: 'linked-list',
    lc: 'linked-list-cycle-ii',
    n: 142,
    tags: ['fast slow', 'cycle'],
    title: 'Linked List Cycle II',
    difficulty: 'Medium',
    pattern: 'Floyd cycle entry',
    summary: 'If the list loops, return the index of the node where the loop begins, otherwise -1.',
    hook: 'After the pointers meet, restart one from the head; stepping together, they meet at the entrance.',
    real: 'Locating where a corrupted chain first points back into itself.',
    input: '[[3, 2, 0, 4], 1]',
    expected: '1',
    cases: [
      { input: '[[1, 2], 0]', expected: '0' },
      { input: '[[1], -1]', expected: '-1' },
      { input: '[[1, 2, 3, 4, 5], 4]', expected: '4' },
      { input: '[[1, 2, 3], 2]', expected: '2' },
    ],
    solutions: [
      {
        label: 'Map each node to its index',
        complexity: 'O(n)',
        code:
          BUILD_CYCLE +
          `function detectCycle(vals, pos) {
  var head = build(vals, pos);
  var seen = new Map();
  var cur = head;
  var i = 0;
  while (cur !== null) {
    if (seen.has(cur)) return seen.get(cur);
    seen.set(cur, i);
    cur = cur.next;
    i++;
  }
  return -1;
}`,
      },
      {
        label: 'Floyd, then restart from head',
        complexity: 'O(n)',
        code:
          BUILD_CYCLE +
          `function detectCycle(vals, pos) {
  var head = build(vals, pos);
  var slow = head;
  var fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      var p = head;
      var idx = 0;
      while (p !== slow) {
        p = p.next;
        slow = slow.next;
        idx++;
      }
      return idx;
    }
  }
  return -1;
}`,
      },
    ],
  },
  {
    id: 'rotate-list',
    category: 'linked-list',
    lc: 'rotate-list',
    n: 61,
    tags: ['pointers', 'ring'],
    title: 'Rotate List',
    difficulty: 'Medium',
    pattern: 'Close the ring, cut at the right spot',
    summary: 'Move the last k nodes to the front, where k may exceed the length.',
    hook: 'Reduce k modulo the length, tie the tail to the head, then cut after n - k nodes.',
    real: 'Rotating a circular buffer or log file set to a new starting point.',
    input: '[[1, 2, 3, 4, 5], 2]',
    expected: '[4, 5, 1, 2, 3]',
    cases: [
      { input: '[[0, 1, 2], 4]', expected: '[2, 0, 1]' },
      { input: '[[1], 5]', expected: '[1]' },
      { input: '[[], 3]', expected: '[]' },
      { input: '[[1, 2, 3], 3]', expected: '[1, 2, 3]' },
    ],
    solutions: [
      {
        label: 'Slice and concat an array',
        complexity: 'O(n)',
        code:
          H +
          `function rotateRight(vals, k) {
  var head = build(vals);
  var arr = toArray(head);
  var n = arr.length;
  if (n === 0) return [];
  var r = k % n;
  var out = arr.slice(n - r).concat(arr.slice(0, n - r));
  return toArray(build(out));
}`,
      },
      {
        label: 'Form a ring and cut',
        complexity: 'O(n)',
        code:
          H +
          `function rotateRight(vals, k) {
  var head = build(vals);
  if (head === null) return [];
  var n = 1;
  var tail = head;
  while (tail.next !== null) {
    tail = tail.next;
    n++;
  }
  var r = k % n;
  if (r === 0) return toArray(head);
  tail.next = head;
  var newTail = head;
  for (var i = 0; i < n - r - 1; i++) {
    newTail = newTail.next;
  }
  var newHead = newTail.next;
  newTail.next = null;
  return toArray(newHead);
}`,
      },
    ],
  },
];
