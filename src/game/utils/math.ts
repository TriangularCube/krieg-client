export const Clamp = (num: number, min: number, max: number): number => {
    return Math.max(min, Math.min(num, max))
}
