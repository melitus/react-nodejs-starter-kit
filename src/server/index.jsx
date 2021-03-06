
import express from 'express';
import exphbs from 'express-handlebars';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import compression from 'compression';
import path from 'path';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import bodyParser from 'body-parser';

import countriesrouter from './routes/countries';
import statesrouter from './routes/states';
import lgarouter from './routes/local_government';
import addressrouter from './routes/address';
import georouter from './routes/geocoordinates';
import companiesrouter from './routes/companies';

import template from './views/template.handlebars';
import App from '../client/components/App';
import rootReducers from '../client/redux/rootReducers';

// Initialize http server
const app = express();

// Include static assets and compress the file before sending to client
app.use(compression())
.use(express.static(path.join(__dirname, '../..', 'build')));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// create redux store
const store = createStore(rootReducers);

// Read the environement variable to initializate the process
const PORT = process.env.PORT || 4003;

// set up View templates and  engine
app.engine('handlebars', exphbs({ defaultLayout: 'template' }));
app.set('view engine', 'handlebars');

// // Register our route
// redirecting all calls to /api/* to api router :
app.use('/api/v1', companiesrouter);
app.use('/api/v1', georouter);
app.use('/api/v1', addressrouter);
app.use('/api/v1/', lgarouter);
app.use('/api/v1/', statesrouter);
app.use('/api/v1', countriesrouter);

// Routes
app.get('/', (req, res) => {
  const htmlString = ReactDOMServer.renderToString(
    <Provider store={store}>
      <App store={store} />
    </Provider>
        );
  res.send(template({
    body: htmlString,
    title: 'Craft Turf Academy - SchoolApp'
  }));
});

// start the server
app.listen(PORT);
console.log('Server is Up and Running at Port : ', PORT);
