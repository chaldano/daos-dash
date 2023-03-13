import path from 'path'
import express from 'express';

// import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';
// import config from '../../webpack.dev.app.config.js'

import movieRouter from './sapp/movie/router';
import movieRouter2 from './sapp/tabledb/router';
import matrixRouter from './sapp/route-matrix/router';
import ccmatrixRouter from './sapp/ccmatrix/router';
import sfrRouter from './sapp/sfrclass/router';
import adrRouter from './sapp/adressen/router';
import fwService from './sapp/fwservice/router';

import bodyParser from 'body-parser';

console.log("Server is starting ...");

import morgan2 from 'morgan';
const app = express(),
    DIST_DIR = __dirname,
    HTML_FILE = path.join(DIST_DIR, 'index.html')

// app.use(webpackDevMiddleware(compiler, {
//     publicPath: config.output.publicPath
// }))
// app.use(webpackHotMiddleware(compiler))

app.use(express.static(DIST_DIR))
// app.get('/', (req, res) => { res.sendFile(HTML_FILE) })

// POST method route
// app.post('/adressen', function (req, res) {
//     res.send('POST request to the homepage');
//   });

app.use(morgan2('combined', { immediate: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// app.post('/adressen', (req, res) => {
//     console.log('Got body:', req.body);
//     res.sendStatus(200);
// });
app.use('/movie', movieRouter);
app.use('/tabledb', movieRouter2);
app.use('/route-matrix', matrixRouter);
app.use('/fwservice', fwService);
app.use('/ccmatrix', ccmatrixRouter);
app.use('/sfrclass', sfrRouter);
app.use('/adressen', adrRouter);

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})
