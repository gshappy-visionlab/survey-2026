import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const appPath = path.join(rootDir, "app.js");
const outDir = path.join(rootDir, "docs");

const source = fs.readFileSync(appPath, "utf8");
const questions = vm.runInNewContext(`(${extractQuestionsArray(source)})`, {}, { timeout: 1000 });
const questionById = new Map(questions.map((question) => [question.id, question]));

const terminalNodes = [
  {
    id: "submit",
    section: "제출",
    title: "설문 제출 및 결과 분류",
    type: "terminal",
  },
  {
    id: "result_witness",
    section: "결과",
    title: "증인",
    type: "result",
  },
  {
    id: "result_vision",
    section: "결과",
    title: "비전",
    type: "result",
  },
  {
    id: "result_gospel",
    section: "결과",
    title: "복음 이해",
    type: "result",
  },
  {
    id: "result_courage",
    section: "결과",
    title: "용기와 훈련",
    type: "result",
  },
  {
    id: "result_reflection",
    section: "결과",
    title: "성찰 fallback",
    type: "result",
  },
];

const dynamicEdges = {
  q3_2: [
    { to: "q3_3", label: "복음대로 살고 있지 못해서" },
    { to: "q3_4", label: "전하기 두렵다 / q3_3 조건 없음" },
    { to: "q4_1_no", label: "그 외" },
  ],
  q3_3: [
    { to: "q3_4", label: "q3_2에서 전하기 두렵다도 선택" },
    { to: "q4_1_no", label: "그 외" },
  ],
};

const manualLabelPositions = {
  "q3_2->q3_4": { x: 595, y: 2328 },
  "q3_3->q3_4": { x: 335, y: 2425 },
  "q4_2->q4_4": { x: 855, y: 2490 },
  "q4_3->q4_4": { x: 1215, y: 2585 },
};

const positions = {
  q1_1: [680, 90],
  q1_2: [330, 250],
  q1_3: [680, 410],
  q1_4: [330, 570],
  q1_5: [680, 730],
  q1_6: [330, 890],
  q1_7: [680, 1050],
  q1_8: [330, 1210],
  q1_9: [680, 1370],
  q1_10: [330, 1530],
  q2_1: [680, 1690],
  q2_2: [680, 1850],
  q3_1: [680, 2010],
  q3_2: [330, 2170],
  q3_3: [190, 2330],
  q3_4: [470, 2490],
  q4_1_no: [330, 2650],
  q4_1_yes: [1030, 2170],
  q4_2: [1030, 2330],
  q4_3: [1190, 2490],
  q4_4: [1030, 2650],
  q5_1: [680, 2850],
  q5_2: [680, 3010],
  q5_3: [500, 3170],
  q5_4: [860, 3170],
  q5_5: [680, 3330],
  q5_6: [680, 3490],
  q5_7: [680, 3650],
  submit: [680, 3830],
  result_witness: [140, 4030],
  result_vision: [415, 4030],
  result_gospel: [690, 4030],
  result_courage: [965, 4030],
  result_reflection: [1240, 4030],
};

const sectionColors = {
  "하나님에 대한 필요": ["#fff7ed", "#c2410c"],
  "복음에 대한 이해 부족": ["#eff6ff", "#1d4ed8"],
  "영적 무관심": ["#f0fdf4", "#15803d"],
  "바쁨과 우선순위": ["#fefce8", "#a16207"],
  "개인적 상처와 의문": ["#fdf2f8", "#be185d"],
  "나의 복음": ["#f5f3ff", "#7c3aed"],
  "복음 전하기": ["#ecfeff", "#0e7490"],
  "복음을 전한 경험": ["#eef2ff", "#4338ca"],
  "복음을 전하고 싶은 대상": ["#f0fdfa", "#0f766e"],
  "비전과 사명": ["#f8fafc", "#475569"],
  "청년세대의 어려움": ["#fff1f2", "#be123c"],
  "소망과 회복": ["#f7fee7", "#4d7c0f"],
  제출: ["#f3f4f6", "#374151"],
  결과: ["#f8fafc", "#1e293b"],
};

const nodes = [...questions, ...terminalNodes].map((question, index) => ({
  ...question,
  index,
  x: positions[question.id]?.[0] || 680,
  y: positions[question.id]?.[1] || 90 + index * 160,
}));
compactRows(nodes);
addResultGap(nodes);

const nodeById = new Map(nodes.map((node) => [node.id, node]));
const edges = collectEdges(questions);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "survey-flow.dot"), renderDot(nodes, edges));
fs.writeFileSync(path.join(outDir, "survey-flow.svg"), renderSvg(nodes, edges));

