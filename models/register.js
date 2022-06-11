module.exports = (sequelize, Sequelize) => {

    const Page = require("./page.js")(sequelize, Sequelize)
    const User = require("./user.js")(sequelize, Sequelize)

    class Register extends Sequelize.Model{
        static async findByPkAndUpdate(id, params){
            try{
                let register = await Register.findByPk(id);
                if(register){
                    register = await Register.update(params, {
                        where: {registerId: id}
                    });
                }
                return register;
            }catch(err){
                console.log(err);
            }
        }
        static async findByPkAndRemove(id){
            try{
                let register = await Register.findByPk(id);
                if(register){
                    register = await Register.destroy({
                        where:{registerId: id}
                    });
                }
                return register; 
            }catch(err){
                console.log(err);
            }
        }
        static async getDateFromToday(from_today = 0) {
                let date = new Date();
                date.setDate(date.getDate() + from_today);
                let dd = String(date.getDate()).padStart(2, '0');
                let mm = String(date.getMonth() + 1).padStart(2, '0');  // January is 0
                let yyyy = date.getFullYear();
                return `${yyyy}-${mm}-${dd}`
        }
        getInfo(){
            return `url: ${this.url} key1: ${this.key1} key2: ${this.key2} key3: ${this.key3} condition: ${this.condition} name: ${this.name} deadline: ${this.deadline}`;
        }
    };

    Register.init({
        registerId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        key1: {
            type: Sequelize.STRING,
            allowNull: false
        },
        key2: {
            type: Sequelize.STRING,
        },
        key3: {
            type: Sequelize.STRING,
        },
        notifyLogic: {
            type: Sequelize.STRING,
            allowNull: false,
            // validate: {isIn: [['and', 'or']]}
        },
        siteName: {
            type: Sequelize.STRING
        },
        dueDate: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            isDate: true,
            // validate: {isAfter: Register.getDateFromToday(-1)}  // yesterday
        },
        userId: {
            type: Sequelize.STRING,
            references: {
                model: User,
                key: 'id'
            }
        },
        pageUrl: {
            type: Sequelize.STRING,
            allowNull: false,
            //validate: {isUrl: true},
            references: {
                model: Page,
                key: 'url'
            }
        }

    },{
        sequelize,
        modelName: 'registerTBL',
        freezeTableName: true,
        timestamps: false,
    });
    
    return Register;
};