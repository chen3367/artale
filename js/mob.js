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
    img: `https://maplestory.io/api/TWMS/217/mob/${arr[8].split('.')[0]}/render/stand`
  }));
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
    <img src="${m.img}" alt="${m.name}">
    <h2>${m.name}</h2>
    <ul>
      <li>等級: ${m.level}</li>
      <li>HP: ${m.hp}</li>
      <li>MP: ${m.mp}</li>
      <li>EXP: ${m.exp}</li>
      <li>迴避: ${m.avoid}</li>
      <li>PDEF: ${m.pdef}</li>
      <li>MDEF: ${m.mdef}</li>
      <li>ACC: ${m.acc}</li>
    </ul>
  `;
  for (const cat of ['裝備', '消耗', '其他']) {
    if (categories[cat].length > 0) {
      html += `<h4>${cat}</h4><div class="drops">`;
      categories[cat].forEach(it => {
        const enc = encodeURIComponent(it.name);
        const link = it.id < 2000000 ? 'equip' : 'item';
        html += `
          <a href="https://maplesaga.com/library/cn/permalink/${link}/${it.id}" target="_blank">
            <img src="image/${enc}.png" onerror="this.onerror=null;this.src='https://maplestory.io/api/TWMS/217/item/${it.id}/icon'">
            <br>${it.name}
          </a>`;
      });
      html += '</div>';
    }
  }
  document.getElementById('mob-info').innerHTML = html;
}
