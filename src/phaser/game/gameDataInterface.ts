import EventEmitter from 'eventemitter3'
import { GameSetupCode } from '../../../shared/MessageCodes'

export interface GameData {
    messageSystem: MessageSystem
}

export class MessageSystem {
    private wsConnection: WebSocket
    private eventEmitter: EventEmitter

    private heartbeatInterval: NodeJS.Timeout
    private heartbeatMissed: number

    constructor(ws: WebSocket) {
        this.wsConnection = ws
        this.eventEmitter = new EventEmitter()
        this.heartbeatMissed = 0

        ws.onmessage = event => {
            const message = JSON.parse(event.data)
            this.eventEmitter.emit(message.eventName, message.data)
        }

        this.handleHeartbeat()

        // TODO Handle get User Info
    }

    public registerListener(
        name: string,
        listener: (data: Record<string, unknown>) => void
    ): void {
        this.eventEmitter.on(name, listener)
    }

    public deregisterListener(
        name: string,
        listener: (data: Record<string, unknown>) => void
    ): void {
        this.eventEmitter.off(name, listener)
    }

    public sendNetworkMessage(
        eventName: string,
        message: Record<string, unknown> | null
    ): void {
        this.wsConnection.send(
            JSON.stringify({
                eventName,
                data: message,
            })
        )
    }

    public destroy(): void {
        this.eventEmitter = null
        this.wsConnection.close()
        clearInterval(this.heartbeatInterval)
    }

    private handleHeartbeat(): void {
        this.heartbeatInterval = setInterval(() => {
            if (this.heartbeatMissed > 4) {
                this.eventEmitter.emit(GameSetupCode.ConnectionDropped, null)
                this.destroy()
                return
            }
            ++this.heartbeatMissed
            this.sendNetworkMessage(GameSetupCode.Heartbeat, null)
        }, 5000)
        this.registerListener(GameSetupCode.Heartbeat, () => {
            this.heartbeatMissed = 0
        })
    }
}
