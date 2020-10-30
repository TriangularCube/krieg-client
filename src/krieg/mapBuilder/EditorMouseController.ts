import EventEmitter from 'eventemitter3'
import { KriegMap } from '../common/GameMap'
import { TileSize } from '../common/GraphicsData'

export enum EditorMouseEventType {
    Pan = 'Pan',
    Select = 'Select',
    Zoom = 'Zoom',
}

export interface Coordinate {
    x: number
    y: number
}

export class EditorMouseController extends EventEmitter {
    private input: Phaser.Input.InputPlugin
    private map: KriegMap

    private isPanning: boolean
    private previousPan: Coordinate | null

    private currentSelection: Coordinate | null

    constructor(input: Phaser.Input.InputPlugin, map: KriegMap) {
        super()

        this.input = input
        this.map = map

        this.isPanning = false
        this.previousPan = null

        this.currentSelection = null

        input.on(Phaser.Input.Events.POINTER_DOWN, this.pointerDown.bind(this))
        input.on(Phaser.Input.Events.POINTER_UP, this.pointerUp.bind(this))
        input.on(Phaser.Input.Events.POINTER_MOVE, this.pointerMove.bind(this))
        input.on(Phaser.Input.Events.POINTER_WHEEL, this.wheel.bind(this))
    }

    private pointerDown(event: PointerEvent): void {
        switch (event.button) {
            case 0:
                const mapTile = EditorMouseController.findMapTile(
                    event.x,
                    event.y
                )

                this.currentSelection = mapTile
                this.emit(EditorMouseEventType.Select, mapTile.x, mapTile.y)
                break
            case 2:
                this.isPanning = true
                this.previousPan = {
                    x: event.x,
                    y: event.y,
                }
                break
        }
    }

    private pointerUp(event: PointerEvent): void {
        switch (event.button) {
            case 0:
                this.currentSelection = null
                break
            case 2:
                this.previousPan = null
                this.isPanning = false
                break
        }
    }

    private pointerMove(event: PointerEvent): void {
        if (this.isPanning) {
            if (this.previousPan == null) {
                console.error('Pan Move while Pan Start is null')
                return
            }
            this.emit(
                EditorMouseEventType.Pan,
                event.x - this.previousPan.x,
                event.y - this.previousPan.y
            )
            this.previousPan = {
                x: event.x,
                y: event.y,
            }
        }
    }

    private wheel(event: WheelEvent): void {
        this.emit(EditorMouseEventType.Zoom, event.deltaY)
    }

    private static findMapTile(x: number, y: number): Coordinate {
        return {
            x: Math.floor(x / TileSize),
            y: Math.floor(y / TileSize),
        }
    }
}
