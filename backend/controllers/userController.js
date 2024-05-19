const userService = require('../services/userService');

exports.getUserById = async (req, res) => {
    try {
        const user_id = req.data.user.user_id;
        const user = await userService.getUserById(user_id);
        if(!user){
            return res.status(400).json("Unauthorized!");
        }
        return res.status(201).json(user);
    } catch (error) {
        console.log('Server Error: ', error);
        return res.status(400).json(error);
    }
}
