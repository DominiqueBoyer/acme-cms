const express = require('express');
const app = express();
const db = require('./db');
const { Page } = db.models;
const path = require('path');

app.get('/api/pages', async (req, res, next )=>{
  Page.findAll()
    .then( page => res.send(page))
    .catch(next)
});


//the req.params.id is not working here


// app.get('/api/pages/:id', async (req, res, next )=>{
//   Page.findPl({ where: {id: req.params.id}})
//     .then( page => res.send(page))
//     .catch(next);
// });
// app.get('/api/pages/:id/children', async (req, res, next )=>{
//   Page.findAll({ where: {parentId: req.params.id}})
//     .then( page => res.send(page))
//     .catch(next);
// });

// app.get('/api/pages/:id/siblings', async (req, res, next )=>{
//   Page.findAll({ where: { parentId: req.params.parentId}}).filter( page => page.id !== req.params.id)
//     .then( page => res.send(page))
//     .catch(next);
// });

db.syncAndSeed()
  .then (()=>{
    app.listen(3000, ()=> console.log('LISTENING'));
  })
