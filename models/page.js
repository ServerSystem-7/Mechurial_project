module.exports = (sequelize, Sequelize) => {

    class pageTBL extends Sequelize.Model {
        static associate(db){
            db.pageTBL.hasMany(db.pageTBL,{
                foreignKey:'pageUrl',
                targetKey:'url',
                onDelete:'cascade'
            });
        }
    }
  
    pageTBL.init({
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
    
    return pageTBL;
  }