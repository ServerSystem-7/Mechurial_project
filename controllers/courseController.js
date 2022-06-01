const db = require("../models/index"),
    Course = db.course,
    getCourseParams = body => {
        return{
            title: body.title,
            description: body.description,
            maxStudents: body.maxStudents,
            cost: body.cost
        };
    };

module.exports ={
    index: async(req, res, next) =>{
        try{
            let courses = await Course.findAll();
            res.locals.courses = courses;
            next();
        } catch(error){
            console.log('Error fetching courses: ${error.message}');
            next(error);
        };
    },
    indexView: (req, res) => {
        res.render("courses/index");
    },
    new: (req, res) => {
        res.render("courses/new");
    },
    create: async (req, res, next) => {
        let courseParams = getCourseParams(req.body);
        try{
            let course = await Course.create(courseParams);
            res.locals.redirect = "/courses";
            next();
        }catch(error){
            console.log('Error saving course: ${error.message}');
            next(error);
        };
    },
}