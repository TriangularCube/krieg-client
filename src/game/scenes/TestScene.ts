import * as Phaser from 'phaser'
import { MessageSystem, StartData } from '../gameConfig'

export class TestScene extends Phaser.Scene {
    private messageSystem: MessageSystem

    private keys
    private tile: Phaser.GameObjects.Sprite

    public init(data: StartData): void {
        this.messageSystem = data.messageSystem
    }

    public async preload(): Promise<void> {
        this.load.setBaseURL(window.location.origin + '/assets')
        this.load.atlasXML(
            'terrain',
            'graphics/terrain_sheet.png',
            'graphics/terrain_sheet.xml'
        )
    }

    public create(): void {
        this.messageSystem.registerListener('test', data => {
            console.log(data)
        })

        const atlasTexture = this.textures.get('terrain')

        const frame = atlasTexture.get('scifiTile_01.png')

        this.tile = this.add.sprite(
            frame.halfWidth,
            frame.halfHeight,
            'terrain',
            frame.name
        )

        this.keys = this.input.keyboard.addKeys({
            up: 'up',
            down: 'down',
            left: 'left',
            right: 'right',
            confirm: 'a',
        })

        this.input.on('wheel', (pointer, currentlyOver, dx, dy) => {
            this.cameras.main.setZoom(
                this.clamp((this.cameras.main.zoom -= dy / 1000), 0.5, 1)
            )
        })
    }

    public update(): void {
        if (Phaser.Input.Keyboard.JustDown(this.keys.confirm)) {
            this.messageSystem.sendNetworkMessage('Something', {
                data: 'hi',
            })
        }
    }

    private clamp(num: number, min: number, max: number): number {
        return Math.max(min, Math.min(num, max))
    }
}
