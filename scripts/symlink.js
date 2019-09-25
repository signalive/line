const fs = require('fs');
const path = require('path');

const basedir = path.join(__dirname, '..');
const isWindows = process.platform == 'win32';

const filePaths = [
    './dist/client-node.js',
    './src/client/client-node.d.ts',
    './dist/client-web.js',
    './src/client/client-web.d.ts',
    './dist/server.js'
];

function handleFile(filePath) {
    const from = path.join(basedir, filePath);
    const filename = path.basename(from);
    const to = path.join(basedir, filename);

    try {
        fs.statSync(to);

        if (!isWindows) {
            return;
        }

        fs.unlinkSync(to);
    } catch (err) {
        if (err.code != 'ENOENT') {
            throw err;
        }
    }

    if (isWindows) {
        // fs.copyFileSync(from, to); // fs.copyFileSync is only available >= v8.5.0
        fs.writeFileSync(to, fs.readFileSync(from));
    } else {
        fs.symlinkSync(from, to);
    }
}

try {
    filePaths.forEach(handleFile);
} catch (err) {
    console.error('Failed to link files due to', err);
    process.exit(-1);
}