console.log(`Wrote ${path.relative(rootDir, path.join(outDir, "survey-flow.svg"))}`);
console.log(`Wrote ${path.relative(rootDir, path.join(outDir, "survey-flow.dot"))}`);

function extractQuestionsArray(fileSource) {
  const marker = "const questions =";
  const markerIndex = fileSource.indexOf(marker);
  if (markerIndex === -1) throw new Error("Could not find questions array.");

  const arrayStart = fileSource.indexOf("[", markerIndex);
  if (arrayStart === -1) throw new Error("Could not find questions array start.");

  let depth = 0;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = arrayStart; index < fileSource.length; index += 1) {
    const char = fileSource[index];
    const next = fileSource[index + 1];

    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }

    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === quote) quote = "";
      continue;
    }

    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }

    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }

    if (char === "'" || char === '"' || char === "`") {
      quote = char;
      continue;
    }

    if (char === "[") depth += 1;
    if (char === "]") {
      depth -= 1;
      if (depth === 0) return fileSource.slice(arrayStart, index + 1);
    }
  }

  throw new Error("Could not find questions array end.");
}

function compactRows(graphNodes) {
  const top = 90;
  const rowGap = 160;
  const rows = [...new Set(graphNodes.map((node) => node.y))].sort((a, b) => a - b);
  const rowMap = new Map(rows.map((row, index) => [row, top + index * rowGap]));

  graphNodes.forEach((node) => {
    node.y = rowMap.get(node.y);
  });
}

function addResultGap(graphNodes) {
  graphNodes.forEach((node) => {
    if (node.id.startsWith("result_")) node.y += 160;
  });
}

function collectEdges(questionList) {
  const edgeMap = new Map();

  function addEdge(from, to, label = "", meta = {}) {
    if (!to) return;
    const key = `${from}->${to}`;
    const edge = edgeMap.get(key) || { from, to, labels: [] };
    Object.assign(edge, meta);
    const labels = Array.isArray(label) ? label : [label];
    labels.filter(Boolean).forEach((item) => {
      if (!edge.labels.includes(item)) edge.labels.push(item);
    });
    edgeMap.set(key, edge);
  }

  questionList.forEach((question) => {
    if (dynamicEdges[question.id]) {
      dynamicEdges[question.id].forEach((edge) => addEdge(question.id, edge.to, edge.label));
      return;
    }

    const optionNexts = new Map();
    if (question.type?.startsWith("single")) {
      question.options?.forEach((option) => {
        if (!option || typeof option !== "object" || !option.next) return;
        const label = shortEdgeLabel(option.label);
        const labels = optionNexts.get(option.next) || [];
        labels.push(label);
        optionNexts.set(option.next, labels);
      });
    }

    optionNexts.forEach((labels, to) => addEdge(question.id, to, labels));

    if (typeof question.next === "string") {
      const fallbackLabel = optionNexts.size && question.allowOther ? "기타" : question.next === "submit" ? "제출" : "";
      addEdge(question.id, question.next, fallbackLabel);
    }
  });

  [
    { from: "submit", to: "result_witness", label: "1순위: q3_1 = 네" },
    { from: "submit", to: "result_vision", label: "2순위: q3_1 != 네\nq5_2 = 안다" },
    { from: "submit", to: "result_gospel", label: "3순위: q3_1 != 네\nq5_2 != 안다\nq1_3 = 그렇다" },
    { from: "submit", to: "result_courage", label: "4순위: q3_1 != 네\nq5_2 != 안다\nq1_3 != 그렇다\nq3_2 응답 있음" },
    { from: "submit", to: "result_reflection", label: "fallback\n현재 정상 흐름에서는 도달 불가", dashed: true },
  ].forEach((edge) => addEdge(edge.from, edge.to, edge.label, { dashed: edge.dashed }));

  return [...edgeMap.values()].sort((a, b) => {
    const fromA = questionById.get(a.from)?.id || a.from;
    const fromB = questionById.get(b.from)?.id || b.from;
    return fromA.localeCompare(fromB, "ko") || a.to.localeCompare(b.to, "ko");
  });
}

function shortEdgeLabel(label) {
  return label
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s*\/\s*/g, "/")
    .replace("더 이상 미룰 수 없어서/대상자에게 더 이상 기회가 없을 것 같아서", "더 이상 미룰 수 없어서")
    .trim();
}

function formatEdgeLabel(labels) {
  const unique = [...new Set(labels)];
  if (!unique.length) return "";
  if (unique.length <= 2) return unique.join(" / ");
  if (unique.length <= 4) return unique.join("\n");
  return `${unique.slice(0, 3).join("\n")}\n외 ${unique.length - 3}개`;
}

