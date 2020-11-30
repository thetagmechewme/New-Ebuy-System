const Subcategory = require ('../models/subcategory.model');
const slugify = require('slugify');
const Product = require('../models/product.model');

exports.subCategoryCreate =async (req, res) => {
    try {
        const { name, parent } = req.body;
        res.json(await new Subcategory({ name, parent, slug: slugify(name) }).save());
    } catch (err) {
        // console.log(err);
        res.status(400).send("Create sub failed");
    }
};

exports.subCategoryList = async (req, res) => {
    res.json(await Subcategory.find({}).sort({ createdAt: -1 }).exec());
};

exports.subCategoryRead = async ( req, res) => {
    let subCat = await Subcategory.findOne({ slug: req.params.slug }).exec();
    //res.json(subCat);
    const products = await Product.find({ subcategory: subCat })
        .populate('category')
        .exec();
    res.json({
        subCat,
        products,
    });
};

exports.subCategoryUpdate = async (req, res) => {
    const { name } = req.body;
    try {
        const updated = await Subcategory.findOneAndUpdate(
            { slug: req.params.slug },
            { name, slug: slugify(name) },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).send("Subcategory update failed");
    }
};

exports.subCategoryRemove = async (req, res) => {
    try {
        const deleted = await Subcategory.findOneAndDelete({ slug: req.params.slug });
        res.json(deleted);
    } catch (err) {
        res.status(400).send("Subcategory delete failed");
    }
};
