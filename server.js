import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res, next) => {
    if (req.accepts('html')) {
        res.sendFile(
            path.join(__dirname, 'dist', 'index.html'),
            { headers: { 'Content-Type': 'text/html' } }
        );
    } else {
        next();
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
