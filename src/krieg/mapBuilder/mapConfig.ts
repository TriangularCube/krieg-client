import * as Phaser from 'phaser'

export const mapConfig: Phaser.Types.Core.GameConfig = {
    title: 'Krieg Map Builder',

    type: Phaser.AUTO,

    scale: {
        width: 800,
        height: 600,
    },

    parent: 'map-root',
    backgroundColor: '#efc533',
}
