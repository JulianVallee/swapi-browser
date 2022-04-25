import path from 'path';
import chokidar from 'chokidar';

// @ts-ignore
// FIXME: TS complains about the extension, but fails to load the file without it.
import imageProcessor from './image-processor.ts';

const watcherInstance = chokidar.watch(imageProcessor.options.input.dir);

watcherInstance
    .on('add', async (filePath, stats) => {
        await imageProcessor.processFile(path.parse(filePath).base);

    })
    .on('change', async (filePath, stats) => {
        await imageProcessor.processFile(path.parse(filePath).base);

    })
    .on('unlink', async (filePath) => {
        await imageProcessor.unlinkDestFile(filePath);

    });

process.on('SIGINT', async () => {
    await watcherInstance.close()
});