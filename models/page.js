module.exports = (sequelize, Sequelize) => {
  class Page extends Sequelize.Model {}

  Page.init({
      url: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
          validation: {isUrl: true}
      },
  },{
      sequelize,
      modelName: 'pageTBL',
      freezeTableName: true,
      timestamps: false,
  });
  return Page;
}