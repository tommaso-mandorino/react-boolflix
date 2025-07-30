import { useState, useEffect } from 'react';

const MOVIES_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';

const API_KEY = import.meta.env.VITE_API_KEY;

function SearchMoviesSection() {

    const [moviesSearchInputValue, setMoviesSearchInputValue] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const [initialSearchResults, setInitialSearchResults] = useState(null);
    
    const [moviesSearchResults, setMoviesSearchResults] = useState([]);

    

    useEffect(() => {

        setMoviesSearchResults([]);

        setErrorMessage('');

        if (initialSearchResults) {

            const totalSearchResults = initialSearchResults.total_results;

            if (moviesSearchInputValue === '')
                return setErrorMessage('You must enter something inside search bar.');

            switch (true) {

                case totalSearchResults === 0:
                    return setErrorMessage('There are no results matching your query.');

                case totalSearchResults === 10000:
                    return setErrorMessage(`Your search is too much general and produced more than ${totalSearchResults} results. Please, be more specific to get fewer movies.`);

                case totalSearchResults > 100:
                    return setErrorMessage(`Your search is too much general and produced ${totalSearchResults} results. Please, be more specific to get fewer movies.`);
            
            }

            for (let page = 1; page <= initialSearchResults.total_pages; page++) {

                fetch(MOVIES_SEARCH_URL + '?api_key=' + API_KEY + '&language=it-IT' + '&query=' + moviesSearchInputValue + '&page=' + page)

                    .then(response => {

                        if (!response.ok)
                            throw new Error(`There was an error: server responded with ${response.status} status code.`);

                        return response.json();

                    })

                    .then(searchResults => {
                        
                        setMoviesSearchResults(lastUpdatedValue => [...lastUpdatedValue, ...searchResults.results]);

                    })

                    .catch(error => console.error(error));

            }

        }

    }, [initialSearchResults]);



    const getSearchResultsPageNumber = () => {

        fetch(MOVIES_SEARCH_URL + '?api_key=' + API_KEY + '&language=it-IT' + '&query=' + moviesSearchInputValue)

            .then(response => {

                if (!response.ok)
                    throw new Error(`There was an error in fetching search results pages number: server responded with ${response.status} status code.`);

                return response.json();

            })

            .then(searchResults => {

                setInitialSearchResults(searchResults);
            
            })

            .catch(error => console.error(error));

    }



    return (

        <section>

            <hr />

            <form onSubmit={event => {event.preventDefault(); getSearchResultsPageNumber()}}>

                <label htmlFor="moviesSearchInput">Search:&nbsp;</label>
                <input
                    type="search"
                    name="moviesSearchInput"
                    id="moviesSearchInput"
                    placeholder="search..."
                    value={moviesSearchInputValue}
                    onChange={event => setMoviesSearchInputValue(event.target.value)}
                    required
                />

                <button type="reset" onClick={() => setMoviesSearchInputValue('')}>Clear</button>

                <button type="submit">Search</button>

            </form>

            <hr />

            <div>{errorMessage}</div>

            <section>

                <hr />

                {

                    (moviesSearchResults.length > 0)
                    ?
                        <>

                            <h5>Search results: {moviesSearchResults.length}/{initialSearchResults?.total_results}</h5>
                        
                            <hr />
                        
                        </>
                    :
                        null

                }

                {

                    moviesSearchResults?.map((movie, index) => {

                        return (

                            <section key={`movie-id-${movie.id}`}>

                                <hr />

                                <h6>Result number {index + 1}</h6>

                                <hr />

                                <div>Title: {movie.title}</div>

                                <div>Original title: {movie.original_title}</div>

                                <div>Original language: {movie.original_language}</div>

                                <div>Vote average: {movie.vote_average.toFixed(2)}</div>

                                <hr />

                            </section>

                        )

                    })
                    
                }

            </section>

        </section>

    );

}

export default SearchMoviesSection;