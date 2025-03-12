const course = require("../Model/courseModel")
const getCourse = async (req, res , next) => {

    let courseData;
    try{
        courseData = await course.find();
    }catch (error){
        console.log(error);
    }
    if(!courseData){
        return res.status(404).json({message: "No data found"});
    }
    return res.status(200).json(courseData);
};

const addCourse = async (req, res , next) =>{
    const{year, semester, moduleCode,moduleName}= req.body;
    let courseData;
    try{
        courseData=new course({year,semester,moduleCode,moduleName});
        await courseData.save();
    }catch (error){
        console.log(error);
    }

    if(!courseData){
        return res.status(404).json({message:"No data found"});
    }

    return res.status(200).json(courseData);
};

const getCourseById = async (req, res, next) => {
    const courseId = req.params.id;
    let courseData;
    try {
        courseData = await course.findById(courseId);
    } catch (error) {
        console.log(error);
    }

    if (!courseData) {
        return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(courseData);
};

const updateCourse = async (req, res, next) => {
    const courseId = req.params.id;
    const {year,semester,moduleCode,moduleName} = req.body;
    let courseData;
    try{
        courseData = await course.findByIdAndUpdate(courseId, {year,semester,moduleCode,moduleName});
        courseData = await courseData.save(); 
    } catch (error) {
        console.log(error);
    }

    if (!courseData) {
        return res.status(404).json({ message: "No data found" });
    } else {
        return res.status(200).json(courseData);
    }
};
const deleteCourse = async (req, res, next) => {
    const courseId = req.params.id;
    let courseData;
    try{
        courseData = await course.findByIdAndDelete(courseId);
    } catch (error) {
        console.log(error);
    }

    if (!courseData) {
        return res.status(404).json({ message: "No data found" });
    } else {
        return res.status(200).json(courseData);
    }
};




exports.getCourse=getCourse;
exports.addCourse=addCourse;
exports.getCourseById=getCourseById;
exports.updateCourse=updateCourse;
exports.deleteCourse=deleteCourse;

