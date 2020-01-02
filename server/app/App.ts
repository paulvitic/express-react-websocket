import ExpressServer from "./ExpressServer";
import LogFactory from "./LogFactory";
import config, {Environment} from "./config";
import RedisClient from "./RedisClient";

type Context = {
    clients: Map<string, any>
    server: ExpressServer | undefined,
}

export default class App {
    private readonly log = LogFactory.get(App.name);
    private env: Environment;
    private context: Context = {
        clients: new Map<string, any>(),
        server: undefined
    };

    public start = async () => {
        this.log.info(`getting configuration`);
        config().then((env: Environment) => {
            this.env = env;
            this.init();
        });
    };

    private init = async () => {
        this.initClients()
            .then(() => {
                this.initServer();
            });
    };

    private initClients = (): Promise<void> => {
        this.context.clients = new Map<string, any>();

        new RedisClient(
            this.env.REDIS_HOST,
            this.env.REDIS_PORT,
            this.env.REDIS_PASS
        ).init()
            .then((client) => {
            this.context.clients.set('redisClient', client);
        });

        return new Promise<void>((resolve, reject) => {
            return resolve();
        })
    };

    private initServer = () => {
        const server = new ExpressServer(
            this.env.PORT,
            this.context.clients.get('redisClient').sessionStore());

        this.context.server = server.listen();
    }
}
