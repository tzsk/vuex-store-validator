const mix = require('laravel-mix');

mix.js('src/main.js', 'dist/validator.min.js');
mix.sourceMaps();
