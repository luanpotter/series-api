# API Specification

## Routes

This is the specification for the API. The following routes are available:

```
GET /series -> List<Series> : list all available series
GET /series/:id -> Series : show details about a single series
GET /series/:id/seasons -> List<Season> : list all seasons of a given series (known so far, both released and announced)
GET /series/:id/seasons/:id -> Season : show details about a specific season
GET /series/:id/seasons/:id/episodes -> List<Episode> : list all episodes of a given season
GET /series/:id/seasons/:id/episodes/:id -> Episode : show details of a specific episode
```

## Models

Above, Series, Season and Episode refer to the following objects:

```
Series: {
    id: [string] the id of this REST resource
    imdbId: [string] the IMDB id of this series
    title: [string] the name of this series
    numberOfSeasons: [integer] the number of seasons of this series
    releaseDate: [string] the release date (of the first episode of first season) of this season, in the format YYYY-MM-DD
}

Season: {
    id: [string] the id of this REST resource; it's the sequential number of the season as well
    releaseDate: [string] the release date (of the first episode) of this season, in the format YYYY-MM-DD
    numberOfEpisodes: [integer] the number of episodes of this season
}

Episode: {
    id: [string] the id of this REST resource; it's the sequential number of the episode within the season as well
    imdbId: [string] the IMDB id of this specific episode within the series
    title: [string] the title of this episode
    releaseDate: [string] the release date of this episode, in the format YYYY-MM-DD
    duration: [string] the duration of this episode, in human readable format (e.g., '2h 20min' or '50min')
}
```

## Mock Date

Aditionally, for every route you can add a `mockDate` query parameter (in `YYYY-MM-DD` format). If not provide, all `releaseDates` (of all resources) will be unmangled. However, if provided, the dates will be changed in a specific way. It will return instead different dates such as the difference between the actual date and today is the same as it was if today was equal to the date. So for example, if you provide `mockDate` as the actual current date, nothing happens. If you provide yesterday, every `releaseDate` will be shifted one day to the future, and so on.

## Examples

Using curl and setting up a URL property with the deployed url, you can, for instance:

Get the title of the third series:

```bash
curl -s $URL/series | jq -r '.[2].title'
# > Westworld
```

Get the duration of S01E04 of Westworld:

```bash
curl -s $URL/series/2/seasons/1/episodes | jq -r '.[4].duration'
# > 56min
```

And much more!