import EventEmitter from 'eventemitter3'

export interface GameData {
    messageSystem: MessageSystem
}

export class MessageSystem {
    private wsConnection: WebSocket
    private eventEmitter: EventEmitter

    constructor(ws: WebSocket) {
        this.wsConnection = ws
        this.eventEmitter = new EventEmitter()

        ws.onmessage = event => {
            const message = JSON.parse(event.data)
            this.eventEmitter.emit(message.eventName, message.data)
        }
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
}
