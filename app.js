const GOOGLE_SCRIPT_URL = window.SURVEY_CONFIG?.googleScriptUrl || "";
const MULTI_SELECT_HELP = "복수 선택이 가능합니다.";

const questions = [
  {
    id: "q1_1",
    section: "하나님에 대한 필요",
    title: "나는 하나님이 필요한 사람인가요?",
    type: "single",
    required: true,
    options: [
      { label: "나는 하나님이 필요합니다.", next: "q1_3" },
      { label: "그다지 필요하지 않다고 생각합니다.", next: "q1_2" },
    ],
  },
  {
    id: "q1_2",
    section: "하나님에 대한 필요",
    title: "하나님이 필요하지 않다고 느끼는 가장 큰 이유는 무엇인가요?",
    help: "복수 선택이 가능합니다.",
    type: "multi",
    required: true,
    options: [
      "현재 삶에 큰 어려움이 없다.",
      "스스로 해결할 수 있다고 생각한다.",
      "하나님이 실제로 존재하는지 확신이 없다.",
      "하나님이 삶에 어떤 도움을 주는지 모르겠다.",
      "하나님에 대해 깊이 생각해 본 적이 없다.",
    ],
    allowOther: true,
    next: "q1_3",
  },
  {
    id: "q1_3",
    section: "복음에 대한 이해 부족",
    title: "예수님이 나를 위해 십자가를 지셨다는 것이 믿어지나요?",
    type: "single",
    required: true,
    options: [
      { label: "믿어집니다.", next: "q1_5" },
      { label: "아직 모르겠습니다.", next: "q1_4" },
    ],
  },
  {
    id: "q1_4",
    section: "복음에 대한 이해 부족",
    title: "어떤 이유로 믿어지지 않나요?",
    help: "복수 선택이 가능합니다.",
    type: "multi",
    required: true,
    options: [
      "내용을 잘 모르기 때문이다.",
      "현실과 연결되지 않는다고 생각한다.",
      "들어봤지만 특별한 의미를 느끼지 못했다.",
      "나와는 다른 사람들을 위한 이야기라고 생각한다.",
    ],
    allowOther: true,
    next: "q1_5",
  },
  {
    id: "q1_5",
    section: "영적 무관심",
    title: "신앙이나 영적인 문제에 대해 깊이 생각해 본 적이 있나요?",
    type: "single",
    required: true,
    options: [
      { label: "깊이 생각해 본 적이 있다.", next: "q1_9" },
      { label: "깊이 생각해 본 적이 없다.", next: "q1_6" },
    ],
  },
  {
    id: "q1_6",
    section: "영적 무관심",
    title: "이유가 무엇인가요?",
    help: "복수 선택이 가능합니다.",
    type: "multi",
    required: true,
    options: [
      "신앙보다 중요한 일이 많다.",
      "하나님에 대해 궁금한 점이 없다.",
      "하나님에 대해 실망한 경험이 있다.",
      "바빠서 생각할 여유가 없다.",
      "하나님의 뜻이 뭔지 모르겠다.",
    ],
    allowOther: true,
    next: "q1_7",
  },
  {
    id: "q1_7",
    section: "바쁨과 우선순위",
    title: "하나님과의 관계를 우선순위에 두고 있나요?",
    type: "single",
    required: true,
    options: [
      { label: "네", next: "q1_8" },
      { label: "아니오", next: "q1_8" },
    ],
  },
  {
    id: "q1_8",
    section: "바쁨과 우선순위",
    title: "최근 많은 관심과 에너지를 쏟고 있는 것은 무엇인가요?",
    type: "multi",
    required: true,
    options: [
      "학업 / 자기개발",
      "취업 / 진로준비",
      "직장 / 커리어",
      "연애 / 인간관계",
      "취미 및 여가",
      "재정관리 / 경제적 안정",
      "미디어 소비",
      "신앙생활 및 영적성장",
    ],
    allowOther: true,
    next: "q2_1",
  },
  {
    id: "q1_9",
    section: "영적 무관심",
    title: "하나님의 뜻을 구하며 기도하는 영역이 있나요?",
    type: "single",
    required: true,
    options: [
      { label: "네, 있습니다.", next: "q1_7" },
      { label: "아니오, 딱히 없습니다.", next: "q1_6" },
    ],
  },
  {
    id: "q2_1",
    section: "나의 복음",
    title: "복음을 어떻게 알게 되었나요?",
    help: "가장 가까운 이유를 선택해주세요. 복수 선택이 가능합니다.",
    type: "multiText",
    required: true,
    options: [
      "복음을 잘 모릅니다.",
      "예배를 통해 (찬양, 말씀, 기도)",
      "공동체를 통해 (환대, 구별됨, 믿음의 사람 등)",
      "선교를 통해",
      "사역을 통해",
      "고난(시련)을 통해",
      "누군가의 전도를 통해",
    ],
    allowOther: true,
    textLabel: "복음을 알게 된 이야기를 한 줄로 짧게 나눠주세요.",
    noteRequired: true,
    next: "q2_2",
  },
  {
    id: "q2_2",
    section: "나의 복음",
    title: "나의 언어로 정리된 나의 복음이 있나요? 복음이 뭐라고 생각하나요?",
    help: "하나 이상의 간증이나 문장으로 자유롭게 적어주세요. 작성하기 어렵다면 단어로도 좋습니다.",
    type: "textarea",
    required: true,
    next: "q3_1",
  },
  {
    id: "q3_1",
    section: "복음 전하기",
    title: "복음을 전하고 있나요?",
    type: "single",
    required: true,
    options: [
      { label: "네", next: "q4_1_yes" },
      { label: "아니오", next: "q3_2" },
    ],
  },
  {
    id: "q3_2",
    section: "복음 전하기",
    title: "복음을 전하기 어려운 이유가 무엇인가요?",
    help: "복수 선택이 가능합니다. 선택에 따라 추가 질문이 이어집니다.",
    type: "multi",
    required: true,
    options: [
      "사실 복음을 잘 몰라서",
      "전할 대상이 없어서",
      "복음대로 살고 있지 못해서",
      "전하기 두려워서 (시선, 관계)",
      "전해야 할 이유를 모르겠어서",
    ],
    allowOther: true,
    next: (answers) => {
      const selected = answers.q3_2?.choices || [];
      if (selected.includes("복음대로 살고 있지 못해서")) return "q3_3";
      if (selected.includes("전하기 두려워서 (시선, 관계)")) return "q3_4";
      return "q4_1_no";
    },
  },
  {
    id: "q3_3",
    section: "복음 전하기",
    title: "복음대로 살고 있지 못하는 영역은 무엇인가요?",
    type: "multi",
    required: true,
    options: [
      "용서하기 어려운 사람이 있다.",
      "재물을 더 사랑한다.",
      "시간의 우선순위를 드리지 못한다.",
      "말씀에 순종하지 못하고 있다.",
      "삶에 염려함이 있다.",
      "끊어내지 못한 죄가 있다.",
      "그리스도인으로 구별된 삶을 살지 못하고 있다.",
    ],
    allowOther: true,
    next: (answers) => {
      const selected = answers.q3_2?.choices || [];
      return selected.includes("전하기 두려워서 (시선, 관계)") ? "q3_4" : "q4_1_no";
    },
  },
  {
    id: "q3_4",
    section: "복음 전하기",
    title: "전하기 두려운 이유는 무엇인가요?",
    help: "복수 선택이 가능합니다.",
    type: "multi",
    required: true,
    options: ["관계적 부담", "전도 방법 및 훈련 부족", "시선"],
    nestedOptions: {
      "관계적 부담": [
        "관계가 불편해질까 걱정되어서",
        "상대방이 거절하거나 부담스러워할 것 같아서",
        "신앙 이야기를 꺼내는 것 자체가 어색해서",
      ],
      "전도 방법 및 훈련 부족": [
        "복음을 전해 본 경험이 부족해서",
        "어떻게 복음을 전해야 하는지 잘 몰라서",
        "전도에 대한 훈련이나 도움이 부족해서",
      ],
      "시선": [
        "종교를 강요하는 사람으로 보일까 봐서",
        "기독교에 대한 좋지 않은 인식 때문에",
        "이단으로 보일까 봐",
      ],
    },
    allowOther: true,
    next: "q4_1_no",
  },
  {
    id: "q4_1_yes",
    section: "복음을 전한 경험",
    title: "복음을 누구에게 전했나요?",
    help: "복수 선택이 가능합니다.",
    type: "multi",
    required: true,
    options: [
      "가족",
      "친구",
      "학교",
      "직장",
      "다음세대",
      "이웃",
      "미디어",
    ],
    nestedOptions: {
      "이웃": ["주목자", "이주민", "북한", "주변 이웃"],
    },
    allowOther: true,
    next: "q4_2",
  },
  {
    id: "q4_2",
    section: "복음을 전한 경험",
    title: "복음을 어떻게 전했나요?",
    type: "multi",
    required: true,
    options: [
      "말로 복음을 설명하거나 나눈다.",
      "나의 신앙 경험(간증)을 나눈다.",
      "사랑과 섬김을 통해 복음을 보여준다.",
      "교회나 공동체에 초대한다.",
    ],
    allowOther: true,
    next: "q4_4",
  },
  {
    id: "q4_4",
    section: "복음을 전한 경험",
    title: "복음을 전한 경험을 나눠주세요.",
    help: "작성하기 어렵다면 한 문장이어도 좋습니다.",
    type: "textarea",
    required: true,
    next: "q5_1",
  },
  {
    id: "q4_1_no",
    section: "복음을 전하고 싶은 대상",
    title: "복음을 전하고 싶은 대상이 있나요?",
    type: "multi",
    required: true,
    options: ["가족", "친구", "학교", "직장", "다음세대", "이웃", "미디어"],
    allowOther: true,
    next: "q5_1",
  },
  {
    id: "q5_1",
    section: "비전과 사명",
    title: "가장 마음이 부어지는 영역을 골라주세요.",
    type: "single",
    required: true,
    options: ["Next (다음세대)", "Nomad (이주민)", "North (북한)", "Nation (열방)", "Neighbor (이웃)"],
    next: "q5_2",
  },
  {
    id: "q5_2",
    section: "비전과 사명",
    title: "하나님께서 나에게 맡겨주신 비전이나 사명을 알고 있나요?",
    type: "single",
    required: true,
    options: [
      { label: "안다", next: "q5_3" },
      { label: "모른다", next: "q5_4" },
    ],
  },
  {
    id: "q5_3",
    section: "비전과 사명",
    title: "비전이나 사명이 무엇인가요?",
    type: "textarea",
    required: true,
    next: "submit",
  },
  {
    id: "q5_4",
    section: "비전과 사명",
    title: "모르는 이유는 무엇인가요?",
    type: "multi",
    required: true,
    options: [
      "생각해보지 않았음",
      "아직 찾지 못함(찾는 중)",
      "하나님의 뜻을 분별하기가 어려움",
      "하나님의 길을 따를 자신이 없음",
      "나는 재능과 은사가 없는 것 같음",
      "당장 살아내야 할 현실이 버겁다",
    ],
    next: "submit",
  },
];

