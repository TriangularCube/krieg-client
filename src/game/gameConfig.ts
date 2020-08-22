import * as Phaser from 'phaser'
import EventEmitter from 'eventemitter3'

export const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Phaser Template',

    type: Phaser.AUTO,

    scale: {
        // autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
    },

    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },

    parent: 'game-root',
    backgroundColor: '#efc533',

    // Scene not loaded here, as we need to pass information into Phaser Scene
}

export { TestScene as StartScene } from './scenes/TestScene'
export const StartSceneKey = 'Start'

export interface StartData {
    messageSystem: MessageSystem
}

export class MessageSystem {
    private _wsConnection: WebSocket
    private _eventEmitter: EventEmitter

    constructor(ws: WebSocket) {
        this._wsConnection = ws
        this._eventEmitter = new EventEmitter()

        ws.onmessage = event => {
            const message = JSON.parse(event.data)
            this._eventEmitter.emit(message.eventName, message.data)
        }
    }

    public registerListener(
        name: string,
        listener: (data: Record<string, unknown>) => void
    ): void {
        this._eventEmitter.on(name, listener)
    }

    public sendNetworkMessage(
        eventName: string,
        message: Record<string, unknown>
    ): void {
        this._wsConnection.send(
            JSON.stringify({
                eventName,
                data: message,
            })
        )
    }
}
