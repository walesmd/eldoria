// Boot the game — but only after the pixel font is ready, or every text
// object would bake the fallback font into its texture.
window.addEventListener('load', () => {
  const boot = () => {
    window.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'game',
      width: CONFIG.ROOM_W * CONFIG.TILE,                       // 320
      height: CONFIG.ROOM_H * CONFIG.TILE + CONFIG.HUD_H / CONFIG.ZOOM, // 208
      backgroundColor: '#000000',
      pixelArt: true,
      scale: { zoom: CONFIG.ZOOM },
      scene: [BootScene, TitleScene, IntroScene, GameScene, UIScene, PauseScene, GameOverScene, VictoryScene],
    });
  };
  if (document.fonts && document.fonts.load) {
    Promise.all([
      document.fonts.load('8px ' + CONFIG.FONT),
      document.fonts.load('16px ' + CONFIG.FONT),
    ]).catch(() => {}).then(boot);
  } else {
    boot();
  }
});
