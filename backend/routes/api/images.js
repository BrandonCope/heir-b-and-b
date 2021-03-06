const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const { Image } = require('../../db/models')

const imageValidations = require('../../utils/validations/images')

router.get('/', asyncHandler(async (req, res) => {
    const images = await Image.findAll();
    // const spots = await Spot.findAll();
   
    return res.json(images)
}))

router.post('/', imageValidations.validateCreate, asyncHandler(async(req,res) => {
    const image = await Image.create(req.body);
    res.json(image)
}))

module.exports = router;
