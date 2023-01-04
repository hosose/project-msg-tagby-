require('dotenv').config();

const http = require('http');

const { createApp } = require('./app');
const { appDataSource } = require('./api/models/data_source');

const start = async () => {
    const app = createApp();
    const server = http.createServer(app);
    const PORT = process.env.PORT;
    try {
        await appDataSource
            .initialize()
            .then(() => {
                console.log('Datasource initialized!');
            })
            .catch((err) => {
                console.error('data source error', err);
            });

        server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
    } catch (err) {
        console.error(err);
    }
};
start();
