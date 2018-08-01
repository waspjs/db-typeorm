import * as _ from "lodash";
import * as wasp from "@wasp/core";
import * as orm from "typeorm";
import NamingStrategy from "./lib/NamingStrategy";

export default class TypeORMPlugin extends wasp.Plugin {
    constructor(
        private entities: string[] | any[],
        private connectionManager: orm.ConnectionManager,
        private options: {
            orm?: Partial<orm.ConnectionOptions>
        } = {}
    ) {
        super();
    }

    onStart = async () => {
        const connection = await this.connectionManager.create(
            _.merge(this.app.config.db as orm.ConnectionOptions, {
                entities: this.entities,
                synchronize: true,
                namingStrategy: new NamingStrategy()
            }, this.options.orm || {})
        );
        await connection.connect();
    }

    onStop = () => this.connectionManager.get().close();
}
