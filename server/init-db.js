const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs').promises;
const Papa = require('papaparse');

async function initializeDatabase() {
    const dbPath = path.resolve(__dirname, '../data/crimes.db');
    const csvPath = path.resolve(__dirname, '../data/raw_2021-2024.csv');

    const db = new sqlite3.Database(dbPath);

    try {
        // Read CSV file
        const csvData = await fs.readFile(csvPath, 'utf-8');
        
        // Create table
        await new Promise((resolve, reject) => {
            db.run(`CREATE TABLE IF NOT EXISTS crimes (
                IncidentDate TEXT,
                OccurredFromTime TEXT,
                IncidentNum TEXT,
                Offense TEXT,
                NIBRS TEXT,
                NIBRSCategory TEXT,
                SRS_UCR TEXT,
                CrimeAgainst TEXT,
                FelMisdCit TEXT,
                IncidentTopSRS_UCR TEXT,
                IncidentLocation TEXT,
                IntersectionOtherLoc TEXT,
                District TEXT,
                Neighborhood TEXT,
                NbhdNum TEXT,
                Latitude REAL,
                Longitude REAL,
                IncidentSupplemented TEXT,
                LastSuppDate TEXT,
                VictimNum TEXT,
                FirearmUsed TEXT,
                IncidentNature TEXT
            )`, (err) => {
                if (err) reject(err);
                resolve();
            });
        });

        // Parse CSV and insert data
        Papa.parse(csvData, {
            header: true,
            complete: (results) => {
                const stmt = db.prepare(`INSERT INTO crimes VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?
                )`);

                db.serialize(() => {
                    // Begin transaction for faster inserts
                    db.run('BEGIN TRANSACTION');

                    results.data.forEach((row) => {
                        stmt.run(Object.values(row));
                    });

                    // Commit transaction
                    db.run('COMMIT');
                });

                stmt.finalize();
                console.log(`Inserted ${results.data.length} rows`);
            }
        });

        // Create indexes for better query performance
        await new Promise((resolve, reject) => {
            db.run(`CREATE INDEX IF NOT EXISTS idx_date ON crimes(IncidentDate)`, (err) => {
                if (err) reject(err);
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            db.run(`CREATE INDEX IF NOT EXISTS idx_offense ON crimes(Offense)`, (err) => {
                if (err) reject(err);
                resolve();
            });
        });

    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

initializeDatabase()
    .then(() => console.log('Database initialized successfully'))
    .catch(console.error);