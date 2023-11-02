import { Client } from "pg";
import { setPool } from "../../src/connector/pg-pool";
import { PostgreSqlContainer } from "@testcontainers/postgresql";

export class PGTestContainer {
    public postgresContainer: any;
    public postgresClient: any;

    async init() {
        this.postgresContainer = await new PostgreSqlContainer()
        .withExposedPorts(5432)
        .withDatabase('test')
        .withUsername('postgres')
        .withPassword('postgres')
        .withCopyFilesToContainer([
            {
                source: 'test/repository/init.sql', 
                target: '/docker-entrypoint-initdb.d/1-init.sql'
            }, 
            {
                source: 'test/repository/data.sql', 
                target: '/docker-entrypoint-initdb.d/2-data.sql', 
            }]).start();
        this.postgresClient = new Client({connectionString: this.postgresContainer.getConnectionUri()});
        setPool(this.postgresClient);
        await this.postgresClient.connect();
    }

    async destroy() {
        await this.postgresClient.end();
        await this.postgresContainer.stop();
    }

}