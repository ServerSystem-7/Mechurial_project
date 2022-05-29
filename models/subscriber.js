const { subscriber } = require(".");

module.exports = (sequelize, Sequelize) => {
  const course = require("./course")(sequelize, Sequelize);
  class Subscriber extends Sequelize.Model {
    static async findByPkAndUpdate(email, params) {
      try {
        let subscriber = await Subscriber.findByPk(email);
        if (subscriber) {
          sub = await Subscriber.update(params, {
            where: {
              email: email,
            },
          });
        }
        return subscriber;
      } catch (err) {
        console.log(err);
      }
    }
    static async findByPkAndRemove(id) {
      try {
        let subscriber = await Subscriber.findByPk(email);
        if (subscriber) {
          subscriber = await Subscriber.destroy({
            where: { email: email },
          });
        }
        return subscriber;
      } catch (err) {
        console.log(err);
      }
    }
    getInfo() {
      return "Name: ${this.name} Email: ${this.email}";
    }
  }
  Subscriber.init(
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
    },
    { sequelize, modelName: "subscriber" }
  );
  return Subscriber;
};
