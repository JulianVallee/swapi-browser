import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const options = {
    input: {
        dir: 'public/images/people/src'
    },
    output: {
        dir: 'public/images/people',
        size: 400,
        extension: 'webp'
    }
};

export const processFile = async (filePath: string) => {
    // Prepare paths
    const parsedPath = path.parse(filePath);
    const inputPath = `${options.input.dir}/${parsedPath.base}`;
    const outputPath = `${options.output.dir}/${parsedPath.name}.${options.output.extension}`;

    // Load image
    const file = await fs.promises.readFile(`${inputPath}`);

    // Create sharp file instance
    const image = sharp(file);

    // Get meta data for resizing
    const metaData = await image.metadata();

    // Define final squared size
    if (metaData.width && metaData.height) {
        await image
            // Shrink image
            .trim()
            .resize(options.output.size, options.output.size, {fit: 'inside'})

            // Save image
            .toFile(outputPath, (err, info) => {
                if (err) {
                    console.log(err);
                }

                console.log(`Generated: ${outputPath}`);
            });
    }
}

export const processFileAll = async () => {
    let fileCounter = 0;

    const files = await fs.promises.readdir(options.input.dir, {withFileTypes: true})

    for(const fileInfo of files) {
        if(!fileInfo.isFile()) {
            return;
        }

        await processFile(fileInfo.name);
        fileCounter++;
    }
};

export const unlinkDestFile = async (filePath: string) => {
    const outputPath = `${options.output.dir}/${path.parse(filePath).name}.${options.output.extension}`;

    try {
        await fs.promises.unlink(outputPath);
        console.log(`Deleted: ${outputPath}`);

    } catch(e) {
        console.log(`Already deleted: ${outputPath}`);

    }
}

export const test = () => {
    console.log("WORKS");
}

export default {
    options,
    processFile,
    processFileAll,
    unlinkDestFile,
    test
}