const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {

    class User extends Sequelize.Model {
      
      static async findByPkAndUpdate(id, params) {
        try {
          let user = await User.findByPk(id);
          if (user) {
            user = await User.update(params, {
              where: {
                id: id,
              },
            });
          }
          return user;
        } catch (err) {
          console.log(err);
        }
      }
  
      static async findByPkAndRemove(id) {
          let user = await User.findByPk(id);
          if (user) {
            user = await User.destroy({
              where: {
                id: id,
              }
            });
          }
          return user;
        } 

      passwordComparison(inputPassword){
        let user = this;
        return bcrypt.compare(inputPassword, user.password);
      }
  };

    User.init({
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            // TODO: hash password with passport
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {isEmail: true}
        }
    },{
      hooks:{
        beforeSave: async(user) => {
          let hash = await bcrypt.hash(user.password, 10);
          user.password = hash;
        }
      },
        sequelize,
        modelName: 'userTBL',
        freezeTableName: true,
        timestamps: false,
    });

    return User;
}