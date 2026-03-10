export function convertUNIXToDate(key: string, value: unknown) {
    if (typeof value === 'number' && key === 'date') {
        return new Date(value * 1000); // Date принимает только мс, поэтому с секунд делаем мс.
    }
    return value;
}