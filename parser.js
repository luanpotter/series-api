const rp = require('request-promise');
const $ = require('cheerio');

const listingUrl = ({ title, season }) => `https://www.imdb.com/title/${title}/episodes?season=${season}`;
const titlePageUrl = id => `https://www.imdb.com/title/${id}`;

const extractImdbId = str => /^\/title\/([^/]*)\/.*$/g.exec(str)[1];

const query = async info => {
    const listingHtml = await rp(listingUrl(info));
    const seasons = Array.from($('select#bySeason option', listingHtml)).map(tag => $(tag).text().trim());

    const episodes = Array.from($('#episodes_content div.list.detail.eplist div.list_item', listingHtml));
    const response = episodes.map(tag => ({
        episodeNumber: $('.info meta[itemprop=episodeNumber]', tag).attr('content').trim(),
        imdbId: extractImdbId($('.info > strong a', tag).attr('href').trim()),
        title: $('.info > strong a', tag).text().trim(),
        releaseDate: $('.info div.airdate', tag).text().trim(),
    })).map(async el => {
        const titlePageHtml = await rp(titlePageUrl(el.imdbId));
        const duration = $('#title-overview-widget .title_block .title_wrapper .subtext > time', titlePageHtml).text().trim();
        return {
            ...el,
            duration,
        };
    });
    const data = await Promise.all(response);
    return { seasons, data };
};

module.exports = { query };