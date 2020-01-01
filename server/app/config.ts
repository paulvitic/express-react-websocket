import { config as environment} from 'dotenv';

export interface Environment {
    //NODE_ENV: string,
    APP_ID: string,
    PORT: number,
    LOG_LEVEL: string,
    REQUEST_LIMIT: string,
    SESSION_SECRET: string,
    POSTGRE_USER: string,
    POSTGRE_PASS: string,
    REDIS_HOST: string,
    REDIS_PORT: number;
    REDIS_PASS: string,
    RABBIT_USER: string,
    RABBIT_PASS: string,
    SWAGGER_API_SPEC: string,
    DATA_COLLECTION_CRON: string,
    API_PREFIX: string,
    //JIRA_URL: string,
    //JIRA_USER: string,
    //JIRA_API_TOKEN: string
}

const getStringValueOrThrow = (objectVariables: NodeJS.ProcessEnv, key: string): string => {
    const value = objectVariables[key];
    if (value) {
        return value;
    }
    throw Error(`invalid value '${value}' for environment variable ${key}`);
};

const getArrayFromCommaSeparated = (value?: string): string[] => {
    return value && value.trim() ? value.split(',').map((item) => item.trim()) : [];
};

const envFound = environment();

if (!envFound) {
    throw new Error("Couldn't find .env file");
}

export default async function config(): Promise<Environment> {
    return {
        //NODE_ENV: getStringValueOrThrow(process.env, 'NODE_ENV'),
        APP_ID: getStringValueOrThrow(process.env, 'APP_ID'),
        PORT: process.env.PORT ? parseInt(process.env.PORT) : 4000,
        LOG_LEVEL: process.env.LOG_LEVEL || "info",
        REQUEST_LIMIT: getStringValueOrThrow(process.env, 'REQUEST_LIMIT'),
        SESSION_SECRET: getStringValueOrThrow(process.env, 'SESSION_SECRET'),
        POSTGRE_USER: getStringValueOrThrow(process.env, 'POSTGRE_USER'),
        POSTGRE_PASS: getStringValueOrThrow(process.env, 'POSTGRE_PASS'),
        REDIS_HOST:  process.env.REDIS_HOST || 'localhost',
        REDIS_PORT:  process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
        REDIS_PASS:  getStringValueOrThrow(process.env, 'REDIS_PASS'),
        RABBIT_USER: getStringValueOrThrow(process.env, 'RABBIT_USER'),
        RABBIT_PASS: getStringValueOrThrow(process.env, 'RABBIT_PASS'),
        SWAGGER_API_SPEC: getStringValueOrThrow(process.env, 'SWAGGER_API_SPEC'),
        DATA_COLLECTION_CRON: process.env.DATA_COLLECTION_CRON || '* * * * *',
        API_PREFIX: process.env.API_PREFIX || '/api',
        //JIRA_URL: getStringValueOrThrow(process.env, 'JIRA_URL'),
        //JIRA_USER: getStringValueOrThrow(process.env, 'JIRA_USER'),
        //JIRA_API_TOKEN: getStringValueOrThrow(process.env, 'JIRA_API_TOKEN'),
    };
}
