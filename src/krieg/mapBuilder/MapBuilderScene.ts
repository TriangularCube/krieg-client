import { KriegMap } from '../common/GameMap'
import { Terrain } from '../../../shared/Kreig/terrain'
import { TerrainAnimations } from '../common/LoadingData'
import { TerrainTile } from '../common/TerrainTile'

interface SceneData {
    kriegMap: KriegMap
    port: MessagePort
}

export class MapBuilderScene extends Phaser.Scene {
    private port!: MessagePort

    private tile!: Phaser.GameObjects.Sprite

    private kriegMap!: KriegMap

    private terrainLayer!: Phaser.GameObjects.Sprite[][]

    private spacebar!: Phaser.Input.Keyboard.Key

    public init(sceneData: SceneData): void {
        this.port = sceneData.port
        this.kriegMap = sceneData.kriegMap

        this.port.postMessage('Hi')
    }

    public async preload(): Promise<void> {
        this.load.setBaseURL('/assets')
        this.load.atlasXML(
            'terrain',
            'graphics/terrain_sheet.png',
            'graphics/terrain_sheet.xml'
        )
    }

    public create(): void {
        TerrainAnimations.forEach(value => {
            this.anims.create({
                ...value.config,
                frames: this.anims.generateFrameNames(
                    'terrain',
                    value.framesConfig
                ),
            })
        })

        this.tile = new TerrainTile(0, this, 0, 0, 'Plains')

        this.spacebar = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        )
    }

    public update(): void {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            // this.tile.destroy()
            this.scene.pause()
        }
    }
}