const questionMap = new Map(questions.map((question) => [question.id, question]));

const state = {
  currentId: "q1_1",
  history: [],
  answers: {},
  submitting: false,
  transitioning: false,
};

const els = {
  coverView: document.querySelector("#cover-view"),
  surveyView: document.querySelector("#survey-view"),
  resultView: document.querySelector("#result-view"),
  questionTitle: document.querySelector("#question-title"),
  questionHelp: document.querySelector("#question-help"),
  answerForm: document.querySelector("#answer-form"),
  formError: document.querySelector("#form-error"),
  backBtn: document.querySelector("#back-btn"),
  nextBtn: document.querySelector("#next-btn"),
  progressFill: document.querySelector("#progress-fill"),
  progressText: document.querySelector("#progress-text"),
  resultTitle: document.querySelector("#result-title"),
  resultCopy: document.querySelector("#result-copy"),
  resultActions: document.querySelector("#result-actions"),
  startBtn: document.querySelector("#start-btn"),
  restartBtn: document.querySelector("#restart-btn"),
};

function startSurvey() {
  els.coverView.classList.add("hidden");
  els.surveyView.classList.remove("hidden");
  renderQuestion();
}

function renderQuestion() {
  const question = questionMap.get(state.currentId);
  const answer = state.answers[question.id];
  els.questionTitle.textContent = question.title;
  els.questionHelp.textContent = getQuestionHelp(question);
  els.formError.textContent = "";
  els.answerForm.innerHTML = "";
  els.nextBtn.textContent = question.next === "submit" ? "제출" : "다음";

  renderInput(question, answer);
  updateControls();
  updateProgress();
}

