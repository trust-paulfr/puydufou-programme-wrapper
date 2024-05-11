import sqlLite from './src/sqlite_database';
import PDF_PROGRAMME from './src/pdf_programme';
import PDF_WZ_LANG from './src/pdf_wzlang';
import PDF_MQTT from './src/pdf_mqtt';
import { getSpectacleSubInfos, getWzLangInfos, getSpectacleState } from './src/utils';

const sqlite = new sqlLite();
const pdfProgramme = new PDF_PROGRAMME();
const pdfWzLang = new PDF_WZ_LANG();
const pdfMQTT = new PDF_MQTT();

async function main() {
    await sqlite.checkDatabase();   
    
    const sqliteConnection = await sqlite.getDatabaseConnection();
    pdfMQTT.isMQTTConnected();
    const programmeData = await pdfProgramme.getProgrammeData();
    const wzLangData = await pdfWzLang.getWzLangData();

    await getSpectacleSubInfos(programmeData, sqliteConnection);
    getWzLangInfos(programmeData, wzLangData);

    const eventsToSubscribe = programmeData.filter((event) => event.duree > 0).length;
    
    process.setMaxListeners(eventsToSubscribe + 1); // Set max listeners to the number of events + 1 (for the 'done' event)
    require('events').EventEmitter.prototype._maxListeners = eventsToSubscribe + 1;
    
    for (const event of programmeData) {
        if (event.duree != 0) {
            if (event.pdfid == undefined) continue; // Skip events with no PDF ID (WZ Lang data not found

            console.log(`[PDF Programme] ${event.title} (${event.wzid})`);
            console.log(`[PDF Programme] Try to subscribe to topic ${event.pdfid}`);

            pdfMQTT.addMQTTHook('fr/visitor/grandstand/affluence_real_time/' + event.pdfid, (message: any) => {
                console.log(`[PDF Programme] ${new Date().toLocaleString()} Received message for ${event.title} (${event.wzid})`);
                console.log(message.toString());

                const messageData = JSON.parse(message.toString());

                if (messageData.affluence) {
                    console.log(`[PDF Programme] Affluence for ${event.title} (${event.wzid}): ${messageData.affluence}`);
                    event.affluence = messageData.affluence != '' ? Number(messageData.affluence) : 0;
                    event.state = getSpectacleState(event);
                }
            });
        }

        event.state = getSpectacleState(event);
    }
}

export default main;