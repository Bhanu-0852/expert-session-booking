const Expert = require('../models/Expert');

exports.getExperts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        if (category && category !== 'All') query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        const experts = await Expert.find(query);
        res.status(200).json({ experts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getExpertById = async (req, res) => {
    try {
        const expert = await Expert.findById(req.params.id);
        res.status(200).json(expert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};