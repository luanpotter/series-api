const { tryQuery } = require('./parser');
const { write } = require('./storage');
const { DATE_FORMAT } = require('./utils');

const setup = async () => {
    const ps = [];
    const allSeries = [
        { imdbId: 'tt0944947', title: 'Game of Thrones' },
        { imdbId: 'tt6226232', title: 'Young Sheldon' },
        { imdbId: 'tt0475784', title: 'Westworld' },
        { imdbId: 'tt0411008', title: 'Lost' },
        { imdbId: 'tt6468322', title: 'La Casa de Papel' },
        { imdbId: 'tt0098936', title: 'Twin Peaks' },
    ];
    const allSeriesEnchanced = [];

    console.log(`Adding a total of ${allSeries.length} series.`);
    let idx = 1;

    for (const { imdbId, title } of allSeries) {
        console.log(`Parsing Series ${title}.`);

        const { seasons, data } = await tryQuery({ title: imdbId, season: '1' });
        const numberOfSeasons = seasons.map(i => parseInt(i)).reduce((a, b) => a > b ? a : b);
        console.log(` + Found ${numberOfSeasons} seasons`);

        const releaseDate = data[0].releaseDate.format(DATE_FORMAT);
        const enhancedSeries = {
            id: `${idx++}`,
            imdbId,
            title,
            numberOfSeasons,
            releaseDate,
        };
        allSeriesEnchanced.push(enhancedSeries);
        const seriesUrl = `series/${enhancedSeries.id}`;

        const seasonOnePs = addSeason(ps, seriesUrl, '1', data);

        const seasonsSkipS1 = seasons.filter(s => s !== '1');
        const otherSeasonsPs = seasonsSkipS1.map(seasonNumber => {
            return tryQuery({ title: imdbId, season: seasonNumber }).then(({ data }) => {
                return addSeason(ps, seriesUrl, seasonNumber, data);
            });
        });

        const enhancedSeasons = await Promise.all([ seasonOnePs, ...otherSeasonsPs ]);
        console.log(` + Parsed all seasons`);
        ps.push(write(`${seriesUrl}/seasons`, enhancedSeasons));
        ps.push(write(`${seriesUrl}`, enhancedSeries));
    }

    ps.push(write('series', allSeriesEnchanced));
    console.log(`Waiting for ${ps.length} S3 files writing...`);
    await Promise.all(ps);
    console.log('Done.');
};

const addSeason = (ps, seriesUrl, seasonNumber, data) => {
    const episodeList = data.map(d => ({
        ...d,
        releaseDate: d.releaseDate.format(DATE_FORMAT),
    }));
    const numberOfEpisodes = episodeList.length;
    console.log(` + Queried Season ${seasonNumber}, found ${numberOfEpisodes} episodes`);

    const seasonStart = data[0].releaseDate;
    const seasonUrl = `${seriesUrl}/seasons/${seasonNumber}`;
    const enhancedSeason = {
        id: seasonNumber,
        numberOfEpisodes,
        releaseDate: seasonStart.format(DATE_FORMAT),
    };

    ps.push(write(`${seasonUrl}`, enhancedSeason));
    ps.push(write(`${seasonUrl}/episodes`, episodeList));
    ps.push(...episodeList.map((episode) => write(`${seasonUrl}/episodes/${episode.id}`, episode)));

    return enhancedSeason;
};

module.exports = {
    setup,
};
