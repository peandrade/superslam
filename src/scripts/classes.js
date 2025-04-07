class Character {
  #life = 1;

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

  constructor(player, enemy, playerElement, enemyElement, battleLog) {
    this.player = player;
    this.enemy = enemy;
    this.playerElement = playerElement;
    this.enemyElement = enemyElement;
    this.battleLog = battleLog;
  }

  start() {
    this.update();
  }

  renderCharacter(character, characterElement) {
    const nameElement = characterElement.querySelector('.name');
    const barElement = characterElement.querySelector('.bar');

    const lifePercent = (character.life / character.maxLife) * 100;
    nameElement.innerHTML = `${character.name} - ${character.life.toFixed(1)} HP`;
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
  }

  update() {
    this.renderCharacter(this.player, this.playerElement);
    this.renderCharacter(this.enemy, this.enemyElement);
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
      const damage = attackPower - defensePower;
      defender.life -= damage;
      this.battleLog.addMessage(
        `${attacker.name} causou ${damage.toFixed(1)} de dano em ${defender.name}.`
      );
      if (defender.life <= 0) {
        this.battleLog.addMessage(
          `${attacker.name} derrotou ${defender.name}.`
        );
      }
    } else {
      this.battleLog.addMessage(`${defender.name} defendeu com sucesso!`);
    }

    this.update();
  }
}
