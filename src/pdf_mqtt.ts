import mqtt from 'mqtt';

const mqttOptions: mqtt.IClientOptions = {
    port: 443,
    host: 'wss://notifications.puydufou.com/mqtt', 
    clientId: '', // To replace with credentials
    username: '', // To replace with credentials
    password: '', // To replace with credentials
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};

class PDF_MQTT {
    MQTT_CLIENT: any;
    MQTT_HOOKS: any = {}; // TODO: Add types for MQTT_HOOKS

    private async connectMQTT() {
        this.MQTT_CLIENT = mqtt.connect('wss://notifications.puydufou.com/mqtt', mqttOptions);

        this.MQTT_CLIENT.on('connect', () => {
            console.log('[PDF MQTT] Connected to MQTT');
        });
    }

    public isMQTTConnected() {
        if (!this.MQTT_CLIENT) {
            console.log('[PDF MQTT] MQTT client not connected. Try to connect first.');
            this.connectMQTT();
        }

        return this.MQTT_CLIENT;
    }

    private async subscribeMQTT(topic: string) {
        if (!this.MQTT_CLIENT) {
            console.log('[PDF MQTT] MQTT client not connected. Try to connect first.');
            this.connectMQTT();
        }

        this.MQTT_CLIENT.subscribe(topic, (err: any) => {
            if (err) {
                console.log('[PDF MQTT] Error subscribing to topic', err);
            }
        });

        this.MQTT_CLIENT.on('message', (topic: string, message: any) => {
            if (!this.MQTT_HOOKS[topic]) {
                console.log(`[PDF MQTT] No hooks for topic ${topic}`);
                return;
            }

            for (const hook of this.MQTT_HOOKS[topic]) {
                hook(message);
            }
        });
    }

    public async addMQTTHook(topic: string, callback: any) {
        if (!this.MQTT_CLIENT) {
            console.log('[PDF MQTT] MQTT client not connected. Try to connect first.');
            this.connectMQTT();
        }
        if (!this.MQTT_HOOKS[topic]) {
            this.MQTT_HOOKS[topic] = [];
        }

        this.MQTT_HOOKS[topic].push(callback);
        this.subscribeMQTT(topic);
    }
}

export default PDF_MQTT;