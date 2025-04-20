class Character {
  xp = 0;
  level = 1;
  #life = 1;
  coins = 0;

  constructor(name, maxLife = 1, attack = 0, defense = 0) {
    this.name = name;
    this.maxLife = maxLife;
    this.attack = attack;
    this.defense = defense;
    this.#life = maxLife;
  }

  get life() {
    return this.#life;
  }

  set life(value) {
    this.#life = Math.max(0, Math.min(this.maxLife, value));
  }

  isAlive() {
    return this.life > 0;
  }

  gainXP(xpAmount) {
    this.xp += xpAmount;
    const nextLevel = this.level * 100;

    if (this.xp >= nextLevel) {
      this.xp -= nextLevel;
      this.level++;
      this.maxLife += 10;
      this.attack += 2;
      this.defense += 1;
    }
  }
}

export class Knight extends Character {
  constructor(name) {
    super(name, 100, 10, 8);
  }
}

export class Sorcerer extends Character {
  constructor(name) {
    super(name, 80, 14, 3);
  }
}

export class LittleEnemy extends Character {
  constructor() {
    super('Little Enemy', 40, 4, 4);
  }
}

export class BigEnemy extends Character {
  constructor() {
    super('Big Monster', 120, 16, 6);
  }
}

export class Stage {
  static MAX_ATTACK_FACTOR = 2;
  static MAX_DEFENSE_FACTOR = 2;
  currentHorde = 1;
  enemiesRemaining = 4;

  constructor(player, enemy, playerElement, enemyElement, battleLog) {
    this.player = player;
    this.enemy = enemy;
    this.playerElement = playerElement;
    this.enemyElement = enemyElement;
    this.battleLog = battleLog;
    this.enemies = this.generateHorde();
    this.currentEnemyIndex = 0;
    this.currentEnemy = this.enemies[this.currentEnemyIndex];
  }

  start() {
    this.update();
  }

  updateCharacterUI(character, characterElement) {
    const nameElement = characterElement.querySelector('.name');
    const barElement = characterElement.querySelector('.lifebar .bar');
    const lifeElement = characterElement.querySelector('.life');
    const levelElement = characterElement.querySelector('.level');

    const lifePercent = (character.life / character.maxLife) * 100;
    levelElement.innerHTML = `Level ${character.level}`;
    nameElement.innerHTML = `${character.name}`;
    lifeElement.innerHTML = `${character.life} / ${character.maxLife} HP`;
    barElement.style.width = `${lifePercent}%`;

    if (lifePercent > 60) {
      barElement.classList.remove('bg-yellow-400', 'bg-red-600');
      barElement.classList.add('bg-green-500');
    } else if (lifePercent > 30) {
      barElement.classList.remove('bg-green-500', 'bg-red-600');
      barElement.classList.add('bg-yellow-400');
    } else {
      barElement.classList.remove('bg-green-500', 'bg-yellow-400');
      barElement.classList.add('bg-red-600');
    }

    const coinsElement = characterElement.querySelector('.coins');
    if (coinsElement) {
      coinsElement.textContent = `Moedas: ${character.coins}`;
    }
  }

  update() {
    this.updateCharacterUI(this.player, this.playerElement);
    this.updateCharacterUI(this.currentEnemy, this.enemyElement);
    if (!this.currentEnemy.isAlive()) {
      this.updateXPBar(this.player);
    }
    this.updateHordeInfo();
  }

  updateXPBar(character) {
    if (!this.currentEnemy.isAlive()) {
      const xpReward = Math.round(
        this.currentEnemy.attack * 5 + Math.random() * 10
      );
      console.log(character);
      character.gainXP(xpReward);
      console.log(character);

      const xpPercentage = (character.xp / (character.level * 100)) * 100;
      const xpBarElement = document.querySelector('.xpbar .bar');

      setTimeout(() => {
        xpBarElement.className =
          'bar h-full rounded-md transition-all duration-700 bg-blue-500';
        xpBarElement.style.width = `${xpPercentage}%`;
      }, 600);
      this.battleLog.addMessage(`${character.name} ganhou ${xpReward} de XP!`);

      const coinsReward = Math.floor(Math.random() * 10) + 5;
      character.coins += coinsReward;
      this.battleLog.addMessage(
        `${character.name} recebeu ${coinsReward} moedas!`
      );
    }
  }

  calculateDamage(attacker, defender) {
    if (!attacker.isAlive() || !defender.isAlive()) {
      this.battleLog.addMessage(
        'Ataque inválido. Um dos personagens já foi derrotado.'
      );
      return;
    }

    const attackFactor = Math.random() * Stage.MAX_ATTACK_FACTOR;
    const defenseFactor = Math.random() * Stage.MAX_DEFENSE_FACTOR;

    const attackPower = attacker.attack * attackFactor;
    const defensePower = defender.defense * defenseFactor;

    if (attackPower > defensePower) {
      const damage = Math.round(attackPower - defensePower);
      defender.life -= damage;
      this.battleLog.addMessage(
        `${attacker.name} causou ${damage} de dano em ${defender.name}.`
      );
      if (defender.life <= 0) {
        this.battleLog.addMessage(
          `${attacker.name} derrotou ${defender.name}.`
        );
        if (defender === this.currentEnemy) {
          const enemyElement = this.enemyElement;

          enemyElement.classList.add('opacity-0', 'pointer-events-none');

          setTimeout(() => {
            this.nextEnemy();
            this.update();
            enemyElement.classList.remove('opacity-0', 'pointer-events-none');
          }, 1500);
        }
      }
    } else {
      this.battleLog.addMessage(`${defender.name} defendeu com sucesso!`);
    }
    this.update();
  }

  bindStatusButton() {
    document.getElementById('statusBtn').addEventListener('click', () => {
      const content = `
        <div><strong>${this.player.name}</strong> (Level ${this.player.level})</div>
        <div>HP: ${this.player.life} / ${this.player.maxLife}</div>
        <div>ATK: ${this.player.attack}</div>
        <div>DEF: ${this.player.defense}</div>
        <div>XP: ${this.player.xp} / ${this.player.level * 100}</div>
        <div>Moedas: ${this.player.coins}</div>
      `;

      document.getElementById('statusContent').innerHTML = content;
      document.getElementById('statusModal').classList.remove('hidden');
      document.getElementById('statusModal').classList.add('flex');
    });

    document.getElementById('closeModal').addEventListener('click', () => {
      document.getElementById('statusModal').classList.add('hidden');
      document.getElementById('statusModal').classList.remove('flex');
    });
  }

  generateHorde() {
    const horde = [];

    for (let i = 0; i < 4; i++) {
      horde.push(new Character(`Inimigo ${i + 1}`, 70, 6, 5));
    }

    return horde;
  }

  nextEnemy() {
    this.currentEnemyIndex++;
    if (this.currentEnemyIndex >= this.enemies.length) {
      this.currentHorde++;
      this.enemies = this.generateHorde();
      this.currentEnemyIndex = 0;
      this.currentEnemy = this.enemies[0];
    } else {
      this.currentEnemy = this.enemies[this.currentEnemyIndex];
    }
    this.battleLog.addMessage(`${this.currentEnemy.name} entrou em campo.`);
    this.updateHordeInfo();
  }
  updateHordeInfo() {
    document.getElementById('hordeNumber').textContent =
      `Horda ${this.currentHorde}`;
    document.getElementById('enemiesLeft').textContent =
      `Inimigos restantes: ${this.enemies.length - this.currentEnemyIndex}`;
  }
}
