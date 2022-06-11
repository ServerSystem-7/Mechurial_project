module.exports = (sequelize, Sequelize) => {

    class Page extends Sequelize.Model {}
  
    Page.init({
        url: {
            type: Sequelize.STRING(768),
            primaryKey: true,
            allowNull: false,
            //validation: {isUrl: true} // 오류로 인한 주석처리
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