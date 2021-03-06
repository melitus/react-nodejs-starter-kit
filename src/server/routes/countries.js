
import { Router } from 'express';


// import halson from 'halson';
import dbConnect from '../../../persistence/mysql';
import schema from '../models/countries';
import errorMessages from '../utils/error.messages';

const db = schema(dbConnect())();

// get an instance of the express Router, allowing us to add
// middleware and register our API routes as needed
const countriesrouter = new Router();

countriesrouter.post('/countries', async (req, res) => {
  let result;
  let responseResult;
  try {
    result = await db.countries.create(req.query);
    if (result) {
      responseResult = {
        status: 'Success',
        data: result,
        message: 'Successfully inserted one countries',
      };
      res.status(201).send(responseResult);
    } else {
      res.status(401).send('Unable to add record. Please try again');
    }
  } catch (e) {
    res.status(404).send(errorMessages.USER_NOT_FOUND);
  }
});

countriesrouter.get('/countries', async (req, res) => {
  let result;
  try {
    result = await db.countries.findAll();
  } catch (e) {
    res.status(404).send(errorMessages.USER_NOT_FOUND);
  }
  res.status(200).json({
    status: 'success',
    data: result,
    message: 'Retrieved ALL countries'
  });
});


countriesrouter.get('/countries/:id', async (req, res) => {
  let result;
  try {
    result = await db.countries.find({ id: req.params.id });
    if (result) {
      res.status(200)
              .json({
                status: 'success',
                data: result,
                message: 'Retrieved ONE country'
              });
    } else {
      res.status(404).send('ID does not exist');
    }
  } catch (e) {
    // catches error in result
    res.status(404).send(errorMessages.USER_NOT_FOUND);
  }
});

countriesrouter.put('/countries/:id', async (req, res) => {
  let result;
  try {
    result = await db.countries.upsert(req.query, { id: req.params.id });
    if (result) {
      res.status(200).send('succesfully updated');
    } else { res.status(404).send('ID does not exist'); }
  } catch (e) {
    res.status(404).send(errorMessages.USER_NOT_FOUND);
  }
  res.status(200).json(result);
});

countriesrouter.delete('/countries', async (req, res) => {
  let result;
  try {
    result = await db.countries.removeAll();
  } catch (e) {
    res.status(404).send(errorMessages.USER_NOT_FOUND);
  }
  res.status(200)
        .json({
          status: 'success',
          data: result,
          message: 'Removed  countries'
        });
});

countriesrouter.delete('/countries/:id', async (req, res) => {
  let result;
  try {
    result = await db.countries.remove({ id: req.params.id });
  } catch (e) {
    res.status(404).send(errorMessages.USER_NOT_FOUND);
  }
  res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} country`
        });
});

export default countriesrouter;
