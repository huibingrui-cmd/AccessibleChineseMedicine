const entries = [
  {
    id: "yin-yang",
    type: "theory",
    title: "阴阳学说",
    level: "入门",
    summary: "理解中医辨证中寒热、表里、动静、升降等关系的基础框架。",
    keywords: ["阴阳", "寒热", "动静", "基础"],
    sections: {
      核心概念: "阴阳用于描述事物相互对立、互根、消长和转化的关系。",
      学习重点: "先抓住相对性：同一个现象在不同参照下可能呈现不同阴阳属性。",
      后续可接入: "可加入《黄帝内经》原文、老师讲义、案例辨析。"
    }
  },
  {
    id: "five-phases",
    type: "theory",
    title: "五行与脏腑关系",
    level: "入门",
    summary: "用木、火、土、金、水理解生克制化，以及肝心脾肺肾之间的关系。",
    keywords: ["五行", "脏腑", "生克", "制化"],
    sections: {
      核心概念: "五行不是简单分类表，而是观察功能关系和动态变化的模型。",
      学习重点: "重点看生克制化如何帮助分析病机，不要只背对应表。",
      后续可接入: "可扩展五行配属表、脏腑病机图、临床例题。"
    }
  },
  {
    id: "guizhi-tang",
    type: "formula",
    title: "桂枝汤",
    level: "进阶",
    summary: "经典解肌发表、调和营卫方，适合用来学习方剂结构。",
    keywords: ["桂枝汤", "伤寒论", "营卫", "解表"],
    sections: {
      组成示例: "桂枝、芍药、炙甘草、生姜、大枣。",
      功用示例: "解肌发表，调和营卫。",
      学习提示: "后续可把你的方解、剂量、加减、条文出处导入这里。"
    }
  },
  {
    id: "si-jun-zi-tang",
    type: "formula",
    title: "四君子汤",
    level: "进阶",
    summary: "补气基础方，适合做脾胃气虚类方剂的学习入口。",
    keywords: ["四君子汤", "补气", "脾胃", "方剂"],
    sections: {
      组成示例: "人参、白术、茯苓、炙甘草。",
      功用示例: "益气健脾。",
      学习提示: "可以继续关联六君子汤、香砂六君子汤等衍生方。"
    }
  },
  {
    id: "gan-cao",
    type: "herb",
    title: "甘草",
    level: "入门",
    summary: "常见调和药，学习性味、归经、配伍时非常适合作为起点。",
    keywords: ["甘草", "补气", "调和", "中药"],
    sections: {
      性味归经示例: "甘，平。归心、肺、脾、胃经。",
      功效示例: "补脾益气，清热解毒，祛痰止咳，缓急止痛，调和诸药。",
      学习提示: "后续可加入禁忌、炮制、常见配伍和原文出处。"
    }
  },
  {
    id: "huang-qi",
    type: "herb",
    title: "黄芪",
    level: "专题",
    summary: "补气升阳、固表相关药物，可用于专题化学习气虚、表虚、自汗等概念。",
    keywords: ["黄芪", "补气", "固表", "升阳"],
    sections: {
      性味归经示例: "甘，微温。归脾、肺经。",
      功效示例: "补气升阳，固表止汗，利水消肿，托毒生肌。",
      学习提示: "可与人参、白术、防风等药物做配伍对比。"
    }
  }
];

const typeNames = {
  all: "全部资料",
  theory: "中医理论",
  formula: "方剂库",
  herb: "中药库"
};

const state = {
  type: "all",
  query: "",
  level: "all",
  activeId: null
};

const itemList = document.querySelector("#itemList");
const detailPanel = document.querySelector("#detailPanel");
const resultCount = document.querySelector("#resultCount");
const panelTitle = document.querySelector("#panelTitle");
const searchInput = document.querySelector("#searchInput");
const levelSelect = document.querySelector("#levelSelect");
const entryCards = document.querySelectorAll(".entry-card");

function getFilteredEntries() {
  const query = state.query.trim().toLowerCase();
  return entries.filter((entry) => {
    const typeMatch = state.type === "all" || entry.type === state.type;
    const levelMatch = state.level === "all" || entry.level === state.level;
    const queryText = [entry.title, entry.summary, entry.level, ...entry.keywords].join(" ").toLowerCase();
    const queryMatch = !query || queryText.includes(query);
    return typeMatch && levelMatch && queryMatch;
  });
}

function renderStats() {
  document.querySelector("#theoryCount").textContent = entries.filter((item) => item.type === "theory").length;
  document.querySelector("#formulaCount").textContent = entries.filter((item) => item.type === "formula").length;
  document.querySelector("#herbCount").textContent = entries.filter((item) => item.type === "herb").length;
}

function renderList() {
  const filtered = getFilteredEntries();
  panelTitle.textContent = typeNames[state.type];
  resultCount.textContent = `${filtered.length} 条`;

  itemList.innerHTML = "";
  if (!filtered.length) {
    itemList.innerHTML = '<p class="empty">没有找到匹配内容。后续导入资料后，这里会自动扩展。</p>';
    return;
  }

  filtered.forEach((entry) => {
    const button = document.createElement("button");
    button.className = `item-card${state.activeId === entry.id ? " active" : ""}`;
    button.type = "button";
    button.innerHTML = `
      <div class="meta-row">
        <span class="tag">${typeNames[entry.type]}</span>
        <span class="tag">${entry.level}</span>
      </div>
      <h3>${entry.title}</h3>
      <p>${entry.summary}</p>
    `;
    button.addEventListener("click", () => selectEntry(entry.id));
    itemList.appendChild(button);
  });
}

function selectEntry(id) {
  state.activeId = id;
  const entry = entries.find((item) => item.id === id);
  if (!entry) return;

  const sections = Object.entries(entry.sections)
    .map(([label, value]) => `<div class="detail-section"><strong>${label}</strong><p>${value}</p></div>`)
    .join("");

  detailPanel.innerHTML = `
    <p class="eyebrow">${typeNames[entry.type]} / ${entry.level}</p>
    <h2>${entry.title}</h2>
    <p>${entry.summary}</p>
    <div class="meta-row">${entry.keywords.map((keyword) => `<span class="tag">${keyword}</span>`).join("")}</div>
    ${sections}
  `;
  renderList();
}

function setType(type) {
  state.type = type;
  entryCards.forEach((card) => card.classList.toggle("active", card.dataset.filter === type));
  renderList();
}

entryCards.forEach((card) => {
  card.addEventListener("click", () => setType(card.dataset.filter));
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderList();
});

levelSelect.addEventListener("change", (event) => {
  state.level = event.target.value;
  renderList();
});

renderStats();
renderList();
selectEntry(entries[0].id);
