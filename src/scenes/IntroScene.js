// Story intro for a new game.
window.IntroScene = class IntroScene extends Phaser.Scene {
  constructor() { super('Intro'); }

  create() {
    this.cameras.main.setBackgroundColor('#06060f');
    this.pages = [
      ['Long ago, the CROWN OF ELDORIA', 'kept our land in balance.', ''],
      ['But the sorcerer MORGRATH', 'shattered it into three shards', 'and hid them in dark temples...'],
      ['Monsters crept into the meadows.', 'The sky over the wastes turned ash.', ''],
      ['Elder Rowan has chosen YOU,', 'a kid from Willow Village,', 'to find the shards.'],
      ['Reforge the crown.', 'Defeat Morgrath.', 'Be brave!'],
    ];
    this.page = 0;
    this.textObj = this.add.text(160, 90, '', {
      fontFamily: CONFIG.FONT, fontSize: '8px', color: '#e8e8ff', align: 'center',
      lineSpacing: 8,
    }).setShadow(1, 1, '#000000', 0).setOrigin(0.5).setResolution(CONFIG.ZOOM * 2);
    this.hint = this.add.text(160, 180, '- press ENTER -', {
      fontFamily: CONFIG.FONT, fontSize: '8px', color: '#666688',
    }).setOrigin(0.5).setResolution(CONFIG.ZOOM * 2);
    this.tweens.add({ targets: this.hint, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });
    this.show();

    const adv = () => this.advance();
    this.input.keyboard.on('keydown-ENTER', adv);
    this.input.keyboard.on('keydown-SPACE', adv);
    this.input.keyboard.on('keydown-Z', adv);
  }

  show() {
    this.textObj.setText(this.pages[this.page].join('\n'));
    this.textObj.setAlpha(0);
    this.tweens.add({ targets: this.textObj, alpha: 1, duration: 400 });
    AUDIO.sfx('blip');
  }

  advance() {
    AUDIO.init();
    if (this.page < this.pages.length - 1) {
      this.page++;
      this.show();
    } else {
      AUDIO.sfx('menuSelect');
      this.scene.start('Game');
    }
  }
};
