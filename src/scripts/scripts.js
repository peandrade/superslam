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

function setupControls(stage, player, enemy) {
  const playerAttackButton = document.querySelector('#player .attackButton');

  playerAttackButton.addEventListener('click', () => {
    if (playerAttackButton.disabled) return;

    playerAttackButton.disabled = true;
    stage.calculateDamage(player, enemy);

    setTimeout(() => {
      stage.calculateDamage(enemy, player);
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

setupControls(stage, player, enemy);
stage.start();
stage.bindStatusButton();
