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
            console.log("입력한 pw "+inputPassword);
            console.log("db의pw "+correctPassword);
        
            return 1;
          }else return 0;
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
        sequelize,
        modelName: 'userTBL',
        freezeTableName: true,
        timestamps: false,
    });

    return User;
}