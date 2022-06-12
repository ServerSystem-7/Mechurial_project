module.exports = (sequelize, Sequelize) => {

    class Page extends Sequelize.Model {
        static associate(db){
            db.Page.hasMany(db.Page,{
                foreignKey:'pageUrl',
                targetKey:'url',
                onDelete:'cascade'
            });
        }
    }
  
    Page.init({
        url: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
            validation: {isUrl: true}
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