const Sequelize = require('sequelize');
const { UUID, UUIDV4, STRING } = Sequelize

const conn = new Sequelize('postgres://localhost/acme_cms',{logging:false});

const Page = conn.define('page', {
  id:{
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  title:{
    type: STRING,
    unique: true
  }
})

const mapAndSave = (pages)=> Promise.all(pages.map( page => Page.create(page)));

const syncAndSeed = async()=> {
  try {
    await conn.sync({force: false});
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
  }
  catch(err){
    console.log(err);
  }
};

Page.belongsTo(Page, { as: 'parent'});

// Page.findHomePage = async function(){
//   return await Page.findOne({where: {title: 'Home Page'}})
// };

// Page.prototype.findChildren = async function(){
//   return await Page.findAll({where: {parentId: this.id}})
// };

//still working on this method
// Page.prototype.hierarchy = async function(){
//   return await Page.findAll({where: { id: this.parentId}});
// }

syncAndSeed()
  // .then(async()=>{
  //   // const home = await Page.findHomePage();
  //   // // console.log('hello', home.title);
  //   // const homeChildren = await home.findChildren();
  //   // // console.log('home children', homeChildren.map( page => page.title)); //[About, Contact];
  //   // const fax = await Page.findOne({ where: { title: 'Fax'}});
  //   // // console.log('fax', fax.title);
  //   // let hier = await fax.hierarchy();
  //   // // console.log('hierarchy', hier.map( page => page.title)); //['Fax', 'Contact', 'Home']

  // })

module.exports = {
  syncAndSeed,
  models:{
    Page
  }

};
