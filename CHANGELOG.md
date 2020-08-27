# Changelog

## Version: 2.0.1
### Changes
- Updated dependencies

## Version: 2.0.0
### Removed
- Removed AJV from the bundle (Can be setup manually)
- Removed other unnecessary dependencies
### Changed
- Reduced bundle size from `50kb` gzipped to about `1.7kb` gzipped by removing ajv
### Fixed
- Readme Typo fixes

## Version: 1.3.0
### Added
- Support for Yup Validator
### Changed
- Changed entry file to `main.js` convention
- Move to `webpack` from `rollup` as a bundler

## Version: 1.2.0
### Added
- Support for Async Validator Functions
### Changed
- Moved to `rollup` from `microbundle` as a bundler

## Version: 1.1.0
### Added
- Support for Superstruct Validator
### Fixed
- Handle Empty schema for Ajv

## Version: 1.0.1
### Added
- Support for Closure Schema

## Version: 1.0.0
### Added
- Vuex Mutation Validator
- Custom Validator Engine
- Joi Engine
- Ajv Engine
