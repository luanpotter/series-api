const moment = require('moment');

const { query } = require('./parser');
const { write } = require('./storage');
const { request } = require('./request');
const { QUERY_SECRET } = require('./env');

const DATE_FORMAT = 'YYYY-MM-DD';

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
        const allSeries = [
            { title: 'tt0944947', displayName: 'Game of Thrones' },
            { title: 'tt6226232', displayName: 'Young Sheldon' },
            { title: 'tt0475784', displayName: 'Westworld' },
            { title: 'tt0411008', displayName: 'Lost' },
            { title: 'tt6468322', displayName: 'La Casa de Papel' },
        ];
        const series = allSeries.map(s => ({ id: s.title, ...s }));
        await write('series', series);

        const ps = allSeries.map(s => request('/admin/addSeries', s));
        resp.status(200).send(`Success, waiting for ${ps.length} promises.`);
    });

    app.get('/admin/addSeries', async (req, resp) => {
        const title = req.query.title;
        const displayName = req.query.displayName;
        const { seasons, data } = await query({ title, season: '1' });
        const numberSeasons = seasons.map(i => parseInt(i)).reduce((a, b) => a > b ? a : b);

        const startDate = data[0].releaseDate.format(DATE_FORMAT);
        const series = {
            title,
            displayName,
            numberSeasons,
            startDate,
            _startDateDelta: 0,
        };

        const url = `series/${title}`;
        await write(`${url}`, series);
        await write(`${url}/seasons`, seasons.map(i => ({ id: parseInt(i) })));

        const ps = seasons.map(season => request('/admin/addSeason', { title, season, startDate }));
        resp.status(200).send(`Success, waiting for ${ps.length} promises.`);
    });

    app.get('/admin/addSeason', async (req, resp) => {
        const title = req.query.title;
        const season = req.query.season;
        const startDate = moment(req.query.startDate, DATE_FORMAT);

        console.log(`Running for title: ${title}, season: ${season}`);
        const { data } = await query({ title, season });

        const seasonStart = data[0].releaseDate;
        const seasonStartDelta = seasonStart.diff(startDate, 'd');

        const enhancedData = data.map(d => ({
            ...d,
            releaseDate: d.releaseDate.format(DATE_FORMAT),
            _releaseDateDelta: d.releaseDate.diff(startDate, 'd'),
        }));

        const url = `series/${title}/seasons/${season}`;
        const ps = [
            write(`${url}`, { id: season, releaseDate: seasonStart, _releaseDateDelta: seasonStartDelta }),
            write(`${url}/episodes`, enhancedData),
        ];
        ps.push(...enhancedData.map((episode) => write(`${url}/episodes/${episode.id}`, episode)));

        console.log('Dispatched. Waiting...');
        Promise.all(ps).then(() => {
            console.log('Done!');
            resp.status(200).send('Ok, will do.');
        }).catch(ex => {
            console.error('Error!', ex);
            resp.status(500).send(JSON.stringify(ex));
        });
    });
};

module.exports = { adminRoutes };
