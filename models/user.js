// const { user } = require(".");
 const passportLocalSequelize = require("passport-local-sequelize");
 const passport = require('passport');
 var bcrypt = require('bcryptjs');
 const LocalStrategy = require("passport-local").Strategy;


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

      passwordComparison = (inputPassword, correctPassword) =>{
        let user = this;
        console.log(correctPassword);
        if(inputPassword === correctPassword){
          return 1;
        }

        //return compare(inputPassword, correctPassword); //암호화되어있음 
      }
  };
  User.init(
    {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // mysalt: {
      //   type: Sequelize.STRING
      // }
    },
    {
      hooks: {
        beforeSave: async (user) => {
          /*let hash = await bcrypt.hash(user.password, 50);
          console.log("hash" + hash);
          user.password = hash;
          */
          if (user.userAccount === undefined) {
            try {
              let user = await User.findOne({
                where: {
                  id: id,
                },
              });
              console.log(user);
              user.userAccount= user;
            } catch (err) {
              console.log("err!");
            }
          } else {
            console.log(user.userAccount);
          }
        },
      },
      sequelize,
      modelName: 'userTBL',
      freezeTableName: true,
      timestamps: false,
    }
  );
  // passportLocalSequelize.attachToUser(User,{
  //   usernameField: 'id',
  //   hashField: 'password',
  //   saltField: 'mysalt'
  // });
  return User;
};