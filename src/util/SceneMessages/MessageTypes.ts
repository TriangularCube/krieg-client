export enum MessageType {
  System = 'System',
  Tool = 'Tool',
}

export enum ToolCategory {
  Terrain,
  Building,
  Unit,
}

export interface ToolType {
  category: ToolCategory
  type: number
}

export enum Owner {
  One,
  Two,
  Three,
  Four,
}
