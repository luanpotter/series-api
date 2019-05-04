# API Specification

This is the specification for the API. The following routes are available:

```
GET /series -> List<Series> : list all available series
GET /series/:id -> Series : show details about a single series
GET /series/:id/seasons -> List<Season> : list all seasons of a given series (known so far, both released and announced)
GET /series/:id/seasons/:id -> Season : show details about a specific season
GET /series/:id/seasons/:id/episodes -> List<Episode> : list all episodes of a given season
GET /series/:id/seasons/:id/episodes/:id -> Episode : show details of a specific episode
```

```
Series: {
    id: [string] the id of this REST resource; it's equal to the title property
    imdbId: [string] the IMDB id of this series
    displayName: [string] the name of this series
    numberOfSeasons: [integer] the number of seasons of this series
    releaseDate: [string] the release date (of the first episode of first season) of this season, in the format YYYY-MM-DD
}
```

```
Season: {
    id: [string] the id of this REST resource; it's the sequential number of the season as well
    releaseDate: [string] the release date (of the first episode) of this season, in the format YYYY-MM-DD
    numberOfEpisodes: [integer] the number of episodes of this season
}
```

```
Episode: {
    id: [string] the id of this REST resource; it's the sequential number of the episode within the season as well
    imdbId: [string] the IMDB id of this specific episode within the series
    title: [string] the title of this episode
    releaseDate: [string] the release date of this episode, in the format YYYY-MM-DD
    duration: [string] the duration of this episode, in human readable format (e.g., '2h 20min' or '50min')
}
```
