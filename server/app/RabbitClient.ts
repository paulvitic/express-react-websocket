import amqp from 'amqplib/callback_api';

// if the connection is closed or fails to be established at all, we will reconnect
const companyEventQueue = 'companyEvents';
let amqpConn = null;

export function InitRabbitMQ() {
    const { queue: { host, port } } = config;
    const RABBIT_MQ_URL = process.env.CLOUDAMQP_URL || `amqp://${host}:${port}`;

    amqp.connect(RABBIT_MQ_URL + '?heartbeat=60', function(err, conn) {
        if (err) {
            console.error('[AMQP]', err.message);
            return setTimeout(InitRabbitMQ, 7000);
        }
        conn.on('error', function(err) {
            if (err.message !== 'Connection closing') {
                console.error('[AMQP] conn error', err.message);
            }
        });
        conn.on('close', function() {
            console.error('[AMQP] reconnecting');
            return setTimeout(InitRabbitMQ, 7000);
        });

        console.log('[AMQP] connected');
        amqpConn = conn;

        whenConnected();
    });
}

function whenConnected() {
    startCompanyConsumer();
}

function startCompanyConsumer() {
    amqpConn.createChannel(function(err, ch) {
        if (closeOnErr(err)) return;

        ch.on('error', function(err) {
            console.error('[AMQP] channel error', err.message);
        });

        ch.on('close', function() {
            console.log('[AMQP] channel closed');
        });

        ch.prefetch(10);

        ch.assertQueue(companyEventQueue, { durable: true }, function(err) {
            if (closeOnErr(err)) return;
            ch.consume(companyEventQueue, processMsg, { noAck: false });
            console.log('[info] company consumer started');
        });

        function processMsg(msg) {
            console.log('[info] msg [deliveryTag=' + msg.fields.deliveryTag + '] arrived');
            work(msg, function(ok) {
                console.log('[info] sending Ack for msg');
                try {
                    if (ok)
                        ch.ack(msg);
                    else
                        ch.reject(msg, true);
                } catch (e) {
                    closeOnErr(e);
                }
            });
        }
    });
}

function work(msg, ack) {
    const msgStr = msg.content.toString();
    console.log('[info] got msg %s', msgStr);
    const event = JSON.parse(msgStr);
    CreateCompany(event, ack);
    //setTimeout(() => ack(true), 12000);
}

function closeOnErr(err) {
    if (!err) return false;
    console.error('[AMQP] error', err);
    amqpConn.close();
    return true;
}
