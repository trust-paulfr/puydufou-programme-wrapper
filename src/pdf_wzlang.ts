import axios from 'axios';

class PDF_WZ_LANG {
    wzLangData: any;

    private async getData() {
        console.log('[PDF WZ Lang] Getting data...');
        const dataWzLang = await axios.get('https://api.mobile.puydufou.com/pivot/pdf/wezit?lang=fr');

        this.wzLangData = dataWzLang.data['data'];
    }

    public async getWzLangData() {
        if (!this.wzLangData) {
            console.log('[PDF WZ Lang] WZ Lang data not found. ');
            await this.getData();
        }

        return this.wzLangData;
    }
}

export default PDF_WZ_LANG;