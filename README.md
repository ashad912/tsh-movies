# **TSH Movies**

App adds movies to data source record and feeds them by genres and/or duration query strings.

## Setup

#### Run app:

1. Run: **npm install**
2. Run: **npm start**

#### Run tests:

1. Run: **npm install**
2. Run: **npm test**

## Genres definition

Genres available to use in API endpoints. Genres should be used as strings (case insenstive).

- Comedy
- Fantasy
- Crime
- Drama
- Music
- Adventure
- History
- Thriller
- Animation
- Family
- Mystery
- Biography
- Action
- Film-Noir
- Romance
- Sci-Fi
- War
- Western
- Horror
- Musical
- Sport

## API Documentation

Server listens to **localhost**.

### POST - /api/movies

Creates new movie in data source.

Body schema:

```
 {
    title: string,
    year: string,
    runtime: string,
    genres: string[],
    director: string,
    actors?: string,
    plot?: string,
    posterUrl?: string
}
```

- **title** and **director** field has to be up to 255 characters long
- **runtime** field (in minutes) has to have non-negative integer format (ex. 60, 100, 0)
- **genres** should contain at least one valid genre (look at **Genres definition** section)
- schema fields **cannot be empty**
- adding non-schema fields to body is **not allowed**

### GET - /api/movies

Gets movies by **duration** and/or **genres** query strings.

- **duration** (in minutes) query should be valid integer
- **duration** query gets movies in range of +/- 10 minutes runtime of provided **duration** value
- **genres** could be provided as single or multiple query
- **genres** provided as single query is always splitted by comma separator, trimmed and processed as multiple
- **genres** query should contain valid genres (look at **Genres definition** section)

Examples:

- ?duration=100 **gets** [{title: "movie_1", ..., runtime: "91"}, {title: "movie_2", ..., runtime: "108"}]
- ?genres=crime&genres=comedy&genres=Romance **is** ["crime", "comedy", "romance"]
- ?genres=crime, Comedy, romance **is** ["crime", "comedy", "romance"]
