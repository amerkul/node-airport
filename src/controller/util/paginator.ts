export class Paginator {

    static getOffset(page: number, size: number): number {
        return !isNaN(page) && page > 0 ? (page - 1) * size : 0;
    }

    static validatePageSize(size: number): boolean {
        return size > 0 && !isNaN(size);
    }

    static getTotalPages(totalEntries: number, size: number): number {
        return (totalEntries % size) === 0 ? totalEntries / size : ~~(totalEntries / size + 1);
    }

}
