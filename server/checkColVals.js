const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function analyzeData() {
    console.log("Starting analysis...");

    try {
        const db = await open({
            filename: path.resolve(__dirname, '../data/crimes.db'),
            driver: sqlite3.Database
        });

        // Categorical columns to analyze
        const columns = ['Offense', 'District', 'CrimeAgainst', 'FelMisdCit', 'FirearmUsed', 'Neighborhood'];
        
        for (const column of columns) {
            console.log(`\n=== Unique values in ${column} ===`);
            const query = `
                SELECT ${column}, COUNT(*) as count 
                FROM crimes 
                WHERE ${column} IS NOT NULL AND ${column} != ''
                GROUP BY ${column} 
                ORDER BY count DESC`;
            
            const results = await db.all(query);
            console.log(`Found ${results.length} unique values:`);
            results.forEach(row => {
                console.log(`${row[column]}: ${row.count}`);
            });
        }

        // Get date range information
        console.log('\n=== Date Range Analysis ===');
        const dateQuery = `
            SELECT 
                MIN(IncidentDate) as earliest_date,
                MAX(IncidentDate) as latest_date,
                COUNT(DISTINCT substr(IncidentDate, 1, 7)) as unique_months
            FROM crimes`;
        
        const dateInfo = await db.get(dateQuery);
        console.log("Date range:", dateInfo);

        await db.close();
        console.log("\nAnalysis complete.");

    } catch (error) {
        console.error('Error:', error);
    }
}

analyzeData();