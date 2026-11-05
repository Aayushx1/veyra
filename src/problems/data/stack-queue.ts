import type { Problem } from '../types';

const range = (n: number, f: (i: number) => number | string) =>
  Array.from({ length: n }, (_, i) => f(i));

export const stackQueue: Problem[] = [
  {
    id: 'min-stack',
    category: 'stack-queue',
    lc: 'min-stack',
    n: 155,
    tags: ['stack', 'design'],
    title: 'Min Stack',
    difficulty: 'Medium',
    pattern: 'Parallel min stack',
    summary:
      'Replay a list of stack operations (push, pop, top, getMin) and return the answers produced by top and getMin, in order.',
    hook: 'Store the running minimum next to every element so a pop also restores the old minimum.',
    real: 'Monitoring dashboards keep a running max or min over a sliding history so every new sample is O(1) to report.',
    input:
      '[[["push", 3], ["push", 5], ["getMin"], ["push", 2], ["getMin"], ["pop"], ["top"], ["getMin"]]]',
    expected: '[3, 2, 5, 3]',
    cases: [
      { input: '[[["push", 1], ["top"], ["getMin"]]]', expected: '[1, 1]' },
      { input: '[[]]', expected: '[]' },
      {
        input:
          '[[["push", -2], ["push", 0], ["push", -3], ["getMin"], ["pop"], ["top"], ["getMin"]]]',
        expected: '[-3, 0, -2]',
      },
    ],
    solutions: [
      {
        label: 'Scan for the minimum',
        complexity: 'O(n²)',
        code: `function minStack(ops) {
  const stack = [];
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const name = ops[i][0];
    if (name === "push") {
      stack.push(ops[i][1]);
    } else if (name === "pop") {
      stack.pop();
    } else if (name === "top") {
      out.push(stack[stack.length - 1]);
    } else {
      let m = stack[0];
      for (let j = 1; j < stack.length; j++) {
        if (stack[j] < m) m = stack[j];
      }
      out.push(m);
    }
  }
  return out;
}`,
      },
      {
        label: 'Min stack alongside',
        complexity: 'O(n)',
        code: `function minStack(ops) {
  const stack = [];
  const mins = [];
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const name = ops[i][0];
    if (name === "push") {
      const v = ops[i][1];
      stack.push(v);
      if (mins.length === 0 || v < mins[mins.length - 1]) mins.push(v);
      else mins.push(mins[mins.length - 1]);
    } else if (name === "pop") {
      stack.pop();
      mins.pop();
    } else if (name === "top") {
      out.push(stack[stack.length - 1]);
    } else {
      out.push(mins[mins.length - 1]);
    }
  }
  return out;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) =>
        JSON.stringify([
          [
            ...range(n, () => 0).map((_, i) => ['push', n - i]),
            ...range(n, () => 0).map(() => ['getMin']),
          ],
        ]),
    },
  },
  {
    id: 'evaluate-reverse-polish-notation',
    category: 'stack-queue',
    lc: 'evaluate-reverse-polish-notation',
    n: 150,
    tags: ['stack', 'parsing'],
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    pattern: 'Operand stack',
    summary:
      'Tokens are numbers and operators written in postfix order. Compute the value, with division truncating toward zero.',
    hook: 'Numbers go on the stack; an operator pops two, combines them, pushes the result.',
    real: 'Bytecode interpreters and spreadsheet formula engines evaluate postfix or stack-machine code exactly this way.',
    input: '[["2", "1", "+", "3", "*"]]',
    expected: '9',
    cases: [
      { input: '[["4", "13", "5", "/", "+"]]', expected: '6' },
      {
        input: '[["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]]',
        expected: '22',
      },
      { input: '[["7"]]', expected: '7' },
      { input: '[["-7", "2", "/"]]', expected: '-3' },
    ],
    solutions: [
      {
        label: 'Rewrite the first operator',
        complexity: 'O(n²)',
        code: `function evalRPN(tokens) {
  const t = tokens.slice();
  while (t.length > 1) {
    let i = 0;
    while (t[i] !== "+" && t[i] !== "-" && t[i] !== "*" && t[i] !== "/") i++;
    const a = Number(t[i - 2]);
    const b = Number(t[i - 1]);
    let r;
    if (t[i] === "+") r = a + b;
    else if (t[i] === "-") r = a - b;
    else if (t[i] === "*") r = a * b;
    else r = Math.trunc(a / b);
    t.splice(i - 2, 3, String(r));
  }
  return Number(t[0]);
}`,
      },
      {
        label: 'Operand stack',
        complexity: 'O(n)',
        code: `function evalRPN(tokens) {
  const stack = [];
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok === "+" || tok === "-" || tok === "*" || tok === "/") {
      const b = stack.pop();
      const a = stack.pop();
      if (tok === "+") stack.push(a + b);
      else if (tok === "-") stack.push(a - b);
      else if (tok === "*") stack.push(a * b);
      else stack.push(Math.trunc(a / b));
    } else {
      stack.push(Number(tok));
    }
  }
  return stack[0];
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => JSON.stringify([[...range(n, () => '1'), ...range(n - 1, () => '+')]]),
    },
  },
  {
    id: 'daily-temperatures',
    category: 'stack-queue',
    lc: 'daily-temperatures',
    n: 739,
    tags: ['monotonic stack'],
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    pattern: 'Monotonic stack',
    summary:
      'For each day, report how many days you must wait for a warmer one, or 0 if none ever comes.',
    hook: 'Keep unresolved days on a stack; a warmer day resolves everything colder on top.',
    real: 'Alerting systems pair each event with the next later event that exceeds it, such as the next higher latency spike.',
    input: '[[73, 74, 75, 71, 69, 72, 76, 73]]',
    expected: '[1, 1, 4, 2, 1, 1, 0, 0]',
    cases: [
      { input: '[[30, 40, 50, 60]]', expected: '[1, 1, 1, 0]' },
      { input: '[[90, 80, 70]]', expected: '[0, 0, 0]' },
      { input: '[[]]', expected: '[]' },
    ],
    solutions: [
      {
        label: 'Look ahead from each day',
        complexity: 'O(n²)',
        code: `function dailyTemperatures(temps) {
  const res = [];
  for (let i = 0; i < temps.length; i++) {
    let days = 0;
    for (let j = i + 1; j < temps.length; j++) {
      if (temps[j] > temps[i]) {
        days = j - i;
        break;
      }
    }
    res.push(days);
  }
  return res;
}`,
      },
      {
        label: 'Monotonic stack',
        complexity: 'O(n)',
        code: `function dailyTemperatures(temps) {
  const res = [];
  for (let i = 0; i < temps.length; i++) res.push(0);
  const stack = [];
  for (let i = 0; i < temps.length; i++) {
    while (stack.length > 0 && temps[stack[stack.length - 1]] < temps[i]) {
      const prev = stack.pop();
      res[prev] = i - prev;
    }
    stack.push(i);
  }
  return res;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => JSON.stringify([range(n, (i) => n - i)]),
    },
  },
  {
    id: 'next-greater-element-i',
    category: 'stack-queue',
    lc: 'next-greater-element-i',
    n: 496,
    tags: ['monotonic stack', 'hash map'],
    title: 'Next Greater Element I',
    difficulty: 'Easy',
    pattern: 'Monotonic stack + map',
    summary:
      'Every value of the first list also appears in the second. For each, give the first larger value to its right in the second list, else -1.',
    hook: 'Precompute the next-greater of every value in one stack pass, then just look it up.',
    real: 'Stream processors precompute "next larger event" once so later queries are a dictionary lookup.',
    input: '[[4, 1, 2], [1, 3, 4, 2]]',
    expected: '[-1, 3, -1]',
    cases: [
      { input: '[[2, 4], [1, 2, 3, 4]]', expected: '[3, -1]' },
      { input: '[[1], [1]]', expected: '[-1]' },
      { input: '[[], [5, 6]]', expected: '[]' },
    ],
    solutions: [
      {
        label: 'Find then scan right',
        complexity: 'O(n·m)',
        code: `function nextGreaterElement(nums1, nums2) {
  const res = [];
  for (let i = 0; i < nums1.length; i++) {
    let pos = 0;
    while (nums2[pos] !== nums1[i]) pos++;
    let ans = -1;
    for (let j = pos + 1; j < nums2.length; j++) {
      if (nums2[j] > nums1[i]) {
        ans = nums2[j];
        break;
      }
    }
    res.push(ans);
  }
  return res;
}`,
      },
      {
        label: 'Stack and lookup map',
        complexity: 'O(n + m)',
        code: `function nextGreaterElement(nums1, nums2) {
  const next = new Map();
  const stack = [];
  for (let i = 0; i < nums2.length; i++) {
    while (stack.length > 0 && stack[stack.length - 1] < nums2[i]) {
      next.set(stack.pop(), nums2[i]);
    }
    stack.push(nums2[i]);
  }
  const res = [];
  for (let i = 0; i < nums1.length; i++) {
    res.push(next.has(nums1[i]) ? next.get(nums1[i]) : -1);
  }
  return res;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => JSON.stringify([range(n, (i) => n - i), range(n, (i) => n - i)]),
    },
  },
  {
    id: 'largest-rectangle-in-histogram',
    category: 'stack-queue',
    lc: 'largest-rectangle-in-histogram',
    n: 84,
    tags: ['monotonic stack'],
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    pattern: 'Increasing stack of bars',
    summary:
      'Bars of width 1 sit side by side. Find the area of the biggest rectangle that fits entirely inside the bars.',
    hook: 'A bar ends its reign when a shorter bar arrives; pop it and measure how far it stretched.',
    real: 'Layout and packing tools find the largest free block under a skyline of obstacles using this stack sweep.',
    input: '[[2, 1, 5, 6, 2, 3]]',
    expected: '10',
    cases: [
      { input: '[[2, 4]]', expected: '4' },
      { input: '[[]]', expected: '0' },
      { input: '[[1, 1, 1, 1]]', expected: '4' },
      { input: '[[6, 2, 5, 4, 5, 1, 6]]', expected: '12' },
    ],
    solutions: [
      {
        label: 'Expand around each bar',
        complexity: 'O(n²)',
        code: `function largestRectangle(heights) {
  let best = 0;
  for (let i = 0; i < heights.length; i++) {
    let left = i;
    while (left > 0 && heights[left - 1] >= heights[i]) left--;
    let right = i;
    while (right < heights.length - 1 && heights[right + 1] >= heights[i]) right++;
    const area = heights[i] * (right - left + 1);
    if (area > best) best = area;
  }
  return best;
}`,
      },
      {
        label: 'Monotonic stack',
        complexity: 'O(n)',
        code: `function largestRectangle(heights) {
  const stack = [];
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];
    while (stack.length > 0 && heights[stack[stack.length - 1]] >= h) {
      const height = heights[stack.pop()];
      const left = stack.length === 0 ? 0 : stack[stack.length - 1] + 1;
      const area = height * (i - left);
      if (area > best) best = area;
    }
    stack.push(i);
  }
  return best;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => JSON.stringify([range(n, (i) => i + 1)]),
    },
  },
  {
    id: 'car-fleet',
    category: 'stack-queue',
    lc: 'car-fleet',
    n: 853,
    tags: ['sorting', 'stack'],
    title: 'Car Fleet',
    difficulty: 'Medium',
    pattern: 'Sort by position, track slowest arrival',
    summary:
      'Cars drive one lane toward a target and cannot pass; a faster car that catches up slows to match. Count the groups that arrive together.',
    hook: 'Walk from the front car back; a car starts a new fleet only if it arrives later than everyone ahead.',
    real: 'Convoy and platooning models merge vehicles that would otherwise collide into a single group speed.',
    input: '[12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]]',
    expected: '3',
    cases: [
      { input: '[10, [3], [3]]', expected: '1' },
      { input: '[100, [0, 2, 4], [4, 2, 1]]', expected: '1' },
      { input: '[10, [], []]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Compare with every car ahead',
        complexity: 'O(n²)',
        code: `function carFleet(target, position, speed) {
  const n = position.length;
  let fleets = 0;
  for (let i = 0; i < n; i++) {
    const t = (target - position[i]) / speed[i];
    let blocked = false;
    for (let j = 0; j < n; j++) {
      if (position[j] > position[i] && (target - position[j]) / speed[j] >= t) {
        blocked = true;
        break;
      }
    }
    if (!blocked) fleets++;
  }
  return fleets;
}`,
      },
      {
        label: 'Sort, then one pass',
        complexity: 'O(n log n)',
        code: `function carFleet(target, position, speed) {
  const order = [];
  for (let i = 0; i < position.length; i++) order.push(i);
  order.sort((a, b) => position[b] - position[a]);
  let fleets = 0;
  let slowest = 0;
  for (let k = 0; k < order.length; k++) {
    const i = order[k];
    const t = (target - position[i]) / speed[i];
    if (t > slowest) {
      fleets++;
      slowest = t;
    }
  }
  return fleets;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => JSON.stringify([n, range(n, (i) => i), range(n, () => 1)]),
    },
  },
  {
    id: 'decode-string',
    category: 'stack-queue',
    lc: 'decode-string',
    n: 394,
    tags: ['stack', 'recursion', 'strings'],
    title: 'Decode String',
    difficulty: 'Medium',
    pattern: 'Stack of (count, prefix)',
    summary:
      'Expand an encoded string where k[text] means the text repeated k times, and groups may be nested.',
    hook: 'On "[" save the count and the text so far; on "]" repeat the inner text and glue it back.',
    real: 'Template engines and compression formats expand nested repeat blocks with the same save-and-restore context.',
    input: '["3[a2[c]]"]',
    expected: '"accaccacc"',
    cases: [
      { input: '["2[abc]3[cd]ef"]', expected: '"abcabccdcdcdef"' },
      { input: '[""]', expected: '""' },
      { input: '["10[a]"]', expected: '"aaaaaaaaaa"' },
    ],
    solutions: [
      {
        label: 'Recursive descent',
        complexity: 'O(n)',
        code: `function decodeFrom(s, state) {
  let out = "";
  let num = 0;
  while (state.i < s.length) {
    const c = s[state.i];
    if (c >= "0" && c <= "9") {
      num = num * 10 + Number(c);
      state.i++;
    } else if (c === "[") {
      state.i++;
      const inner = decodeFrom(s, state);
      for (let r = 0; r < num; r++) out += inner;
      num = 0;
    } else if (c === "]") {
      state.i++;
      return out;
    } else {
      out += c;
      state.i++;
    }
  }
  return out;
}

function decodeString(s) {
  return decodeFrom(s, { i: 0 });
}`,
      },
      {
        label: 'Explicit stacks',
        complexity: 'O(n)',
        code: `function decodeString(s) {
  const counts = [];
  const prefixes = [];
  let cur = "";
  let num = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c >= "0" && c <= "9") {
      num = num * 10 + Number(c);
    } else if (c === "[") {
      counts.push(num);
      prefixes.push(cur);
      num = 0;
      cur = "";
    } else if (c === "]") {
      const k = counts.pop();
      const prev = prefixes.pop();
      let rep = "";
      for (let r = 0; r < k; r++) rep += cur;
      cur = prev + rep;
    } else {
      cur += c;
    }
  }
  return cur;
}`,
      },
    ],
  },
  {
    id: 'basic-calculator-ii',
    category: 'stack-queue',
    lc: 'basic-calculator-ii',
    n: 227,
    tags: ['stack', 'parsing'],
    title: 'Basic Calculator II',
    difficulty: 'Medium',
    pattern: 'Deferred operator + stack',
    summary:
      'Evaluate an expression of non-negative integers with + - * / and spaces; division truncates and * / bind tighter.',
    hook: 'Apply the previous operator when you reach the next one; * and / fold into the stack top.',
    real: 'Query and formula parsers resolve operator precedence without building a full syntax tree.',
    input: '[" 3+5 / 2 "]',
    expected: '5',
    cases: [
      { input: '["14-3/2"]', expected: '13' },
      { input: '["42"]', expected: '42' },
      { input: '["1-1+1"]', expected: '1' },
      { input: '["100/3*3"]', expected: '99' },
    ],
    solutions: [
      {
        label: 'Tokenize, fold terms, sum',
        complexity: 'O(n)',
        code: `function calculate(s) {
  const nums = [];
  const ops = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c >= "0" && c <= "9") {
      let v = 0;
      while (i < s.length && s[i] >= "0" && s[i] <= "9") {
        v = v * 10 + Number(s[i]);
        i++;
      }
      nums.push(v);
    } else {
      if (c !== " ") ops.push(c);
      i++;
    }
  }
  const terms = [nums[0]];
  const signs = [];
  for (let k = 0; k < ops.length; k++) {
    const v = nums[k + 1];
    const last = terms.length - 1;
    if (ops[k] === "*") terms[last] = terms[last] * v;
    else if (ops[k] === "/") terms[last] = Math.trunc(terms[last] / v);
    else {
      signs.push(ops[k]);
      terms.push(v);
    }
  }
  let total = terms[0];
  for (let k = 0; k < signs.length; k++) {
    if (signs[k] === "+") total += terms[k + 1];
    else total -= terms[k + 1];
  }
  return total;
}`,
      },
      {
        label: 'Single pass with stack',
        complexity: 'O(n)',
        code: `function calculate(s) {
  const stack = [];
  let num = 0;
  let op = "+";
  for (let i = 0; i <= s.length; i++) {
    const c = i < s.length ? s[i] : "+";
    if (c >= "0" && c <= "9") {
      num = num * 10 + Number(c);
    } else if (c !== " ") {
      if (op === "+") stack.push(num);
      else if (op === "-") stack.push(-num);
      else if (op === "*") stack.push(stack.pop() * num);
      else stack.push(Math.trunc(stack.pop() / num));
      op = c;
      num = 0;
    }
  }
  let total = 0;
  for (let i = 0; i < stack.length; i++) total += stack[i];
  return total;
}`,
      },
    ],
  },
  {
    id: 'asteroid-collision',
    category: 'stack-queue',
    lc: 'asteroid-collision',
    n: 735,
    tags: ['stack', 'simulation'],
    title: 'Asteroid Collision',
    difficulty: 'Medium',
    pattern: 'Stack of survivors',
    summary:
      'Positive numbers fly right, negatives fly left, size is the absolute value. Equal sizes both vanish, otherwise the smaller dies. Return the survivors.',
    hook: 'Only a right-mover on the stack facing a new left-mover can collide; fight until one is gone.',
    real: 'Event-cancellation logic, like matching buy and sell orders of opposite sign, resolves against the top of a stack.',
    input: '[[5, 10, -5]]',
    expected: '[5, 10]',
    cases: [
      { input: '[[8, -8]]', expected: '[]' },
      { input: '[[10, 2, -5]]', expected: '[10]' },
      { input: '[[-2, -1, 1, 2]]', expected: '[-2, -1, 1, 2]' },
      { input: '[[]]', expected: '[]' },
    ],
    solutions: [
      {
        label: 'Rescan after each collision',
        complexity: 'O(n²)',
        code: `function asteroidCollision(asteroids) {
  const a = asteroids.slice();
  let i = 0;
  while (i < a.length - 1) {
    if (a[i] > 0 && a[i + 1] < 0) {
      if (a[i] > -a[i + 1]) a.splice(i + 1, 1);
      else if (a[i] < -a[i + 1]) a.splice(i, 1);
      else a.splice(i, 2);
      i = 0;
    } else {
      i++;
    }
  }
  return a;
}`,
      },
      {
        label: 'Stack',
        complexity: 'O(n)',
        code: `function asteroidCollision(asteroids) {
  const stack = [];
  for (let k = 0; k < asteroids.length; k++) {
    const cur = asteroids[k];
    let alive = true;
    while (alive && cur < 0 && stack.length > 0 && stack[stack.length - 1] > 0) {
      const top = stack[stack.length - 1];
      if (top < -cur) {
        stack.pop();
      } else {
        if (top === -cur) stack.pop();
        alive = false;
      }
    }
    if (alive) stack.push(cur);
  }
  return stack;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => JSON.stringify([[...range(n - 1, (i) => i + 1), -n]]),
    },
  },
  {
    id: 'simplify-path',
    category: 'stack-queue',
    lc: 'simplify-path',
    n: 71,
    tags: ['stack', 'strings'],
    title: 'Simplify Path',
    difficulty: 'Medium',
    pattern: 'Stack of directory names',
    summary:
      'Turn an absolute Unix path into its canonical form: collapse repeated slashes, drop ".", and let ".." step up one folder.',
    hook: 'Push real names, pop on "..", ignore "." and empty pieces, then join with slashes.',
    real: 'File systems, web servers and URL routers normalize paths this way to block directory-traversal tricks.',
    input: '["/a/./b/../../c/"]',
    expected: '"/c"',
    cases: [
      { input: '["/../"]', expected: '"/"' },
      { input: '["/home//foo/"]', expected: '"/home/foo"' },
      { input: '["/a//b////c/d//././/.."]', expected: '"/a/b/c"' },
    ],
    solutions: [
      {
        label: 'Collect parts, cancel with splice',
        complexity: 'O(n²)',
        code: `function simplifyPath(path) {
  const SLASH = String.fromCharCode(47);
  const parts = [];
  let cur = "";
  for (let i = 0; i <= path.length; i++) {
    const c = i < path.length ? path[i] : SLASH;
    if (c === SLASH) {
      if (cur !== "" && cur !== ".") parts.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  let k = 0;
  while (k < parts.length) {
    if (parts[k] === "..") {
      if (k > 0) {
        parts.splice(k - 1, 2);
        k--;
      } else {
        parts.splice(0, 1);
      }
    } else {
      k++;
    }
  }
  return SLASH + parts.join(SLASH);
}`,
      },
      {
        label: 'Single pass with stack',
        complexity: 'O(n)',
        code: `function simplifyPath(path) {
  const SLASH = String.fromCharCode(47);
  const stack = [];
  let cur = "";
  for (let i = 0; i <= path.length; i++) {
    const c = i < path.length ? path[i] : SLASH;
    if (c === SLASH) {
      if (cur === "..") {
        if (stack.length > 0) stack.pop();
      } else if (cur !== "" && cur !== ".") {
        stack.push(cur);
      }
      cur = "";
    } else {
      cur += c;
    }
  }
  return SLASH + stack.join(SLASH);
}`,
      },
    ],
  },
  {
    id: 'online-stock-span',
    category: 'stack-queue',
    lc: 'online-stock-span',
    n: 901,
    tags: ['monotonic stack'],
    title: 'Online Stock Span',
    difficulty: 'Medium',
    pattern: 'Monotonic stack',
    summary:
      'Given daily prices, report for each day how many consecutive days up to and including it had a price no higher than that day.',
    hook: 'Pop every earlier price that is not higher; the span runs back to whatever blocks you.',
    real: 'Trading and analytics tools compute "how long has this been a running high" for every tick in constant amortized time.',
    input: '[[100, 80, 60, 70, 60, 75, 85]]',
    expected: '[1, 1, 1, 2, 1, 4, 6]',
    cases: [
      { input: '[[]]', expected: '[]' },
      { input: '[[5, 5, 5]]', expected: '[1, 2, 3]' },
      { input: '[[4, 3, 2, 1]]', expected: '[1, 1, 1, 1]' },
    ],
    solutions: [
      {
        label: 'Walk back each day',
        complexity: 'O(n²)',
        code: `function stockSpans(prices) {
  const res = [];
  for (let i = 0; i < prices.length; i++) {
    let span = 1;
    while (i - span >= 0 && prices[i - span] <= prices[i]) span++;
    res.push(span);
  }
  return res;
}`,
      },
      {
        label: 'Monotonic stack',
        complexity: 'O(n)',
        code: `function stockSpans(prices) {
  const res = [];
  const stack = [];
  for (let i = 0; i < prices.length; i++) {
    while (stack.length > 0 && prices[stack[stack.length - 1]] <= prices[i]) stack.pop();
    const span = stack.length === 0 ? i + 1 : i - stack[stack.length - 1];
    res.push(span);
    stack.push(i);
  }
  return res;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => JSON.stringify([range(n, (i) => i + 1)]),
    },
  },
  {
    id: 'remove-k-digits',
    category: 'stack-queue',
    lc: 'remove-k-digits',
    n: 402,
    tags: ['monotonic stack', 'greedy'],
    title: 'Remove K Digits',
    difficulty: 'Medium',
    pattern: 'Greedy monotonic stack',
    summary:
      'Delete exactly k digits from a number written as a string so the remaining number is as small as possible. Strip leading zeros; an empty result is "0".',
    hook: 'Whenever a digit is bigger than the one after it, drop it; earlier digits matter most.',
    real: 'Greedy "drop the worst earlier item when a better one arrives" shows up in cache eviction and token-budget trimming.',
    input: '["1432219", 3]',
    expected: '"1219"',
    cases: [
      { input: '["10200", 1]', expected: '"200"' },
      { input: '["10", 2]', expected: '"0"' },
      { input: '["9", 1]', expected: '"0"' },
      { input: '["12345", 2]', expected: '"123"' },
    ],
    solutions: [
      {
        label: 'Remove the first peak, k times',
        complexity: 'O(n·k)',
        code: `function removeKDigits(num, k) {
  let digits = num;
  for (let r = 0; r < k; r++) {
    let idx = digits.length - 1;
    for (let i = 0; i < digits.length - 1; i++) {
      if (digits[i] > digits[i + 1]) {
        idx = i;
        break;
      }
    }
    digits = digits.slice(0, idx) + digits.slice(idx + 1);
  }
  let start = 0;
  while (start < digits.length - 1 && digits[start] === "0") start++;
  return digits.length === 0 ? "0" : digits.slice(start);
}`,
      },
      {
        label: 'Monotonic stack',
        complexity: 'O(n)',
        code: `function removeKDigits(num, k) {
  const stack = [];
  let left = k;
  for (let i = 0; i < num.length; i++) {
    const d = num[i];
    while (left > 0 && stack.length > 0 && stack[stack.length - 1] > d) {
      stack.pop();
      left--;
    }
    stack.push(d);
  }
  while (left > 0) {
    stack.pop();
    left--;
  }
  let start = 0;
  while (start < stack.length - 1 && stack[start] === "0") start++;
  const out = stack.slice(start).join("");
  return out === "" ? "0" : out;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => JSON.stringify(['1'.repeat(n), Math.floor(n / 2)]),
    },
  },
  {
    id: 'implement-queue-using-stacks',
    category: 'stack-queue',
    lc: 'implement-queue-using-stacks',
    n: 232,
    tags: ['stack', 'queue', 'design'],
    title: 'Implement Queue using Stacks',
    difficulty: 'Easy',
    pattern: 'Two stacks, lazy transfer',
    summary:
      'Build a FIFO queue from two stacks. Replay push, pop, peek and empty operations and return the results of pop, peek and empty in order.',
    hook: 'Pour the inbox into the outbox only when the outbox is empty; reversal makes it FIFO.',
    real: 'Message buffers and undo/redo engines use a two-stack queue to get amortized constant-time operations.',
    input: '[[["push", 1], ["push", 2], ["peek"], ["pop"], ["empty"]]]',
    expected: '[1, 1, false]',
    cases: [
      { input: '[[["empty"]]]', expected: '[true]' },
      { input: '[[["push", 1], ["pop"], ["empty"]]]', expected: '[1, true]' },
      {
        input:
          '[[["push", 1], ["push", 2], ["push", 3], ["pop"], ["push", 4], ["pop"], ["pop"], ["peek"]]]',
        expected: '[1, 2, 3, 4]',
      },
    ],
    solutions: [
      {
        label: 'Flip everything on each read',
        complexity: 'O(n²)',
        code: `function queueUsingStacks(ops) {
  const a = [];
  const b = [];
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const name = ops[i][0];
    if (name === "push") {
      a.push(ops[i][1]);
    } else if (name === "empty") {
      out.push(a.length === 0);
    } else {
      while (a.length > 0) b.push(a.pop());
      const front = b[b.length - 1];
      if (name === "pop") b.pop();
      while (b.length > 0) a.push(b.pop());
      out.push(front);
    }
  }
  return out;
}`,
      },
      {
        label: 'Inbox and outbox',
        complexity: 'O(n)',
        code: `function queueUsingStacks(ops) {
  const inbox = [];
  const outbox = [];
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const name = ops[i][0];
    if (name === "push") {
      inbox.push(ops[i][1]);
    } else if (name === "empty") {
      out.push(inbox.length === 0 && outbox.length === 0);
    } else {
      if (outbox.length === 0) {
        while (inbox.length > 0) outbox.push(inbox.pop());
      }
      if (name === "pop") out.push(outbox.pop());
      else out.push(outbox[outbox.length - 1]);
    }
  }
  return out;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) =>
        JSON.stringify([
          [
            ...range(n, () => 0).map((_, i) => ['push', i]),
            ...range(n, () => 0).map(() => ['peek']),
          ],
        ]),
    },
  },
  {
    id: 'sum-of-subarray-minimums',
    category: 'stack-queue',
    lc: 'sum-of-subarray-minimums',
    n: 907,
    tags: ['monotonic stack'],
    title: 'Sum of Subarray Minimums',
    difficulty: 'Medium',
    pattern: 'Contribution counting with monotonic stack',
    summary:
      'Add up the minimum of every contiguous subarray, reporting the total modulo 1,000,000,007.',
    hook: 'Ask how many subarrays each value is the minimum of: reach left times reach right.',
    real: "Range-aggregate analytics count each element's contribution instead of enumerating every window.",
    input: '[[3, 1, 2, 4]]',
    expected: '17',
    cases: [
      { input: '[[11, 81, 94, 43, 3]]', expected: '444' },
      { input: '[[1]]', expected: '1' },
      { input: '[[2, 2]]', expected: '6' },
    ],
    solutions: [
      {
        label: 'Running min over every subarray',
        complexity: 'O(n²)',
        code: `function sumSubarrayMins(arr) {
  const MOD = 1000000007;
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    let m = arr[i];
    for (let j = i; j < arr.length; j++) {
      if (arr[j] < m) m = arr[j];
      total = (total + m) % MOD;
    }
  }
  return total;
}`,
      },
      {
        label: 'Monotonic stack contributions',
        complexity: 'O(n)',
        code: `function sumSubarrayMins(arr) {
  const MOD = 1000000007;
  const n = arr.length;
  const stack = [];
  let total = 0;
  for (let i = 0; i <= n; i++) {
    const cur = i === n ? -1 : arr[i];
    while (stack.length > 0 && arr[stack[stack.length - 1]] >= cur) {
      const mid = stack.pop();
      const left = stack.length === 0 ? mid + 1 : mid - stack[stack.length - 1];
      const right = i - mid;
      total = (total + arr[mid] * left * right) % MOD;
    }
    stack.push(i);
  }
  return total;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 32, 64],
      make: (n) => JSON.stringify([range(n, (i) => ((i * 7) % 13) + 1)]),
    },
  },
];
