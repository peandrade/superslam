import { Knight, LittleEnemy, Stage } from './index.js';

const player = new Knight('Pedro');
const enemy = new LittleEnemy();
const battleLog = createBattleLog(document.querySelector('.log'));

const stage = new Stage(
  player,
  enemy,
  document.querySelector('#player'),
  document.querySelector('#enemy'),
  battleLog
);

function setupControls(stage, player) {
  const playerAttackButton = document.querySelector('#player .attackButton');

  playerAttackButton.addEventListener('click', () => {
    if (playerAttackButton.disabled) return;

    playerAttackButton.disabled = true;
    stage.calculateDamage(player, stage.currentEnemy);

    setTimeout(() => {
      if (stage.currentEnemy.isAlive()) {
        stage.calculateDamage(stage.currentEnemy, player);
      }
      playerAttackButton.disabled = false;
    }, 1000);
  });
}

function createBattleLog(listElement) {
  const list = [];

  function addMessage(msg) {
    list.push(msg);
    render();
  }

  function render() {
    listElement.innerHTML = list.map((msg) => `<li>${msg}</li>`).join('');
    listElement.scrollTop = listElement.scrollHeight;
  }

  return { addMessage };
}

const shopItems = [
  { name: 'Tônico de Vida', effect: 'maxLife', value: 10, cost: 15 },
  { name: 'Tônico de Ataque', effect: 'attack', value: 2, cost: 20 },
  { name: 'Tônico de Defesa', effect: 'defense', value: 2, cost: 20 },
  { name: 'Poção de Vida', effect: 'heal', value: 'full', cost: 10 },
  { name: 'Poção de XP', effect: 'xp', value: 50, cost: 25 },
];

if (!player.inventory) player.inventory = [];

function openShop() {
  const container = document.getElementById('shopItems');
  container.innerHTML = '';

  shopItems.forEach((item, index) => {
    const li = document.createElement('li');
    const wrapper = document.createElement('div');
    wrapper.className = 'flex justify-between items-center';

    const label = document.createElement('span');
    label.innerHTML = `<strong>${item.name}</strong> - ${item.cost} moedas`;

    const button = document.createElement('button');
    button.textContent = 'Comprar';
    button.className = 'bg-blue-600 text-white text-xs px-2 py-1 rounded';
    button.addEventListener('click', () => {
      buyItem(index);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(button);
    li.appendChild(wrapper);
    container.appendChild(li);
  });

  document.getElementById('shopModal').classList.remove('hidden');
  document.getElementById('shopModal').classList.add('flex');
}

function buyItem(index) {
  const item = shopItems[index];
  if (player.coins >= item.cost) {
    player.coins -= item.cost;
    player.inventory.push(item);
    stage.battleLog.addMessage(`${player.name} comprou ${item.name}.`);
    stage.update();
  } else {
    stage.battleLog.addMessage(
      `Você não tem moedas suficientes para ${item.name}.`
    );
  }
}

function openBag() {
  const container = document.getElementById('bagItems');
  container.innerHTML = '';

  if (player.inventory.length === 0) {
    container.innerHTML = '<li>Sua mochila está vazia.</li>';
  } else {
    player.inventory.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="flex justify-between items-center">
          <span>${item.name}</span>
        </div>
      `;

      const button = document.createElement('button');
      button.textContent = 'Usar';
      button.className = 'bg-green-600 text-white text-xs px-2 py-1 rounded';
      button.addEventListener('click', () => {
        useItem(index);
      });

      li.querySelector('div').appendChild(button);
      container.appendChild(li);
    });
  }

  // 🔥 Aqui é onde você ativa o modal:
  document.getElementById('bagModal').classList.remove('hidden');
  document.getElementById('bagModal').classList.add('flex');
}

function useItem(index) {
  const item = player.inventory[index];
  switch (item.effect) {
    case 'maxLife':
      player.maxLife += item.value;
      break;
    case 'attack':
      player.attack += item.value;
      break;
    case 'defense':
      player.defense += item.value;
      break;
    case 'heal':
      player.life = player.maxLife;
      break;
    case 'xp':
      player.gainXP(item.value);
      break;
  }
  stage.battleLog.addMessage(`${player.name} usou ${item.name}.`);
  player.inventory.splice(index, 1);
  stage.update();
  openBag();
}

document.getElementById('shopBtn').addEventListener('click', openShop);
document.getElementById('closeShop').addEventListener('click', () => {
  document.getElementById('shopModal').classList.add('hidden');
  document.getElementById('shopModal').classList.remove('flex');
});

document.getElementById('bagBtn').addEventListener('click', openBag);
document.getElementById('closeBag').addEventListener('click', () => {
  document.getElementById('bagModal').classList.add('hidden');
  document.getElementById('bagModal').classList.remove('flex');
});

setupControls(stage, player);
stage.start();
stage.bindStatusButton();
