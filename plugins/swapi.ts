import {defineNuxtPlugin} from "nuxt/app";
import {extractIdFromResourceUri} from '~/modules/swapi-utils';
import {Film, People, Planet} from "~/types/swapi";
import {store} from "~/store";


interface SwapiResponse {
    count: number;
    next: string;
    previous: string;
    results: object[];
}

interface SwapiStore {
    films: Film[];
    peoples: People[];
    planets: Planet[];
}

interface Suggestion {
    value: string;
    displayValue: string;
}

export class Swapi {
    private store: SwapiStore = {
        films: [],
        peoples: [],
        planets: [],
    };

    private setCache(data: SwapiStore) {
        localStorage.setItem('swapi', JSON.stringify(data));

        // TODO: Add cache expiration
        // console.log(`[swapi] Cache set`);

        return data;
    }

    private getCache() {
        const data = localStorage.getItem('swapi');

        // TODO: Verify cache expiration
        // console.log(`[swapi] Cache ${data ? 'hit' : 'miss'}`);

        return data !== null ? JSON.parse(data) : null;
    }

    private async fetchAllPages<T>(url: string) {
        // Fetch current URL
        const res = await $fetch<SwapiResponse>(url);

        // Fetch and merge next page URL
        if(res.next) {
            // Cast back to object array to use the spread operator
            res.results = [
                ...res.results,
                ...(await this.fetchAllPages(res.next) as object[])
            ];
        }

        // Explicit conversion to generic array only
        // works when casting to unknown first
        return (res.results as unknown) as T[];
    }

    async load() {
        this.store = this.getCache() ?? this.setCache({
            peoples: await this.fetchAllPages('https://swapi.dev/api/people'),
            planets: await this.fetchAllPages('https://swapi.dev/api/planets'),
            films: await this.fetchAllPages('https://swapi.dev/api/films'),
        });

        // Global store, not to confuse with the store inside this class
        store.loaded = true;

        return this.store;
    }

    get() {
        return this.store;
    }

    filterPeopleByFilm(filterValue: string) {
        filterValue = filterValue.toLowerCase();

        return this.store.peoples.filter(tile =>
            tile.films.filter(film => {
                const index = extractIdFromResourceUri(film) - 1;
                const title = this.store.films[index].title.toLowerCase();

                return title.includes(filterValue);
            }).length
        );
    }

    getSuggestions(): Suggestion[] {
        return this.store.films.map(film => {
            return {
                value: film.title,
                displayValue: `${film.title} (${film.characters.length})`
            }
        });
    }
}

const $swapi = new Swapi();

export const useSwapi = function () {
    return $swapi;
}

export default defineNuxtPlugin((nuxtApp) => {
    return {
        provide: {
            swapi: $swapi
        }
    }
});