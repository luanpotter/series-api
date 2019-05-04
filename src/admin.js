const { tryQuery } = require('./parser');
const { write } = require('./storage');
const { DATE_FORMAT } = require('./utils');

const setup = async () => {
    const ps = [];
    const allSeries = [
        { imdbId: 'tt0944947', displayName: 'Game of Thrones' },
        { imdbId: 'tt6226232', displayName: 'Young Sheldon' },
        { imdbId: 'tt0475784', displayName: 'Westworld' },
        { imdbId: 'tt0411008', displayName: 'Lost' },
        { imdbId: 'tt6468322', displayName: 'La Casa de Papel' },
    ];
    const allSeriesEnchanced = [];

    console.log(`Adding a total of ${allSeries.length} series.`);

    for (const { imdbId, displayName } of allSeries) {
        console.log(`Parsing Series ${displayName}.`);

        const { seasons, data } = await tryQuery({ title: imdbId, season: '1' });
        const numberOfSeasons = seasons.map(i => parseInt(i)).reduce((a, b) => a > b ? a : b);
        console.log(` + Found ${numberOfSeasons} seasons`);

        const releaseDate = data[0].releaseDate.format(DATE_FORMAT);
        const enhancedSeries = {
            id: imdbId,
            imdbId,
            displayName,
            numberOfSeasons,
            releaseDate,
        };
        allSeriesEnchanced.push(enhancedSeries);
        const seriesUrl = `series/${imdbId}`;

        const enhancedSeasons = [];
        for (let seasonNumber of seasons) {
            console.log(` + Querying Season ${seasonNumber}`);
            const { data } = await tryQuery({ title: imdbId, season: seasonNumber });
            const episodeList = data.map(d => ({
                ...d,
                releaseDate: d.releaseDate.format(DATE_FORMAT),
            }));
            const numberOfEpisodes = episodeList.length;
            console.log(` ++ Found ${numberOfEpisodes} episodes`);
        
            const seasonStart = data[0].releaseDate;
            const seasonUrl = `${seriesUrl}/seasons/${seasonNumber}`;
            const enhancedSeason = {
                id: seasonNumber,
                numberOfEpisodes,
                releaseDate: seasonStart.format(DATE_FORMAT),
            };
            enhancedSeasons.push(enhancedSeason);

            ps.push(write(`${seasonUrl}`, enhancedSeason));
            ps.push(write(`${seasonUrl}/episodes`, episodeList));
            ps.push(...episodeList.map((episode) => write(`${seasonUrl}/episodes/${episode.id}`, episode)));
        }

        ps.push(write(`${seriesUrl}/seasons`, enhancedSeasons));
        ps.push(write(`${seriesUrl}`, enhancedSeries));
    }

    ps.push(write('series', allSeriesEnchanced));
    console.log(`Waiting for ${ps.length} S3 files writing...`);
    await Promise.all(ps);
    console.log('Done.');
};

module.exports = {
    setup,
};