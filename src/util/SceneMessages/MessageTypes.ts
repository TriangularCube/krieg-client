export enum MessageType {
    System = 'System',
    Tool = 'Tool',
}

export enum ToolCategory {
    Terrain,
}

export interface ToolType {
    category: ToolCategory
    type: number
}
