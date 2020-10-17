import * as Phaser from 'phaser'
import { TileSize, TerrainGraphics, BorderSize } from './GraphicsData'

export class TerrainTile extends Phaser.GameObjects.Sprite {
    private terrainId: number
    constructor(terrainId: number, scene: Phaser.Scene, x: number, y: number) {
        const terrainData = TerrainGraphics.get(terrainId)
        if (!terrainData) {
            throw new Error('No valid terrain data')
        }

        super(
            scene,
            (x + 0.5) * TileSize /* + BorderSize */,
            (y + 0.5) * TileSize /* + BorderSize */,
            terrainData.name
        )
        scene.add.existing(this)
        this.play(terrainData.animationConfig.key)

        this.terrainId = terrainId
    }
}
