import type { Problem } from '../types';

const SIZES = [4, 8, 16, 32, 64];
const rep = (c: string, n: number) => c.repeat(n);
/** n distinct characters. */
const uni = (n: number) =>
  Array.from({ length: n }, (_, i) => String.fromCharCode(1000 + i)).join('');

export const strings: Problem[] = [
  {
    id: 'valid-palindrome',
    category: 'strings',
    lc: 'valid-palindrome',
    n: 125,
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    tags: ['two pointers'],
    pattern: 'Two pointers from the ends',
    summary:
      'Ignoring case and anything that is not a letter or digit, decide whether the text reads the same in both directions.',
    hook: 'Two fingers, one at each end, skipping junk, meeting in the middle.',
    real: 'Normalizing and comparing user input (like usernames or codes) while ignoring punctuation.',
    input: '["A man, a plan, a canal: Panama"]',
    expected: 'true',
    cases: [
      { input: '["race a car"]', expected: 'false' },
      { input: '[" "]', expected: 'true' },
      { input: '["0P"]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Clean then reverse',
        complexity: 'O(n)',
        code: `function isPalindrome(s) {
  let clean = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i].toLowerCase();
    if ((c >= "a" && c <= "z") || (c >= "0" && c <= "9")) clean += c;
  }
  let rev = "";
  for (let i = clean.length - 1; i >= 0; i--) rev += clean[i];
  return rev === clean;
}`,
      },
      {
        label: 'Two pointers in place',
        complexity: 'O(n)',
        code: `function isAlnum(c) {
  return (c >= "a" && c <= "z") || (c >= "0" && c <= "9");
}
function isPalindrome(s) {
  let lo = 0;
  let hi = s.length - 1;
  while (lo < hi) {
    const a = s[lo].toLowerCase();
    const b = s[hi].toLowerCase();
    if (!isAlnum(a)) lo++;
    else if (!isAlnum(b)) hi--;
    else if (a !== b) return false;
    else {
      lo++;
      hi--;
    }
  }
  return true;
}`,
      },
    ],
  },
  {
    id: 'reverse-string',
    category: 'strings',
    lc: 'reverse-string',
    n: 344,
    title: 'Reverse String',
    difficulty: 'Easy',
    tags: ['two pointers'],
    pattern: 'Swap from both ends',
    summary:
      'Reverse a list of characters so the first becomes last, ideally without extra storage.',
    hook: 'Swap the ends, step inward, stop when the pointers cross.',
    real: 'In-place buffer reversal, such as flipping byte order in a network packet.',
    input: '[["h", "e", "l", "l", "o"]]',
    expected: '["o", "l", "l", "e", "h"]',
    cases: [
      { input: '[[]]', expected: '[]' },
      { input: '[["a"]]', expected: '["a"]' },
      { input: '[["a", "b", "c", "d"]]', expected: '["d", "c", "b", "a"]' },
    ],
    solutions: [
      {
        label: 'Copy backwards',
        complexity: 'O(n)',
        code: `function reverseString(chars) {
  const out = [];
  for (let i = chars.length - 1; i >= 0; i--) {
    out.push(chars[i]);
  }
  return out;
}`,
      },
      {
        label: 'In-place swap',
        complexity: 'O(n)',
        code: `function reverseString(chars) {
  let lo = 0;
  let hi = chars.length - 1;
  while (lo < hi) {
    const tmp = chars[lo];
    chars[lo] = chars[hi];
    chars[hi] = tmp;
    lo++;
    hi--;
  }
  return chars;
}`,
      },
    ],
  },
  {
    id: 'longest-common-prefix',
    category: 'strings',
    lc: 'longest-common-prefix',
    n: 14,
    title: 'Longest Common Prefix',
    difficulty: 'Easy',
    tags: ['prefix'],
    pattern: 'Vertical scan',
    summary: 'Find the longest beginning that every word in the list shares.',
    hook: 'Compare column by column and stop at the first disagreement.',
    real: 'Autocomplete and path compression, where shared prefixes are factored out.',
    input: '[["flower", "flow", "flight"]]',
    expected: '"fl"',
    cases: [
      { input: '[["dog", "racecar", "car"]]', expected: '""' },
      { input: '[["a"]]', expected: '"a"' },
      { input: '[["abc", "abc", "ab"]]', expected: '"ab"' },
    ],
    solutions: [
      {
        label: 'Shrink the prefix word by word',
        complexity: 'O(n·m)',
        code: `function longestCommonPrefix(strs) {
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, prefix.length - 1);
    }
  }
  return prefix;
}`,
      },
      {
        label: 'Scan column by column',
        complexity: 'O(n·m)',
        code: `function longestCommonPrefix(strs) {
  for (let i = 0; i < strs[0].length; i++) {
    const c = strs[0][i];
    for (let j = 1; j < strs.length; j++) {
      if (i >= strs[j].length || strs[j][i] !== c) return strs[0].slice(0, i);
    }
  }
  return strs[0];
}`,
      },
    ],
  },
  {
    id: 'is-subsequence',
    category: 'strings',
    lc: 'is-subsequence',
    n: 392,
    title: 'Is Subsequence',
    difficulty: 'Easy',
    tags: ['two pointers'],
    pattern: 'Greedy two pointers',
    summary:
      'Check whether the first text can be obtained from the second by deleting characters without reordering.',
    hook: 'Walk the big string once; advance the small pointer only on a match.',
    real: 'Fuzzy file finders match a typed query as a subsequence of file names.',
    input: '["abc", "ahbgdc"]',
    expected: 'true',
    cases: [
      { input: '["axc", "ahbgdc"]', expected: 'false' },
      { input: '["", "ahbgdc"]', expected: 'true' },
      { input: '["a", ""]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Jump with indexOf',
        complexity: 'O(n + m)',
        code: `function isSubsequence(s, t) {
  let pos = 0;
  for (let i = 0; i < s.length; i++) {
    const found = t.indexOf(s[i], pos);
    if (found === -1) return false;
    pos = found + 1;
  }
  return true;
}`,
      },
      {
        label: 'Two pointers',
        complexity: 'O(n + m)',
        code: `function isSubsequence(s, t) {
  let i = 0;
  for (let j = 0; j < t.length && i < s.length; j++) {
    if (s[i] === t[j]) i++;
  }
  return i === s.length;
}`,
      },
    ],
  },
  {
    id: 'isomorphic-strings',
    category: 'strings',
    lc: 'isomorphic-strings',
    n: 205,
    title: 'Isomorphic Strings',
    difficulty: 'Easy',
    tags: ['hash map'],
    pattern: 'Bijective character mapping',
    summary:
      'Decide whether one text can be turned into another by consistently swapping each letter for a single other letter.',
    hook: 'The mapping must work forwards and backwards: use two maps.',
    real: 'Checking that two schemas or tokenizations have the same structure under renaming.',
    input: '["egg", "add"]',
    expected: 'true',
    cases: [
      { input: '["foo", "bar"]', expected: 'false' },
      { input: '["paper", "title"]', expected: 'true' },
      { input: '["badc", "baba"]', expected: 'false' },
      { input: '["ab", "a"]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Compare first-occurrence patterns',
        complexity: 'O(n²)',
        code: `function shape(s) {
  const out = [];
  for (let i = 0; i < s.length; i++) {
    let j = 0;
    while (s[j] !== s[i]) j++;
    out.push(j);
  }
  return out.join(",");
}
function isIsomorphic(s, t) {
  if (s.length !== t.length) return false;
  return shape(s) === shape(t);
}`,
      },
      {
        label: 'Two maps',
        complexity: 'O(n)',
        code: `function isIsomorphic(s, t) {
  if (s.length !== t.length) return false;
  const st = new Map();
  const ts = new Map();
  for (let i = 0; i < s.length; i++) {
    const a = s[i];
    const b = t[i];
    if (st.has(a) && st.get(a) !== b) return false;
    if (ts.has(b) && ts.get(b) !== a) return false;
    st.set(a, b);
    ts.set(b, a);
  }
  return true;
}`,
      },
    ],
    scale: { sizes: SIZES, make: (n) => JSON.stringify([uni(n), uni(n)]) },
  },
  {
    id: 'roman-to-integer',
    category: 'strings',
    lc: 'roman-to-integer',
    n: 13,
    title: 'Roman to Integer',
    difficulty: 'Easy',
    tags: ['hash map'],
    pattern: 'Lookup table with subtractive rule',
    summary: 'Convert a Roman numeral into its numeric value.',
    hook: 'A smaller symbol before a bigger one is subtracted; otherwise add.',
    real: 'Parsers that decode compact encodings where context changes a symbol meaning.',
    input: '["MCMXCIV"]',
    expected: '1994',
    cases: [
      { input: '["III"]', expected: '3' },
      { input: '["LVIII"]', expected: '58' },
      { input: '["IV"]', expected: '4' },
    ],
    solutions: [
      {
        label: 'Match two-letter tokens first',
        complexity: 'O(n)',
        code: `function romanToInt(s) {
  const vals = { I: 1, IV: 4, V: 5, IX: 9, X: 10, XL: 40, L: 50, XC: 90, C: 100, CD: 400, D: 500, CM: 900, M: 1000 };
  let total = 0;
  let i = 0;
  while (i < s.length) {
    const two = s.slice(i, i + 2);
    if (two.length === 2 && vals[two] !== undefined) {
      total += vals[two];
      i += 2;
    } else {
      total += vals[s[i]];
      i++;
    }
  }
  return total;
}`,
      },
      {
        label: 'Right to left',
        complexity: 'O(n)',
        code: `function romanToInt(s) {
  const vals = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let prev = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const v = vals[s[i]];
    if (v < prev) total -= v;
    else total += v;
    prev = v;
  }
  return total;
}`,
      },
    ],
  },
  {
    id: 'integer-to-roman',
    category: 'strings',
    lc: 'integer-to-roman',
    n: 12,
    title: 'Integer to Roman',
    difficulty: 'Medium',
    tags: ['greedy'],
    pattern: 'Greedy over a value table',
    summary: 'Write a number from 1 to 3999 as a Roman numeral.',
    hook: 'Include the subtractive forms (900, 400, 90...) in the table, then take the biggest that fits.',
    real: 'Greedy change-making, the same way a cashier picks the largest coin that fits.',
    input: '[1994]',
    expected: '"MCMXCIV"',
    cases: [
      { input: '[3]', expected: '"III"' },
      { input: '[58]', expected: '"LVIII"' },
      { input: '[3999]', expected: '"MMMCMXCIX"' },
    ],
    solutions: [
      {
        label: 'Digit-place tables',
        complexity: 'O(1)',
        code: `function intToRoman(num) {
  const ones = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  const tens = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
  const hundreds = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
  const thousands = ["", "M", "MM", "MMM"];
  return thousands[Math.floor(num / 1000)] + hundreds[Math.floor((num % 1000) / 100)] + tens[Math.floor((num % 100) / 10)] + ones[num % 10];
}`,
      },
      {
        label: 'Greedy subtraction',
        complexity: 'O(1)',
        code: `function intToRoman(num) {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let out = "";
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) {
      out += syms[i];
      num -= vals[i];
    }
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'string-to-integer-atoi',
    category: 'strings',
    lc: 'string-to-integer-atoi',
    n: 8,
    title: 'String to Integer (atoi)',
    difficulty: 'Medium',
    tags: ['parsing'],
    pattern: 'Parse with a clamp',
    summary:
      'Parse an optional sign and leading digits from text, skipping leading spaces, and clamp to the signed 32-bit range.',
    hook: 'Skip spaces, read the sign, read digits, stop at the first non-digit, clamp.',
    real: 'Every number parser in a standard library or config reader has these exact edge cases.',
    input: '["   -042abc"]',
    expected: '-42',
    cases: [
      { input: '["4193 with words"]', expected: '4193' },
      { input: '["words and 987"]', expected: '0' },
      { input: '[""]', expected: '0' },
      { input: '["-91283472332"]', expected: '-2147483648' },
      { input: '["2147483648"]', expected: '2147483647' },
      { input: '["+1"]', expected: '1' },
    ],
    solutions: [
      {
        label: 'Collect digits, then convert',
        complexity: 'O(n)',
        code: `function myAtoi(s) {
  let i = 0;
  while (i < s.length && s[i] === " ") i++;
  let sign = 1;
  if (i < s.length && (s[i] === "-" || s[i] === "+")) {
    if (s[i] === "-") sign = -1;
    i++;
  }
  let digits = "";
  while (i < s.length && s[i] >= "0" && s[i] <= "9") {
    digits += s[i];
    i++;
  }
  if (digits === "") return 0;
  const value = Number(digits) * sign + 0;
  if (value > 2147483647) return 2147483647;
  if (value < -2147483648) return -2147483648;
  return value;
}`,
      },
      {
        label: 'Accumulate with early clamp',
        complexity: 'O(n)',
        code: `function myAtoi(s) {
  let i = 0;
  while (i < s.length && s[i] === " ") i++;
  let sign = 1;
  if (i < s.length && (s[i] === "-" || s[i] === "+")) {
    if (s[i] === "-") sign = -1;
    i++;
  }
  let total = 0;
  while (i < s.length && s[i] >= "0" && s[i] <= "9") {
    total = total * 10 + (s.charCodeAt(i) - 48);
    if (sign === 1 && total > 2147483647) return 2147483647;
    if (sign === -1 && total > 2147483648) return -2147483648;
    i++;
  }
  return sign * total + 0;
}`,
      },
    ],
  },
  {
    id: 'longest-palindromic-substring',
    category: 'strings',
    lc: 'longest-palindromic-substring',
    n: 5,
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    tags: ['palindrome', 'expand'],
    pattern: 'Expand around center',
    summary:
      'Return the longest contiguous piece of the text that reads the same backwards (earliest one on ties).',
    hook: 'Every palindrome has a center: grow outward from each of the 2n-1 centers.',
    real: 'Finding symmetric structure, for example hairpins in DNA sequences.',
    input: '["babad"]',
    expected: '"bab"',
    cases: [
      { input: '["cbbd"]', expected: '"bb"' },
      { input: '["a"]', expected: '"a"' },
      { input: '["abc"]', expected: '"a"' },
      { input: '["forgeeksskeegfor"]', expected: '"geeksskeeg"' },
    ],
    solutions: [
      {
        label: 'Check every substring',
        complexity: 'O(n³)',
        code: `function isPal(s, l, r) {
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++;
    r--;
  }
  return true;
}
function longestPalindrome(s) {
  let best = "";
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      if (isPal(s, i, j) && j - i + 1 > best.length) best = s.slice(i, j + 1);
    }
  }
  return best;
}`,
      },
      {
        label: 'Expand around centers',
        complexity: 'O(n²)',
        code: `function expand(s, l, r) {
  while (l >= 0 && r < s.length && s[l] === s[r]) {
    l--;
    r++;
  }
  return r - l - 1;
}
function longestPalindrome(s) {
  let start = 0;
  let bestLen = 0;
  for (let c = 0; c < s.length; c++) {
    const a = expand(s, c, c);
    const b = expand(s, c, c + 1);
    if (a > bestLen) {
      bestLen = a;
      start = c - (a - 1) / 2;
    }
    if (b > bestLen) {
      bestLen = b;
      start = c - b / 2 + 1;
    }
  }
  return s.slice(start, start + bestLen);
}`,
      },
    ],
    scale: { sizes: SIZES, make: (n) => JSON.stringify([rep('a', n)]) },
  },
  {
    id: 'palindromic-substrings',
    category: 'strings',
    lc: 'palindromic-substrings',
    n: 647,
    title: 'Palindromic Substrings',
    difficulty: 'Medium',
    tags: ['palindrome', 'expand'],
    pattern: 'Expand around center',
    summary:
      'Count how many contiguous pieces of the text (by position) read the same in both directions.',
    hook: 'Each successful expansion from a center is one more palindrome.',
    real: 'Counting symmetric motifs in a sequence for bioinformatics or pattern statistics.',
    input: '["aaa"]',
    expected: '6',
    cases: [
      { input: '["abc"]', expected: '3' },
      { input: '["a"]', expected: '1' },
      { input: '[""]', expected: '0' },
      { input: '["abba"]', expected: '6' },
    ],
    solutions: [
      {
        label: 'Check every substring',
        complexity: 'O(n³)',
        code: `function isPal(s, l, r) {
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++;
    r--;
  }
  return true;
}
function countSubstrings(s) {
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      if (isPal(s, i, j)) count++;
    }
  }
  return count;
}`,
      },
      {
        label: 'Expand around centers',
        complexity: 'O(n²)',
        code: `function countFrom(s, l, r) {
  let found = 0;
  while (l >= 0 && r < s.length && s[l] === s[r]) {
    found++;
    l--;
    r++;
  }
  return found;
}
function countSubstrings(s) {
  let count = 0;
  for (let c = 0; c < s.length; c++) {
    count += countFrom(s, c, c);
    count += countFrom(s, c, c + 1);
  }
  return count;
}`,
      },
    ],
    scale: { sizes: SIZES, make: (n) => JSON.stringify([rep('a', n)]) },
  },
  {
    id: 'reverse-words-in-a-string',
    category: 'strings',
    lc: 'reverse-words-in-a-string',
    n: 151,
    title: 'Reverse Words in a String',
    difficulty: 'Medium',
    tags: ['parsing'],
    pattern: 'Tokenize and reverse',
    summary:
      'Reverse the order of the words, dropping extra spaces so words are separated by exactly one space.',
    hook: 'Walk from the back, skip spaces, grab a word, repeat.',
    real: 'Tokenizers and command-line parsers that must tolerate messy whitespace.',
    input: '["  the sky  is blue "]',
    expected: '"blue is sky the"',
    cases: [
      { input: '["hello"]', expected: '"hello"' },
      { input: '["   "]', expected: '""' },
      { input: '["a good   example"]', expected: '"example good a"' },
    ],
    solutions: [
      {
        label: 'Split, filter, walk backwards',
        complexity: 'O(n)',
        code: `function reverseWords(s) {
  const parts = s.split(" ");
  const out = [];
  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i] !== "") out.push(parts[i]);
  }
  return out.join(" ");
}`,
      },
      {
        label: 'Scan from the end',
        complexity: 'O(n)',
        code: `function reverseWords(s) {
  let i = s.length - 1;
  let out = "";
  while (i >= 0) {
    while (i >= 0 && s[i] === " ") i--;
    if (i < 0) break;
    const end = i;
    while (i >= 0 && s[i] !== " ") i--;
    const word = s.slice(i + 1, end + 1);
    out = out === "" ? word : out + " " + word;
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'count-and-say',
    category: 'strings',
    lc: 'count-and-say',
    n: 38,
    title: 'Count and Say',
    difficulty: 'Medium',
    tags: ['simulation', 'run-length'],
    pattern: 'Run-length encode the previous term',
    summary:
      'Each term describes the previous term by reading its runs aloud as count then digit. Return the nth term.',
    hook: '"21" is one 2, one 1, so the next term is "1211".',
    real: 'Run-length encoding, used in image formats and simple compression.',
    input: '[4]',
    expected: '"1211"',
    cases: [
      { input: '[1]', expected: '"1"' },
      { input: '[5]', expected: '"111221"' },
      { input: '[6]', expected: '"312211"' },
    ],
    solutions: [
      {
        label: 'Recursion on n-1',
        complexity: 'O(L)',
        code: `function countAndSay(n) {
  if (n === 1) return "1";
  const prev = countAndSay(n - 1);
  let out = "";
  let count = 1;
  for (let i = 1; i <= prev.length; i++) {
    if (i < prev.length && prev[i] === prev[i - 1]) {
      count++;
    } else {
      out += String(count) + prev[i - 1];
      count = 1;
    }
  }
  return out;
}`,
      },
      {
        label: 'Iterate and group runs',
        complexity: 'O(L)',
        code: `function countAndSay(n) {
  let cur = "1";
  for (let step = 2; step <= n; step++) {
    let next = "";
    let i = 0;
    while (i < cur.length) {
      let j = i;
      while (j < cur.length && cur[j] === cur[i]) j++;
      next += String(j - i) + cur[i];
      i = j;
    }
    cur = next;
  }
  return cur;
}`,
      },
    ],
  },
  {
    id: 'find-the-index-of-the-first-occurrence-in-a-string',
    category: 'strings',
    lc: 'find-the-index-of-the-first-occurrence-in-a-string',
    n: 28,
    title: 'First Occurrence of a Substring',
    difficulty: 'Easy',
    tags: ['string matching', 'KMP'],
    pattern: 'KMP failure table',
    summary:
      'Return the first index where the needle appears inside the haystack, or -1 if it never does.',
    hook: 'On a mismatch, do not restart: the failure table says how much already matches.',
    real: 'The core of find-in-page, grep, and text editors search.',
    input: '["hello", "ll"]',
    expected: '2',
    cases: [
      { input: '["a", "a"]', expected: '0' },
      { input: '["abc", "d"]', expected: '-1' },
      { input: '["aaa", "aaaa"]', expected: '-1' },
      { input: '["abc", ""]', expected: '0' },
      { input: '["aabaaabaaac", "aabaaac"]', expected: '4' },
    ],
    solutions: [
      {
        label: 'Try every start',
        complexity: 'O(n·m)',
        code: `function strStr(haystack, needle) {
  const n = haystack.length;
  const m = needle.length;
  for (let i = 0; i + m <= n; i++) {
    let j = 0;
    while (j < m && haystack[i + j] === needle[j]) j++;
    if (j === m) return i;
  }
  return -1;
}`,
      },
      {
        label: 'KMP',
        complexity: 'O(n + m)',
        code: `function strStr(haystack, needle) {
  const m = needle.length;
  if (m === 0) return 0;
  const lps = [0];
  let k = 0;
  for (let i = 1; i < m; i++) {
    while (k > 0 && needle[i] !== needle[k]) k = lps[k - 1];
    if (needle[i] === needle[k]) k++;
    lps.push(k);
  }
  let q = 0;
  for (let i = 0; i < haystack.length; i++) {
    while (q > 0 && haystack[i] !== needle[q]) q = lps[q - 1];
    if (haystack[i] === needle[q]) q++;
    if (q === m) return i - m + 1;
  }
  return -1;
}`,
      },
    ],
    scale: {
      sizes: SIZES,
      make: (n) => JSON.stringify([rep('a', n), rep('a', Math.floor(n / 2) - 1) + 'b']),
    },
  },
  {
    id: 'valid-palindrome-ii',
    category: 'strings',
    lc: 'valid-palindrome-ii',
    n: 680,
    title: 'Valid Palindrome II',
    difficulty: 'Easy',
    tags: ['two pointers', 'palindrome'],
    pattern: 'Two pointers with one skip',
    summary: 'Decide whether the text becomes a palindrome after deleting at most one character.',
    hook: 'At the first mismatch there are only two options: skip the left char or skip the right.',
    real: 'Spell-checkers and fuzzy matching tolerate a single-edit difference.',
    input: '["abca"]',
    expected: 'true',
    cases: [
      { input: '["aba"]', expected: 'true' },
      { input: '["abc"]', expected: 'false' },
      { input: '["a"]', expected: 'true' },
      { input: '["abcdba"]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Try deleting every character',
        complexity: 'O(n²)',
        code: `function isPalExcept(s, skip) {
  let l = 0;
  let r = s.length - 1;
  while (true) {
    if (l === skip) l++;
    if (r === skip) r--;
    if (l >= r) return true;
    if (s[l] !== s[r]) return false;
    l++;
    r--;
  }
}
function validPalindrome(s) {
  if (isPalExcept(s, -1)) return true;
  for (let i = 0; i < s.length; i++) {
    if (isPalExcept(s, i)) return true;
  }
  return false;
}`,
      },
      {
        label: 'Two pointers, one skip',
        complexity: 'O(n)',
        code: `function isPal(s, l, r) {
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++;
    r--;
  }
  return true;
}
function validPalindrome(s) {
  let l = 0;
  let r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return isPal(s, l + 1, r) || isPal(s, l, r - 1);
    l++;
    r--;
  }
  return true;
}`,
      },
    ],
    scale: {
      sizes: SIZES,
      make: (n) => {
        const k = Math.max(1, Math.floor(n / 2) - 1);
        return JSON.stringify([rep('a', k) + 'bcd' + rep('a', k)]);
      },
    },
  },
  {
    id: 'ransom-note',
    category: 'strings',
    lc: 'ransom-note',
    n: 383,
    title: 'Ransom Note',
    difficulty: 'Easy',
    tags: ['hash map', 'counting'],
    pattern: 'Character counts',
    summary:
      'Check whether a note can be assembled from the letters of a magazine, using each magazine letter at most once.',
    hook: 'Count what you have, then spend it.',
    real: 'Inventory checks: can the available stock satisfy this order?',
    input: '["aab", "baa"]',
    expected: 'true',
    cases: [
      { input: '["a", "b"]', expected: 'false' },
      { input: '["aa", "ab"]', expected: 'false' },
      { input: '["", "x"]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Find and cross out each letter',
        complexity: 'O(n·m)',
        code: `function canConstruct(ransomNote, magazine) {
  const used = [];
  for (let j = 0; j < magazine.length; j++) used.push(false);
  for (let i = 0; i < ransomNote.length; i++) {
    let found = false;
    for (let j = 0; j < magazine.length; j++) {
      if (!used[j] && magazine[j] === ransomNote[i]) {
        used[j] = true;
        found = true;
        break;
      }
    }
    if (!found) return false;
  }
  return true;
}`,
      },
      {
        label: 'Count letters',
        complexity: 'O(n + m)',
        code: `function canConstruct(ransomNote, magazine) {
  const counts = new Map();
  for (let j = 0; j < magazine.length; j++) {
    const c = magazine[j];
    counts.set(c, (counts.get(c) || 0) + 1);
  }
  for (let i = 0; i < ransomNote.length; i++) {
    const c = ransomNote[i];
    const have = counts.get(c) || 0;
    if (have === 0) return false;
    counts.set(c, have - 1);
  }
  return true;
}`,
      },
    ],
    scale: {
      sizes: SIZES,
      make: (n) =>
        JSON.stringify([rep('a', Math.floor(n / 2)), rep('b', n) + rep('a', Math.floor(n / 2))]),
    },
  },
  {
    id: 'first-unique-character-in-a-string',
    category: 'strings',
    lc: 'first-unique-character-in-a-string',
    n: 387,
    title: 'First Unique Character',
    difficulty: 'Easy',
    tags: ['hash map', 'counting'],
    pattern: 'Count then scan',
    summary:
      'Return the index of the first character that appears exactly once, or -1 if none does.',
    hook: 'Pass one: count. Pass two: first char with count 1.',
    real: 'Deduplication and first-seen analysis over event streams.',
    input: '["leetcode"]',
    expected: '0',
    cases: [
      { input: '["loveleetcode"]', expected: '2' },
      { input: '["aabb"]', expected: '-1' },
      { input: '["z"]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Compare against every other char',
        complexity: 'O(n²)',
        code: `function firstUniqChar(s) {
  for (let i = 0; i < s.length; i++) {
    let dup = false;
    for (let j = 0; j < s.length; j++) {
      if (i !== j && s[i] === s[j]) {
        dup = true;
        break;
      }
    }
    if (!dup) return i;
  }
  return -1;
}`,
      },
      {
        label: 'Count then scan',
        complexity: 'O(n)',
        code: `function firstUniqChar(s) {
  const counts = new Map();
  for (let i = 0; i < s.length; i++) {
    counts.set(s[i], (counts.get(s[i]) || 0) + 1);
  }
  for (let i = 0; i < s.length; i++) {
    if (counts.get(s[i]) === 1) return i;
  }
  return -1;
}`,
      },
    ],
    scale: {
      sizes: SIZES,
      make: (n) => {
        const half = Math.max(1, Math.floor(n / 2));
        return JSON.stringify([uni(half) + uni(half)]);
      },
    },
  },
  {
    id: 'add-binary',
    category: 'strings',
    lc: 'add-binary',
    n: 67,
    title: 'Add Binary',
    difficulty: 'Easy',
    tags: ['math', 'simulation'],
    pattern: 'Digit-by-digit addition with carry',
    summary: 'Add two binary numbers given as text and return the sum as text.',
    hook: 'Grade-school addition from the right, carrying 1s.',
    real: 'Big-integer arithmetic, where numbers are too large for a machine word.',
    input: '["1010", "1011"]',
    expected: '"10101"',
    cases: [
      { input: '["11", "1"]', expected: '"100"' },
      { input: '["0", "0"]', expected: '"0"' },
      { input: '["1", "111"]', expected: '"1000"' },
    ],
    solutions: [
      {
        label: 'Pad to equal length',
        complexity: 'O(n)',
        code: `function addBinary(a, b) {
  while (a.length < b.length) a = "0" + a;
  while (b.length < a.length) b = "0" + b;
  let out = "";
  let carry = 0;
  for (let i = a.length - 1; i >= 0; i--) {
    const sum = carry + (a.charCodeAt(i) - 48) + (b.charCodeAt(i) - 48);
    out = String(sum % 2) + out;
    carry = Math.floor(sum / 2);
  }
  if (carry > 0) out = "1" + out;
  return out;
}`,
      },
      {
        label: 'Two pointers with carry',
        complexity: 'O(n)',
        code: `function addBinary(a, b) {
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;
  let out = "";
  while (i >= 0 || j >= 0 || carry > 0) {
    let sum = carry;
    if (i >= 0) {
      sum += a.charCodeAt(i) - 48;
      i--;
    }
    if (j >= 0) {
      sum += b.charCodeAt(j) - 48;
      j--;
    }
    out = String(sum % 2) + out;
    carry = Math.floor(sum / 2);
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'multiply-strings',
    category: 'strings',
    lc: 'multiply-strings',
    n: 43,
    title: 'Multiply Strings',
    difficulty: 'Medium',
    tags: ['math', 'simulation'],
    pattern: 'Positional digit multiplication',
    summary:
      'Multiply two non-negative integers given as digit strings, without converting them to numbers.',
    hook: 'Digit i times digit j lands in result slots i+j and i+j+1.',
    real: 'Arbitrary-precision multiplication in big-number libraries.',
    input: '["23", "45"]',
    expected: '"1035"',
    cases: [
      { input: '["0", "52"]', expected: '"0"' },
      { input: '["999", "999"]', expected: '"998001"' },
      { input: '["2", "3"]', expected: '"6"' },
    ],
    solutions: [
      {
        label: 'Partial products then add',
        complexity: 'O(n·m)',
        code: `function mulDigit(a, d) {
  let carry = 0;
  let out = "";
  for (let i = a.length - 1; i >= 0; i--) {
    const p = (a.charCodeAt(i) - 48) * d + carry;
    out = String(p % 10) + out;
    carry = Math.floor(p / 10);
  }
  if (carry > 0) out = String(carry) + out;
  return out;
}
function addStrings(a, b) {
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;
  let out = "";
  while (i >= 0 || j >= 0 || carry > 0) {
    let sum = carry;
    if (i >= 0) {
      sum += a.charCodeAt(i) - 48;
      i--;
    }
    if (j >= 0) {
      sum += b.charCodeAt(j) - 48;
      j--;
    }
    out = String(sum % 10) + out;
    carry = Math.floor(sum / 10);
  }
  while (out.length > 1 && out[0] === "0") out = out.slice(1);
  return out;
}
function multiply(num1, num2) {
  let total = "0";
  for (let i = num2.length - 1; i >= 0; i--) {
    let part = mulDigit(num1, num2.charCodeAt(i) - 48);
    for (let z = 0; z < num2.length - 1 - i; z++) part += "0";
    total = addStrings(total, part);
  }
  return total;
}`,
      },
      {
        label: 'Single result array',
        complexity: 'O(n·m)',
        code: `function multiply(num1, num2) {
  const n = num1.length;
  const m = num2.length;
  const res = [];
  for (let k = 0; k < n + m; k++) res.push(0);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      const prod = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48) + res[i + j + 1];
      res[i + j + 1] = prod % 10;
      res[i + j] += Math.floor(prod / 10);
    }
  }
  let k = 0;
  while (k < res.length - 1 && res[k] === 0) k++;
  let out = "";
  for (; k < res.length; k++) out += res[k];
  return out;
}`,
      },
    ],
  },
  {
    id: 'zigzag-conversion',
    category: 'strings',
    lc: 'zigzag-conversion',
    n: 6,
    title: 'Zigzag Conversion',
    difficulty: 'Medium',
    tags: ['simulation'],
    pattern: 'Row simulation or cycle jumps',
    summary: 'Write the text in a zigzag over a given number of rows, then read it row by row.',
    hook: 'Bounce the row index down and up; or jump by 2*(rows-1).',
    real: 'Interleaving and striping data across a fixed number of lanes or disks.',
    input: '["PAYPALISHIRING", 3]',
    expected: '"PAHNAPLSIIGYIR"',
    cases: [
      { input: '["PAYPALISHIRING", 4]', expected: '"PINALSIGYAHRPI"' },
      { input: '["A", 1]', expected: '"A"' },
      { input: '["AB", 1]', expected: '"AB"' },
    ],
    solutions: [
      {
        label: 'Simulate the bounce',
        complexity: 'O(n)',
        code: `function convert(s, numRows) {
  if (numRows === 1 || numRows >= s.length) return s;
  const rows = [];
  for (let r = 0; r < numRows; r++) rows.push("");
  let row = 0;
  let dir = 1;
  for (let i = 0; i < s.length; i++) {
    rows[row] += s[i];
    if (row === 0) dir = 1;
    else if (row === numRows - 1) dir = -1;
    row += dir;
  }
  return rows.join("");
}`,
      },
      {
        label: 'Jump by cycle length',
        complexity: 'O(n)',
        code: `function convert(s, numRows) {
  if (numRows === 1) return s;
  const cycle = 2 * (numRows - 1);
  let out = "";
  for (let r = 0; r < numRows; r++) {
    for (let i = r; i < s.length; i += cycle) {
      out += s[i];
      if (r > 0 && r < numRows - 1) {
        const j = i + cycle - 2 * r;
        if (j < s.length) out += s[j];
      }
    }
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'word-pattern',
    category: 'strings',
    lc: 'word-pattern',
    n: 290,
    title: 'Word Pattern',
    difficulty: 'Easy',
    tags: ['hash map'],
    pattern: 'Bijection between letters and words',
    summary:
      'Check whether the words follow the same repetition pattern as the given letters, one letter per word.',
    hook: 'Same idea as isomorphic strings: map both ways and reject any conflict.',
    real: 'Template matching where placeholders must bind to the same value everywhere.',
    input: '["abba", "dog cat cat dog"]',
    expected: 'true',
    cases: [
      { input: '["abba", "dog cat cat fish"]', expected: 'false' },
      { input: '["aaaa", "dog cat cat dog"]', expected: 'false' },
      { input: '["abba", "dog dog dog dog"]', expected: 'false' },
      { input: '["a", "x y"]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Compare every pair of positions',
        complexity: 'O(n²)',
        code: `function wordPattern(pattern, s) {
  const words = s.split(" ");
  if (words.length !== pattern.length) return false;
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      if ((pattern[i] === pattern[j]) !== (words[i] === words[j])) return false;
    }
  }
  return true;
}`,
      },
      {
        label: 'Two maps',
        complexity: 'O(n)',
        code: `function wordPattern(pattern, s) {
  const words = s.split(" ");
  if (words.length !== pattern.length) return false;
  const toWord = new Map();
  const toChar = new Map();
  for (let i = 0; i < words.length; i++) {
    const c = pattern[i];
    const w = words[i];
    if (toWord.has(c) && toWord.get(c) !== w) return false;
    if (toChar.has(w) && toChar.get(w) !== c) return false;
    toWord.set(c, w);
    toChar.set(w, c);
  }
  return true;
}`,
      },
    ],
    scale: {
      sizes: SIZES,
      make: (n) => JSON.stringify([uni(n), Array.from({ length: n }, (_, i) => 'w' + i).join(' ')]),
    },
  },
  {
    id: 'string-compression',
    category: 'strings',
    lc: 'string-compression',
    n: 443,
    title: 'String Compression',
    difficulty: 'Medium',
    tags: ['two pointers', 'run-length'],
    pattern: 'Read/write pointers',
    summary:
      'Compress a character list in place: each run becomes the character followed by its count digits (omitted when the run is 1). Return the compressed prefix.',
    hook: 'The write pointer never overtakes the read pointer, so overwrite safely.',
    real: 'Run-length encoding in place, as in simple image and log compressors.',
    input: '[["a", "a", "b", "b", "c", "c", "c"]]',
    expected: '["a", "2", "b", "2", "c", "3"]',
    cases: [
      { input: '[["a"]]', expected: '["a"]' },
      {
        input: '[["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"]]',
        expected: '["a", "b", "1", "2"]',
      },
      { input: '[["a", "b", "c"]]', expected: '["a", "b", "c"]' },
    ],
    solutions: [
      {
        label: 'Build a string, write it back',
        complexity: 'O(n)',
        code: `function compress(chars) {
  let out = "";
  let i = 0;
  while (i < chars.length) {
    let j = i;
    while (j < chars.length && chars[j] === chars[i]) j++;
    out += chars[i];
    if (j - i > 1) out += String(j - i);
    i = j;
  }
  for (let k = 0; k < out.length; k++) chars[k] = out[k];
  return chars.slice(0, out.length);
}`,
      },
      {
        label: 'In-place read/write pointers',
        complexity: 'O(n)',
        code: `function compress(chars) {
  let write = 0;
  let read = 0;
  while (read < chars.length) {
    const c = chars[read];
    const start = read;
    while (read < chars.length && chars[read] === c) read++;
    chars[write] = c;
    write++;
    if (read - start > 1) {
      const cnt = String(read - start);
      for (let k = 0; k < cnt.length; k++) {
        chars[write] = cnt[k];
        write++;
      }
    }
  }
  return chars.slice(0, write);
}`,
      },
    ],
  },
  {
    id: 'reverse-vowels-of-a-string',
    category: 'strings',
    lc: 'reverse-vowels-of-a-string',
    n: 345,
    title: 'Reverse Vowels of a String',
    difficulty: 'Easy',
    tags: ['two pointers'],
    pattern: 'Two pointers with a filter',
    summary: 'Reverse only the vowels of the text, leaving every other character where it is.',
    hook: 'Move each pointer to the next vowel, then swap.',
    real: 'Selective transformations over a subset of elements, keeping the rest in place.',
    input: '["IceCreAm"]',
    expected: '"AceCreIm"',
    cases: [
      { input: '["leetcode"]', expected: '"leotcede"' },
      { input: '["bcd"]', expected: '"bcd"' },
      { input: '[""]', expected: '""' },
    ],
    solutions: [
      {
        label: 'Collect vowels, refill backwards',
        complexity: 'O(n)',
        code: `function isVowel(c) {
  return "aeiouAEIOU".includes(c);
}
function reverseVowels(s) {
  const vowels = [];
  for (let i = 0; i < s.length; i++) {
    if (isVowel(s[i])) vowels.push(s[i]);
  }
  let out = "";
  for (let i = 0; i < s.length; i++) {
    out += isVowel(s[i]) ? vowels.pop() : s[i];
  }
  return out;
}`,
      },
      {
        label: 'Two pointers swap',
        complexity: 'O(n)',
        code: `function isVowel(c) {
  return "aeiouAEIOU".includes(c);
}
function reverseVowels(s) {
  const arr = s.split("");
  let lo = 0;
  let hi = arr.length - 1;
  while (lo < hi) {
    if (!isVowel(arr[lo])) lo++;
    else if (!isVowel(arr[hi])) hi--;
    else {
      const tmp = arr[lo];
      arr[lo] = arr[hi];
      arr[hi] = tmp;
      lo++;
      hi--;
    }
  }
  return arr.join("");
}`,
      },
    ],
  },
  {
    id: 'backspace-string-compare',
    category: 'strings',
    lc: 'backspace-string-compare',
    n: 844,
    title: 'Backspace String Compare',
    difficulty: 'Easy',
    tags: ['stack', 'two pointers'],
    pattern: 'Stack or reverse scan',
    summary:
      'Two texts are typed into editors where # means backspace. Decide whether they end up identical.',
    hook: 'Scanning from the back, a # tells you how many letters to skip.',
    real: 'Replaying edit logs to check that two editors converge on the same text.',
    input: '["ab#c", "ad#c"]',
    expected: 'true',
    cases: [
      { input: '["a#c", "b"]', expected: 'false' },
      { input: '["a##c", "#a#c"]', expected: 'true' },
      { input: '["a", "a#"]', expected: 'false' },
      { input: '["#", ""]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Build both results with a stack',
        complexity: 'O(n + m)',
        code: `function build(s) {
  const stack = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "#") stack.pop();
    else stack.push(s[i]);
  }
  return stack.join("");
}
function backspaceCompare(s, t) {
  return build(s) === build(t);
}`,
      },
      {
        label: 'Reverse scan with skip counts',
        complexity: 'O(n + m)',
        code: `function nextValid(s, i) {
  let skip = 0;
  while (i >= 0) {
    if (s[i] === "#") {
      skip++;
      i--;
    } else if (skip > 0) {
      skip--;
      i--;
    } else break;
  }
  return i;
}
function backspaceCompare(s, t) {
  let i = s.length - 1;
  let j = t.length - 1;
  while (true) {
    i = nextValid(s, i);
    j = nextValid(t, j);
    if (i < 0 || j < 0) return i < 0 && j < 0;
    if (s[i] !== t[j]) return false;
    i--;
    j--;
  }
}`,
      },
    ],
  },
  {
    id: 'length-of-last-word',
    category: 'strings',
    lc: 'length-of-last-word',
    n: 58,
    title: 'Length of Last Word',
    difficulty: 'Easy',
    tags: ['parsing'],
    pattern: 'Scan from the end',
    summary: 'Return the length of the final word in a text that may have trailing spaces.',
    hook: 'Skip trailing spaces, then count letters until the next space.',
    real: 'Parsing the last path segment or the last token of a command line.',
    input: '["   fly me   to   the moon  "]',
    expected: '4',
    cases: [
      { input: '["Hello World"]', expected: '5' },
      { input: '["a"]', expected: '1' },
      { input: '["   "]', expected: '0' },
      { input: '["luffy is still joyboy"]', expected: '6' },
    ],
    solutions: [
      {
        label: 'Split and find last non-empty',
        complexity: 'O(n)',
        code: `function lengthOfLastWord(s) {
  const words = s.split(" ");
  for (let i = words.length - 1; i >= 0; i--) {
    if (words[i] !== "") return words[i].length;
  }
  return 0;
}`,
      },
      {
        label: 'Scan backwards',
        complexity: 'O(n)',
        code: `function lengthOfLastWord(s) {
  let i = s.length - 1;
  while (i >= 0 && s[i] === " ") i--;
  let count = 0;
  while (i >= 0 && s[i] !== " ") {
    count++;
    i--;
  }
  return count;
}`,
      },
    ],
  },
  {
    id: 'repeated-substring-pattern',
    category: 'strings',
    lc: 'repeated-substring-pattern',
    n: 459,
    title: 'Repeated Substring Pattern',
    difficulty: 'Easy',
    tags: ['string matching'],
    pattern: 'Divisors or doubled string',
    summary:
      'Decide whether the text is made by repeating one of its own pieces two or more times.',
    hook: 'If s is periodic, it reappears inside s+s at an offset other than 0 and len.',
    real: 'Detecting periodic signals or repeated blocks in logs and data.',
    input: '["abab"]',
    expected: 'true',
    cases: [
      { input: '["aba"]', expected: 'false' },
      { input: '["a"]', expected: 'false' },
      { input: '["abcabcabcabc"]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Try each divisor length',
        complexity: 'O(n·d(n))',
        code: `function repeatedSubstringPattern(s) {
  const n = s.length;
  for (let len = Math.floor(n / 2); len >= 1; len--) {
    if (n % len !== 0) continue;
    let ok = true;
    for (let i = len; i < n; i++) {
      if (s[i] !== s[i - len]) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }
  return false;
}`,
      },
      {
        label: 'Search inside s + s',
        complexity: 'O(n)',
        code: `function repeatedSubstringPattern(s) {
  const doubled = s + s;
  return doubled.indexOf(s, 1) !== s.length;
}`,
      },
    ],
  },
];
