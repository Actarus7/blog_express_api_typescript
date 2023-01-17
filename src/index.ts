// imports
import * as express from 'express';
import {articlesRouter} from './routes/articlesRouter'
import { usersRouter } from './routes/usersRouter';

// Express server creation
const app = express();
const port = 8000 /* process.env.PORT || */;

// for parsing application/json
app.use(express.json());

// Add headers before the routes are defined
app.use((req, res, next) => {
    res.setHeader('authorization', '');
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Pass to next layer of middleware
    next();
});

// Routes
app.use('/api/articles', articlesRouter);
app.use('/api/users', usersRouter);
app.use('/*', (req, res) => {
    res.status(404).json({
        status: 'FAIL',
        message: "Ce nom de domaine n'existe pas",
        data: null
    })
})

// Bind express server on port 8000
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
