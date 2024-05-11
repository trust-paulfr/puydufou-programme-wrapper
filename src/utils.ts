import PDFProgrammeInterface from '../types/pdf_programme';

async function getSpectacleSubInfos(programmeData: PDFProgrammeInterface[], sqliteConnection: any) { // TODO: Add types for sqliteConnection
    const promises = [];

    for (const event of programmeData) {
        const idSpectacle = event.wzid;

        promises.push(new Promise(async (resolve, reject) => {
            const spectacleData = await sqliteConnection('RICH_TEXT').where('pid', idSpectacle).limit(1).first();
            if (!spectacleData) {
                console.log(`[Spectacle] Spectacle ${idSpectacle} not found in database.`);
                return
            }

            event.title = spectacleData.title;
            event.subject = spectacleData.subject;
            event.description = spectacleData.desc;

            resolve(true);
        }));
    }

    await Promise.all(promises);
}

function getWzLangInfos(programmeData: PDFProgrammeInterface[], wzLangData: any) {
    for (const event of programmeData) {
        const pdfID = wzLangData.find((wzLang: any) => wzLang.wzid === event.wzid);
        if (!pdfID) {
            console.log(`[WZ Lang] WZ Lang data not found for ${event.wzid}`);
            continue;
        }

        event.pdfid = pdfID.pdfid;
    }
}

function getSpectacleState(programmeData: PDFProgrammeInterface) {
    /* 
        Return 
        - 0: No spectacle programmed
        - 1: Session programmed in 60 minutes or less
        - 2: Session Open 
        - 3: Session Closed (Spectacle started or Full capacity)
    */
    let state = 0;
    const date = new Date();

    for (const session of programmeData.heures) {
        let sessionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(session.debut.substring(0, 2)), Number(session.debut.substring(2, 4)));
        
        if (session.fin != '') { /* Ouvert en continue  */
            let sessionEndDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(session.fin.substring(0, 2)), Number(session.fin.substring(2, 4)));

            if (date.getTime() < sessionEndDate.getTime()) {
                state = 2;
                continue;
            }else {
                state = 0;
                continue;
            }
        }

        if (date.getTime() > sessionDate.getTime()) {
            if (sessionDate.getTime() + (programmeData.duree * 60000) > date.getTime()) {
                state = 3;
                continue;
            } else {
                state = 0;
                continue;
            }
        }  

        if (sessionDate.getTime() - date.getTime() <= 3600000) {
            state = 1;

            if (sessionDate.getTime() - date.getTime() <= 1800000) {
                state = 2;
                            
                if (programmeData.affluence && programmeData.affluence >=  100) {
                    state = 3;
                }
            }
        }
    }

    return state;
}

export { getSpectacleSubInfos, getWzLangInfos, getSpectacleState };