function renderDot(graphNodes, graphEdges) {
  const lines = [
    "digraph SurveyFlow {",
    '  graph [rankdir=TB, bgcolor="white", splines=true, nodesep=0.5, ranksep=0.8];',
    '  node [shape=box, style="rounded,filled", fontname="Apple SD Gothic Neo", fontsize=12, margin="0.16,0.10"];',
    '  edge [fontname="Apple SD Gothic Neo", fontsize=10, color="#64748b", arrowsize=0.8];',
    "",
  ];

  graphNodes.forEach((node) => {
    const [fill, stroke] = sectionColors[node.section] || ["#ffffff", "#334155"];
    const label = `${node.id}\\n${escapeDot(node.section)}\\n${escapeDot(node.title)}`;
    lines.push(`  "${node.id}" [label="${label}", fillcolor="${fill}", color="${stroke}"];`);
  });

  lines.push("");
  graphEdges.forEach((edge) => {
    const formattedLabel = formatEdgeLabel(edge.labels);
    const attrs = [];
    if (formattedLabel) attrs.push(`label="${escapeDot(formattedLabel)}"`);
    if (edge.dashed) attrs.push('style="dashed"');
    const attrText = attrs.length ? ` [${attrs.join(", ")}]` : "";
    lines.push(`  "${edge.from}" -> "${edge.to}"${attrText};`);
  });

  lines.push("}");
  return `${lines.join("\n")}\n`;
}

