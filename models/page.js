module.exports = (sequelize, Sequelize) => {

    class Page extends Sequelize.Model {
        static associate(db){
            db.Page.hasMany(db.Page,{
                foreignKey:'pageUrl',
                targetKey:'url',
                onDelete:'cascade'
            });
        }
        static async findByPkAndUpdate(url, params){
            try{
                let page = await page.findByPk(url);
                if(page){
                    page = await Page.update(params, {
                        where: {url: url}
                    });
                }
                return page;
            }catch(err){
                console.log(err);
            }
        }
        static async findByPkAndRemove(url){
            try{
                let page = await Page.findByPk(url);
                if(page){
                    page = await Page.destroy({
                        where:{url: url}
                    });
                }
                return page; 
            }catch(err){
                console.log(err);
            }
        }
    }
  
    Page.init({
        url: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
            // validation: {isUrl: true}
        },
    },{
        // TODO: hook?? (to create only if new url)
        sequelize,
        modelName: 'pageTBL',
        freezeTableName: true,
        timestamps: false,
    });
    
    return Page;
  }