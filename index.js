require('dotenv').config();
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const Promise = require('bluebird');
const Bottleneck = require('bottleneck');
const sendPostcard = require('./src/send-postcard');
const removeDuplicates = require('./src/remove-duplicates');
const { jsonToCsv } = require('@hutsoninc/utils');

const limiter = new Bottleneck({
    maxConcurrent: 5,
    minTime: 1000 / 25,
});

const main = async () => {
    const workbook = xlsx.readFile(path.join(__dirname, 'data/data.xlsx'));

    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets['data']);

    // Remove duplicates
    const filteredSheet = removeDuplicates(sheet);

    console.log(`Attempting to send ${filteredSheet.length} postcards`);

    const promises = filteredSheet.map(async row => {
        return limiter.schedule(async () => await sendPostcard(row));
    });

    const results = await Promise.all(promises);

    const resultsWithErrors = results.filter(obj => obj.error);

    console.log(
        `Successfully sent ${results.length - resultsWithErrors.length}/${
            results.length
        } postcards`
    );

    if (resultsWithErrors.length > 0) {
        const resultsCsv = jsonToCsv(resultsWithErrors, [
            'name',
            'street',
            'city',
            'state',
            'zip',
            'error',
        ]);

        fs.writeFileSync(
            path.join(__dirname, 'data/results.csv'),
            resultsCsv,
            'utf8'
        );
    }
};

main();
