import PDFProgrammeInterface from '../types/pdf_programme';
import axios from 'axios';

class PDF_PROGRAMME {
    programmeData: PDFProgrammeInterface[];

    private async getData() {
        console.log('[PDF Programme] Getting data...');
        const dataProgramme = await axios.get('https://api.mobile.puydufou.com/horaires?last_update=0&lang=fr');
        const dateOfDay = new Date();
        const date = dateOfDay.toISOString().split('T')[0];


        this.programmeData = dataProgramme.data['data']['grille'][date]['evenements'].map((event: any) => {            
            return {
                wzid: event['wzid'],
                duree: Number(event['duree']),
                heures: event['heures'].map((session: any) => {
                    const debut_timestamp = new Date(dateOfDay.getFullYear(), dateOfDay.getMonth(), dateOfDay.getDate(), Number(session['debut'].substring(0, 2)), Number(session['debut'].substring(2, 4))).getTime();

                    return {
                        debut: session['debut'],
                        debut_timestamp: debut_timestamp,
                        fin: session['fin']
                    };
                })
            };
        });
    }

    public async getProgrammeData(): Promise<PDFProgrammeInterface[]> {
        if (!this.programmeData) {
            console.log('[PDF Programme] Programme data not found. ');
            await this.getData();
        }

        return this.programmeData;
    }
}

export default PDF_PROGRAMME;