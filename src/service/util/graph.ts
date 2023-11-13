import { Flight } from "../../model/flight";

export class FlightGraph {

    private items: Map<string, any[]> = new Map();
    private count: number = 0;

    getCount() {
        return this.count;
    } 

    /**
     * Adding a new vertex.
     * Vertex is a <country, city>.
     * @param {string} v 
     */
    addVertex(v: string) {
        this.count++;
        this.items.set(v, []);
    }

    addVertexIfAbsent(v: string) {
        if (!this.items.has(v)) {
            this.count++;
            this.items.set(v, []);
        }
    }

    /**
     * Binding two vertices together.
     * The weight is a flight.
     * @param {string} v1 
     * @param {string} v2 
     */
    addEdge(v1: string, v2: string, weight: Flight) {
        this.items.get(v1)?.push({node: v2, weight: weight});
    }

    getAllPaths(v1: string, v2: string) {
        const visited = new Set();
        const currentPath: any[] = [];
        const paths: any[] = [];
        this.dfs({node: v1, weight: null} , v2, visited, currentPath, paths);
        return paths;
    }

    private dfs(v1: any, v2: string, visited: Set<any>, currentPath: any[], paths: any[]) {
        if (visited.has(v1.node)) {
            return;
        }
        visited.add(v1.node);
        currentPath.push(v1);
        if (v1.node === v2) {
            paths.push(JSON.parse(JSON.stringify(currentPath)));
            visited.delete(v1.node);
            currentPath.pop();
            return;
        }
        const children = this.items.get(v1.node);
        if (children !== undefined) {
            for (const child of children) {
                if (v1.weight === null 
                    || new Date(v1.weight.arrival) < new Date(child.weight.depature)) {
                    this.dfs(child, v2, visited, currentPath, paths);
                } 
            }
        }
        currentPath.pop();
        visited.delete(v1.node);
    }

}