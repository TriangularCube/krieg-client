export interface KriegMapData {
    name: string
    gameMap: GameMapData
}

export interface GameMapData {
    terrain: number[][]
}

export class KriegMap {
    public name: string
    public readonly gameMap: GameMap

    constructor(mapData: KriegMapData) {
        this.name = mapData.name
        this.gameMap = new GameMap(mapData.gameMap)
    }
}

export class GameMap {
    private _terrain: number[][]
    private _width: number
    private _height: number

    constructor(data: GameMapData) {
        this._terrain = data.terrain

        // TODO
        this._width = 20
        this._height = 20
    }

    get width(): number {
        return this._width
    }
    get height(): number {
        return this._height
    }
    public getTerrainAt(x: number, y: number): number {
        return this._terrain[x][y]
    }

    public setMapSize(width: number, height: number): void {
        // TODO
    }
}
