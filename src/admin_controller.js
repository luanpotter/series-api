const { query } = require('./parser');
const { write } = require('./storage');
const { DATE_FORMAT } = require('./utils');

const addAllSeries = async () => {
    console.log('Adding all series.');
    const allSeries = [
        { title: 'tt0944947', displayName: 'Game of Thrones' },
        { title: 'tt6226232', displayName: 'Young Sheldon' },
        { title: 'tt0475784', displayName: 'Westworld' },
        { title: 'tt0411008', displayName: 'Lost' },
        { title: 'tt6468322', displayName: 'La Casa de Papel' },
    ];
    const series = allSeries.map(s => ({ id: s.title, ...s }));
    await write('series', series);
    return allSeries;
};

const addSeries = async (title, displayName) => {
    console.log(`Adding series title: ${title}, displayName: ${displayName}`);

    const { seasons, data } = await query({ title, season: '1' });
    const numberSeasons = seasons.map(i => parseInt(i)).reduce((a, b) => a > b ? a : b);

    const releaseDate = data[0].releaseDate.format(DATE_FORMAT);
    const series = {
        title,
        displayName,
        numberSeasons,
        releaseDate,
    };

    const url = `series/${title}`;
    await write(`${url}`, series);
    await write(`${url}/seasons`, seasons.map(i => ({ id: parseInt(i) })));

    return seasons;
};

const addSeason = async (title, season) => {
    console.log(`Adding seasons for title: ${title}, season: ${season}`);
    const { data } = await query({ title, season });

    const enhancedData = data.map(d => ({
        ...d,
        releaseDate: d.releaseDate.format(DATE_FORMAT),
    }));

    const seasonStart = data[0].releaseDate;

    const url = `series/${title}/seasons/${season}`;
    const ps = [
        write(`${url}`, { id: season, releaseDate: seasonStart.format(DATE_FORMAT) }),
        write(`${url}/episodes`, enhancedData),
    ];
    ps.push(...enhancedData.map((episode) => write(`${url}/episodes/${episode.id}`, episode)));
    return Promise.all(ps);
};

module.exports = {
    addAllSeries,
    addSeries,
    addSeason,
};