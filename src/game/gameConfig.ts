import * as Phaser from 'phaser'

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

    // Scene not loaded here, as we need to pass information into Phaser Scene
}

export { TestScene as StartScene } from './scenes/TestScene'
export const StartSceneKey = 'Start'
