export const BorderSize = 10

export const TileSize = 64

export const TerrainGraphics = new Map([
    [
        // Plains Background
        0,
        {
            spriteSheet: 'scifiTile_01',
            name: 'Plains',
            animationConfig: {
                key: 'plains_background',
                repeat: -1,
                frameRate: 2,
            },
        },
    ],
])

export const SelectionCursorPadding = 2
