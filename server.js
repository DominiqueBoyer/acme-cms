const express = require('express');
const app = express();
const db = require('./db');
const { Page } = db.models;

app.get('/api/pages', async (req, res, next )=>{
  Page.findAll()
    .then( page => res.send(page))
    .catch(next);
});


app.get('/api/pages/:id/children', async (req, res, next )=>{
  Page.findAll({ where: {parentId: req.params.id}})
    .then( pages => res.send(pages))
    .catch(next);
});


app.get('/api/pages/:id/siblings', async (req, res, next )=>{
  console.log(req.params)
  Page.findByPk( req.params.id )
    .then(page => Page.findAll({where: {parentId: page.parentId}}))
    .then( pages => res.send(pages))
    .catch(next);
});

db.syncAndSeed()
  .then (()=>{
    app.listen(3000, ()=> console.log('LISTENING'));
  })
