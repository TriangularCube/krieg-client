import * as Phaser from 'phaser'

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Test',
}

export class TestScene extends Phaser.Scene {
    private square: Phaser.GameObjects.Rectangle & {
        body: Phaser.Physics.Arcade.Body
    }

    constructor() {
        super(sceneConfig)
    }

    public create(): void {
        this.square = this.add.rectangle(400, 400, 100, 100, 0xffffff) as never
        this.physics.add.existing(this.square)
    }

    public update(): void {
        // TODO
    }
}
