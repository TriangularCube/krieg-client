import EventEmitter from 'eventemitter3'

export interface GameData {
    messageSystem: MessageSystem
}

export class MessageSystem {
    private wsConnection: WebSocket
    private eventEmitter: EventEmitter

    private readonly heartbeatInterval: NodeJS.Timeout
    private heartbeatMissed: number

    constructor(ws: WebSocket) {
        this.wsConnection = ws
        this.eventEmitter = new EventEmitter()
        this.heartbeatMissed = 0

        ws.onmessage = event => {
            const message = JSON.parse(event.data)
            this.eventEmitter.emit(message.eventName, message.data)
        }

        this.heartbeatInterval = setInterval(() => {
            if (this.heartbeatMissed > 4) {
                this.eventEmitter.emit('--connection dropped--', null)
                this.destroy()
                return
            }
            ++this.heartbeatMissed
            this.sendNetworkMessage('--heartbeat--', null)
        }, 5000)
        this.registerListener('--heartbeat--', () => {
            this.heartbeatMissed = 0
        })
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
        message: Record<string, unknown>
    ): void {
        this.wsConnection.send(
            JSON.stringify({
                eventName,
                data: message,
            })
        )
    }

    public destroy() {
        this.eventEmitter = null
        this.wsConnection.close()
        clearInterval(this.heartbeatInterval)
    }
}
