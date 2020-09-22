import * as Phaser from 'phaser'
import { MapData } from '../../site/map/EditMapDisplay'

interface SceneData {
    mapData: MapData
    port: MessagePort
}

export class MapBuilderScene extends Phaser.Scene {
    private port: MessagePort

    public init(sceneData: SceneData): void {
        console.log(sceneData.mapData)
        this.port = sceneData.port

        this.port.postMessage('Hi')
    }
}