function getQuestionHelp(question) {
  const helpItems = [];
  let customHelp = question.help || "";

  if (question.type?.startsWith("multi")) {
    helpItems.push(MULTI_SELECT_HELP);
    customHelp = customHelp.replace(MULTI_SELECT_HELP, "").trim().replace(/^[.,\s]+/, "");
  }

  if (customHelp) {
    helpItems.push(customHelp);
  }

  return helpItems.join(" ");
}

function updateControls() {
  els.backBtn.disabled = state.history.length === 0 || state.submitting || state.transitioning;
  els.nextBtn.disabled = state.submitting || state.transitioning;
}

function renderInput(question, answer) {
  if (question.type === "textarea") {
    els.answerForm.appendChild(createTextarea(question.id, answer?.text || ""));
    return;
  }

  if (["single", "singleText", "multi", "multiText"].includes(question.type)) {
    const inputType = question.type.startsWith("single") ? "radio" : "checkbox";
    question.options.forEach((option, index) => {
      const label = typeof option === "string" ? option : option.label;
      els.answerForm.appendChild(createOption(question, inputType, label, index, answer));
    });

    if (question.allowOther) {
      els.answerForm.appendChild(createOtherInput(question.id, inputType, answer));
    }

    if (question.type.endsWith("Text")) {
      els.answerForm.appendChild(createFollowupInput(question, answer));
    }
  }
}

