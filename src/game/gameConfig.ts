import * as Phaser from 'phaser'

// import { TestScene } from './scenes/TestScene'

export const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Phaser Template',

    type: Phaser.AUTO,

    scale: {
        // autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
    },

    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },

    parent: 'game-root',
    backgroundColor: '#efc533',

    // scene: [TestScene],
}

export { TestScene as StartScene } from './scenes/TestScene'
export const StartSceneKey = 'Start'
