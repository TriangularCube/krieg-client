import * as Phaser from 'phaser'

export const mapConfig: Phaser.Types.Core.GameConfig = {
    title: 'Map Builder',

    type: Phaser.AUTO,

    scale: {
        width: 800,
        height: 600,
    },

    physics: null,

    parent: 'map-root',
    backgroundColor: '#efc533',
}

export { MapBuilderScene } from './MapBuilderScene'
export const MapBuilderSceneKey = 'Map Builder'
