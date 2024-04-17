const express = require('express');
const Movie = require('../models/movie');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);



// Get movies with pagination and optional title filter
router.get('/', async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;

        const skip = (currentPage - 1) * perPage;
        const limit = perPage;

        const movies = await Movie.find().skip(skip).limit(limit);
        const totalMovies = await Movie.countDocuments();

        const totalPages = Math.ceil(totalMovies / perPage);

        res.render('list', {
            movies: movies,
            currentPage: currentPage,
            totalPages: totalPages,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve movies: ' + err.message });
    }
});

// Route to render the form for adding a new movie
router.get('/addMovie', (req, res) => {
    res.render('addMovie');
});

// Route to handle form submissions and add a new movie
router.post('/addMovie', async (req, res) => {
    try {
        const movieData = {
            title: req.body.title,
            plot: req.body.plot,
            genres: req.body.genres.split(','),
            runtime: parseFloat(req.body.runtime),
            cast: req.body.cast.split(','),
            languages: req.body.languages.split(','),
            directors: req.body.directors.split(','),
            released: new Date(req.body.released),
            rated: req.body.rated,
            awards: {
                text: req.body.awards,
            },
            imdb: {
                rating: parseFloat(req.body.imdbRating),
            },
            year: parseInt(req.body.year),
            countries: req.body.countries.split(','),
            tomatoes: {
                viewer: {
                    rating: parseFloat(req.body.tomatoesViewerRating),
                },
                critic: {
                    rating: parseFloat(req.body.tomatoesCriticRating),
                },
            },
        };

        // Create a new movie using the provided data
        const newMovie = new Movie(movieData);

        // Save the new movie to the database
        await newMovie.save();

        // Redirect to the list of movies after successfully adding the new movie
        res.redirect('/api/movies');
    } catch (err) {
        console.error('Error adding new movie:', err);
        res.status(500).json({ error: 'Failed to add new movie' });
    }
});




// Route to render the update form with pre-filled movie data
router.get('/UpdateMovie/:id', async (req, res) => {
    try {
        // Get the movie ID from the URL
        const movieId = req.params.id;

        // Find the movie in the database by its ID
        const movie = await Movie.findById(movieId);

        // Check if the movie exists
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Render the update form with the movie data
        res.render('update', {
            _id: movie._id, // Pass the movie ID to the view
            title: movie.title,
            plot: movie.plot,
            genres: movie.genres.join(', '), // Convert array to comma-separated string
            runtime: movie.runtime,
            cast: movie.cast.join(', '), // Convert array to comma-separated string
            languages: movie.languages.join(', '), // Convert array to comma-separated string
            directors: movie.directors.join(', '), // Convert array to comma-separated string
            released: movie.released.toISOString().split('T')[0], // Format date as yyyy-mm-dd
            rated: movie.rated,
            awards: movie.awards ? movie.awards.text : '', // Check if awards exist
            imdbRating: movie.imdb ? movie.imdb.rating : '', // Check if IMDb rating exists
            year: movie.year,
            countries: movie.countries.join(', '), // Convert array to comma-separated string
            tomatoesViewerRating: movie.tomatoes && movie.tomatoes.viewer ? movie.tomatoes.viewer.rating : '',
            tomatoesCriticRating: movie.tomatoes && movie.tomatoes.critic ? movie.tomatoes.critic.rating : ''
        });
    } catch (err) {
        console.error('Error retrieving movie:', err);
        res.status(500).json({ error: 'Failed to retrieve movie data' });
    }
});

// Route to handle form submission and update a movie
router.post('/UpdateMovie/:id', async (req, res) => {
    try {
        const movieId = req.params.id;

        const updatedData = {
            title: req.body.title,
            plot: req.body.plot,
            genres: req.body.genres.split(','),
            runtime: parseFloat(req.body.runtime),
            cast: req.body.cast.split(','),
            languages: req.body.languages.split(','),
            directors: req.body.directors.split(','),
            released: new Date(req.body.released),
            rated: req.body.rated,
            awards: {
                text: req.body.awards,
            },
            imdb: {
                rating: parseFloat(req.body.imdbRating),
            },
            year: parseInt(req.body.year),
            countries: req.body.countries.split(','),
            tomatoes: {
                viewer: {
                    rating: parseFloat(req.body.tomatoesViewerRating),
                },
                critic: {
                    rating: parseFloat(req.body.tomatoesCriticRating),
                },
            },
        };

        // Find the movie and update it with the new data
        const updatedMovie = await Movie.findByIdAndUpdate(movieId, updatedData, { new: true });

        if (!updatedMovie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Redirect to the updated movie's details page
        res.redirect(`/api/movies/${updatedMovie._id}`);
    } catch (err) {
        console.error('Error updating movie:', err);
        res.status(500).json({ error: 'Failed to update movie' });
    }
});

// Delete a movie
router.post('/DeleteMovie/', async (req, res) => {
    try {
        const movieId = req.body.id;
        const deletedMovie = await Movie.findByIdAndDelete(movieId);

        if (!deletedMovie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.redirect('/api/movies');
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete movie: ' + err.message });
    }
});

module.exports = router;
