import { useState } from 'react';

const MOVIES_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';

const API_KEY = import.meta.env.VITE_API_KEY;

function SearchMoviesSection() {

    const [moviesSearchInputValue, setMoviesSearchInputValue] = useState('');

    const [moviesSearchResults, setMoviesSearchResults] = useState({});

    const searchMovies = query => {

        fetch(MOVIES_SEARCH_URL + '?api_key=' + API_KEY + '&language=it-IT' + '&query=' + query)

            .then(response => {

                if (!response.ok)
                    throw new Error(`There was an error: server responded with ${response.status} status code.`);

                return response.json();

            })

            .then(searchResults => setMoviesSearchResults(searchResults))

            .catch(error => console.error(error));

    }

    return (

        <section>

            <form onSubmit={event => {event.preventDefault(); searchMovies(moviesSearchInputValue)}}>

                <input
                    type="search"
                    name="moviesSearchInput"
                    id="moviesSearchInput"
                    value={moviesSearchInputValue}
                    onChange={event => setMoviesSearchInputValue(event.target.value)}
                />

                <button type="submit">Search</button>

            </form>

            <div>

                {

                    moviesSearchResults?.results?.map(movie => {

                        return (

                            <section key={`movie-id-${movie.id}`}>

                                <hr />

                                <div>Title: {movie.title}</div>

                                <div>Original title: {movie.original_title}</div>

                                <div>Original language: {movie.original_language}</div>
                                
                                <div>Vote average: {movie.vote_average}</div>

                                <hr />

                            </section>

                        )

                    })
                }

            </div>

        </section>

    );

}

export default SearchMoviesSection;