function createFollowupInput(question, answer) {
  const wrapper = document.createElement("div");
  wrapper.className = "followup-field";

  const label = document.createElement("label");
  label.className = "followup-title";
  label.htmlFor = `${question.id}_note`;
  label.textContent = question.textLabel || "한 줄 나눔 (선택)";

  const text = document.createElement("input");
  text.id = `${question.id}_note`;
  text.className = "text-input";
  text.name = `${question.id}_note`;
  text.placeholder = "자유롭게 적어주세요";
  text.value = answer?.note || "";

  wrapper.append(label, text);
  return wrapper;
}

function createOption(question, inputType, labelText, index, answer) {
  const nestedItems = question.nestedOptions?.[labelText];
  const wrapper = nestedItems ? document.createElement("div") : null;
  if (wrapper) {
    wrapper.className = "nested-option-group";
  }

  const label = document.createElement("label");
  label.className = nestedItems ? "option has-nested-options" : "option";

  const input = document.createElement("input");
  input.type = inputType;
  input.name = question.id;
  input.value = labelText;
  input.checked = answer?.choices?.includes(labelText) || answer?.choice === labelText;
  input.addEventListener("change", () => {
    if (nestedItems) {
      updateNestedVisibility(wrapper, input.checked);
    }
    if (!input.checked || !shouldAutoAdvance(question)) return;
    window.setTimeout(() => {
      handleNext();
    }, 120);
  });

  const span = document.createElement("span");
  span.textContent = labelText;

  label.append(input, span);
  if (!nestedItems) return label;

  const nested = createNestedOptions(question.id, labelText, nestedItems, answer, input.checked);
  wrapper.append(label, nested);
  return wrapper;
}

function createNestedOptions(questionId, parentLabel, nestedItems, answer, isOpen) {
  const nested = document.createElement("div");
  nested.className = "nested-options";
  nested.dataset.open = String(isOpen);

  nestedItems.forEach((item) => {
    const label = document.createElement("label");
    label.className = "nested-option";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = `${questionId}_${parentLabel}_details`;
    input.value = item;
    input.checked = answer?.details?.[parentLabel]?.includes(item) || false;

    const span = document.createElement("span");
    span.textContent = item;

    label.append(input, span);
    nested.appendChild(label);
  });

  return nested;
}

