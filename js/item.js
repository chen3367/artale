let itemDataGlobal = {};
let dropGlobal = {};
let mobGlobal = [];

async function loadItemData() {
  const [mobRes, dropRes, itemRes] = await Promise.all([
    fetch('data/mob.json').then(r => r.json()),
    fetch('data/drop_data.json').then(r => r.json()),
    fetch('data/item.json').then(r => r.json())
  ]);
  dropGlobal = dropRes;
  itemDataGlobal = itemRes;
  mobGlobal = Object.entries(mobRes).map(([name, arr]) => ({
    name,
    id: arr[8].split('.')[0],
    img: `https://maplestory.io/api/TWMS/217/mob/${arr[8].split('.')[0]}/render/stand`,
    level: arr[0]
  }));
}

function searchItems(query) {
  return Object.entries(itemDataGlobal)
    .filter(([, nm]) => nm.includes(query))
    .map(([id, nm]) => ({ id: Number(id), name: nm }));
}

function renderItem(item) {
  const owners = Object.entries(dropGlobal)
    .filter(([, drops]) => drops.includes(item.name))
    .map(([mobName]) => mobGlobal.find(m => m.name === mobName))
    .filter(Boolean);

  const linkType = item.id < 2000000 ? 'equip' : 'item';
  const imgUrl = `image/${encodeURIComponent(item.name)}.png`;

  let html = `
    <a href="https://maplesaga.com/library/cn/permalink/${linkType}/${item.id}" target="_blank">
      <img src="${imgUrl}" onerror="this.onerror=null;this.src='https://maplestory.io/api/TWMS/217/item/${item.id}/icon'">
    </a>
    <h2>${item.name}</h2>
    <h3>掉落此物品的怪物：</h3>`;

  if (owners.length === 0) {
    html += '<p>無怪物掉落此物品。</p>';
  } else {
    owners.sort((a, b) => a.level - b.level);
    html += '<div class="mob-list">';
    owners.forEach(mob => {
      html += `
        <div class="mob-card">
          <img src="${mob.img}" alt="${mob.name}">
          <div>${mob.name} (Lv${mob.level})</div>
        </div>`;
    });
    html += '</div>';
  }

  document.getElementById('item-info').innerHTML = html;
}
