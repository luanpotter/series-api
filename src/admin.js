const setup = require('./setup');
const { query } = require('./parser');
const { QUERY_SECRET } = require('./env');
const { request } = require('./request');

const adminRoutes = app => {
    app.use('/admin', (req, res, next) => {
        if (req.query.secret !== QUERY_SECRET) {
            res.status(403).send('Invalid secret, mate...');
        } else {
            next();
        }
    });

    app.get('/admin/query', (req, resp) => {
        const data = { title: req.query.title, season: req.query.season };
        query(data).then(result => resp.status(200).send(JSON.stringify(result.data)));
    });

    app.get('/admin/addAllSeries', async (req, resp) => {
        try {
            const allSeries = await setup.addAllSeries();
            const ps = allSeries.map(s => request('/admin/addSeries', s));
            resp.status(200).send(`Success, waiting for ${ps.length} promises.`);
        } catch (ex) {
            console.error('Error!', ex);
            resp.status(500).send(JSON.stringify(ex));
        }
    });

    app.get('/admin/addSeries', async (req, resp) => {
        const title = req.query.title;
        const displayName = req.query.displayName;

        try {
            const seasons = await setup.addSeries(title, displayName);
            const ps = seasons.map(season => request('/admin/addSeason', { title, season }));
            resp.status(200).send(`Success, waiting for ${ps.length} promises.`);
        } catch (ex) {
            console.error('Error!', ex);
            resp.status(500).send(JSON.stringify(ex));
        }
    });

    app.get('/admin/addSeason', async (req, resp) => {
        const title = req.query.title;
        const season = req.query.season;

        try {
            await setup.addSeason(title, season);
            console.log('Done!');
            resp.status(200).send('Ok!');
        } catch (ex) {
            console.error('Error!', ex);
            resp.status(500).send(JSON.stringify(ex));
        }
    });
};

module.exports = { adminRoutes };
