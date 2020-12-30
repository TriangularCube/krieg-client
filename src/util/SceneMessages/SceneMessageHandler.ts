import EventEmitter from 'eventemitter3'
import { MessageType } from './MessageTypes'

export class SceneMessageHandler extends EventEmitter {
  private port: MessagePort

  constructor(port: MessagePort) {
    super()

    this.port = port

    port.onmessage = (event: MessageEvent) => {
      this.emit(event.data.messageType, event.data.data)
    }
  }

  public postMessage(messageType: MessageType, data: unknown): void {
    this.port.postMessage({
      messageType,
      data,
    })
  }
}