function escapeDot(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function renderSvg(graphNodes, graphEdges) {
  const width = 1380;
  const nodeWidth = 270;
  const nodeHeight = 104;
  const height = Math.ceil(Math.max(...graphNodes.map((node) => node.y)) + nodeHeight / 2 + 70);
  const svg = [];

  svg.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">`);
  svg.push(`<title id="title">Survey Question Branch Flow</title>`);
  svg.push(`<desc id="desc">Node and edge graph generated from app.js questions array.</desc>`);
  svg.push(`<defs>`);
  svg.push(`<marker id="arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b"/></marker>`);
  svg.push(`<filter id="shadow" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.10"/></filter>`);
  svg.push(`</defs>`);
  svg.push(`<rect width="${width}" height="${height}" fill="#ffffff"/>`);
  svg.push(`<text x="40" y="42" font-family="${fontStack()}" font-size="22" font-weight="700" fill="#0f172a">비전 설문 질문 분기 그래프</text>`);
  svg.push(`<text x="40" y="70" font-family="${fontStack()}" font-size="13" fill="#64748b">Generated from app.js: ${questions.length} question nodes, 5 result nodes, ${graphEdges.length} directed edges</text>`);

  const edgeLayouts = graphEdges.flatMap((edge, index) => {
    const from = nodeById.get(edge.from);
    const to = nodeById.get(edge.to);
    if (!from || !to) return [];
    return [getEdgeLayout(from, to, edge, index, nodeWidth, nodeHeight)];
  });

  edgeLayouts.forEach((layout) => {
    svg.push(renderEdgePath(layout));
  });

  graphNodes.forEach((node) => {
    svg.push(renderNode(node, nodeWidth, nodeHeight));
  });

  edgeLayouts.forEach((layout) => {
    if (layout.label) svg.push(renderEdgeLabel(layout));
  });

  svg.push(`</svg>`);
  return `${svg.join("\n")}\n`;
}

function getEdgeLayout(from, to, edge, index, nodeWidth, nodeHeight) {
  const fromPoint = edgeAnchor(from, to, nodeWidth, nodeHeight, "from");
  const toPoint = edgeAnchor(to, from, nodeWidth, nodeHeight, "to");
  const deltaY = Math.abs(toPoint.y - fromPoint.y);
  const curve = Math.max(50, Math.min(140, deltaY * 0.45));
  const path = `M ${fromPoint.x} ${fromPoint.y} C ${fromPoint.x} ${fromPoint.y + curve}, ${toPoint.x} ${toPoint.y - curve}, ${toPoint.x} ${toPoint.y}`;
  const label = formatEdgeLabel(edge.labels);
  return { edge, index, fromPoint, toPoint, path, label };
}

function renderEdgePath(layout) {
  const { edge, path } = layout;
  const dash = edge.dashed ? ` stroke-dasharray="8 6"` : "";
  return `<path d="${path}" fill="none" stroke="#64748b" stroke-width="1.6" marker-end="url(#arrow)" opacity="0.78"${dash}/>`;
}

function edgeAnchor(node, other, nodeWidth, nodeHeight, direction) {
  const dx = other.x - node.x;
  const dy = other.y - node.y;

  if (Math.abs(dx) > Math.abs(dy) * 1.3) {
    return {
      x: node.x + Math.sign(dx) * (nodeWidth / 2),
      y: node.y + Math.max(-nodeHeight / 3, Math.min(nodeHeight / 3, dy * 0.2)),
    };
  }

  return {
    x: node.x + Math.max(-nodeWidth / 3, Math.min(nodeWidth / 3, dx * 0.18)),
    y: node.y + (direction === "from" ? nodeHeight / 2 : -nodeHeight / 2),
  };
}

function renderEdgeLabel(layout) {
  const { edge, fromPoint, toPoint, label, index } = layout;
  const lines = wrapLines(label, 17).slice(0, 4);
  const key = `${edge.from}->${edge.to}`;
  const manual = getManualLabelPosition(key, edge);
  const midX = manual?.x ?? (fromPoint.x + toPoint.x) / 2;
  const midY = manual?.y ?? (fromPoint.y + toPoint.y) / 2;
  const offset = index % 2 === 0 ? -10 : 12;
  const longest = lines.reduce((max, line) => Math.max(max, displayWidth(line)), 0);
  const width = Math.max(70, longest * 7 + 18);
  const height = lines.length * 15 + 10;
  const x = midX - width / 2;
  const y = midY + (manual ? 0 : offset) - height / 2;
  const text = lines.map((line, lineIndex) => `<tspan x="${midX}" dy="${lineIndex === 0 ? 0 : 15}">${escapeXml(line)}</tspan>`).join("");

  return [
    `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${width.toFixed(1)}" height="${height}" rx="5" fill="#ffffff" stroke="#cbd5e1" opacity="0.96"/>`,
    `<text x="${midX.toFixed(1)}" y="${(y + 17).toFixed(1)}" text-anchor="middle" font-family="${fontStack()}" font-size="10.5" fill="#334155">${text}</text>`,
  ].join("\n");
}

function getManualLabelPosition(key, edge) {
  if (edge.from === "submit" && edge.to.startsWith("result_")) {
    const submitNode = nodeById.get("submit");
    const resultNode = nodeById.get(edge.to);
    return {
      x: resultNode.x,
      y: submitNode.y + 178,
    };
  }
  return manualLabelPositions[key];
}

function renderNode(node, width, height) {
  const [fill, stroke] = sectionColors[node.section] || ["#ffffff", "#334155"];
  const x = node.x - width / 2;
  const y = node.y - height / 2;
  const titleLines = wrapLines(node.title, 18).slice(0, 3);
  const typeLabel = node.type ? `type: ${node.type}` : "";

  return [
    `<g filter="url(#shadow)">`,
    `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1.4"/>`,
    `<rect x="${x}" y="${y}" width="8" height="${height}" rx="4" fill="${stroke}"/>`,
    `<text x="${x + 20}" y="${y + 22}" font-family="${fontStack()}" font-size="12" font-weight="700" fill="${stroke}">${escapeXml(node.id)}</text>`,
    `<text x="${x + width - 14}" y="${y + 22}" text-anchor="end" font-family="${fontStack()}" font-size="10.5" fill="#64748b">${escapeXml(node.section)}</text>`,
    `<text x="${x + 20}" y="${y + 48}" font-family="${fontStack()}" font-size="13.2" font-weight="700" fill="#0f172a">${titleLines.map((line, index) => `<tspan x="${x + 20}" dy="${index === 0 ? 0 : 17}">${escapeXml(line)}</tspan>`).join("")}</text>`,
    typeLabel ? `<text x="${x + 20}" y="${y + height - 13}" font-family="${fontStack()}" font-size="10.5" fill="#64748b">${escapeXml(typeLabel)}</text>` : "",
    `</g>`,
  ].filter(Boolean).join("\n");
}

function wrapLines(text, maxWidth) {
  const lines = [];
  String(text).split("\n").forEach((part) => {
    const words = part.split(/\s+/).filter(Boolean);
    let line = "";

    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (displayWidth(candidate) <= maxWidth || !line) {
        line = candidate;
        return;
      }
      lines.push(line);
      line = word;
    });

    if (line) lines.push(line);
  });
  return lines.length ? lines : [""];
}

function displayWidth(value) {
  return [...String(value)].reduce((total, char) => total + (char.charCodeAt(0) > 127 ? 1.6 : 1), 0);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fontStack() {
  return "Apple SD Gothic Neo, Noto Sans KR, Malgun Gothic, Arial, sans-serif";
}
