let monsterData = [];
let mobDrop = {};
let mobItems = {};

async function loadMobData() {
  const [mobRes, dropRes, itemRes] = await Promise.all([
    fetch('data/mob.json').then(r => r.json()),
    fetch('data/drop_data.json').then(r => r.json()),
    fetch('data/item.json').then(r => r.json())
  ]);
  mobDrop = dropRes;
  mobItems = itemRes;
  monsterData = Object.entries(mobRes).map(([name, arr]) => ({
    name,
    id: arr[8].split('.')[0],
    level: arr[0], hp: arr[1], mp: arr[2],
    exp: arr[3], avoid: arr[4],
    pdef: arr[5], mdef: arr[6], acc: arr[7],
    img: `https://maplestory.io/api/TWMS/217/mob/${arr[8].split('.')[0]}/render/stand`,
  }));
  
  // 初始提示文字
  document.getElementById('mob-info').innerHTML = '<div class="info-placeholder">請輸入怪物名稱進行搜尋</div>';
}

function searchMobs(query) {
  return monsterData.filter(m => m.name.includes(query));
}

function renderMob(m) {
  const drops = mobDrop[m.name] || [];
  const categories = { 裝備: [], 消耗: [], 其他: [] };
  for (const [id, itemName] of Object.entries(mobItems)) {
    if (drops.includes(itemName)) {
      const iid = Number(id);
      const cat = iid < 2000000 ? '裝備' : iid < 3000000 ? '消耗' : '其他';
      categories[cat].push({ id: iid, name: itemName });
    }
  }

  let html = `
    <a href="https://maplesaga.com/library/cn/permalink/mob/${m.id}" target="_blank">
      <img class="mob-search-img" src="${m.img}" alt="${m.name}">
    </a>
    <h2>${m.name}</h2>
    <table class="mob-info-table">
      <tr><th>等級</th><td>${m.level}</td><th>HP</th><td>${m.hp}</td></tr>
      <tr><th>MP</th><td>${m.mp}</td><th>經驗</th><td>${m.exp}</td></tr>
      <tr><th>迴避</th><td>${m.avoid}</td><th>命中需求</th><td>${m.acc}</td></tr>
      <tr><th>物防</th><td>${m.pdef}</td><th>魔防</th><td>${m.mdef}</td></tr>
    </table>
  `;

  for (const cat of ['裝備', '消耗', '其他']) {
    if (categories[cat].length > 0) {
      html += `
        <div class="drop-section">
          <h4>${cat}</h4>
          <div class="drops">`;

      categories[cat].forEach((it) => {
        const enc = encodeURIComponent(it.name);
        const link = it.id < 2000000 ? 'equip' : 'item';
        html += `
          <a href="https://maplesaga.com/library/cn/permalink/${link}/${it.id}" target="_blank" title="${it.name}">
            <img src="image/${enc}.png" onerror="this.onerror=null;this.src='https://maplestory.io/api/TWMS/217/item/${it.id}/icon'">
            <br>${it.name}
          </a>`;
      });
      html += `</div></div>`;
    }
  }

  document.getElementById('mob-info').innerHTML = html;
}

// 下面示範簡單的輸入與建議顯示邏輯
function setupMobSearch() {
  const mobInput = document.getElementById('mob-input');
  const mobSug = document.getElementById('mob-suggestions');

  mobInput.addEventListener('input', () => {
    const q = mobInput.value.trim();
    mobSug.innerHTML = '';
    mobSug.style.display = 'none';

    if (!q) {
      document.getElementById('mob-info').innerHTML = '<div class="info-placeholder">請輸入怪物名稱進行搜尋</div>';
      return;
    }

    const results = searchMobs(q);
    if (results.length === 0) {
      mobSug.innerHTML = '<div class="suggestion-item">找不到符合的怪物</div>';
      mobSug.style.display = 'block';
      document.getElementById('mob-info').innerHTML = '';
      return;
    }

    // 建立建議列表
    for (const m of results.slice(0, 20)) {  // 顯示最多20筆
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = m.name;
      div.onclick = () => {
        mobInput.value = m.name;
        mobSug.innerHTML = '';
        mobSug.style.display = 'none';
        renderMob(m);
      };
      mobSug.appendChild(div);
    }
    mobSug.style.display = 'block';
  });
}
