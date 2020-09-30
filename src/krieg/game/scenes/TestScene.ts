import { MessageSystem, GameData } from '../gameDataInterface'
import { Clamp } from '../utils/math'

export class TestScene extends Phaser.Scene {
    private messageSystem!: MessageSystem

    private keys!: { [key: string]: Phaser.Input.Keyboard.Key }
    private tile!: Phaser.GameObjects.Sprite

    public init(data: GameData): void {
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
        }) as { [key: string]: Phaser.Input.Keyboard.Key }

        this.input.on(
            'wheel',
            (
                pointer: unknown,
                currentlyOver: unknown,
                dx: number,
                dy: number
            ) => {
                this.cameras.main.setZoom(
                    Clamp((this.cameras.main.zoom -= dy / 100), 0.5, 1)
                )
            }
        )
    }

    public update(): void {
        if (Phaser.Input.Keyboard.JustDown(this.keys.confirm)) {
            this.messageSystem.sendNetworkMessage('Something', {
                data: 'hi',
            })
        }
    }
}
