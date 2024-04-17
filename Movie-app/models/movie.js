const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    plot: {
        type: String,
        required: true,
    },
    genres: {
        type: [String],
        required: true,
    },
    runtime: {
        type: Number,
        required: true,
    },
    cast: {
        type: [String],
        required: true,
    },
    poster: {
        type: String,
    },
    title: {
        type: String,
        required: true,
        index: true, 
    },
    fullplot: {
        type: String,
        required: true,
    },
    languages: {
        type: [String],
        required: true,
    },
    released: {
        type: Date,
        required: true,
    },
    directors: {
        type: [String],
        required: true,
    },
    rated: {
        type: String,
        default: 'NR',
    },
    awards: {
        wins: {
            type: Number,
            default: 0,
        },
        nominations: {
            type: Number,
            default: 0,
        },
        text: {
            type: String,
            default: '',
        },
    },
    lastupdated: {
        type: Date,
        default: Date.now,
    },
    year: {
        type: Number,
        required: true,
        index: -1, 
    },
    imdb: {
        rating: {
            type: Number,
            default: 0,
        },
        votes: {
            type: Number,
            default: 0,
        },
        id: {
            type: Number,
        },
    },
    countries: {
        type: [String],
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    tomatoes: {
        viewer: {
            rating: {
                type: Number,
                default: 0,
            },
            numReviews: {
                type: Number,
                default: 0,
            },
            meter: {
                type: Number,
                default: 0,
            },
        },
        fresh: {
            type: Number,
            default: 0,
        },
        critic: {
            rating: {
                type: Number,
                default: 0,
            },
            numReviews: {
                type: Number,
                default: 0,
            },
            meter: {
                type: Number,
                default: 0,
            },
        },
        rotten: {
            type: Number,
            default: 0,
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    num_mflix_comments: {
        type: Number,
        default: 0,
    },
});

movieSchema.index({ title: 1 });
movieSchema.index({ year: -1 });
movieSchema.index({ genres: 1 });

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