function updateNestedVisibility(wrapper, isOpen) {
  const nested = wrapper?.querySelector(".nested-options");
  if (nested) {
    nested.dataset.open = String(isOpen);
  }
}

function shouldAutoAdvance(question) {
  return question.type === "single" && question.options?.length === 2 && !question.allowOther;
}

function createOtherInput(questionId, inputType, answer) {
  const wrapper = document.createElement("label");
  wrapper.className = "option";

  const input = document.createElement("input");
  input.type = inputType;
  input.name = questionId;
  input.value = "__other__";
  input.checked = Boolean(answer?.other);

  const text = document.createElement("input");
  text.className = "text-input";
  text.name = `${questionId}_other`;
  text.placeholder = "기타 내용을 입력해주세요";
  text.value = answer?.other || "";
  text.addEventListener("focus", () => {
    input.checked = true;
  });

  const field = document.createElement("span");
  field.className = "other-field";

  const caption = document.createElement("span");
  caption.textContent = "기타";

  field.append(caption, text);
  wrapper.append(input, field);
  return wrapper;
}

function createTextarea(questionId, value) {
  const textarea = document.createElement("textarea");
  textarea.className = "textarea-input";
  textarea.name = questionId;
  textarea.placeholder = "자유롭게 적어주세요";
  textarea.value = value;
  return textarea;
}

function collectAnswer(question) {
  const formData = new FormData(els.answerForm);

  if (question.type === "textarea") {
    return { text: (formData.get(question.id) || "").trim() };
  }

  if (question.type.startsWith("single")) {
    const selected = formData.get(question.id);
    const other = (formData.get(`${question.id}_other`) || "").trim();
    const note = (formData.get(`${question.id}_note`) || "").trim();
    const choice = selected === "__other__" ? "기타" : selected;
    return { choice, other, note };
  }

  const rawChoices = formData.getAll(question.id);
  const other = (formData.get(`${question.id}_other`) || "").trim();
  const note = (formData.get(`${question.id}_note`) || "").trim();
  const choices = rawChoices.map((choice) => (choice === "__other__" ? "기타" : choice));
  const details = collectNestedDetails(question, formData, choices);
  return { choices, details, other, note };
}

function collectNestedDetails(question, formData, choices) {
  if (!question.nestedOptions) return {};

  return Object.keys(question.nestedOptions).reduce((details, parentLabel) => {
    if (!choices.includes(parentLabel)) return details;

    const selected = formData.getAll(`${question.id}_${parentLabel}_details`);
    if (selected.length > 0) {
      details[parentLabel] = selected;
    }
    return details;
  }, {});
}

function validateAnswer(question, answer) {
  if (!question.required) return "";

  if (question.type === "textarea" && !answer.text) {
    return "답변을 입력해주세요.";
  }

  if (question.type.startsWith("single") && !answer.choice) {
    return "하나를 선택해주세요.";
  }

  if (question.type.startsWith("multi") && answer.choices.length === 0) {
    return "하나 이상 선택해주세요.";
  }

  if (question.type.startsWith("multi")) {
    const nestedError = validateNestedDetails(question, answer);
    if (nestedError) return nestedError;
  }

  if (question.type !== "textarea" && hasOtherSelected(answer) && !answer.other) {
    return "기타를 선택했다면 내용을 입력해주세요.";
  }

  if (question.noteRequired && !answer.note) {
    return "한 줄 나눔을 입력해주세요.";
  }

  return "";
}

function validateNestedDetails(question, answer) {
  if (!question.nestedOptions) return "";

  const missingParent = Object.keys(question.nestedOptions).find((parentLabel) => {
    return answer.choices.includes(parentLabel) && !answer.details?.[parentLabel]?.length;
  });

  return missingParent ? `${missingParent}의 세부 항목을 하나 이상 선택해주세요.` : "";
}

function hasOtherSelected(answer) {
  return answer.choice === "기타" || answer.choices?.includes("기타");
}

