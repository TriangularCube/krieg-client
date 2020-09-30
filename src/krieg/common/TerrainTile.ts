import * as Phaser from 'phaser'

export class TerrainTile extends Phaser.GameObjects.Sprite {
    private terrainId: number
    constructor(
        terrainId: number,
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string | Phaser.Textures.Texture
    ) {
        super(scene, 0, 0, texture)
        scene.add.existing(this)

        this.setPosition(40, 40)
        this.play('plains_background')

        this.terrainId = terrainId
    }
}
