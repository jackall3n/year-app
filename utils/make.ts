
export function make(count: number): number[] {
    return Array.from(Array(count)).map((_, i) => i);
}
