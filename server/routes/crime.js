const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const router = express.Router();

const OFFENSE_CATEGORIES = {
    'VIOLENT': [
        'MURDER', 'HOMICIDE', 'ASSAULT', 'ROBBERY', 'AGGRAVATED ASSAULT',
        'ASSAULT W/DEADLY WEAPON'
    ],
    'PROPERTY': [
        'STEALING', 'THEFT', 'BURGLARY', 'LARCENY', 'AUTO THEFT',
        'STOLEN VEHICLE', 'VANDALISM', 'PROPERTY DAMAGE'
    ],
    'DOMESTIC': [
        'DOMESTIC ASSAULT', 'DOMESTIC VIOLENCE', 'VIOLATION OF PROTECTION ORDER',
        'STALKING'
    ],
    'SEX CRIMES': [
        'RAPE', 'SEXUAL ABUSE', 'SEXUAL ASSAULT', 'SODOMY', 
        'CHILD MOLESTATION', 'STATUTORY RAPE'
    ],
    'DRUGS': [
        'DRUG POSSESSION', 'DRUG DISTRIBUTION', 'DRUG PARAPHERNALIA',
        'CONTROLLED SUBSTANCE'
    ],
    'WEAPONS': [
        'WEAPONS OFFENSE', 'UNLAWFUL POSSESSION OF WEAPON', 
        'CONCEALED WEAPON'
    ]
};

router.get('/', async (req, res) => {
    const { crimeType, district, fromDate, toDate } = req.query;
    console.log("Received query params:", { crimeType, district, fromDate, toDate });

    try {
        const db = await openDb();
        
        let query = `SELECT * FROM crimes WHERE 1=1`;
        const params = [];

        if (crimeType && crimeType !== '') {
            if (crimeType === 'OTHER') {
                // Create array of all categorized offenses
                const categorizedOffenses = Object.values(OFFENSE_CATEGORIES).flat();
                const placeholders = categorizedOffenses.map(() => '?').join(',');
                query += ` AND Offense NOT IN (${placeholders})`;
                params.push(...categorizedOffenses);
            } else {
                // Get the offenses for the selected category
                const categoryOffenses = OFFENSE_CATEGORIES[crimeType] || [];
                const placeholders = categoryOffenses.map(() => '?').join(',');
                query += ` AND Offense IN (${placeholders})`;
                params.push(...categoryOffenses);
            }
        }

        if (district && district !== '') {
            query += ` AND District = ?`;
            params.push(district);
        }

        if (fromDate && fromDate !== '') {
            query += ` AND substr(IncidentDate, 1, 10) >= ?`;
            params.push(fromDate);  // fromDate will already be in YYYY-MM-DD format from the input
        }
        
        if (toDate && toDate !== '') {
            query += ` AND substr(IncidentDate, 1, 10) <= ?`;
            params.push(toDate);
        }
        query += ` ORDER BY IncidentDate DESC LIMIT 1000` //avoid crashing

        console.log("Executing query:", query);
        console.log("With parameters:", params);

        const rows = await db.all(query, params);
        console.log(`Found ${rows.length} incidents matching criteria`);

        await db.close();
        res.json(rows);

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            error: "Database query failed",
            details: error.message 
        });
    }
});

// Don't forget to define the openDb function
async function openDb() {
    try {
        const dbPath = path.resolve(__dirname, '../../data/crimes.db');
        return await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
}

module.exports = router;
