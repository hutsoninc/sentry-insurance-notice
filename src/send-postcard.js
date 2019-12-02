const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production' ? true : false;

const Lob = require('lob')(
    process.env[isProduction ? 'LIVE_LOB_KEY' : 'TEST_LOB_KEY']
);

const frontTemplate = fs.readFileSync(
    path.join(__dirname, '../templates/front.html')
);

const backTemplate = fs.readFileSync(
    path.join(__dirname, '../templates/back.html')
);

const sendPostcard = async row => {
    try {
        const res = await Lob.postcards.create({
            description: `Sentry Insurance Postcard to ${
                row.name
                    ? row.name
                    : `resident at ${row.street}, ${row.city}, ${row.state} ${row.zip}`
            }`,
            to: {
                name:
                    row.name && row.name.length <= 40
                        ? row.name
                        : 'Current Resident',
                address_line1: row.street,
                address_line2: '',
                address_city: row.city,
                address_state: row.state,
                address_zip: row.zip,
            },
            front: frontTemplate,
            back: backTemplate,
        });

        return {
            ...row,
        };
    } catch (err) {
        return {
            ...row,
            error: err.message,
        };
    }
};

module.exports = sendPostcard;
