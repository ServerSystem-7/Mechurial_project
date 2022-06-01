const { user } = require(".");

module.exports = (sequelize, Sequelize) => {
  const course = require("./course")(sequelize, Sequelize);
  const Subscriber = require("./subscriber")(sequelize, Sequelize);
  class User extends Sequelize.Model {
    static async findByPkAndUpdate(email, params) {
      try {
        let user = await User.findByPk(email);
        if (user) {
          user = await User.update(params, {
            where: {
              email: email,
            },
          });
        }
        return user;
      } catch (err) {
        console.log(err);
      }
    }
    static async findByPkAndRemove(id) {
      try {
        let user = await User.findByPk(email);
        if (user) {
          user = await User.destroy({
            where: {
              email: email,
            },
          });
        }
        return user;
      } catch (err) {
        console.log(err);
      }
    }
    getInfo() {
      return "id: ${this.id} Email: ${this.email}";
    }
  }
  User.init(
    {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subscribedAccount: {
        type: Sequelize.INTEGER,
        references: {
          model: User,
          key: "email",
        },
      },
    },
    {
      hooks: {
        beforeSave: async (user) => {
          if (user.subscribedAccount == undefined) {
            try {
              let subscriber = await Subscriber.findOne({
                where: {
                  id: user.id,
                },
              });
              console.log(subscriber);
              user.subscribedAccount = subscriber;
            } catch (err) {
              console.log("err!");
            }
          } else {
            console.log(user.subscribedAccount);
          }
        },
      },
      sequelize,
      modelName: "user",
    }
  );
  return "user";
};
