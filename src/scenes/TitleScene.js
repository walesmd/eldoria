// Title screen with the three save slots (start / continue / erase).
window.TitleScene = class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    this.cameras.main.setBackgroundColor('#0b0b18');
    this.sel = 0;
    this.eraseArmed = -1;

    // decorative crown + shards
    this.add.image(160, 38, ART.tex('crown', 0)).setScale(3);
    this.add.image(120, 56, ART.tex('shardEmerald', 0)).setScale(1.5);
    this.add.image(160, 60, ART.tex('shardRuby', 0)).setScale(1.5);
    this.add.image(200, 56, ART.tex('shardSapphire', 0)).setScale(1.5);

    this.text(160, 76, 'THE SHATTERED CROWN', '#ffe97f', 16, true);
    this.text(160, 92, 'a tiny legend', '#9999bb', 8, true);

    this.slotTexts = [];
    this.cursor = this.text(70, 0, '>', '#ffe97f', 8);
    this.refreshSlots();

    this.text(160, 196, 'ARROWS move  ENTER choose  E erase', '#666688', 8, true);

    this.input.keyboard.on('keydown', () => AUDIO.init());
    this.input.keyboard.on('keydown-UP', () => this.move(-1));
    this.input.keyboard.on('keydown-DOWN', () => this.move(1));
    this.input.keyboard.on('keydown-ENTER', () => this.choose());
    this.input.keyboard.on('keydown-SPACE', () => this.choose());
    this.input.keyboard.on('keydown-E', () => this.erase());
    this.input.keyboard.on('keydown-M', () => AUDIO.toggleMute());

    // music starts once the first keypress unlocks audio
    AUDIO.playSong('title');
  }

  text(x, y, str, color, size, center) {
    const t = this.add.text(x, y, str, {
      fontFamily: CONFIG.FONT, fontSize: (size || 8) + 'px', color: color || '#fff',
    }).setShadow(1, 1, '#000000', 0).setResolution(CONFIG.ZOOM * 2);
    if (center) t.setOrigin(0.5, 0.5);
    return t;
  }

  fmtTime(ms) {
    const m = Math.floor(ms / 60000);
    return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0');
  }

  refreshSlots() {
    for (const t of this.slotTexts) t.destroy();
    this.slotTexts = [];
    const add = (o) => { this.slotTexts.push(o); return o; };
    const slots = SAVE.slots();
    slots.forEach((s, i) => {
      const y = 112 + i * 22;
      const color = s.exists ? '#ffffff' : '#8a8aa8';
      add(this.text(82, y - 5, `Slot ${i + 1}`, color, 8));
      if (s.exists) {
        add(this.add.image(148, y, ART.tex('heart', 0)).setScale(0.6));
        add(this.text(156, y - 5, 'x' + s.hearts, '#ff9090', 8));
        ['shardEmerald', 'shardRuby', 'shardSapphire'].forEach((sh, j) => {
          const img = add(this.add.image(192 + j * 12, y, ART.tex(sh, 0)).setScale(0.6));
          if (j >= s.shards) img.setAlpha(0.18);
        });
        add(this.text(232, y - 5, this.fmtTime(s.playMs), '#9999bb', 8));
        if (s.done) add(this.add.image(288, y, ART.tex('crown', 0)).setScale(0.7));
      } else {
        add(this.text(148, y - 5, '- new adventure -', color, 8));
      }
    });
    this.cursor.setY(112 + this.sel * 22 - 6);
  }

  move(d) {
    AUDIO.init();
    this.sel = (this.sel + d + CONFIG.SAVE_SLOTS) % CONFIG.SAVE_SLOTS;
    this.eraseArmed = -1;
    AUDIO.sfx('menuMove');
    this.refreshSlots();
  }

  choose() {
    AUDIO.init();
    AUDIO.sfx('menuSelect');
    const existing = SAVE.load(this.sel);
    SAVE.start(this.sel);
    AUDIO.stopSong();
    if (existing) {
      GS.hearts = Math.max(GS.hearts, Math.min(3, GS.maxHearts));
      this.scene.start('Game');
    } else {
      SAVE.write();
      this.scene.start('Intro');
    }
  }

  erase() {
    AUDIO.init();
    if (!SAVE.load(this.sel)) return;
    if (this.eraseArmed === this.sel) {
      SAVE.erase(this.sel);
      this.eraseArmed = -1;
      AUDIO.sfx('explosion');
      this.refreshSlots();
    } else {
      this.eraseArmed = this.sel;
      AUDIO.sfx('denied');
      const t = this.text(160, 184, 'Press E again to erase slot ' + (this.sel + 1) + '!', '#ff8080', 8, true);
      this.time.delayedCall(2000, () => { t.destroy(); if (this.eraseArmed === this.sel) this.eraseArmed = -1; });
    }
  }
};
