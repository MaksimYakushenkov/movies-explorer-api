const {
  dataMovies = 'mongodb://localhost:27017/moviesdb',
  PORT = 3000,
} = process.env;

module.exports = {
  dataMovies,
  PORT,
};
