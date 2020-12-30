import * as Phaser from 'phaser'
import { TerrainGraphics } from './GraphicsData'
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

    this.loadTerrainSheets()
    this.load.image('cursor', 'graphics/cursor.png')
  }

  public create(): void {
    this.loadTerrainAnimations()

    // Start next Scene
    this.scene.start(this.sceneData.nextSceneKey, this.sceneData.nextSceneData)
  }

  private loadTerrainSheets(): void {
    const processName = (name: string) => `graphics/terrain/${name}.png`

    TerrainGraphics.forEach(value => {
      this.load.spritesheet(value.name, processName(value.spriteSheet), {
        frameWidth: 64,
        frameHeight: 64,
      })
    })
  }

  private loadTerrainAnimations() {
    TerrainGraphics.forEach(value => {
      this.anims.create({
        ...value.animationConfig,
        frames: this.anims.generateFrameNumbers(value.name, {}),
      })
    })
  }
}