function getNextId(question, answer) {
  if (typeof question.next === "function") {
    return question.next(state.answers);
  }

  if (question.type.startsWith("single")) {
    const option = question.options?.find((item) => {
      const label = typeof item === "string" ? item : item.label;
      return label === answer.choice;
    });
    if (option && typeof option === "object" && option.next) return option.next;
  }

  return question.next;
}

function updateProgress() {
  const answeredCount = Object.keys(state.answers).length;
  const totalCount = questions.length;
  const percent = Math.min(100, Math.max(4, ((answeredCount + 1) / totalCount) * 100));
  els.progressFill.style.width = `${percent}%`;
  els.progressText.textContent = `${Math.round(percent)}%`;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function transitionToQuestion(nextId, options = {}) {
  if (state.transitioning) return;

  state.transitioning = true;
  els.nextBtn.disabled = true;
  els.backBtn.disabled = true;
  els.surveyView.classList.remove("is-entering");
  els.surveyView.classList.add("is-leaving");

  await wait(180);

  if (options.pushHistory) {
    state.history.push(state.currentId);
  }

  state.currentId = nextId;
  renderQuestion();

  window.scrollTo({ top: 0, behavior: "smooth" });
  els.surveyView.classList.remove("is-leaving");
  els.surveyView.classList.add("is-entering");

  await wait(280);
  els.surveyView.classList.remove("is-entering");
  state.transitioning = false;
  updateControls();
}

async function handleNext() {
  if (state.transitioning || state.submitting) return;

  const question = questionMap.get(state.currentId);
  const answer = collectAnswer(question);
  const error = validateAnswer(question, answer);

  if (error) {
    els.formError.textContent = error;
    return;
  }

  state.answers[question.id] = answer;
  const nextId = getNextId(question, answer);

  if (nextId === "submit") {
    await submitSurvey();
    return;
  }

  pruneForwardAnswers(nextId);
  await transitionToQuestion(nextId, { pushHistory: true });
}

function pruneForwardAnswers(nextId) {
  const activeIds = new Set([...state.history, state.currentId, nextId]);
  Object.keys(state.answers).forEach((id) => {
    if (!activeIds.has(id) && !state.history.includes(id)) {
      delete state.answers[id];
    }
  });
}

async function handleBack() {
  if (state.history.length === 0 || state.transitioning || state.submitting) return;
  const previousId = state.history.pop();
  await transitionToQuestion(previousId);
}

async function submitSurvey() {
  state.submitting = true;
  els.nextBtn.disabled = true;
  els.nextBtn.textContent = "제출 중...";
  els.formError.textContent = "";

  const payload = {
    submittedAt: new Date().toISOString(),
    resultType: getResultType(),
    answers: formatAnswersForSheet(),
  };

  try {
    if (GOOGLE_SCRIPT_URL) {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      console.info("Google Apps Script URL이 비어 있어 로컬 저장만 건너뜁니다.", payload);
    }
    showResult(payload.resultType);
  } catch (error) {
    els.formError.textContent = "저장 중 문제가 생겼습니다. 잠시 후 다시 시도해주세요.";
    console.error(error);
  } finally {
    state.submitting = false;
    els.nextBtn.disabled = false;
    els.nextBtn.textContent = "제출";
  }
}

function formatAnswersForSheet() {
  return questions.reduce((rows, question) => {
    rows[question.id] = {
      question: question.title,
      answer: state.answers[question.id] ? stringifyAnswer(state.answers[question.id]) : "",
    };
    return rows;
  }, {});
}

function stringifyAnswer(answer) {
  const parts = [];
  if (answer.choice) parts.push(answer.choice);
  if (answer.choices?.length) parts.push(answer.choices.join(", "));
  if (answer.details) {
    Object.entries(answer.details).forEach(([label, values]) => {
      if (values.length) parts.push(`${label}: ${values.join(", ")}`);
    });
  }
  if (answer.text) parts.push(answer.text);
  if (answer.other) parts.push(`기타: ${answer.other}`);
  if (answer.note) parts.push(`나눔: ${answer.note}`);
  return parts.join(" / ");
}

function getResultType() {
  const answers = state.answers;
  if (answers.q3_1?.choice === "네") return "witness";
  if (answers.q5_2?.choice === "안다") return "vision";
  if (answers.q1_3?.choice === "아직 모르겠습니다.") return "gospel";
  if (answers.q3_2) return "courage";
  return "reflection";
}

function showResult(resultType) {
  const result = resultContent[resultType] || resultContent.reflection;
  els.surveyView.classList.add("hidden");
  els.resultView.classList.remove("hidden");
  els.resultView.classList.add("is-entering");
  els.resultTitle.textContent = result.title;
  els.resultCopy.textContent = result.copy;
  els.resultActions.innerHTML = "";
  result.actions.forEach((action) => {
    const li = document.createElement("li");
    li.textContent = action;
    els.resultActions.appendChild(li);
  });
  window.setTimeout(() => {
    els.resultView.classList.remove("is-entering");
  }, 340);
}

const resultContent = {
  gospel: {
    title: "복음의 연결고리를 다시 발견하는 여정 📖",
    copy: "지금의 답변은 복음을 더 또렷하게 듣고, 내 삶과 어떻게 이어지는지 차분히 확인할 필요를 보여줍니다.",
    actions: ["복음의 핵심을 한 문장으로 정리해보기", "신뢰할 수 있는 공동체 안에서 질문을 나누기", "내 삶의 현실 문제와 복음이 만나는 지점을 적어보기"],
  },
  courage: {
    title: "복음을 전하기 위한 용기와 훈련이 필요한 자리 💪",
    copy: "복음을 전하고 싶은 마음이 있어도 관계, 시선, 삶의 무게 때문에 멈출 수 있습니다. 이 답변은 혼자 버티기보다 함께 준비할 때 열리는 길을 가리킵니다.",
    actions: ["전도 대상 한 사람을 정하고 기도하기", "복음을 내 언어로 1분 안에 말해보기", "공동체 안에서 전도 경험과 두려움을 솔직히 나누기"],
  },
  witness: {
    title: "이미 복음을 흘려보내고 있는 증인의 자리 ⭐️",
    copy: "복음을 전한 경험은 하나님께서 삶의 현장에서 일하고 계신 흔적입니다. 다음 걸음은 그 경험을 더 선명한 간증과 지속적인 순종으로 이어가는 것입니다.",
    actions: ["복음을 전했던 계기와 변화를 기록하기", "다음 전도 대상과 구체적인 만남 계획 세우기", "분별의 과정을 공동체와 나누기"],
  },
  vision: {
    title: "비전과 사명을 구체화할 때 🧭",
    copy: "비전이 있다면 이제 그것을 삶의 리듬과 선택으로 연결할 차례입니다. 작게라도 반복 가능한 순종이 사명을 단단하게 만듭니다.",
    actions: ["비전을 위해 이번 달 실천할 한 가지 정하기", "마음이 부어지는 영역의 실제 필요 조사하기", "함께 걸어갈 동역자에게 나누기"],
  },
  reflection: {
    title: "하나님 앞에서 나를 정직하게 바라본 시간 🙏",
    copy: "답변 속에는 관심, 질문, 소망이 함께 담겨 있습니다. 오늘 적은 내용을 바탕으로 하나님과의 관계를 한 걸음 더 실제적으로 돌아볼 수 있습니다.",
    actions: ["가장 오래 머문 질문 하나를 다시 묵상하기", "회복되어야 할 한 가지를 놓고 기도하기", "답변을 공동체 리더나 믿음의 친구와 나누기"],
  },
};

function restart() {
  state.currentId = "q1_1";
  state.history = [];
  state.answers = {};
  state.submitting = false;
  state.transitioning = false;
  els.resultView.classList.add("hidden");
  els.resultView.classList.remove("is-entering");
  els.coverView.classList.remove("hidden");
  els.surveyView.classList.remove("hidden");
  els.surveyView.classList.add("hidden");
}

els.startBtn.addEventListener("click", startSurvey);
els.nextBtn.addEventListener("click", handleNext);
els.backBtn.addEventListener("click", handleBack);
els.restartBtn.addEventListener("click", restart);
