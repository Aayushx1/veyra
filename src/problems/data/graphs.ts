import type { Problem } from '../types';

export const graphs: Problem[] = [
  {
    id: 'number-of-islands',
    category: 'graphs',
    lc: 'number-of-islands',
    n: 200,
    tags: ['grid', 'dfs', 'flood fill'],
    title: 'Number of Islands',
    difficulty: 'Medium',
    pattern: 'Grid flood fill',
    summary:
      'Count the groups of land cells ("1") in a grid, where land joins up, down, left and right.',
    hook: 'Find unvisited land, flood its whole island, count once.',
    real: 'Connected-region labelling is how image tools find separate blobs, and how maps find contiguous territories.',
    input: '[[["1","1","0","0"],["1","0","0","1"],["0","0","1","1"],["1","0","0","0"]]]',
    expected: '3',
    cases: [
      { input: '[[]]', expected: '0' },
      { input: '[[["1"]]]', expected: '1' },
      { input: '[[["0","0"],["0","0"]]]', expected: '0' },
      { input: '[[["1","0","1"],["0","1","0"],["1","0","1"]]]', expected: '5' },
    ],
    solutions: [
      {
        label: 'DFS + visited list scan',
        complexity: 'O((R·C)²)',
        code: `function numIslands(grid) {
  const rows = grid.length;
  if (rows === 0) return 0;
  const cols = grid[0].length;
  const seen = [];
  function wasSeen(r, c) {
    for (let i = 0; i < seen.length; i++) {
      if (seen[i][0] === r && seen[i][1] === c) return true;
    }
    return false;
  }
  function flood(sr, sc) {
    const stack = [[sr, sc]];
    seen.push([sr, sc]);
    while (stack.length > 0) {
      const cur = stack.pop();
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const d of dirs) {
        const nr = cur[0] + d[0];
        const nc = cur[1] + d[1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] !== "1" || wasSeen(nr, nc)) continue;
        seen.push([nr, nc]);
        stack.push([nr, nc]);
      }
    }
  }
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1" && !wasSeen(r, c)) {
        count++;
        flood(r, c);
      }
    }
  }
  return count;
}`,
      },
      {
        label: 'Sink visited land',
        complexity: 'O(R·C)',
        code: `function numIslands(grid) {
  const rows = grid.length;
  if (rows === 0) return 0;
  const cols = grid[0].length;
  function sink(sr, sc) {
    const stack = [[sr, sc]];
    grid[sr][sc] = "0";
    while (stack.length > 0) {
      const cur = stack.pop();
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const d of dirs) {
        const nr = cur[0] + d[0];
        const nc = cur[1] + d[1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] !== "1") continue;
        grid[nr][nc] = "0";
        stack.push([nr, nc]);
      }
    }
  }
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        sink(r, c);
      }
    }
  }
  return count;
}`,
      },
    ],
    scale: {
      sizes: [4, 6, 8, 10, 12],
      make: (n) => {
        const g: string[][] = [];
        for (let r = 0; r < n; r++) {
          const row: string[] = [];
          for (let c = 0; c < n; c++) row.push((r * 3 + c * 5) % 4 !== 0 ? '1' : '0');
          g.push(row);
        }
        return JSON.stringify([g]);
      },
    },
  },
  {
    id: 'max-area-of-island',
    category: 'graphs',
    lc: 'max-area-of-island',
    n: 695,
    tags: ['grid', 'dfs'],
    title: 'Max Area of Island',
    difficulty: 'Medium',
    pattern: 'Grid flood fill',
    summary:
      'Return the size of the largest group of connected 1-cells in a binary grid (0 if there are none).',
    hook: 'Same flood fill as counting islands, but return how many cells each flood touched.',
    real: 'Measuring the biggest connected cluster is how tools size the largest blob in an image or the biggest outage region.',
    input: '[[[1,0,1,1],[1,1,0,1],[0,0,0,1],[1,0,0,0]]]',
    expected: '4',
    cases: [
      { input: '[[[0,0]]]', expected: '0' },
      { input: '[[]]', expected: '0' },
      { input: '[[[1]]]', expected: '1' },
      { input: '[[[1,1],[1,1]]]', expected: '4' },
    ],
    solutions: [
      {
        label: 'DFS + visited list scan',
        complexity: 'O((R·C)²)',
        code: `function maxAreaOfIsland(grid) {
  const rows = grid.length;
  if (rows === 0) return 0;
  const cols = grid[0].length;
  const seen = [];
  function wasSeen(r, c) {
    for (let i = 0; i < seen.length; i++) {
      if (seen[i][0] === r && seen[i][1] === c) return true;
    }
    return false;
  }
  function flood(sr, sc) {
    const stack = [[sr, sc]];
    seen.push([sr, sc]);
    let area = 0;
    while (stack.length > 0) {
      const cur = stack.pop();
      area++;
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const d of dirs) {
        const nr = cur[0] + d[0];
        const nc = cur[1] + d[1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] !== 1 || wasSeen(nr, nc)) continue;
        seen.push([nr, nc]);
        stack.push([nr, nc]);
      }
    }
    return area;
  }
  let best = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1 && !wasSeen(r, c)) {
        best = Math.max(best, flood(r, c));
      }
    }
  }
  return best;
}`,
      },
      {
        label: 'Visited matrix',
        complexity: 'O(R·C)',
        code: `function maxAreaOfIsland(grid) {
  const rows = grid.length;
  if (rows === 0) return 0;
  const cols = grid[0].length;
  const seen = [];
  for (let r = 0; r < rows; r++) {
    const line = [];
    for (let c = 0; c < cols; c++) line.push(false);
    seen.push(line);
  }
  function flood(sr, sc) {
    const stack = [[sr, sc]];
    seen[sr][sc] = true;
    let area = 0;
    while (stack.length > 0) {
      const cur = stack.pop();
      area++;
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const d of dirs) {
        const nr = cur[0] + d[0];
        const nc = cur[1] + d[1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] !== 1 || seen[nr][nc]) continue;
        seen[nr][nc] = true;
        stack.push([nr, nc]);
      }
    }
    return area;
  }
  let best = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1 && !seen[r][c]) {
        best = Math.max(best, flood(r, c));
      }
    }
  }
  return best;
}`,
      },
    ],
    scale: {
      sizes: [4, 6, 8, 10, 12],
      make: (n) => {
        const g: number[][] = [];
        for (let r = 0; r < n; r++) {
          const row: number[] = [];
          for (let c = 0; c < n; c++) row.push((r * 3 + c * 5) % 4 !== 0 ? 1 : 0);
          g.push(row);
        }
        return JSON.stringify([g]);
      },
    },
  },
  {
    id: 'flood-fill',
    category: 'graphs',
    lc: 'flood-fill',
    n: 733,
    tags: ['grid', 'dfs', 'bfs'],
    title: 'Flood Fill',
    difficulty: 'Easy',
    pattern: 'Grid flood fill',
    summary:
      'Starting from one pixel, recolor its whole same-colored connected area to a new color and return the image.',
    hook: 'Spread from the start cell to same-colored neighbors; stop early if the color would not change.',
    real: 'This is the paint-bucket tool in every image editor.',
    input: '[[[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2]',
    expected: '[[2, 2, 2], [2, 2, 0], [2, 0, 1]]',
    cases: [
      { input: '[[[0,0,0],[0,0,0]], 0, 0, 0]', expected: '[[0, 0, 0], [0, 0, 0]]' },
      { input: '[[[1]], 0, 0, 5]', expected: '[[5]]' },
      { input: '[[[1,0],[0,1]], 0, 1, 7]', expected: '[[1, 7], [0, 1]]' },
    ],
    solutions: [
      {
        label: 'Recursive DFS',
        complexity: 'O(R·C)',
        code: `function floodFill(image, sr, sc, color) {
  const rows = image.length;
  const cols = image[0].length;
  const out = [];
  for (let r = 0; r < rows; r++) out.push([...image[r]]);
  const old = out[sr][sc];
  if (old === color) return out;
  function paint(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (out[r][c] !== old) return;
    out[r][c] = color;
    paint(r + 1, c);
    paint(r - 1, c);
    paint(r, c + 1);
    paint(r, c - 1);
  }
  paint(sr, sc);
  return out;
}`,
      },
      {
        label: 'Iterative BFS',
        complexity: 'O(R·C)',
        code: `function floodFill(image, sr, sc, color) {
  const rows = image.length;
  const cols = image[0].length;
  const out = [];
  for (let r = 0; r < rows; r++) out.push([...image[r]]);
  const old = out[sr][sc];
  if (old === color) return out;
  const queue = [[sr, sc]];
  out[sr][sc] = color;
  let head = 0;
  while (head < queue.length) {
    const cur = queue[head];
    head++;
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const d of dirs) {
      const nr = cur[0] + d[0];
      const nc = cur[1] + d[1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (out[nr][nc] !== old) continue;
      out[nr][nc] = color;
      queue.push([nr, nc]);
    }
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'clone-graph',
    category: 'graphs',
    lc: 'clone-graph',
    n: 133,
    tags: ['dfs', 'bfs', 'hash map'],
    title: 'Clone Graph',
    difficulty: 'Medium',
    pattern: 'Map original to copy',
    summary:
      'Given an adjacency list (nodes numbered from 1), build a deep copy of the graph node by node and return its adjacency list.',
    hook: 'Keep a map from original node to its copy so cycles never loop forever.',
    real: 'Deep-copying object graphs (serializers, snapshotting state) needs the same visited-map to survive cycles.',
    input: '[[[2,4],[1,3],[2,4],[1,3]]]',
    expected: '[[2, 4], [1, 3], [2, 4], [1, 3]]',
    cases: [
      { input: '[[[]]]', expected: '[[]]' },
      { input: '[[]]', expected: '[]' },
      { input: '[[[2,3],[1,3],[1,2]]]', expected: '[[2, 3], [1, 3], [1, 2]]' },
    ],
    solutions: [
      {
        label: 'Recursive DFS with map',
        complexity: 'O(V + E)',
        code: `function cloneGraph(adj) {
  const n = adj.length;
  if (n === 0) return [];
  const nodes = [];
  for (let i = 0; i < n; i++) nodes.push({ val: i + 1, neighbors: [] });
  for (let i = 0; i < n; i++) {
    for (const j of adj[i]) nodes[i].neighbors.push(nodes[j - 1]);
  }
  const copies = new Map();
  function clone(node) {
    if (copies.has(node)) return copies.get(node);
    const copy = { val: node.val, neighbors: [] };
    copies.set(node, copy);
    for (const nb of node.neighbors) copy.neighbors.push(clone(nb));
    return copy;
  }
  clone(nodes[0]);
  const out = [];
  for (let i = 0; i < n; i++) out.push([]);
  for (const copy of copies.values()) {
    const list = [];
    for (const nb of copy.neighbors) list.push(nb.val);
    out[copy.val - 1] = list;
  }
  return out;
}`,
      },
      {
        label: 'Iterative BFS with map',
        complexity: 'O(V + E)',
        code: `function cloneGraph(adj) {
  const n = adj.length;
  if (n === 0) return [];
  const nodes = [];
  for (let i = 0; i < n; i++) nodes.push({ val: i + 1, neighbors: [] });
  for (let i = 0; i < n; i++) {
    for (const j of adj[i]) nodes[i].neighbors.push(nodes[j - 1]);
  }
  const copies = new Map();
  copies.set(nodes[0], { val: nodes[0].val, neighbors: [] });
  const queue = [nodes[0]];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head];
    head++;
    for (const nb of node.neighbors) {
      if (!copies.has(nb)) {
        copies.set(nb, { val: nb.val, neighbors: [] });
        queue.push(nb);
      }
      copies.get(node).neighbors.push(copies.get(nb));
    }
  }
  const out = [];
  for (let i = 0; i < n; i++) out.push([]);
  for (const copy of copies.values()) {
    const list = [];
    for (const nb of copy.neighbors) list.push(nb.val);
    out[copy.val - 1] = list;
  }
  return out;
}`,
      },
    ],
  },
  {
    id: 'course-schedule',
    category: 'graphs',
    lc: 'course-schedule',
    n: 207,
    tags: ['topological sort', 'cycle detection'],
    title: 'Course Schedule',
    difficulty: 'Medium',
    pattern: 'Topological sort (Kahn)',
    summary:
      'Given courses 0..n-1 and prerequisite pairs [course, requires], decide whether every course can be finished.',
    hook: 'Peel off courses with zero remaining prerequisites; if you cannot peel them all, there is a cycle.',
    real: 'Build systems and package managers use the same ordering to detect circular dependencies.',
    input: '[5, [[1,0],[2,1],[3,2],[4,3]]]',
    expected: 'true',
    cases: [
      { input: '[2, [[1,0],[0,1]]]', expected: 'false' },
      { input: '[1, []]', expected: 'true' },
      { input: '[4, [[1,0],[2,1],[3,2],[1,3]]]', expected: 'false' },
      { input: '[3, [[1,0],[2,0]]]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Repeated scanning',
        complexity: 'O(V · V · E)',
        code: `function canFinish(numCourses, prerequisites) {
  const done = [];
  for (let i = 0; i < numCourses; i++) done.push(false);
  let finished = 0;
  let progress = true;
  while (progress) {
    progress = false;
    for (let c = 0; c < numCourses; c++) {
      if (done[c]) continue;
      let ready = true;
      for (let k = 0; k < prerequisites.length; k++) {
        if (prerequisites[k][0] === c && !done[prerequisites[k][1]]) {
          ready = false;
          break;
        }
      }
      if (ready) {
        done[c] = true;
        finished++;
        progress = true;
      }
    }
  }
  return finished === numCourses;
}`,
      },
      {
        label: "Kahn's algorithm",
        complexity: 'O(V + E)',
        code: `function canFinish(numCourses, prerequisites) {
  const next = [];
  const indeg = [];
  for (let i = 0; i < numCourses; i++) {
    next.push([]);
    indeg.push(0);
  }
  for (const p of prerequisites) {
    next[p[1]].push(p[0]);
    indeg[p[0]]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (indeg[i] === 0) queue.push(i);
  }
  let head = 0;
  while (head < queue.length) {
    const u = queue[head];
    head++;
    for (const v of next[u]) {
      indeg[v]--;
      if (indeg[v] === 0) queue.push(v);
    }
  }
  return queue.length === numCourses;
}`,
      },
    ],
    scale: {
      sizes: [10, 20, 30, 40, 50],
      make: (n) => {
        const pre: number[][] = [];
        for (let i = 0; i < n - 1; i++) pre.push([i, i + 1]);
        return JSON.stringify([n, pre]);
      },
    },
  },
  {
    id: 'course-schedule-ii',
    category: 'graphs',
    lc: 'course-schedule-ii',
    n: 210,
    tags: ['topological sort', 'queue'],
    title: 'Course Schedule II',
    difficulty: 'Medium',
    pattern: 'Topological sort (Kahn)',
    summary:
      'Return one valid order to take all courses (queue seeded in index order), or an empty list if a cycle makes it impossible.',
    hook: 'The order courses leave the zero-prerequisite queue is the schedule.',
    real: 'Task runners and CI pipelines schedule jobs in exactly this dependency order.',
    input: '[4, [[1,0],[2,0],[3,1],[3,2]]]',
    expected: '[0, 1, 2, 3]',
    cases: [
      { input: '[2, [[0,1],[1,0]]]', expected: '[]' },
      { input: '[1, []]', expected: '[0]' },
      { input: '[3, [[0,1],[0,2]]]', expected: '[1, 2, 0]' },
    ],
    solutions: [
      {
        label: 'Queue, rescan edge list',
        complexity: 'O(V · E)',
        code: `function findOrder(numCourses, prerequisites) {
  const indeg = [];
  for (let i = 0; i < numCourses; i++) indeg.push(0);
  for (let k = 0; k < prerequisites.length; k++) indeg[prerequisites[k][0]]++;
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (indeg[i] === 0) queue.push(i);
  }
  let head = 0;
  while (head < queue.length) {
    const u = queue[head];
    head++;
    for (let k = 0; k < prerequisites.length; k++) {
      if (prerequisites[k][1] === u) {
        const v = prerequisites[k][0];
        indeg[v]--;
        if (indeg[v] === 0) queue.push(v);
      }
    }
  }
  return queue.length === numCourses ? queue : [];
}`,
      },
      {
        label: "Kahn's with adjacency list",
        complexity: 'O(V + E)',
        code: `function findOrder(numCourses, prerequisites) {
  const next = [];
  const indeg = [];
  for (let i = 0; i < numCourses; i++) {
    next.push([]);
    indeg.push(0);
  }
  for (const p of prerequisites) {
    next[p[1]].push(p[0]);
    indeg[p[0]]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (indeg[i] === 0) queue.push(i);
  }
  let head = 0;
  while (head < queue.length) {
    const u = queue[head];
    head++;
    for (const v of next[u]) {
      indeg[v]--;
      if (indeg[v] === 0) queue.push(v);
    }
  }
  return queue.length === numCourses ? queue : [];
}`,
      },
    ],
    scale: {
      sizes: [20, 50, 100, 150, 200],
      make: (n) => {
        const pre: number[][] = [];
        for (let i = 1; i < n; i++) pre.push([i, i - 1]);
        return JSON.stringify([n, pre]);
      },
    },
  },
  {
    id: 'rotting-oranges',
    category: 'graphs',
    lc: 'rotting-oranges',
    n: 994,
    tags: ['grid', 'bfs', 'multi-source'],
    title: 'Rotting Oranges',
    difficulty: 'Medium',
    pattern: 'Multi-source BFS',
    summary:
      'In a grid of empty (0), fresh (1) and rotten (2) cells, every minute rot spreads to adjacent fresh cells. Return the minutes until none are fresh, or -1 if some never rot.',
    hook: 'Start the BFS from every rotten orange at once; each level is one minute.',
    real: 'Multi-source BFS models anything that spreads from many origins, such as outages or infections across a network.',
    input: '[[[2,1,1],[1,1,0],[0,1,1]]]',
    expected: '4',
    cases: [
      { input: '[[[2,1,1],[0,1,1],[1,0,1]]]', expected: '-1' },
      { input: '[[[0,2]]]', expected: '0' },
      { input: '[[[1]]]', expected: '-1' },
      { input: '[[[0]]]', expected: '0' },
    ],
    solutions: [
      {
        label: 'Simulate each minute by scanning',
        complexity: 'O((R·C)²)',
        code: `function orangesRotting(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const g = [];
  for (let r = 0; r < rows; r++) g.push([...grid[r]]);
  function nextToRotten(r, c) {
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const d of dirs) {
      const nr = r + d[0];
      const nc = c + d[1];
      if (nr >= 0 && nc >= 0 && nr < rows && nc < cols && g[nr][nc] === 2) return true;
    }
    return false;
  }
  let minutes = 0;
  while (true) {
    const turning = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (g[r][c] === 1 && nextToRotten(r, c)) turning.push([r, c]);
      }
    }
    if (turning.length === 0) break;
    for (const p of turning) g[p[0]][p[1]] = 2;
    minutes++;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (g[r][c] === 1) return -1;
    }
  }
  return minutes;
}`,
      },
      {
        label: 'Multi-source BFS',
        complexity: 'O(R·C)',
        code: `function orangesRotting(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const g = [];
  for (let r = 0; r < rows; r++) g.push([...grid[r]]);
  const queue = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (g[r][c] === 2) queue.push([r, c]);
      else if (g[r][c] === 1) fresh++;
    }
  }
  let minutes = 0;
  let head = 0;
  while (head < queue.length && fresh > 0) {
    const end = queue.length;
    while (head < end) {
      const cur = queue[head];
      head++;
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const d of dirs) {
        const nr = cur[0] + d[0];
        const nc = cur[1] + d[1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (g[nr][nc] !== 1) continue;
        g[nr][nc] = 2;
        fresh--;
        queue.push([nr, nc]);
      }
    }
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}`,
      },
    ],
    scale: {
      sizes: [4, 8, 12, 16],
      make: (n) => {
        const g: number[][] = [];
        for (let r = 0; r < n; r++) {
          const row: number[] = [];
          for (let c = 0; c < n; c++) row.push(r === 0 && c === 0 ? 2 : 1);
          g.push(row);
        }
        return JSON.stringify([g]);
      },
    },
  },
  {
    id: 'pacific-atlantic-water-flow',
    category: 'graphs',
    lc: 'pacific-atlantic-water-flow',
    n: 417,
    tags: ['grid', 'dfs', 'multi-source'],
    title: 'Pacific Atlantic Water Flow',
    difficulty: 'Medium',
    pattern: 'Reverse flood from the borders',
    summary:
      'Water flows to equal or lower neighbors. The top and left edges touch one ocean, the bottom and right edges the other. List every cell (row-major order) from which water can reach both.',
    hook: 'Flip the question: climb uphill from each ocean border, then intersect.',
    real: 'Reversing the search direction from the targets is how reachability and impact analysis avoid testing every source.',
    input: '[[[1,2,2],[3,2,3],[2,4,5]]]',
    expected: '[[0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]',
    cases: [
      { input: '[[[1]]]', expected: '[[0, 0]]' },
      { input: '[[]]', expected: '[]' },
      {
        input: '[[[3,3,3],[3,1,3],[3,3,3]]]',
        expected: '[[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]',
      },
    ],
    solutions: [
      {
        label: 'Flood from every cell',
        complexity: 'O((R·C)²)',
        code: `function pacificAtlantic(heights) {
  const rows = heights.length;
  if (rows === 0) return [];
  const cols = heights[0].length;
  function reaches(sr, sc) {
    const seen = [];
    for (let r = 0; r < rows; r++) {
      const line = [];
      for (let c = 0; c < cols; c++) line.push(false);
      seen.push(line);
    }
    const stack = [[sr, sc]];
    seen[sr][sc] = true;
    let pac = false;
    let atl = false;
    while (stack.length > 0) {
      const cur = stack.pop();
      const r = cur[0];
      const c = cur[1];
      if (r === 0 || c === 0) pac = true;
      if (r === rows - 1 || c === cols - 1) atl = true;
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const d of dirs) {
        const nr = r + d[0];
        const nc = c + d[1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (seen[nr][nc] || heights[nr][nc] > heights[r][c]) continue;
        seen[nr][nc] = true;
        stack.push([nr, nc]);
      }
    }
    return pac && atl;
  }
  const out = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (reaches(r, c)) out.push([r, c]);
    }
  }
  return out;
}`,
      },
      {
        label: 'Reverse flood from both oceans',
        complexity: 'O(R·C)',
        code: `function pacificAtlantic(heights) {
  const rows = heights.length;
  if (rows === 0) return [];
  const cols = heights[0].length;
  function climb(starts) {
    const seen = [];
    for (let r = 0; r < rows; r++) {
      const line = [];
      for (let c = 0; c < cols; c++) line.push(false);
      seen.push(line);
    }
    const stack = [];
    for (const s of starts) {
      seen[s[0]][s[1]] = true;
      stack.push(s);
    }
    while (stack.length > 0) {
      const cur = stack.pop();
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const d of dirs) {
        const nr = cur[0] + d[0];
        const nc = cur[1] + d[1];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (seen[nr][nc] || heights[nr][nc] < heights[cur[0]][cur[1]]) continue;
        seen[nr][nc] = true;
        stack.push([nr, nc]);
      }
    }
    return seen;
  }
  const pStarts = [];
  const aStarts = [];
  for (let r = 0; r < rows; r++) {
    pStarts.push([r, 0]);
    aStarts.push([r, cols - 1]);
  }
  for (let c = 0; c < cols; c++) {
    pStarts.push([0, c]);
    aStarts.push([rows - 1, c]);
  }
  const pac = climb(pStarts);
  const atl = climb(aStarts);
  const out = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pac[r][c] && atl[r][c]) out.push([r, c]);
    }
  }
  return out;
}`,
      },
    ],
    scale: {
      sizes: [3, 5, 7, 9],
      make: (n) => {
        const g: number[][] = [];
        for (let r = 0; r < n; r++) {
          const row: number[] = [];
          for (let c = 0; c < n; c++) row.push((r * 3 + c * 5) % 7);
          g.push(row);
        }
        return JSON.stringify([g]);
      },
    },
  },
  {
    id: 'surrounded-regions',
    category: 'graphs',
    lc: 'surrounded-regions',
    n: 130,
    tags: ['grid', 'dfs', 'border'],
    title: 'Surrounded Regions',
    difficulty: 'Medium',
    pattern: 'Flood from the border',
    summary:
      'On a board of "X" and "O", turn every group of "O" cells that does not touch the border into "X". Return the board.',
    hook: 'Do not hunt for surrounded regions; mark the ones that escape via the border, flip the rest.',
    real: 'Marking what is reachable from a safe boundary first is the same idea as garbage collection keeping everything reachable from roots.',
    input: '[[["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]]',
    expected:
      '[["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "O", "X", "X"]]',
    cases: [
      { input: '[[]]', expected: '[]' },
      { input: '[[["O","O"],["O","O"]]]', expected: '[["O", "O"], ["O", "O"]]' },
      {
        input: '[[["X","X","X"],["X","O","X"],["X","X","X"]]]',
        expected: '[["X", "X", "X"], ["X", "X", "X"], ["X", "X", "X"]]',
      },
    ],
    solutions: [
      {
        label: 'Check each region, then flip',
        complexity: 'O(R·C)',
        code: `function solve(board) {
  const rows = board.length;
  if (rows === 0) return [];
  const cols = board[0].length;
  const b = [];
  const seen = [];
  for (let r = 0; r < rows; r++) {
    b.push([...board[r]]);
    const line = [];
    for (let c = 0; c < cols; c++) line.push(false);
    seen.push(line);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (b[r][c] !== "O" || seen[r][c]) continue;
      const region = [[r, c]];
      seen[r][c] = true;
      let touchesBorder = false;
      let head = 0;
      while (head < region.length) {
        const cur = region[head];
        head++;
        if (cur[0] === 0 || cur[1] === 0 || cur[0] === rows - 1 || cur[1] === cols - 1) {
          touchesBorder = true;
        }
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const d of dirs) {
          const nr = cur[0] + d[0];
          const nc = cur[1] + d[1];
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          if (b[nr][nc] !== "O" || seen[nr][nc]) continue;
          seen[nr][nc] = true;
          region.push([nr, nc]);
        }
      }
      if (!touchesBorder) {
        for (const p of region) b[p[0]][p[1]] = "X";
      }
    }
  }
  return b;
}`,
      },
      {
        label: 'Protect border-connected cells',
        complexity: 'O(R·C)',
        code: `function solve(board) {
  const rows = board.length;
  if (rows === 0) return [];
  const cols = board[0].length;
  const b = [];
  for (let r = 0; r < rows; r++) b.push([...board[r]]);
  const stack = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const onBorder = r === 0 || c === 0 || r === rows - 1 || c === cols - 1;
      if (onBorder && b[r][c] === "O") {
        b[r][c] = "S";
        stack.push([r, c]);
      }
    }
  }
  while (stack.length > 0) {
    const cur = stack.pop();
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const d of dirs) {
      const nr = cur[0] + d[0];
      const nc = cur[1] + d[1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (b[nr][nc] !== "O") continue;
      b[nr][nc] = "S";
      stack.push([nr, nc]);
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (b[r][c] === "S") b[r][c] = "O";
      else if (b[r][c] === "O") b[r][c] = "X";
    }
  }
  return b;
}`,
      },
    ],
  },
  {
    id: 'number-of-connected-components-in-an-undirected-graph',
    category: 'graphs',
    lc: 'number-of-connected-components-in-an-undirected-graph',
    n: 323,
    tags: ['union find', 'dfs'],
    title: 'Connected Components Count',
    difficulty: 'Medium',
    pattern: 'Union-find',
    summary: 'Given n nodes (0..n-1) and a list of undirected edges, count the connected groups.',
    hook: 'Start with n groups; every edge that joins two different groups removes one.',
    real: 'Union-find groups machines, users or pixels into clusters as links stream in.',
    input: '[5, [[0,1],[1,2],[3,4]]]',
    expected: '2',
    cases: [
      { input: '[4, []]', expected: '4' },
      { input: '[1, []]', expected: '1' },
      { input: '[5, [[0,1],[1,2],[2,3],[3,4]]]', expected: '1' },
    ],
    solutions: [
      {
        label: 'DFS rescanning the edge list',
        complexity: 'O(V · E)',
        code: `function countComponents(n, edges) {
  const seen = [];
  for (let i = 0; i < n; i++) seen.push(false);
  let count = 0;
  for (let s = 0; s < n; s++) {
    if (seen[s]) continue;
    count++;
    seen[s] = true;
    const stack = [s];
    while (stack.length > 0) {
      const u = stack.pop();
      for (let k = 0; k < edges.length; k++) {
        const a = edges[k][0];
        const b = edges[k][1];
        if (a === u && !seen[b]) {
          seen[b] = true;
          stack.push(b);
        } else if (b === u && !seen[a]) {
          seen[a] = true;
          stack.push(a);
        }
      }
    }
  }
  return count;
}`,
      },
      {
        label: 'Union-find',
        complexity: 'O(E · α(V))',
        code: `function countComponents(n, edges) {
  const parent = [];
  for (let i = 0; i < n; i++) parent.push(i);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  let count = n;
  for (const e of edges) {
    const ra = find(e[0]);
    const rb = find(e[1]);
    if (ra !== rb) {
      parent[ra] = rb;
      count--;
    }
  }
  return count;
}`,
      },
    ],
    scale: {
      sizes: [20, 50, 100, 150],
      make: (n) => {
        const e: number[][] = [];
        for (let i = 0; i < n - 1; i++) e.push([i, i + 1]);
        return JSON.stringify([n, e]);
      },
    },
  },
  {
    id: 'redundant-connection',
    category: 'graphs',
    lc: 'redundant-connection',
    n: 684,
    tags: ['union find', 'cycle detection'],
    title: 'Redundant Connection',
    difficulty: 'Medium',
    pattern: 'Union-find cycle detection',
    summary:
      'A tree on nodes 1..n got one extra edge. Given the edges in order, return the last edge that closes a cycle.',
    hook: 'An edge whose endpoints already share a root is the one that closes a loop.',
    real: 'Network designers use this to spot the cable that creates a redundant loop in a topology.',
    input: '[[[1,2],[1,3],[2,3]]]',
    expected: '[2, 3]',
    cases: [
      { input: '[[[1,2],[2,3],[3,4],[1,4],[1,5]]]', expected: '[1, 4]' },
      { input: '[[[1,2],[1,2]]]', expected: '[1, 2]' },
      { input: '[[[1,2],[2,3],[3,1]]]', expected: '[3, 1]' },
    ],
    solutions: [
      {
        label: 'DFS connectivity before each edge',
        complexity: 'O(E²)',
        code: `function findRedundantConnection(edges) {
  const n = edges.length;
  const adj = [];
  for (let i = 0; i <= n; i++) adj.push([]);
  function connected(a, b) {
    const seen = [];
    for (let i = 0; i <= n; i++) seen.push(false);
    const stack = [a];
    seen[a] = true;
    while (stack.length > 0) {
      const u = stack.pop();
      if (u === b) return true;
      for (const v of adj[u]) {
        if (!seen[v]) {
          seen[v] = true;
          stack.push(v);
        }
      }
    }
    return false;
  }
  for (const e of edges) {
    if (connected(e[0], e[1])) return e;
    adj[e[0]].push(e[1]);
    adj[e[1]].push(e[0]);
  }
  return [];
}`,
      },
      {
        label: 'Union-find',
        complexity: 'O(E · α(V))',
        code: `function findRedundantConnection(edges) {
  const n = edges.length;
  const parent = [];
  for (let i = 0; i <= n; i++) parent.push(i);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  for (const e of edges) {
    const ra = find(e[0]);
    const rb = find(e[1]);
    if (ra === rb) return e;
    parent[ra] = rb;
  }
  return [];
}`,
      },
    ],
    scale: {
      sizes: [20, 50, 100, 150],
      make: (n) => {
        const e: number[][] = [];
        for (let i = 1; i < n; i++) e.push([i, i + 1]);
        e.push([1, n]);
        return JSON.stringify([e]);
      },
    },
  },
  {
    id: 'graph-valid-tree',
    category: 'graphs',
    lc: 'graph-valid-tree',
    n: 261,
    tags: ['union find', 'dfs'],
    title: 'Graph Valid Tree',
    difficulty: 'Medium',
    pattern: 'Edge count + connectivity',
    summary:
      'Given n nodes and undirected edges, decide whether the graph is a tree: connected and with no cycle.',
    hook: 'A tree on n nodes has exactly n-1 edges; with that count, no cycle and connected are the same check.',
    real: 'Validating that a network or org chart has no loops and no orphan pieces uses this exact test.',
    input: '[5, [[0,1],[0,2],[0,3],[1,4]]]',
    expected: 'true',
    cases: [
      { input: '[5, [[0,1],[1,2],[2,3],[1,3],[1,4]]]', expected: 'false' },
      { input: '[4, [[0,1],[2,3]]]', expected: 'false' },
      { input: '[1, []]', expected: 'true' },
      { input: '[3, [[0,1],[0,1]]]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Edge count + DFS reaches all',
        complexity: 'O(V + E)',
        code: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const adj = [];
  for (let i = 0; i < n; i++) adj.push([]);
  for (const e of edges) {
    adj[e[0]].push(e[1]);
    adj[e[1]].push(e[0]);
  }
  const seen = [];
  for (let i = 0; i < n; i++) seen.push(false);
  const stack = [0];
  seen[0] = true;
  let visited = 0;
  while (stack.length > 0) {
    const u = stack.pop();
    visited++;
    for (const v of adj[u]) {
      if (!seen[v]) {
        seen[v] = true;
        stack.push(v);
      }
    }
  }
  return visited === n;
}`,
      },
      {
        label: 'Union-find, no cycle',
        complexity: 'O(E · α(V))',
        code: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const parent = [];
  for (let i = 0; i < n; i++) parent.push(i);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  for (const e of edges) {
    const ra = find(e[0]);
    const rb = find(e[1]);
    if (ra === rb) return false;
    parent[ra] = rb;
  }
  return true;
}`,
      },
    ],
  },
  {
    id: 'find-the-town-judge',
    category: 'graphs',
    lc: 'find-the-town-judge',
    n: 997,
    tags: ['degree counting'],
    title: 'Find the Town Judge',
    difficulty: 'Easy',
    pattern: 'In-degree minus out-degree',
    summary:
      'People 1..n; each pair [a, b] means a trusts b. The judge trusts nobody and is trusted by everyone else. Return the judge, or -1.',
    hook: 'Give +1 to who is trusted and -1 to who trusts; the judge scores exactly n-1.',
    real: 'Spotting a node every other node points to and that points nowhere resembles finding a sink or authority in a link graph.',
    input: '[3, [[1,3],[2,3]]]',
    expected: '3',
    cases: [
      { input: '[3, [[1,3],[2,3],[3,1]]]', expected: '-1' },
      { input: '[1, []]', expected: '1' },
      { input: '[2, [[1,2]]]', expected: '2' },
      { input: '[4, [[1,3],[2,3]]]', expected: '-1' },
    ],
    solutions: [
      {
        label: 'Scan the trust list per person',
        complexity: 'O(n · E)',
        code: `function findJudge(n, trust) {
  for (let p = 1; p <= n; p++) {
    let trusts = 0;
    let trustedBy = 0;
    for (let k = 0; k < trust.length; k++) {
      if (trust[k][0] === p) trusts++;
      if (trust[k][1] === p) trustedBy++;
    }
    if (trusts === 0 && trustedBy === n - 1) return p;
  }
  return -1;
}`,
      },
      {
        label: 'Net trust score',
        complexity: 'O(n + E)',
        code: `function findJudge(n, trust) {
  const score = [];
  for (let i = 0; i <= n; i++) score.push(0);
  for (const t of trust) {
    score[t[0]]--;
    score[t[1]]++;
  }
  for (let p = 1; p <= n; p++) {
    if (score[p] === n - 1) return p;
  }
  return -1;
}`,
      },
    ],
    scale: {
      sizes: [20, 50, 100, 150],
      make: (n) => {
        const t: number[][] = [];
        for (let i = 1; i < n; i++) t.push([i, n]);
        return JSON.stringify([n, t]);
      },
    },
  },
  {
    id: 'find-if-path-exists-in-graph',
    category: 'graphs',
    lc: 'find-if-path-exists-in-graph',
    n: 1971,
    tags: ['bfs', 'adjacency list'],
    title: 'Find if Path Exists in Graph',
    difficulty: 'Easy',
    pattern: 'BFS reachability',
    summary:
      'Given n nodes, undirected edges, a source and a destination, decide whether the destination is reachable.',
    hook: 'Build an adjacency list once instead of rescanning every edge for every node.',
    real: 'Reachability checks decide whether two services or machines can talk across a network.',
    input: '[6, [[0,1],[0,2],[3,5],[5,4],[4,3]], 0, 5]',
    expected: 'false',
    cases: [
      { input: '[3, [[0,1],[1,2],[2,0]], 0, 2]', expected: 'true' },
      { input: '[1, [], 0, 0]', expected: 'true' },
      { input: '[4, [[0,1],[2,3]], 1, 3]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'BFS rescanning the edge list',
        complexity: 'O(V · E)',
        code: `function validPath(n, edges, source, destination) {
  const seen = [];
  for (let i = 0; i < n; i++) seen.push(false);
  const queue = [source];
  seen[source] = true;
  let head = 0;
  while (head < queue.length) {
    const u = queue[head];
    head++;
    if (u === destination) return true;
    for (let k = 0; k < edges.length; k++) {
      const a = edges[k][0];
      const b = edges[k][1];
      if (a === u && !seen[b]) {
        seen[b] = true;
        queue.push(b);
      } else if (b === u && !seen[a]) {
        seen[a] = true;
        queue.push(a);
      }
    }
  }
  return false;
}`,
      },
      {
        label: 'BFS with adjacency list',
        complexity: 'O(V + E)',
        code: `function validPath(n, edges, source, destination) {
  const adj = [];
  const seen = [];
  for (let i = 0; i < n; i++) {
    adj.push([]);
    seen.push(false);
  }
  for (const e of edges) {
    adj[e[0]].push(e[1]);
    adj[e[1]].push(e[0]);
  }
  const queue = [source];
  seen[source] = true;
  let head = 0;
  while (head < queue.length) {
    const u = queue[head];
    head++;
    if (u === destination) return true;
    for (const v of adj[u]) {
      if (!seen[v]) {
        seen[v] = true;
        queue.push(v);
      }
    }
  }
  return false;
}`,
      },
    ],
    scale: {
      sizes: [20, 50, 100, 150],
      make: (n) => {
        const e: number[][] = [];
        for (let i = 0; i < n - 1; i++) e.push([i, i + 1]);
        return JSON.stringify([n, e, 0, n - 1]);
      },
    },
  },
  {
    id: 'number-of-provinces',
    category: 'graphs',
    lc: 'number-of-provinces',
    n: 547,
    tags: ['union find', 'dfs', 'adjacency matrix'],
    title: 'Number of Provinces',
    difficulty: 'Medium',
    pattern: 'Connected components on a matrix',
    summary:
      'Given an n by n matrix where 1 means two cities are directly linked, count the groups of cities that are connected directly or indirectly.',
    hook: 'Components in an adjacency matrix: DFS from each unseen city, or merge with union-find.',
    real: 'Grouping linked items, such as friend circles or connected subnets, is a components count.',
    input: '[[[1,1,0],[1,1,0],[0,0,1]]]',
    expected: '2',
    cases: [
      { input: '[[[1]]]', expected: '1' },
      { input: '[[[1,0],[0,1]]]', expected: '2' },
      { input: '[[[1,1],[1,1]]]', expected: '1' },
      { input: '[[[1,0,0,1],[0,1,1,0],[0,1,1,0],[1,0,0,1]]]', expected: '2' },
    ],
    solutions: [
      {
        label: 'DFS from each unseen city',
        complexity: 'O(n²)',
        code: `function findCircleNum(isConnected) {
  const n = isConnected.length;
  const seen = [];
  for (let i = 0; i < n; i++) seen.push(false);
  let count = 0;
  for (let s = 0; s < n; s++) {
    if (seen[s]) continue;
    count++;
    seen[s] = true;
    const stack = [s];
    while (stack.length > 0) {
      const u = stack.pop();
      for (let v = 0; v < n; v++) {
        if (isConnected[u][v] === 1 && !seen[v]) {
          seen[v] = true;
          stack.push(v);
        }
      }
    }
  }
  return count;
}`,
      },
      {
        label: 'Union-find',
        complexity: 'O(n² · α(n))',
        code: `function findCircleNum(isConnected) {
  const n = isConnected.length;
  const parent = [];
  for (let i = 0; i < n; i++) parent.push(i);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  let count = n;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i][j] === 1) {
        const ra = find(i);
        const rb = find(j);
        if (ra !== rb) {
          parent[ra] = rb;
          count--;
        }
      }
    }
  }
  return count;
}`,
      },
    ],
  },
  {
    id: 'word-ladder',
    category: 'graphs',
    lc: 'word-ladder',
    n: 127,
    tags: ['bfs', 'strings', 'hash map'],
    title: 'Word Ladder',
    difficulty: 'Hard',
    pattern: 'BFS with wildcard buckets',
    summary:
      'Change one letter at a time, each step landing on a word in the list, to turn the begin word into the end word. Return the number of words in the shortest sequence, or 0.',
    hook: 'Words that differ by one letter share a wildcard pattern like h*t, so bucket by pattern instead of comparing all pairs.',
    real: 'Spell-checkers and fuzzy search use wildcard or deletion neighborhoods to find near-matches without comparing every pair.',
    input: '["hit", "cog", ["hot","dot","dog","lot","log","cog"]]',
    expected: '5',
    cases: [
      { input: '["hit", "cog", ["hot","dot","dog","lot","log"]]', expected: '0' },
      { input: '["a", "c", ["a","b","c"]]', expected: '2' },
      { input: '["hit", "hot", ["hot"]]', expected: '2' },
    ],
    solutions: [
      {
        label: 'BFS comparing against every word',
        complexity: 'O(N² · L)',
        code: `function ladderLength(beginWord, endWord, wordList) {
  function oneApart(a, b) {
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) diff++;
    }
    return diff === 1;
  }
  let hasEnd = false;
  const used = [];
  for (let i = 0; i < wordList.length; i++) {
    if (wordList[i] === endWord) hasEnd = true;
    used.push(false);
  }
  if (!hasEnd) return 0;
  const queue = [beginWord];
  const dist = [1];
  let head = 0;
  while (head < queue.length) {
    const word = queue[head];
    const d = dist[head];
    head++;
    if (word === endWord) return d;
    for (let i = 0; i < wordList.length; i++) {
      if (!used[i] && oneApart(word, wordList[i])) {
        used[i] = true;
        queue.push(wordList[i]);
        dist.push(d + 1);
      }
    }
  }
  return 0;
}`,
      },
      {
        label: 'BFS with pattern buckets',
        complexity: 'O(N · L²)',
        code: `function ladderLength(beginWord, endWord, wordList) {
  const buckets = new Map();
  for (const w of wordList) {
    for (let i = 0; i < w.length; i++) {
      const key = w.slice(0, i) + "*" + w.slice(i + 1);
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(w);
    }
  }
  const seen = new Set([beginWord]);
  const queue = [beginWord];
  const dist = [1];
  let head = 0;
  while (head < queue.length) {
    const word = queue[head];
    const d = dist[head];
    head++;
    for (let i = 0; i < word.length; i++) {
      const key = word.slice(0, i) + "*" + word.slice(i + 1);
      const group = buckets.get(key) || [];
      for (const nb of group) {
        if (nb === endWord) return d + 1;
        if (!seen.has(nb)) {
          seen.add(nb);
          queue.push(nb);
          dist.push(d + 1);
        }
      }
    }
  }
  return 0;
}`,
      },
    ],
    scale: {
      sizes: [20, 40, 80, 120],
      make: (n) => {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const words: string[] = [];
        for (let i = 0; i < n; i++) words.push(letters[Math.floor(i / 26)] + letters[i % 26]);
        return JSON.stringify(['aa', words[n - 1], words]);
      },
    },
  },
  {
    id: 'network-delay-time',
    category: 'graphs',
    lc: 'network-delay-time',
    n: 743,
    tags: ['dijkstra', 'bellman-ford', 'shortest path'],
    title: 'Network Delay Time',
    difficulty: 'Medium',
    pattern: 'Single-source shortest path',
    summary:
      'Given directed weighted edges [from, to, time] on nodes 1..n and a start node k, return how long until every node has the signal, or -1 if some are unreachable.',
    hook: 'The answer is the largest shortest-path distance from k.',
    real: 'Routing protocols compute shortest paths from a router to every other node in just this way.',
    input: '[[[2,1,1],[2,3,1],[3,4,1]], 4, 2]',
    expected: '2',
    cases: [
      { input: '[[[1,2,1]], 2, 1]', expected: '1' },
      { input: '[[[1,2,1]], 2, 2]', expected: '-1' },
      { input: '[[], 1, 1]', expected: '0' },
      { input: '[[[1,2,5],[1,3,1],[3,2,2]], 3, 1]', expected: '3' },
    ],
    solutions: [
      {
        label: 'Bellman-Ford',
        complexity: 'O(V · E)',
        code: `function networkDelayTime(times, n, k) {
  const INF = 1000000000;
  const dist = [];
  for (let i = 0; i <= n; i++) dist.push(INF);
  dist[k] = 0;
  for (let round = 1; round < n; round++) {
    let changed = false;
    for (const t of times) {
      if (dist[t[0]] < INF && dist[t[0]] + t[2] < dist[t[1]]) {
        dist[t[1]] = dist[t[0]] + t[2];
        changed = true;
      }
    }
    if (!changed) break;
  }
  let worst = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === INF) return -1;
    worst = Math.max(worst, dist[i]);
  }
  return worst;
}`,
      },
      {
        label: 'Dijkstra (array scan)',
        complexity: 'O(V² + E)',
        code: `function networkDelayTime(times, n, k) {
  const INF = 1000000000;
  const adj = [];
  const dist = [];
  const done = [];
  for (let i = 0; i <= n; i++) {
    adj.push([]);
    dist.push(INF);
    done.push(false);
  }
  for (const t of times) adj[t[0]].push([t[1], t[2]]);
  dist[k] = 0;
  for (let round = 0; round < n; round++) {
    let u = -1;
    for (let i = 1; i <= n; i++) {
      if (!done[i] && dist[i] < INF && (u === -1 || dist[i] < dist[u])) u = i;
    }
    if (u === -1) break;
    done[u] = true;
    for (const e of adj[u]) {
      if (dist[u] + e[1] < dist[e[0]]) dist[e[0]] = dist[u] + e[1];
    }
  }
  let worst = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === INF) return -1;
    worst = Math.max(worst, dist[i]);
  }
  return worst;
}`,
      },
    ],
    scale: {
      sizes: [10, 20, 40, 60],
      make: (n) => {
        const t: number[][] = [];
        for (let i = 1; i < n; i++) {
          t.push([i, i + 1, 1]);
          if (i + 2 <= n) t.push([i, i + 2, 3]);
          if (i + 3 <= n) t.push([i, i + 3, 5]);
        }
        t.reverse();
        return JSON.stringify([t, n, 1]);
      },
    },
  },
  {
    id: 'cheapest-flights-within-k-stops',
    category: 'graphs',
    lc: 'cheapest-flights-within-k-stops',
    n: 787,
    tags: ['bellman-ford', 'shortest path', 'dfs'],
    title: 'Cheapest Flights Within K Stops',
    difficulty: 'Medium',
    pattern: 'Bounded Bellman-Ford',
    summary:
      'Given directed priced flights, find the cheapest trip from src to dst using at most k stops in between, or -1.',
    hook: 'Run exactly k+1 rounds of edge relaxation; round i holds the best price using i flights.',
    real: 'Route planners with a hop limit, such as bounded layovers or network hop caps, use the same layered relaxation.',
    input: '[4, [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], 0, 3, 1]',
    expected: '700',
    cases: [
      { input: '[3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 1]', expected: '200' },
      { input: '[3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 0]', expected: '500' },
      { input: '[2, [], 0, 1, 1]', expected: '-1' },
    ],
    solutions: [
      {
        label: 'Try every bounded path (DFS)',
        complexity: 'O(n^(k+1))',
        code: `function findCheapestPrice(n, flights, src, dst, k) {
  const adj = [];
  for (let i = 0; i < n; i++) adj.push([]);
  for (const f of flights) adj[f[0]].push([f[1], f[2]]);
  let best = -1;
  function go(u, used, cost) {
    if (u === dst) {
      if (best === -1 || cost < best) best = cost;
      return;
    }
    if (used === k + 1) return;
    for (const e of adj[u]) go(e[0], used + 1, cost + e[1]);
  }
  go(src, 0, 0);
  return best;
}`,
      },
      {
        label: 'Bellman-Ford, k+1 rounds',
        complexity: 'O(k · E)',
        code: `function findCheapestPrice(n, flights, src, dst, k) {
  const INF = 1000000000;
  let dist = [];
  for (let i = 0; i < n; i++) dist.push(INF);
  dist[src] = 0;
  for (let round = 0; round <= k; round++) {
    const next = [...dist];
    for (const f of flights) {
      if (dist[f[0]] < INF && dist[f[0]] + f[2] < next[f[1]]) {
        next[f[1]] = dist[f[0]] + f[2];
      }
    }
    dist = next;
  }
  return dist[dst] === INF ? -1 : dist[dst];
}`,
      },
    ],
    scale: {
      sizes: [4, 6, 8, 10],
      make: (n) => {
        const f: number[][] = [];
        for (let i = 0; i < n; i++) {
          for (let d = 1; d <= 3; d++) {
            if (i + d < n) f.push([i, i + d, d * 10]);
          }
        }
        return JSON.stringify([n, f, 0, n - 1, Math.floor(n / 2)]);
      },
    },
  },
  {
    id: 'shortest-path-in-binary-matrix',
    category: 'graphs',
    lc: 'shortest-path-in-binary-matrix',
    n: 1091,
    tags: ['grid', 'bfs', 'shortest path'],
    title: 'Shortest Path in Binary Matrix',
    difficulty: 'Medium',
    pattern: 'BFS on a grid (8 directions)',
    summary:
      'Walk from the top-left to the bottom-right through 0-cells, moving in any of 8 directions. Return the number of cells on the shortest path, or -1.',
    hook: 'Unweighted shortest path means BFS; the first time you reach the goal is the shortest.',
    real: 'Grid pathfinding in games and robot navigation starts from this BFS.',
    input: '[[[0,0,0],[1,1,0],[1,1,0]]]',
    expected: '4',
    cases: [
      { input: '[[[0,1],[1,0]]]', expected: '2' },
      { input: '[[[1,0],[0,0]]]', expected: '-1' },
      { input: '[[[0]]]', expected: '1' },
      { input: '[[[0,0,0],[1,1,0],[1,1,1]]]', expected: '-1' },
    ],
    solutions: [
      {
        label: 'Relax distances until stable',
        complexity: 'O((R·C)²)',
        code: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return -1;
  const INF = 1000000000;
  const dist = [];
  for (let r = 0; r < n; r++) {
    const line = [];
    for (let c = 0; c < n; c++) line.push(INF);
    dist.push(line);
  }
  dist[0][0] = 1;
  let changed = true;
  while (changed) {
    changed = false;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (grid[r][c] === 1) continue;
        let best = dist[r][c];
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
            if (dist[nr][nc] + 1 < best) best = dist[nr][nc] + 1;
          }
        }
        if (best < dist[r][c]) {
          dist[r][c] = best;
          changed = true;
        }
      }
    }
  }
  return dist[n - 1][n - 1] >= INF ? -1 : dist[n - 1][n - 1];
}`,
      },
      {
        label: 'BFS with early exit',
        complexity: 'O(R·C)',
        code: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return -1;
  const seen = [];
  for (let r = 0; r < n; r++) {
    const line = [];
    for (let c = 0; c < n; c++) line.push(false);
    seen.push(line);
  }
  const queue = [[0, 0, 1]];
  seen[0][0] = true;
  let head = 0;
  while (head < queue.length) {
    const cur = queue[head];
    head++;
    if (cur[0] === n - 1 && cur[1] === n - 1) return cur[2];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = cur[0] + dr;
        const nc = cur[1] + dc;
        if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
        if (grid[nr][nc] === 1 || seen[nr][nc]) continue;
        seen[nr][nc] = true;
        queue.push([nr, nc, cur[2] + 1]);
      }
    }
  }
  return -1;
}`,
      },
    ],
  },
  {
    id: '01-matrix',
    category: 'graphs',
    lc: '01-matrix',
    n: 542,
    tags: ['grid', 'bfs', 'multi-source'],
    title: '01 Matrix',
    difficulty: 'Medium',
    pattern: 'Multi-source BFS',
    summary:
      'For every cell of a grid containing at least one 0, return the distance (in steps up, down, left, right) to the nearest 0.',
    hook: 'Seed the queue with every zero at once and let the distances ripple outward.',
    real: 'Distance transforms in image processing and nearest-facility maps are computed this way.',
    input: '[[[0,0,0],[0,1,0],[1,1,1]]]',
    expected: '[[0, 0, 0], [0, 1, 0], [1, 2, 1]]',
    cases: [
      { input: '[[[0]]]', expected: '[[0]]' },
      { input: '[[[0,1,1,1]]]', expected: '[[0, 1, 2, 3]]' },
      { input: '[[[1,1],[1,0]]]', expected: '[[2, 1], [1, 0]]' },
    ],
    solutions: [
      {
        label: 'Compare with every zero',
        complexity: 'O((R·C)²)',
        code: `function updateMatrix(mat) {
  const rows = mat.length;
  const cols = mat[0].length;
  const zeros = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mat[r][c] === 0) zeros.push([r, c]);
    }
  }
  const out = [];
  for (let r = 0; r < rows; r++) {
    const line = [];
    for (let c = 0; c < cols; c++) {
      let best = 1000000000;
      if (mat[r][c] === 0) best = 0;
      else {
        for (const z of zeros) {
          const d = Math.abs(r - z[0]) + Math.abs(c - z[1]);
          if (d < best) best = d;
        }
      }
      line.push(best);
    }
    out.push(line);
  }
  return out;
}`,
      },
      {
        label: 'Multi-source BFS',
        complexity: 'O(R·C)',
        code: `function updateMatrix(mat) {
  const rows = mat.length;
  const cols = mat[0].length;
  const out = [];
  const queue = [];
  for (let r = 0; r < rows; r++) {
    const line = [];
    for (let c = 0; c < cols; c++) {
      if (mat[r][c] === 0) {
        line.push(0);
        queue.push([r, c]);
      } else {
        line.push(-1);
      }
    }
    out.push(line);
  }
  let head = 0;
  while (head < queue.length) {
    const cur = queue[head];
    head++;
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const d of dirs) {
      const nr = cur[0] + d[0];
      const nc = cur[1] + d[1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (out[nr][nc] !== -1) continue;
      out[nr][nc] = out[cur[0]][cur[1]] + 1;
      queue.push([nr, nc]);
    }
  }
  return out;
}`,
      },
    ],
    scale: {
      sizes: [4, 6, 8, 10, 12],
      make: (n) => {
        const g: number[][] = [];
        for (let r = 0; r < n; r++) {
          const row: number[] = [];
          for (let c = 0; c < n; c++) row.push((r + c) % 7 === 0 ? 0 : 1);
          g.push(row);
        }
        return JSON.stringify([g]);
      },
    },
  },
  {
    id: 'is-graph-bipartite',
    category: 'graphs',
    lc: 'is-graph-bipartite',
    n: 785,
    tags: ['bfs', 'dfs', 'coloring'],
    title: 'Is Graph Bipartite?',
    difficulty: 'Medium',
    pattern: 'Two-coloring',
    summary:
      'Given an undirected graph as an adjacency list, decide whether its nodes can be split into two sets so every edge crosses between them.',
    hook: 'Color a node, give every neighbor the opposite color; a clash means an odd cycle.',
    real: 'Two-coloring models conflict-free assignment, such as splitting tasks across two machines when some pairs must not share one.',
    input: '[[[1,3],[0,2],[1,3],[0,2]]]',
    expected: 'true',
    cases: [
      { input: '[[[1,2,3],[0,2],[0,1,3],[0,2]]]', expected: 'false' },
      { input: '[[[],[]]]', expected: 'true' },
      { input: '[[]]', expected: 'true' },
      { input: '[[[1],[0],[3,4],[2,4],[2,3]]]', expected: 'false' },
    ],
    solutions: [
      {
        label: 'Recursive DFS coloring',
        complexity: 'O(V + E)',
        code: `function isBipartite(graph) {
  const n = graph.length;
  const color = [];
  for (let i = 0; i < n; i++) color.push(-1);
  function paint(u, c) {
    color[u] = c;
    for (const v of graph[u]) {
      if (color[v] === c) return false;
      if (color[v] === -1 && !paint(v, 1 - c)) return false;
    }
    return true;
  }
  for (let i = 0; i < n; i++) {
    if (color[i] === -1 && !paint(i, 0)) return false;
  }
  return true;
}`,
      },
      {
        label: 'BFS coloring',
        complexity: 'O(V + E)',
        code: `function isBipartite(graph) {
  const n = graph.length;
  const color = [];
  for (let i = 0; i < n; i++) color.push(-1);
  for (let s = 0; s < n; s++) {
    if (color[s] !== -1) continue;
    color[s] = 0;
    const queue = [s];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head];
      head++;
      for (const v of graph[u]) {
        if (color[v] === -1) {
          color[v] = 1 - color[u];
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false;
        }
      }
    }
  }
  return true;
}`,
      },
    ],
  },
  {
    id: 'keys-and-rooms',
    category: 'graphs',
    lc: 'keys-and-rooms',
    n: 841,
    tags: ['dfs', 'reachability'],
    title: 'Keys and Rooms',
    difficulty: 'Medium',
    pattern: 'DFS reachability',
    summary:
      'Room 0 is open; each room holds keys to other rooms. Decide whether every room can eventually be entered.',
    hook: 'Walk with a stack of rooms to visit instead of re-sweeping all rooms until nothing changes.',
    real: 'Checking that every resource is reachable from a root, as in permission graphs or link crawling, is a reachability walk.',
    input: '[[[1],[2],[3],[]]]',
    expected: 'true',
    cases: [
      { input: '[[[1,3],[3,0,1],[2],[0]]]', expected: 'false' },
      { input: '[[[]]]', expected: 'true' },
      { input: '[[[2],[],[1]]]', expected: 'true' },
    ],
    solutions: [
      {
        label: 'Sweep all rooms until stable',
        complexity: 'O(V · (V + E))',
        code: `function canVisitAllRooms(rooms) {
  const n = rooms.length;
  const open = [];
  for (let i = 0; i < n; i++) open.push(false);
  open[0] = true;
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < n; i++) {
      if (!open[i]) continue;
      for (const key of rooms[i]) {
        if (!open[key]) {
          open[key] = true;
          changed = true;
        }
      }
    }
  }
  for (let i = 0; i < n; i++) {
    if (!open[i]) return false;
  }
  return true;
}`,
      },
      {
        label: 'DFS with a stack',
        complexity: 'O(V + E)',
        code: `function canVisitAllRooms(rooms) {
  const n = rooms.length;
  const seen = [];
  for (let i = 0; i < n; i++) seen.push(false);
  seen[0] = true;
  const stack = [0];
  let count = 0;
  while (stack.length > 0) {
    const u = stack.pop();
    count++;
    for (const key of rooms[u]) {
      if (!seen[key]) {
        seen[key] = true;
        stack.push(key);
      }
    }
  }
  return count === n;
}`,
      },
    ],
    scale: {
      sizes: [10, 20, 40, 80],
      make: (n) => {
        const rooms: number[][] = [[n - 1], []];
        for (let i = 2; i < n; i++) rooms.push([i - 1]);
        return JSON.stringify([rooms]);
      },
    },
  },
  {
    id: 'all-paths-from-source-to-target',
    category: 'graphs',
    lc: 'all-paths-from-source-to-target',
    n: 797,
    tags: ['dfs', 'backtracking', 'dag', 'memoization'],
    title: 'All Paths From Source to Target',
    difficulty: 'Medium',
    pattern: 'DFS on a DAG',
    summary:
      'In a directed acyclic graph given as an adjacency list, list every path from node 0 to node n-1 (neighbors tried in the given order).',
    hook: 'Because there are no cycles, you can build paths without a visited set; memoize each node suffix to reuse work.',
    real: 'Enumerating every route through a workflow or dependency graph relies on the acyclic guarantee.',
    input: '[[[1,2],[3],[3],[]]]',
    expected: '[[0, 1, 3], [0, 2, 3]]',
    cases: [
      {
        input: '[[[4,3,1],[3,2,4],[3],[4],[]]]',
        expected: '[[0, 4], [0, 3, 4], [0, 1, 3, 4], [0, 1, 2, 3, 4], [0, 1, 4]]',
      },
      { input: '[[[]]]', expected: '[[0]]' },
      { input: '[[[1],[]]]', expected: '[[0, 1]]' },
    ],
    solutions: [
      {
        label: 'Backtracking DFS',
        complexity: 'O(2^n · n)',
        code: `function allPathsSourceTarget(graph) {
  const target = graph.length - 1;
  const out = [];
  const path = [0];
  function walk(u) {
    if (u === target) {
      out.push([...path]);
      return;
    }
    for (const v of graph[u]) {
      path.push(v);
      walk(v);
      path.pop();
    }
  }
  walk(0);
  return out;
}`,
      },
      {
        label: 'Memoized suffix paths',
        complexity: 'O(2^n · n)',
        code: `function allPathsSourceTarget(graph) {
  const target = graph.length - 1;
  const memo = new Map();
  function from(u) {
    if (u === target) return [[u]];
    if (memo.has(u)) return memo.get(u);
    const result = [];
    for (const v of graph[u]) {
      for (const rest of from(v)) result.push([u, ...rest]);
    }
    memo.set(u, result);
    return result;
  }
  return from(0);
}`,
      },
    ],
  },
  {
    id: 'min-cost-to-connect-all-points',
    category: 'graphs',
    lc: 'min-cost-to-connect-all-points',
    n: 1584,
    tags: ['mst', 'prim', 'kruskal', 'union find'],
    title: 'Min Cost to Connect All Points',
    difficulty: 'Medium',
    pattern: 'Minimum spanning tree',
    summary:
      'Points on a plane are connected by edges costing the Manhattan distance. Return the cheapest total cost to link all points into one network.',
    hook: 'Prim: keep growing the tree by the closest outside point; no need to sort every edge.',
    real: 'Laying cable or road between sites at minimum total length is a minimum spanning tree.',
    input: '[[[0,0],[2,2],[3,10],[5,2],[7,0]]]',
    expected: '20',
    cases: [
      { input: '[[[0,0]]]', expected: '0' },
      { input: '[[[0,0],[1,1]]]', expected: '2' },
      { input: '[[[3,12],[-2,5],[-4,1]]]', expected: '18' },
    ],
    solutions: [
      {
        label: 'Kruskal (sort all edges + union-find)',
        complexity: 'O(n² log n)',
        code: `function minCostConnectPoints(points) {
  const n = points.length;
  const edges = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
      edges.push([d, i, j]);
    }
  }
  edges.sort((a, b) => a[0] - b[0]);
  const parent = [];
  for (let i = 0; i < n; i++) parent.push(i);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  let total = 0;
  let used = 0;
  for (const e of edges) {
    const ra = find(e[1]);
    const rb = find(e[2]);
    if (ra !== rb) {
      parent[ra] = rb;
      total += e[0];
      used++;
      if (used === n - 1) break;
    }
  }
  return total;
}`,
      },
      {
        label: 'Prim (array scan)',
        complexity: 'O(n²)',
        code: `function minCostConnectPoints(points) {
  const n = points.length;
  const INF = 1000000000;
  const best = [];
  const inTree = [];
  for (let i = 0; i < n; i++) {
    best.push(INF);
    inTree.push(false);
  }
  best[0] = 0;
  let total = 0;
  for (let round = 0; round < n; round++) {
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!inTree[i] && (u === -1 || best[i] < best[u])) u = i;
    }
    inTree[u] = true;
    total += best[u];
    for (let v = 0; v < n; v++) {
      if (inTree[v]) continue;
      const d = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
      if (d < best[v]) best[v] = d;
    }
  }
  return total;
}`,
      },
    ],
  },
  {
    id: 'open-the-lock',
    category: 'graphs',
    lc: 'open-the-lock',
    n: 752,
    tags: ['bfs', 'bidirectional', 'strings'],
    title: 'Open the Lock',
    difficulty: 'Medium',
    pattern: 'BFS on states (bidirectional)',
    summary:
      'A four-wheel lock starts at "0000"; one turn moves one wheel by one digit (wrapping). Some codes are dead ends. Return the fewest turns to reach the target, or -1.',
    hook: 'Each lock state is a node with 8 neighbors; BFS from both ends meets in the middle.',
    real: 'Search over puzzle or configuration states, and searching from both ends, is how solvers shrink huge state spaces.',
    input: '[["0100","0010"], "0202"]',
    expected: '4',
    cases: [
      { input: '[["0000"], "8888"]', expected: '-1' },
      { input: '[[], "0000"]', expected: '0' },
      { input: '[[], "0009"]', expected: '1' },
      { input: '[["0201"], "0201"]', expected: '-1' },
    ],
    solutions: [
      {
        label: 'Plain BFS',
        complexity: 'O(10⁴ · 8)',
        code: `function openLock(deadends, target) {
  const dead = new Set(deadends);
  if (dead.has("0000")) return -1;
  if (target === "0000") return 0;
  const seen = new Set(["0000"]);
  const queue = ["0000"];
  const dist = [0];
  let head = 0;
  while (head < queue.length) {
    const word = queue[head];
    const d = dist[head];
    head++;
    for (let i = 0; i < 4; i++) {
      const digit = Number(word[i]);
      for (const delta of [1, 9]) {
        const nd = (digit + delta) % 10;
        const next = word.slice(0, i) + nd + word.slice(i + 1);
        if (dead.has(next) || seen.has(next)) continue;
        if (next === target) return d + 1;
        seen.add(next);
        queue.push(next);
        dist.push(d + 1);
      }
    }
  }
  return -1;
}`,
      },
      {
        label: 'Bidirectional BFS',
        complexity: 'O(10⁴ · 8)',
        code: `function openLock(deadends, target) {
  const dead = new Set(deadends);
  if (dead.has("0000") || dead.has(target)) return -1;
  if (target === "0000") return 0;
  let front = new Set(["0000"]);
  let back = new Set([target]);
  const seen = new Set(["0000", target]);
  let steps = 0;
  while (front.size > 0 && back.size > 0) {
    if (front.size > back.size) {
      const tmp = front;
      front = back;
      back = tmp;
    }
    steps++;
    const next = new Set();
    for (const word of front) {
      for (let i = 0; i < 4; i++) {
        const digit = Number(word[i]);
        for (const delta of [1, 9]) {
          const nd = (digit + delta) % 10;
          const w = word.slice(0, i) + nd + word.slice(i + 1);
          if (back.has(w)) return steps;
          if (dead.has(w) || seen.has(w)) continue;
          seen.add(w);
          next.add(w);
        }
      }
    }
    front = next;
  }
  return -1;
}`,
      },
    ],
  },
  {
    id: 'accounts-merge',
    category: 'graphs',
    lc: 'accounts-merge',
    n: 721,
    tags: ['union find', 'hash map', 'sorting'],
    title: 'Accounts Merge',
    difficulty: 'Medium',
    pattern: 'Union-find on shared emails',
    summary:
      'Each account is [name, email, email, ...]. Accounts that share any email belong to one person. Merge them; each result lists the name then its sorted emails, with results sorted.',
    hook: 'Treat accounts as nodes and shared emails as edges, then group by root.',
    real: 'Entity resolution in CRMs and identity systems merges duplicate records that share an identifier.',
    input: '[[["John","a@m","b@m"],["John","c@m"],["John","b@m","d@m"],["Mary","e@m"]]]',
    expected: '[["John", "a@m", "b@m", "d@m"], ["John", "c@m"], ["Mary", "e@m"]]',
    cases: [
      { input: '[[["A","x"]]]', expected: '[["A", "x"]]' },
      { input: '[[]]', expected: '[]' },
      { input: '[[["A","x","y"],["A","z"],["A","y","z"]]]', expected: '[["A", "x", "y", "z"]]' },
    ],
    solutions: [
      {
        label: 'Merge overlapping groups one by one',
        complexity: 'O(n² · k)',
        code: `function accountsMerge(accounts) {
  let groups = [];
  for (const acct of accounts) {
    const emails = new Set(acct.slice(1));
    const keep = [];
    for (const g of groups) {
      let overlap = false;
      for (const e of g.emails) {
        if (emails.has(e)) overlap = true;
      }
      if (overlap) {
        for (const e of g.emails) emails.add(e);
      } else {
        keep.push(g);
      }
    }
    keep.push({ name: acct[0], emails: emails });
    groups = keep;
  }
  const out = [];
  for (const g of groups) {
    const list = Array.from(g.emails);
    list.sort();
    out.push([g.name, ...list]);
  }
  out.sort((a, b) => (a.join(",") < b.join(",") ? -1 : 1));
  return out;
}`,
      },
      {
        label: 'Union-find over accounts',
        complexity: 'O(N log N)',
        code: `function accountsMerge(accounts) {
  const parent = [];
  for (let i = 0; i < accounts.length; i++) parent.push(i);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  const owner = new Map();
  for (let i = 0; i < accounts.length; i++) {
    for (let j = 1; j < accounts[i].length; j++) {
      const e = accounts[i][j];
      if (owner.has(e)) {
        parent[find(i)] = find(owner.get(e));
      } else {
        owner.set(e, i);
      }
    }
  }
  const groups = new Map();
  for (const e of owner.keys()) {
    const root = find(owner.get(e));
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(e);
  }
  const out = [];
  for (const root of groups.keys()) {
    const list = groups.get(root);
    list.sort();
    out.push([accounts[root][0], ...list]);
  }
  out.sort((a, b) => (a.join(",") < b.join(",") ? -1 : 1));
  return out;
}`,
      },
    ],
  },
];
