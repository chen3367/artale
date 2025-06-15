const LABELS = [
  { id: "empty", text: "全空" },
  { id: "left", text: "隊長站左" },
  { id: "center", text: "隊長站中" },
  { id: "right", text: "隊長站右" }
];

const MAPPING = {
  "0011": "211",
  "0101": "121",
  "0110": "112",
  "1011": "022",
  "1012": "031",
  "1021": "013",
  "1101": "202",
  "1102": "301",
  "1110": "220",
  "1120": "310",
  "1201": "103",
  "1210": "130",
  "2112": "004",
  "2121": "040",
  "2211": "400",
};

function callback(el) {
  if (window.calculateTimeout) {
    clearTimeout(window.calculateTimeout);
  }

  let labelGroups = document.querySelectorAll(`[name="${el.getAttribute('name')}"]`);
  labelGroups.forEach(e => {
    e.className = baseClass;
  });
  el.className = activeClass;

  window.calculateTimeout = setTimeout(() => calculate(), 300);
}

function calculate() {
  const group = LABELS.map(l => document.querySelector(`input[name="${l.id}"]:checked`)?.value);
  if (group.includes(undefined)) return;

  const result = MAPPING[group.join("")];
  document.getElementById("output").innerText =
    result ?? "此組合不存在，請重新確認。";
}

// 樣式統一化
const baseClass = "md:text-4xl text-xl bg-transparent hover:bg-blue-500 text-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded";
const activeClass = "md:text-4xl text-xl bg-blue-500 font-semibold text-white py-2 px-4 border border-blue-500 rounded";

// 動態建立選項 UI
function createOptions() {
  const container = document.getElementById("groups");
  LABELS.forEach(({ id, text }) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "flex flex-row mb-8";
    fieldset.innerHTML = `
      <p class="md:text-4xl text-lg text-center mr-2 md:w-1/2 w-20">${text}</p>
      <div class="flex flex-1">
        ${[0, 1, 2].map(i => `
          <div class="${i === 1 ? 'md:mx-8 mx-4' : ''}">
            <input hidden type="radio" id="${id}${i}" name="${id}" value="${i}" />
            <label name="${id}label" for="${id}${i}" onclick="callback(this)" class="${baseClass}">${i}</label>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(fieldset);
  });
}

// 初始化
createOptions();
