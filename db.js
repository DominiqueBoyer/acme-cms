const Sequelize = require('sequelize');

const conn = new Sequelize('postgress://localhost/acme_cms');



const mapAndSave = (pages)=> Promise.all(pages.map(page => PageTransitionEvent.create(page)));

const syncAndSeed = async()=> {
  await conn.sync({force: true})
}

module.exports = {
  syncAndSeed,

}
