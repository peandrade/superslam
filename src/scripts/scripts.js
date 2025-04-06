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
  document
    .querySelector('#player .attackButton')
    .addEventListener('click', () => stage.doAttack(player, enemy));
  document
    .querySelector('#enemy .attackButton')
    .addEventListener('click', () => stage.doAttack(enemy, player));
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
