import EventEmitter from 'eventemitter3'
import { KriegMap } from '../common/GameMap'
import { TileSize } from '../common/GraphicsData'

export enum EditorMouseEventType {
  Pan = 'Pan',
  Select = 'Select',
  Zoom = 'Zoom',
  Hover = 'Hover',
}

import * as Phaser from 'phaser'
const Vector2 = Phaser.Math.Vector2
type Vector2 = Phaser.Math.Vector2

export class BuilderMouseController extends EventEmitter {
  private input: Phaser.Input.InputPlugin
  private map: KriegMap
  private camera: Phaser.Cameras.Scene2D.Camera

  private isPanning: boolean
  private previousPan: Vector2 | null

  private currentSelection: Vector2 | null

  private previousHover: Vector2 | null

  constructor(
    input: Phaser.Input.InputPlugin,
    map: KriegMap,
    camera: Phaser.Cameras.Scene2D.Camera
  ) {
    super()

    this.input = input
    this.map = map
    this.camera = camera

    this.isPanning = false
    this.previousPan = null
    this.currentSelection = null
    this.previousHover = null

    input.on(Phaser.Input.Events.POINTER_DOWN, this.pointerDown)
    input.on(Phaser.Input.Events.POINTER_UP, this.pointerUp)
    input.on(Phaser.Input.Events.POINTER_MOVE, this.pointerMove)
    input.on(Phaser.Input.Events.POINTER_WHEEL, this.wheel)
    input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.pointerUp)
  }

  private clearHover = (): void => {
    this.emit(EditorMouseEventType.Hover, null)
    this.previousHover = null
  }

  private calculateHover = (event: PointerEvent): void => {
    const currentTile = this.findMapTile(event.x, event.y)
    if (
      this.previousHover === null ||
      currentTile.x !== this.previousHover.x ||
      currentTile.y !== this.previousHover.y
    ) {
      this.emit(EditorMouseEventType.Hover, currentTile)
      this.previousHover = currentTile
    }

    if (this.currentSelection !== null) {
      if (
        currentTile.x !== this.currentSelection.x ||
        currentTile.y !== this.currentSelection.y
      ) {
        this.emit(EditorMouseEventType.Select, currentTile)
        this.currentSelection = currentTile
      }
    }
  }

  private pointerDown = (event: PointerEvent): void => {
    switch (event.button) {
      case 0:
        const mapTile = this.findMapTile(event.x, event.y)

        this.currentSelection = mapTile
        this.emit(EditorMouseEventType.Select, mapTile)
        break
      case 2:
        this.isPanning = true
        this.previousPan = new Vector2(event.x, event.y)

        this.clearHover()

        break
    }
  }

  private pointerUp = (event: PointerEvent): void => {
    switch (event.button) {
      case 0:
        this.currentSelection = null
        break
      case 2:
        this.previousPan = null
        this.isPanning = false

        this.calculateHover(event)
        break
    }
  }

  private pointerMove = (event: PointerEvent): void => {
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
      this.previousPan = new Vector2(event.x, event.y)
    } else {
      this.calculateHover(event)
    }
  }

  private wheel = (event: PointerEvent & WheelEvent): void => {
    this.emit(EditorMouseEventType.Zoom, event.deltaY)

    // TODO: This fires too early, need to wait until after event
    //   finishes propagating
    this.calculateHover(event)
  }

  private findMapTile = (x: number, y: number): Vector2 => {
    const worldPoint = this.camera.getWorldPoint(x, y)

    return new Vector2(
      Math.floor(worldPoint.x / TileSize),
      Math.floor(worldPoint.y / TileSize)
    )
  }
}
