export interface KriegMapData {
    name: string
    gameMap: GameMapData
}

export interface GameMapData {
    terrain: number[][]
}

export class KriegMap {
    private name: string
    private gameMap: GameMap

    constructor(mapData: KriegMapData) {
        this.name = mapData.name
        this.gameMap = new GameMap(mapData.gameMap)
    }
}

export class GameMap {
    private terrain: number[][]

    constructor(data: GameMapData) {
        this.terrain = data.terrain
    }

    public setMapSize(width: number, height: number) {
        // TODO
    }
}
