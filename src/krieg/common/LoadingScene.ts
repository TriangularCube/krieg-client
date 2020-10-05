import * as Phaser from 'phaser'
import { TerrainAnimations } from './LoadingData'
import { KriegMap } from './GameMap'

interface LoadingSceneData {
    nextSceneKey: string
    nextSceneData: SceneData
}
export interface SceneData {
    kriegMap: KriegMap
    port: MessagePort
}

export const LoadingSceneKey = 'Loading Scene'
export class LoadingScene extends Phaser.Scene {
    private sceneData!: LoadingSceneData

    public init(sceneData: LoadingSceneData): void {
        this.sceneData = sceneData
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
        this.loadTerrain()

        // Start next Scene
        this.scene.start(
            this.sceneData.nextSceneKey,
            this.sceneData.nextSceneData
        )
    }

    private loadTerrain() {
        TerrainAnimations.forEach(value => {
            this.anims.create({
                ...value.config,
                frames: this.anims.generateFrameNames(
                    'terrain',
                    value.framesConfig
                ),
            })
        })
    }
}
