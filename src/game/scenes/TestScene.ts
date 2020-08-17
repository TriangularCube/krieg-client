import * as Phaser from 'phaser'

export class TestScene extends Phaser.Scene {
    private keys
    private tile: Phaser.GameObjects.Sprite

    private square: Phaser.GameObjects.Rectangle & {
        body: Phaser.Physics.Arcade.Body
    }

    // Record<string, unknown> is a way around object in TS
    public init(data: Record<string, unknown>): void {
        console.log(data)
    }

    public preload(): void {
        this.load.atlasXML(
            'terrain',
            'assets/graphics/terrain_sheet.png',
            'assets/graphics/terrain_sheet.xml'
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
        })

        this.input.on('wheel', (pointer, currentlyOver, dx, dy, dz, event) => {
            this.cameras.main.setZoom(
                this.clamp((this.cameras.main.zoom -= dy / 1000), 0.5, 1)
            )
        })
    }

    // public update(): void {
    //     if (this.keys.up.isDown) {
    //         this.cameras.main.setZoom(
    //             this.clamp((this.cameras.main.zoom += 0.1), 0.5, 1)
    //         )
    //     }
    //
    //     if (this.keys.down.isDown) {
    //         this.cameras.main.setZoom(
    //             this.clamp((this.cameras.main.zoom -= 0.1), 0.5, 1)
    //         )
    //     }
    // }

    private clamp(num: number, min: number, max: number): number {
        return Math.max(min, Math.min(num, max))
    }
}
