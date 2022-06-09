const { enroll, usertbl } = require(".");

// models/enroll.js 등록 부분
module.exports = (sequelize, Sequelize) => {
    // const Page = require("./page.js")(sequelize, Sequelize)
    // const User = require("./user.js")(sequelize, Sequelize)
    class Enroll extends Sequelize.Model{
        static async findByPkAndUpdate(id, params){
        try{
            let enroll = await Enroll.findByPk(id);
            if(enroll){
                enroll = await Enroll.update(params, {
                    where: {regNumber: id}
                });
            }
            return enroll;
        }catch(err){
            console.log(err);
        }
        }
        static async findByPkAndRemove(id){
            try{
                let enroll = await Enroll.findByPk(id);
                if(enroll){
                    enroll = await Enroll.destroy({
                        where:{regNumber: id}
                    });
                }
                return enroll; 
            }catch(err){
                console.log(err);
            }
        }
    getInfo(){
        return `url: ${this.url} key1: ${this.key1} key2: ${this.key2} key3: ${this.key3} condition: ${this.condition} name: ${this.name} deadline: ${this.deadline}`;
    }
    };
    Enroll.init({
        regNumber: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false,
            validation: {isUrl: true}
        },
        key1: {
            type: Sequelize.STRING,
            allowNull: false
        },
        key2: {
            type: Sequelize.STRING
        },
        key3: {
            type: Sequelize.STRING
        },
        notifyLogic: {
            type: Sequelize.STRING,
            allowNull: false,
            isIn: [['and', 'or']]
        },
        siteName: {
            type: Sequelize.STRING
        },
        dueDate: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            isDate: true, 
        },
        dueTime: {
            type: Sequelize.STRING,  // TODO: type 수정해야함!
            allowNull: false
        },
        // userId: {
        //     type: Sequelize.STRING,
        //     references: {
        //         model: User,
        //         key: 'id'
        //     }
        // },
        // pageUrl: {
        //     type: Sequelize.STRING,
        //     references: {
        //         model: Page,
        //         key: 'url'
        //     }
        // }
        userId : {
            type:Sequelize.STRING,
            references:usertbl,
            referencesKey:'id'
        }
    },{
        sequelize,
        modelName: 'enrollTBL',
        freezeTableName: true,
        timestamps: false,
    });

    
    return Enroll;
};