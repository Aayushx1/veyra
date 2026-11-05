import type { Problem } from '../types';

export const mathBits: Problem[] = [
  {
    id: 'single-number',
    category: 'math-bits',
    lc: 'single-number',
    n: 136,
    title: 'The Lone Number',
    difficulty: 'Easy',
    tags: ['xor', 'bit manipulation'],
    pattern: 'XOR cancels pairs',
    summary: 'Every value appears twice except one. Find the one that appears only once.',
    hook: 'x ^ x = 0 and x ^ 0 = x, so XOR everything and the pairs vanish.',
    real: 'Parity and checksum schemes (like RAID parity) use XOR so duplicated data cancels out.',
    input: '[[4, 1, 2, 1, 2]]',
    expected: '4',
    cases: [
      { input: '[[1]]', expected: '1' },
      { input: '[[2, 2, 1]]', expected: '1' },
      { input: '[[-1, -1, -2]]', expected: '-2' },
    ],
    solutions: [
      {
        label: 'Toggle membership in a set',
        complexity: 'O(n)',
        code: `function singleNumber(nums) {
  const odd = new Set();
  for (let i = 0; i < nums.length; i++) {
    if (odd.has(nums[i])) {
      odd.delete(nums[i]);
    } else {
      odd.add(nums[i]);
    }
  }
  return Array.from(odd)[0];
}`,
      },
      {
        label: 'XOR everything',
        complexity: 'O(n)',
        code: `function singleNumber(nums) {
  let x = 0;
  for (let i = 0; i < nums.length; i++) {
    x ^= nums[i];
  }
  return x;
}`,
      },
    ],
    scale: {
      sizes: [10, 50, 100, 200, 400],
      make: (n) => {
        const a: number[] = [];
        for (let i = 0; i < n; i++) a.push(i, i);
        a.push(999999);
        return JSON.stringify([a]);
      },
    },
  },
  {
    id: 'number-of-1-bits',
    category: 'math-bits',
    lc: 'number-of-1-bits',
    n: 191,
    title: 'Count Set Bits',
    difficulty: 'Easy',
    tags: ['bit manipulation'],
    pattern: "Kernighan's trick",
    summary: 'Count how many bits equal 1 in the binary form of a non-negative integer.',
    hook: 'n & (n - 1) erases the lowest set bit, so loop once per set bit.',
    real: 'Population counts power bitmap indexes, Bloom filter stats and Hamming-distance searches.',
    input: '[11]',
    expected: '3',
    cases: [
      { input: '[0]', expected: '0' },
      { input: '[128]', expected: '1' },
      { input: '[2147483647]', expected: '31' },
    ],
    solutions: [
      {
        label: 'Test every bit',
        complexity: 'O(w)',
        code: `function hammingWeight(n) {
  let count = 0;
  for (let i = 0; i < 32; i++) {
    count += (n >>> i) & 1;
  }
  return count;
}`,
      },
      {
        label: "Kernighan's trick",
        complexity: 'O(k)',
        code: `function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1);
    count++;
  }
  return count;
}`,
      },
    ],
  },
  {
    id: 'counting-bits',
    category: 'math-bits',
    lc: 'counting-bits',
    n: 338,
    title: 'Bit Counts Up To N',
    difficulty: 'Easy',
    tags: ['bit manipulation', 'dp'],
    pattern: 'Reuse the answer for i >> 1',
    summary: 'For every number from 0 to n, report how many 1 bits it has.',
    hook: 'bits[i] = bits[i >> 1] + (i & 1): shift away the last bit and reuse.',
    real: 'Precomputed popcount lookup tables speed up compression and chess engines.',
    input: '[5]',
    expected: '[0, 1, 1, 2, 1, 2]',
    cases: [
      { input: '[0]', expected: '[0]' },
      { input: '[2]', expected: '[0, 1, 1]' },
      { input: '[8]', expected: '[0, 1, 1, 2, 1, 2, 2, 3, 1]' },
    ],
    solutions: [
      {
        label: 'Count each number separately',
        complexity: 'O(n log n)',
        code: `function popcount(x) {
  let c = 0;
  while (x > 0) {
    c += x & 1;
    x = x >> 1;
  }
  return c;
}

function countBits(n) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    out.push(popcount(i));
  }
  return out;
}`,
      },
      {
        label: 'DP from i >> 1',
        complexity: 'O(n)',
        code: `function countBits(n) {
  const bits = [0];
  for (let i = 1; i <= n; i++) {
    bits.push(bits[i >> 1] + (i & 1));
  }
  return bits;
}`,
      },
    ],
    scale: {
      sizes: [8, 16, 32, 64, 128],
      make: (n) => JSON.stringify([n]),
    },
  },
  {
    id: 'reverse-bits',
    category: 'math-bits',
    lc: 'reverse-bits',
    n: 190,
    title: 'Reverse 32-Bit Integer',
    difficulty: 'Easy',
    tags: ['bit manipulation'],
    pattern: 'Shift out / shift in, or swap halves',
    summary:
      'Treat the input as a 32-bit unsigned value and return the value with its bit order reversed.',
    hook: 'Pop the lowest bit of n and push it onto the result; finish with >>> 0.',
    real: 'Bit reversal is the core reordering step in FFT implementations and some CRC variants.',
    input: '[43261596]',
    expected: '964176192',
    cases: [
      { input: '[0]', expected: '0' },
      { input: '[1]', expected: '2147483648' },
      { input: '[4294967293]', expected: '3221225471' },
    ],
    solutions: [
      {
        label: 'Move one bit at a time',
        complexity: 'O(w)',
        code: `function reverseBits(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1);
    n = n >>> 1;
  }
  return result >>> 0;
}`,
      },
      {
        label: 'Swap halves with masks',
        complexity: 'O(log w)',
        code: `function reverseBits(n) {
  n = n >>> 0;
  n = ((n >>> 16) | (n << 16)) >>> 0;
  n = (((n & 0xff00ff00) >>> 8) | ((n & 0x00ff00ff) << 8)) >>> 0;
  n = (((n & 0xf0f0f0f0) >>> 4) | ((n & 0x0f0f0f0f) << 4)) >>> 0;
  n = (((n & 0xcccccccc) >>> 2) | ((n & 0x33333333) << 2)) >>> 0;
  n = (((n & 0xaaaaaaaa) >>> 1) | ((n & 0x55555555) << 1)) >>> 0;
  return n;
}`,
      },
    ],
  },
  {
    id: 'power-of-two',
    category: 'math-bits',
    lc: 'power-of-two',
    n: 231,
    title: 'Is It A Power Of Two',
    difficulty: 'Easy',
    tags: ['bit manipulation'],
    pattern: 'n & (n - 1) == 0',
    summary: 'Decide whether an integer equals 2 raised to some non-negative power.',
    hook: 'A power of two has exactly one set bit, so n & (n - 1) is zero.',
    real: 'Hash tables and ring buffers use power-of-two sizes so modulo becomes a cheap bit mask.',
    input: '[16]',
    expected: 'true',
    cases: [
      { input: '[1]', expected: 'true' },
      { input: '[0]', expected: 'false' },
      { input: '[-16]', expected: 'false' },
      { input: '[6]', expected: 'false' },
      { input: '[1024]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Divide by two repeatedly',
        complexity: 'O(log n)',
        code: `function isPowerOfTwo(n) {
  if (n <= 0) return false;
  while (n % 2 === 0) {
    n = n / 2;
  }
  return n === 1;
}`,
      },
      {
        label: 'Single-bit check',
        complexity: 'O(1)',
        code: `function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 16, 24, 30],
      make: (n) => JSON.stringify([2 ** n]),
    },
  },
  {
    id: 'sum-of-two-integers',
    category: 'math-bits',
    lc: 'sum-of-two-integers',
    n: 371,
    title: 'Add Without Plus',
    difficulty: 'Medium',
    tags: ['bit manipulation'],
    pattern: 'XOR for sum, AND-shift for carry',
    summary: 'Add two 32-bit integers using only bitwise operators, no + or -.',
    hook: 'XOR is the sum without carries; (a & b) << 1 is the carries. Repeat.',
    real: 'This is how an adder circuit works: half-adders chain sum and carry bits.',
    input: '[5, 7]',
    expected: '12',
    cases: [
      { input: '[-1, 1]', expected: '0' },
      { input: '[0, 0]', expected: '0' },
      { input: '[-2, -3]', expected: '-5' },
    ],
    solutions: [
      {
        label: 'Full adder over 32 bit positions',
        complexity: 'O(w)',
        code: `function getSum(a, b) {
  let result = 0;
  let carry = 0;
  for (let i = 0; i < 32; i++) {
    const x = (a >> i) & 1;
    const y = (b >> i) & 1;
    const s = x ^ y ^ carry;
    carry = (x & y) | (carry & (x ^ y));
    result = result | (s << i);
  }
  return result;
}`,
      },
      {
        label: 'Carry loop',
        complexity: 'O(w)',
        code: `function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`,
      },
    ],
  },
  {
    id: 'reverse-integer',
    category: 'math-bits',
    lc: 'reverse-integer',
    n: 7,
    title: 'Reverse Integer',
    difficulty: 'Medium',
    tags: ['math', 'overflow'],
    pattern: 'Peel digits with % and /',
    summary:
      'Reverse the decimal digits of a signed 32-bit integer; return 0 if the result leaves the 32-bit range.',
    hook: 'Take x % 10, append to result times ten, drop a digit; check range at the end.',
    real: 'Overflow checks on reversed or re-scaled values are a classic source of integer bugs in parsers.',
    input: '[123]',
    expected: '321',
    cases: [
      { input: '[-123]', expected: '-321' },
      { input: '[120]', expected: '21' },
      { input: '[0]', expected: '0' },
      { input: '[1534236469]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Reverse the digit string',
        complexity: 'O(d)',
        code: `function reverse(x) {
  const sign = x < 0 ? -1 : 1;
  const s = String(Math.abs(x));
  let rev = '';
  for (let i = s.length - 1; i >= 0; i--) {
    rev += s[i];
  }
  const r = sign * Number(rev);
  if (r > 2147483647 || r < -2147483648) return 0;
  return r;
}`,
      },
      {
        label: 'Arithmetic digit peeling',
        complexity: 'O(d)',
        code: `function reverse(x) {
  const sign = x < 0 ? -1 : 1;
  let y = Math.abs(x);
  let r = 0;
  while (y > 0) {
    r = r * 10 + (y % 10);
    y = Math.floor(y / 10);
  }
  r = sign * r;
  if (r > 2147483647 || r < -2147483648) return 0;
  return r;
}`,
      },
    ],
  },
  {
    id: 'palindrome-number',
    category: 'math-bits',
    lc: 'palindrome-number',
    n: 9,
    title: 'Palindrome Number',
    difficulty: 'Easy',
    tags: ['math'],
    pattern: 'Reverse only half the digits',
    summary:
      'Tell whether an integer reads the same forwards and backwards. Negatives never qualify.',
    hook: 'Build the reversed right half until it catches up with the left half.',
    real: 'Checksum and ID validators often compare a number against its mirrored form.',
    input: '[121]',
    expected: 'true',
    cases: [
      { input: '[-121]', expected: 'false' },
      { input: '[10]', expected: 'false' },
      { input: '[0]', expected: 'true' },
      { input: '[1221]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Compare with the reversed string',
        complexity: 'O(d)',
        code: `function isPalindrome(x) {
  if (x < 0) return false;
  const s = String(x);
  let rev = '';
  for (let i = s.length - 1; i >= 0; i--) {
    rev += s[i];
  }
  return rev === s;
}`,
      },
      {
        label: 'Reverse half the number',
        complexity: 'O(d)',
        code: `function isPalindrome(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  let rev = 0;
  while (x > rev) {
    rev = rev * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return x === rev || x === Math.floor(rev / 10);
}`,
      },
    ],
  },
  {
    id: 'powx-n',
    category: 'math-bits',
    lc: 'powx-n',
    n: 50,
    title: 'Integer Power',
    difficulty: 'Medium',
    tags: ['math', 'divide and conquer'],
    pattern: 'Exponentiation by squaring',
    summary:
      'Compute x raised to a non-negative integer power n, where x is an integer and the result fits exactly.',
    hook: 'Walk the bits of n: square the base each step, multiply in when the bit is 1.',
    real: 'Modular exponentiation in RSA and Diffie-Hellman relies on squaring to stay fast.',
    input: '[2, 10]',
    expected: '1024',
    cases: [
      { input: '[2, 0]', expected: '1' },
      { input: '[3, 5]', expected: '243' },
      { input: '[-2, 3]', expected: '-8' },
    ],
    solutions: [
      {
        label: 'Repeated multiplication',
        complexity: 'O(n)',
        code: `function power(x, n) {
  let r = 1;
  for (let i = 0; i < n; i++) {
    r = r * x;
  }
  return r;
}`,
      },
      {
        label: 'Fast exponentiation',
        complexity: 'O(log n)',
        code: `function power(x, n) {
  let r = 1;
  let base = x;
  let e = n;
  while (e > 0) {
    if (e & 1) r = r * base;
    base = base * base;
    e = e >> 1;
  }
  return r;
}`,
      },
    ],
    scale: {
      sizes: [16, 64, 256, 1024, 4096],
      make: (n) => JSON.stringify([1, n]),
    },
  },
  {
    id: 'fizz-buzz',
    category: 'math-bits',
    lc: 'fizz-buzz',
    n: 412,
    title: 'Fizz Buzz',
    difficulty: 'Easy',
    tags: ['simulation'],
    pattern: 'Divisibility rules',
    summary:
      'For 1..n output "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for both, otherwise the number as text.',
    hook: 'Build the word by appending, so the both-case falls out for free.',
    real: 'Rule-based formatting, like pluralization or alert severity labels, composes small independent checks.',
    input: '[5]',
    expected: '["1", "2", "Fizz", "4", "Buzz"]',
    cases: [
      { input: '[1]', expected: '["1"]' },
      { input: '[3]', expected: '["1", "2", "Fizz"]' },
      {
        input: '[15]',
        expected:
          '["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]',
      },
    ],
    solutions: [
      {
        label: 'Modulo checks',
        complexity: 'O(n)',
        code: `function fizzBuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push('FizzBuzz');
    else if (i % 3 === 0) out.push('Fizz');
    else if (i % 5 === 0) out.push('Buzz');
    else out.push(String(i));
  }
  return out;
}`,
      },
      {
        label: 'Rolling counters, no modulo',
        complexity: 'O(n)',
        code: `function fizzBuzz(n) {
  const out = [];
  let c3 = 0;
  let c5 = 0;
  for (let i = 1; i <= n; i++) {
    c3++;
    c5++;
    let s = '';
    if (c3 === 3) {
      s += 'Fizz';
      c3 = 0;
    }
    if (c5 === 5) {
      s += 'Buzz';
      c5 = 0;
    }
    out.push(s === '' ? String(i) : s);
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'count-primes',
    category: 'math-bits',
    lc: 'count-primes',
    n: 204,
    title: 'Count Primes Below N',
    difficulty: 'Medium',
    tags: ['math', 'sieve'],
    pattern: 'Sieve of Eratosthenes',
    summary: 'Count the prime numbers strictly less than n.',
    hook: 'Instead of testing each number, cross out multiples of each prime starting at p * p.',
    real: 'Prime generation underlies key generation and hash-table sizing in cryptography and runtimes.',
    input: '[10]',
    expected: '4',
    cases: [
      { input: '[0]', expected: '0' },
      { input: '[2]', expected: '0' },
      { input: '[3]', expected: '1' },
      { input: '[20]', expected: '8' },
      { input: '[100]', expected: '25' },
    ],
    solutions: [
      {
        label: 'Trial division up to the square root',
        complexity: 'O(n√n)',
        code: `function countPrimes(n) {
  let count = 0;
  for (let i = 2; i < n; i++) {
    let isPrime = true;
    for (let d = 2; d * d <= i; d++) {
      if (i % d === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) count++;
  }
  return count;
}`,
      },
      {
        label: 'Sieve of Eratosthenes',
        complexity: 'O(n log log n)',
        code: `function countPrimes(n) {
  if (n < 3) return 0;
  const composite = new Array(n).fill(false);
  for (let p = 2; p * p < n; p++) {
    if (composite[p]) continue;
    for (let m = p * p; m < n; m += p) {
      composite[m] = true;
    }
  }
  let count = 0;
  for (let i = 2; i < n; i++) {
    if (!composite[i]) count++;
  }
  return count;
}`,
      },
    ],
    scale: {
      sizes: [100, 500, 1000, 2000, 3000],
      make: (n) => JSON.stringify([n]),
    },
  },
  {
    id: 'excel-sheet-column-number',
    category: 'math-bits',
    lc: 'excel-sheet-column-number',
    n: 171,
    title: 'Spreadsheet Column To Number',
    difficulty: 'Easy',
    tags: ['math', 'strings'],
    pattern: 'Base-26 with letters A=1..Z=26',
    summary:
      'Convert a spreadsheet column label such as "A", "Z", "AA" or "AB" into its 1-based column number.',
    hook: 'Horner: result = result * 26 + letter value, scanning left to right.',
    real: 'Spreadsheet and export tools convert between column labels and indexes constantly.',
    input: '["AB"]',
    expected: '28',
    cases: [
      { input: '["A"]', expected: '1' },
      { input: '["Z"]', expected: '26' },
      { input: '["ZY"]', expected: '701' },
      { input: '["AAA"]', expected: '703' },
    ],
    solutions: [
      {
        label: 'Sum letter * 26^position from the right',
        complexity: 'O(L)',
        code: `function titleToNumber(s) {
  let total = 0;
  let place = 1;
  for (let i = s.length - 1; i >= 0; i--) {
    total += (s.charCodeAt(i) - 64) * place;
    place *= 26;
  }
  return total;
}`,
      },
      {
        label: "Horner's rule",
        complexity: 'O(L)',
        code: `function titleToNumber(s) {
  let result = 0;
  for (let i = 0; i < s.length; i++) {
    result = result * 26 + (s.charCodeAt(i) - 64);
  }
  return result;
}`,
      },
    ],
  },
  {
    id: 'ugly-number',
    category: 'math-bits',
    lc: 'ugly-number',
    n: 263,
    title: 'Ugly Number',
    difficulty: 'Easy',
    tags: ['math'],
    pattern: 'Strip small prime factors',
    summary:
      'A number is "ugly" if it is positive and its only prime factors are 2, 3 and 5. Decide whether n is ugly.',
    hook: 'Divide out 2s, 3s and 5s; what remains must be exactly 1.',
    real: 'Smooth-number checks pick sizes whose factors are small, which keeps FFT transforms fast.',
    input: '[6]',
    expected: 'true',
    cases: [
      { input: '[1]', expected: 'true' },
      { input: '[14]', expected: 'false' },
      { input: '[0]', expected: 'false' },
      { input: '[-5]', expected: 'false' },
      { input: '[30]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Trial-divide by every candidate',
        complexity: 'O(n)',
        code: `function isUgly(n) {
  if (n <= 0) return false;
  for (let d = 2; d <= n; d++) {
    if (n % d === 0) {
      if (d > 5) return false;
      while (n % d === 0) {
        n = n / d;
      }
    }
  }
  return true;
}`,
      },
      {
        label: 'Divide only by 2, 3, 5',
        complexity: 'O(log n)',
        code: `function isUgly(n) {
  if (n <= 0) return false;
  while (n % 2 === 0) n = n / 2;
  while (n % 3 === 0) n = n / 3;
  while (n % 5 === 0) n = n / 5;
  return n === 1;
}`,
      },
    ],
    scale: {
      sizes: [101, 401, 1601, 6421, 25601],
      make: (n) => JSON.stringify([n]),
    },
  },
  {
    id: 'factorial-trailing-zeroes',
    category: 'math-bits',
    lc: 'factorial-trailing-zeroes',
    n: 172,
    title: 'Trailing Zeroes Of n!',
    difficulty: 'Medium',
    tags: ['math'],
    pattern: 'Count factors of 5',
    summary: 'Count the zeros at the end of n factorial without computing the factorial.',
    hook: 'Each trailing zero needs a 2 and a 5; 2s are plentiful, so count 5s: n/5 + n/25 + ...',
    real: 'Counting prime-power factors without building huge numbers is how big-number libraries avoid overflow.',
    input: '[25]',
    expected: '6',
    cases: [
      { input: '[0]', expected: '0' },
      { input: '[3]', expected: '0' },
      { input: '[5]', expected: '1' },
      { input: '[100]', expected: '24' },
    ],
    solutions: [
      {
        label: 'Count 5s in every multiple of 5',
        complexity: 'O(n)',
        code: `function trailingZeroes(n) {
  let count = 0;
  for (let i = 5; i <= n; i += 5) {
    let x = i;
    while (x % 5 === 0) {
      count++;
      x = x / 5;
    }
  }
  return count;
}`,
      },
      {
        label: 'Sum n / 5^k',
        complexity: 'O(log n)',
        code: `function trailingZeroes(n) {
  let count = 0;
  while (n > 0) {
    n = Math.floor(n / 5);
    count += n;
  }
  return count;
}`,
      },
    ],
    scale: {
      sizes: [50, 100, 200, 400, 800],
      make: (n) => JSON.stringify([n]),
    },
  },
  {
    id: 'bitwise-and-of-numbers-range',
    category: 'math-bits',
    lc: 'bitwise-and-of-numbers-range',
    n: 201,
    title: 'AND Of A Number Range',
    difficulty: 'Medium',
    tags: ['bit manipulation'],
    pattern: 'Common binary prefix',
    summary: 'Return the bitwise AND of every integer from left to right inclusive.',
    hook: 'Only the shared leading bits survive; shift both ends right until they match.',
    real: 'Subnet masks work this way: the AND of an address range keeps only the common network prefix.',
    input: '[5, 7]',
    expected: '4',
    cases: [
      { input: '[0, 1]', expected: '0' },
      { input: '[8, 8]', expected: '8' },
      { input: '[12, 15]', expected: '12' },
      { input: '[6, 7]', expected: '6' },
    ],
    solutions: [
      {
        label: 'AND every number in the range',
        complexity: 'O(n)',
        code: `function rangeBitwiseAnd(left, right) {
  let result = left;
  for (let i = left + 1; i <= right; i++) {
    result = result & i;
  }
  return result;
}`,
      },
      {
        label: 'Shift to the common prefix',
        complexity: 'O(log n)',
        code: `function rangeBitwiseAnd(left, right) {
  let shift = 0;
  while (left !== right) {
    left = left >> 1;
    right = right >> 1;
    shift++;
  }
  return left << shift;
}`,
      },
    ],
    scale: {
      sizes: [100, 400, 1600, 6400, 25600],
      make: (n) => JSON.stringify([n, 2 * n]),
    },
  },
  {
    id: 'hamming-distance',
    category: 'math-bits',
    lc: 'hamming-distance',
    n: 461,
    title: 'Hamming Distance',
    difficulty: 'Easy',
    tags: ['bit manipulation', 'xor'],
    pattern: 'XOR then popcount',
    summary: 'Count the bit positions at which two non-negative integers differ.',
    hook: 'a ^ b has a 1 exactly where they differ; count those ones.',
    real: 'Hamming distance drives error-correcting codes and near-duplicate image hashing.',
    input: '[1, 4]',
    expected: '2',
    cases: [
      { input: '[0, 0]', expected: '0' },
      { input: '[3, 1]', expected: '1' },
      { input: '[0, 2147483647]', expected: '31' },
    ],
    solutions: [
      {
        label: 'Compare each bit position',
        complexity: 'O(w)',
        code: `function hammingDistance(a, b) {
  let diff = 0;
  for (let i = 0; i < 31; i++) {
    if (((a >> i) & 1) !== ((b >> i) & 1)) diff++;
  }
  return diff;
}`,
      },
      {
        label: 'XOR + Kernighan',
        complexity: 'O(k)',
        code: `function hammingDistance(a, b) {
  let x = a ^ b;
  let diff = 0;
  while (x !== 0) {
    x = x & (x - 1);
    diff++;
  }
  return diff;
}`,
      },
    ],
  },
  {
    id: 'add-digits',
    category: 'math-bits',
    lc: 'add-digits',
    n: 258,
    title: 'Add Digits',
    difficulty: 'Easy',
    tags: ['math'],
    pattern: 'Digital root formula',
    summary:
      'Repeatedly replace a number with the sum of its digits until a single digit remains, and return it.',
    hook: 'The digital root cycles mod 9: 1 + (n - 1) % 9 for n > 0.',
    real: 'Casting out nines is the old accountants check, and the idea behind simple digit checksums.',
    input: '[38]',
    expected: '2',
    cases: [
      { input: '[0]', expected: '0' },
      { input: '[9]', expected: '9' },
      { input: '[10]', expected: '1' },
      { input: '[999999]', expected: '9' },
    ],
    solutions: [
      {
        label: 'Sum digits until one digit',
        complexity: 'O(log n)',
        code: `function addDigits(n) {
  while (n >= 10) {
    let sum = 0;
    while (n > 0) {
      sum += n % 10;
      n = Math.floor(n / 10);
    }
    n = sum;
  }
  return n;
}`,
      },
      {
        label: 'Mod 9 formula',
        complexity: 'O(1)',
        code: `function addDigits(n) {
  if (n === 0) return 0;
  return 1 + ((n - 1) % 9);
}`,
      },
    ],
  },
  {
    id: 'gcd-euclid',
    category: 'math-bits',
    title: 'Greatest Common Divisor (Euclid)',
    difficulty: 'Easy',
    tags: ['math', 'number theory'],
    pattern: 'gcd(a, b) = gcd(b, a % b)',
    summary: 'Find the largest integer that divides both of two non-negative integers.',
    hook: 'Replace the pair by (b, a mod b) until the second is zero.',
    real: 'Reducing fractions, scheduling periodic jobs and RSA key setup all need a fast gcd.',
    input: '[48, 18]',
    expected: '6',
    cases: [
      { input: '[7, 13]', expected: '1' },
      { input: '[0, 5]', expected: '5' },
      { input: '[100, 25]', expected: '25' },
    ],
    solutions: [
      {
        label: 'Count down from the smaller number',
        complexity: 'O(min(a, b))',
        code: `function gcd(a, b) {
  if (a === 0) return b;
  if (b === 0) return a;
  let d = Math.min(a, b);
  while (d > 1) {
    if (a % d === 0 && b % d === 0) return d;
    d--;
  }
  return 1;
}`,
      },
      {
        label: "Euclid's algorithm",
        complexity: 'O(log(min(a, b)))',
        code: `function gcd(a, b) {
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}`,
      },
    ],
    scale: {
      sizes: [100, 400, 1600, 6400, 25600],
      make: (n) => JSON.stringify([n, n + 1]),
    },
  },
];
