import fs from 'fs';
import axios from 'axios';
import knex from 'knex';

class SQLITE_DATABASE {
    private databaseExists: boolean = false;
    private databaseConnection: any;

    public async checkDatabase() {
        console.log('[SQLITE Database] Checking database...');

        if (!fs.existsSync('database.sqlite')) {
            console.log('[SQLITE Database] Database not found. Download a new one...');
            await this.downloadDatabase();
        }

        this.databaseExists = true;
        this.makeConnection();
    }

    public async getDatabaseConnection() {
        if (!this.databaseExists || !this.databaseConnection) {
            console.log('[SQLITE Database] Database not found or not connected. Please check the database connection.');
            return false;
        }

        return this.databaseConnection;
    }

    private makeConnection() {
        this.databaseConnection = knex({
            client: 'sqlite3',
            connection: {
                filename: 'database.sqlite'
            }
        });

        console.log('[SQLITE Database] Connected to database');
    }

    private async downloadDatabase() {
        axios({
            method: 'get',
            url: 'https://cdn.mobile.puydufou.com/004759/appdata/wzobj_inventory_QqnqAbNBW/sqlite.sqlite',
            responseType: 'stream'
        }).then((response) => {
            response.data.pipe(fs.createWriteStream('database.sqlite'));
        });
    }
}

export default SQLITE_DATABASE;