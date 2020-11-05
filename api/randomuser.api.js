
const axios = require('axios');

class RandomUserApi {
    constructor() {
        this.url = 'https://randomuser.me/api/';
    }

    async getRandomUsers(number) {
        const randomUrl = `${this.url}?results=${number}`;

        let response;
        try {
            response = await axios.get(randomUrl);
        } catch (err) {
            if (!err.response) {
                console.error('Unknown error during the request');
                throw err;
            }

            const { data, status, statusText } = err.response;
            console.error('Error during the request', status, statusText, data);
            return [];
        }

        const results = response.data.results;

        return results.map(elem => {

            let politness = 'Monsieur';
            if (elem.gender === 'female') {
                politness = 'Madame';
            }

            return {
                politness: politness,
                firstName: elem.name.first,
                lastName: elem.name.last,
                email: elem.email,
            }
        });
    }
}

module.exports = RandomUserApi;
