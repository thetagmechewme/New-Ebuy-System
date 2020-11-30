const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');
const slugify = require('slugify');
const Product = require('../models/product.model');

exports.categoryCreate = async (req, res) => {
    try{
        const {name} = req.body;
        const category = await new Category({name, slug: slugify(name)}).save();
        res.json(category);
    } catch (err){
        res.status(400).json({Error: 'Create category failed!'});
    }
};

exports.categoryRead = async ( req, res ) => {
    let category = await Category.findOne({slug: req.params.slug}).exec();
    //res.json(category);
    const products = await Product.find({ category })
        .populate('category')
        .exec();

    res.json({
        category,
        products,
    })
};

exports.categoryUpdate = async ( req, res ) => {
    const {name} = req.body;
    try{
        const updated = await Category.findOneAndUpdate(
            {slug: req.params.slug},
            {name, slug: slugify(name)},
            {new: true}
            );
        res.json(updated);
    } catch (err){
        console.log('Err: ', err);
        res.status(400).json({Error: 'Update category failed!'});
    }
};

exports.categoryRemove = async ( req, res ) => {
    try{
        const deleted = await Category.findOneAndDelete({slug: req.params.slug}).exec();
        res.json(deleted);
    } catch(err) {
        res.status(400).json({Error: 'Delete category failed!'});
    }
}

exports.categoryList = async ( req, res ) => {
    const category = await Category.find({}).sort({createdAt: -1}).exec();
    res.json(category);
};
exports.getSubcategories = async (req, res) => {
    Subcategory.find({ parent: req.params._id }).exec((err, subcategories) => {
        if (err) console.log(err);
        res.json(subcategories);
    });
};
