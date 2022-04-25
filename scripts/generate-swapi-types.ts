import fs from "fs";
import path from "path";

import axios from 'axios';
import jsonSchemaToTypescript from 'json-schema-to-typescript';
import {JSONSchema4} from "json-schema";


const icons = {
    check: '\u001b[32m✔\u001b[39m'
};

interface Schema {
    /**
     * The name of the JSON schema file
     */
    name: string;

    /**
     * The schema inside the JSON schema file
     */
    schema: JSONSchema4;
}

class SwapiTypeGenerator {
    /**
     * GitHub repo contents API URL to the SWAPI json schema directory
     */
    private schemaUrl = 'https://api.github.com/repos/Juriy/swapi/contents/resources/schemas';

    /**
     * SWAPI API schema 'title' is incorrect for some schemas and generates duplicated types.
     * We map the file names (which are correct) to the singular names for transformation.
     */
    private fileToTypeNames: Record<string, string> = {
        films: 'Film',
        people: 'People',
        planets: 'Planet',
        species: 'Species',
        starships: 'Starship',
        vehicles: 'Vehicle'
    };


    /**
     * Prepend to the generated file(s).
     */
    private prepend =
        '/**\n' +
        '* This file was automatically generated by `npm run generate-swapi-types`.\n' +
        '* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,\n' +
        '* and run `npm run generate-swapi-types` to regenerate this file.\n' +
        '*/' +
        '\n\n'

    /**
     * Append to the generated file(s).
     */
    private append = '';

    private schemas: Schema[] = [];

    private typeDefs: string[] = [];

    async run() {
        await this.downloadSchemas();
        await this.transformSchemas();
        await this.generateTypes();
        await this.output();

        this.log(`Done ${icons.check}`);
    }

    /**
     * Download all schemas returned by the GitHub repo contents API URL
     */
    async downloadSchemas() {
        // Get download URLs for all JSON schemas
        const schemaFiles = await this.get(this.schemaUrl);

        // Download all schemas
        for(const file of schemaFiles) {
            this.schemas.push({
                name: path.parse(file.name).name,
                schema: await this.get(file.download_url)
            });
        }
    }

    /**
     * Fix SWAPI JSON schema file issues.
     *
     * Note: While I could fork and fix the files, this transformation step
     * should be fine for the purpose of this demo application.
     */
    transformSchemas() {
        for(const schema of this.schemas) {
            // Fix array properties of type 'unknown' to be strongly typed
            for(const prop in schema.schema.properties) {
                if(schema.schema.properties[prop].type === 'array') {
                    Object.defineProperty(schema.schema.properties[prop], 'items', {
                        value: {
                            "type": "string"
                        }
                    });
                }
            }

            // Fix incorrect schema title to generate types with the correct name
            schema.schema.title = this.fileToTypeNames[schema.name];
        }
    }

    private async generateTypes() {
        for(const schema in this.schemas) {
            this.typeDefs.push(await jsonSchemaToTypescript.compile(this.schemas[schema].schema, this.schemas[schema].name, {bannerComment: ""}));
        }
    }

    private async output() {
        const filePath = `./types/swapi.d.ts`;
        const fileContent = `${this.prepend}${this.typeDefs.join("\n")}${this.append}`;

        this.log(`Writing file: ${filePath}`);
        await fs.promises.writeFile(filePath, fileContent);
    }

    private async get(url: string) {
        this.log(`Downloading: ${url}`);
        return await axios.get(url).then(res => res.data);
    }

    /**
     * Basic terminal logging wrapper
     *
     * @param args
     * @private
     */
    private log(...args: any[]) {
        console.log('[generate-swapi-types]', ...args);
    }
}

const generator = new SwapiTypeGenerator();
await generator.run();

export {};