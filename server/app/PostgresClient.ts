import LogFactory from "./LogFactory";
import { Pool} from "pg";

class PostgresClient {
    private readonly log = LogFactory.get(PostgresClient.name);
    private connPool: Pool;

    constructor(private readonly host: string,
                private readonly port:number,
                password: string
    ) {
        this.connPool = new Pool({
            user: string,
            database: string,
            password: string,
            port: number,
            host: string,
            poolSize: number,
            poolIdleTimeout: number
        });
    }


    init = async () => {

    }

}
