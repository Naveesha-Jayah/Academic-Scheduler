const Resource = require("../Model/resourceModel");

const getResource = async (req, res) => {
    try {
        const resources = await Resource.find();
        if (!resources.length) {
            return res.status(404).json({ message: "No data found" });
        }
        return res.status(200).json(resources);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const addResource = async (req, res) => {
    const { roomName, type, computers, projectors, whiteboards, presentationSystem } = req.body;

    try {
        const resourceData = new Resource({ roomName, type, computers, projectors, whiteboards, presentationSystem });
        await resourceData.save();
        return res.status(201).json(resourceData);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getResourceById = async (req, res) => {
    try {
        const resourceData = await Resource.findById(req.params.id);
        if (!resourceData) {
            return res.status(404).json({ message: "No data found" });
        }
        return res.status(200).json(resourceData);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateResource = async (req, res) => {
    try {
        const resourceData = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!resourceData) {
            return res.status(404).json({ message: "No data found" });
        }
        return res.status(200).json(resourceData);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteResource = async (req, res) => {
    try {
        const resourceData = await Resource.findByIdAndDelete(req.params.id);
        if (!resourceData) {
            return res.status(404).json({ message: "No data found" });
        }
        return res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getResource,
    addResource,
    getResourceById,
    updateResource,
    deleteResource
};