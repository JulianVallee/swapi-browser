# SWAPI Browser

Single Page Application to visualise selected SWAPI resources. 

Written in TypeScript, SCSS and [Nuxt3.0.0-rc.1](https://v3.nuxtjs.org/). 
It also includes a type definition generator for SWAPI resource responses 
to fully leveraging TypeScript support. 🎉

There is a [demo](https://master--sparkly-valkyrie-c4b960.netlify.app/) that automatically updates when a change is pushed to the master branch.

## Features
- Loads persons, planets and films from the API. Everything is cached inside the localstorage,
increasing page load times and reduces traffic sent. (Note: Cache expiration is not implemented yet. Clear localstorage to fetch fresh data on the next page refresh.)
- Star Wars themed responsive UI with animations, advanced control shortcuts and an app-like look-and-feel.
- Enhances the API data with a few manually collected images. These images should normally not be stored within a repository, but for the purposes of this project it doesn't really matter.
- Generate TypeScript definitions from SWAPI schema files using `npm run generate-swapi-types`.

## Setup

Make sure to install the dependencies:

```bash
npm install
```

## Development Environment

Start the development server on http://localhost:3000

```bash
npm run dev
```

Generate SWAPI typescript interfaces from their JSON schema. 
The definition file will be saved in the `/types` directory.  

```bash
npm run generate-swapi-types
```

## Production

Build the application for production:

```bash
npm run generate
```

Locally preview production build:

```bash
npm run preview
```

## Todo
- Add tests
- Optimise images (.webp format, reduce dimensions and check compression)
- Replace DIY store with Pinia and expand usage to clean up code
- Refactor (CSS is partly BEM, but not 100% committed; Not *all* mixins/variables are where they belong)