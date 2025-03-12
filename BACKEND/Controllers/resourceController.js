const resource = require("../Model/resourceModel")

const getResource = async (req, res , next) => {
    let resourceData;
    try{
        resourceData = await resource.find();
    } catch (error) {
        console.log(error);
    }

    if (!resourceData) {
        return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(resourceData);
};

const addResource = async (req, res , next) => {
    const {resourceName} = req.body;
    let resourceData;
    try{
        resourceData = new resource({resourceName});
        await resourceData.save();
    } catch (error) {
        console.log(error);
    }

    if (!resourceData) {
        return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(resourceData);
};

const getResourceById = async (req, res, next) => {
    const resourceId = req.params.id;
    let resourceData;
    try{
        resourceData = await resource.findById(resourceId);
    } catch (error) {
        console.log(error);
    }    

    if (!resourceData) {
        return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(resourceData);
};

const updateResource = async (req, res, next) => {
    const resourceId = req.params.id;
    const {resourceName} = req.body;
    let resourceData;
    try{
        resourceData = await resource.findByIdAndUpdate(resourceId, {resourceName});
        resourceData = await resourceData.save(); 
    } catch (error) {
        console.log(error);
    }

    if (!resourceData) {
        return res.status(404).json({ message: "No data found" });
    } else {
        return res.status(200).json(resourceData);
    }
};

const deleteResource = async (req, res, next) => {
    const resourceId = req.params.id;
    let resourceData;
    try{
        resourceData = await resource.findByIdAndDelete(resourceId);
    } catch (error) {
        console.log(error);
    }

    if (!resourceData) {    
        return res.status(404).json({ message: "No data found" });
    } else {
        return res.status(200).json(resourceData);
    }
};



exports.getResource = getResource;
exports.addResource = addResource;
exports.getResourceById = getResourceById;
exports.updateResource = updateResource;
exports.deleteResource = deleteResource;