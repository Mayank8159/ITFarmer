const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'components');
const appPath = path.join(__dirname, 'app');

function fixExtraParens(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            fixExtraParens(filePath);
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            let content = fs.readFileSync(filePath, 'utf8');
            const regex = /fetch\(['"`]\/api\/data\/([a-zA-Z0-9_-]+)['"`]\)\)/g;
            if (regex.test(content)) {
                content = content.replace(regex, "fetch('/api/data/$1')");
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Fixed: ${filePath}`);
            }
        }
    }
}

fixExtraParens(directoryPath);
fixExtraParens(appPath);
console.log("Done.");
