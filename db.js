const Sequelize = require('sequelize');
const { UUID, UUIDV4, STRING } = Sequelize

const conn = new Sequelize('postgres://localhost/acme_cms');

const Page = conn.define('page', {
  id:{
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  title:{
    type: STRING,
    unique: true,
    notNull: true,
    notEmpty: true
  }
})

const mapAndSave = (pages)=> Promise.all(pages.map( page => Page.create(page)));

const syncAndSeed = async()=> {
  await conn.sync({force: true});
  const home = await Page.create({title: 'Home Page'});
  let pages = [
    { title: 'About', parentId: home.id },
    { title: 'Contact', parentId: home.id }
  ];
  const [ about, contact ] = await mapAndSave(pages);

  pages = [
    { title: 'About our Team', parentId: about.id },
    { title: 'About our History', parentId: about.id },
    { title: 'Phone', parentId: contact.id },
    { title: 'Fax', parentId: contact.id }
  ];
  const [ team, history, phone, fax ] = await mapAndSave(pages);

};

Page.belongsTo(Page, { as: 'parent'});

Page.findHomePage = async function(){
  return await Page.findOne({where: {title: 'Home Page'}})
};

Page.prototype.findChildren = async function(){
  return await Page.findAll({where: {parentId: this.id}})
};

syncAndSeed()
  .then(async()=>{
    const home = await Page.findHomePage();
    console.log('hello', home.title);
    const homeChildren = await home.findChildren();
    console.log(homeChildren.map( page => page.title)); //[About, Contact]
  })

module.exports = {
  syncAndSeed,
  models:{
    Page
  }

};
