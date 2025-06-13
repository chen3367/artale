window.addEventListener('DOMContentLoaded', () => {
  Promise.all([loadMobData(), loadItemData()]).then(() => {
    setup();
  });
});

function setup() {
  const mobInput = document.getElementById('mob-input');
  const mobSug = document.getElementById('mob-suggestions');
  const mobInfo = document.getElementById('mob-info');

  const itemInput = document.getElementById('item-input');
  const itemSug = document.getElementById('item-suggestions');
  const itemInfo = document.getElementById('item-info');

  document.getElementById('tab-mob').onclick = () => switchTab('mob');
  document.getElementById('tab-item').onclick = () => switchTab('item');

  mobInput.oninput = () => {
    const q = mobInput.value.trim();
    mobSug.innerHTML = '';
    mobSug.style.display = 'none';
    if (!q) return;
    const list = searchMobs(q);
    if (list.length > 0) {
      mobSug.style.display = 'block';
      list.slice(0, 30).forEach(m => {
        const d = document.createElement('div');
        d.textContent = m.name;
        d.className = 'suggestion-item';
        d.onclick = () => {
          mobInput.value = m.name;
          mobSug.style.display = 'none';
          renderMob(m);
        };
        mobSug.appendChild(d);
      });
    }
  };
  document.addEventListener('click', e => {
    if (!mobSug.contains(e.target) && e.target !== mobInput) {
      mobSug.style.display = 'none';
    }
  });

  itemInput.oninput = () => {
    const q = itemInput.value.trim();
    itemSug.innerHTML = '';
    itemSug.style.display = 'none';
    if (!q) return;
    const list = searchItems(q);
    if (list.length > 0) {
      itemSug.style.display = 'block';
      list.slice(0, 30).forEach(it => {
        const d = document.createElement('div');
        d.textContent = it.name;
        d.className = 'suggestion-item';
        d.onclick = () => {
          itemInput.value = it.name;
          itemSug.style.display = 'none';
          renderItem(it);
        };
        itemSug.appendChild(d);
      });
    }
  };
  document.addEventListener('click', e => {
    if (!itemSug.contains(e.target) && e.target !== itemInput) {
      itemSug.style.display = 'none';
    }
  });
}

function switchTab(tab) {
  document.getElementById('section-mob').style.display = tab === 'mob' ? 'block' : 'none';
  document.getElementById('section-item').style.display = tab === 'item' ? 'block' : 'none';
  document.getElementById('tab-mob').classList.toggle('active', tab === 'mob');
  document.getElementById('tab-item').classList.toggle('active', tab === 'item');
}
