const Product = require('../models/product.model');
const slugify = require('slugify');
const User = require('../models/user.model');

exports.createProduct = async (req, res) => {
    try{
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    } catch (err){
        console.log(err);
        //res.status(400).send('Create product failed');
        res.status(400).json({
            err: err.message,
        });
    }
};

exports.listAllProducts = async (req, res) => {
    let products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate('category')
        .populate('subcategory')
        .sort([['createdAt', 'desc']])
        .exec();
    res.json(products);
};

exports.removeProduct = async ( req, res ) => {
    try{
        const deleted = await Product.findOneAndRemove({
            slug: req.params.slug,
        }).exec();
        res.json(deleted);
    } catch(err){
        console.log(err);
        return res.status(400).send('Product deleted failed');
    }
};

exports.readProduct = async (req, res) => {
    const product = await Product.findOne({slug: req.params.slug})
        .populate('category')
        .populate('subcategory')
        .exec()
    res.json(product);
};

exports.updateProduct = async (req, res) => {
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const updated = await Product.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true }
        ).exec();
        res.json(updated);
    } catch(err){
        console.log('PRODUCT UPDATED ERROR: ', err);
        res.status(400).json({
            err: err.message,
        });
    }
};

//Without Pagination
/*exports.listProduct = async (req, res) => {
    try {
        const { sort, order, limit } = req.body;
        const products = await Product.find({})
            .populate('category')
            .populate('subcategory')
            .sort([[sort, order]])
            .limit(limit)
            .exec();
        res.json(products);
    } catch(err){
        console.log(err);
    }
};*/

//With Pagination
exports.listProducts = async (req, res) => {
    try {
        const { sort, order, page } = req.body;
        const currentPage = page || 1;
        const perPage = 3;

        const products = await Product.find({})
            .skip((currentPage -1) * perPage)
            .populate('category')
            .populate('subcategory')
            .sort([[sort, order]])
            .limit(perPage)
            .exec();
        res.json(products)
    } catch(err){
        console.log(err);
    }
};

exports.productCount = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec();
    res.json(total);
};

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;

    // who is updating?
    // check if currently logged in user have already added rating to this product?
    let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
    );

    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(
            product._id,
            {
                $push: { ratings: { star, postedBy: user._id } },
            },
            { new: true }
        ).exec();
        console.log('ratingAdded', ratingAdded);
        res.json(ratingAdded);
    } else {
        // if user have already left rating, update it
        const ratingUpdated = await Product.updateOne(
            {
                ratings: { $elemMatch: existingRatingObject },
            },
            { $set: { 'ratings.$.star': star } },
            { new: true }
        ).exec();
        console.log('ratingUpdated', ratingUpdated);
        res.json(ratingUpdated);
    }
};

exports.listRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();

    const related = await Product.find({
        _id: { $ne: product._id },
        category: product.category,
    })
        .limit(3)
        .populate('category')
        .populate('subcategory')
        .populate('postedBy')
        .exec();

    res.json(related);
};


//Search Filter
const handleQuery = async (req, res, query) => {
    const products = await Product.find({ $text: { $search: query } })
        .populate('category', '_id name')
        .populate('subcategory', '_id name')
        .populate('postedBy', '_id name')
        .exec();

    res.json(products);
};

const handlePrice = async (req, res, price) => {
  try {
      let products = await Product.find({
          price: {
              $gte: price[0],
              $lte: price[1],
          },
      })
          .populate('category', '_id name')
          .populate('subcategory', '_id name')
          .populate('postedBy', '_id name')
          .exec();
      res.json(products);
  } catch (err) {
      console.log(err);
  }
};

const handleCategory = async (req, res, category) => {
    try {
        let products = await Product.find({ category })
            .populate('category', '_id name')
            .populate('subcategory', '_id name')
            .populate('postedBy', '_id name')
            .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
};

const handleStar = (req, res, stars) => {
    Product.aggregate([
        {
            $project: {
                document: '$$ROOT',
                title: '$title',
                floorAverage: {
                    $floor: { $avg: '$ratings.star' },
                },
            },
        },
        { $match: { floorAverage: stars } },
    ])
        .limit(12)
        .exec((err, aggregates) => {
            if(err) console.log('AGGREGATE ERROR: ', err);
            Product.find({ _id: aggregates })
                .populate('category', '_id name')
                .populate('subcategory', '_id name')
                .populate('postedBy', '_id name')
                .exec((err, products) => {
                    if (err) console.log('PRODUCT AGGREGATE ERROR: ',err);
                    res.json(products);
                });
        });
};

const handleSubcategory = async (req, res, subcategory) => {
    const products = await Product.find({ subcategory: subcategory })
        .populate('category', '_id name')
        .populate('subcategory', '_id name')
        .populate('postedBy', '_id name')
        .exec();

    res.json(products);
};

const handleShipping = async (req, res, shipping) => {
    const products = await Product.find({ shipping })
        .populate('category', '_id name')
        .populate('subcategory', '_id name')
        .populate('postedBy', '_id name')
        .exec();

    res.json(products);
};

const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
      .populate('category', '_id name')
      .populate('subcategory', '_id name')
      .populate('postedBy', '_id name')
      .exec();

  res.json(products);
};

const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand })
      .populate('category', '_id name')
      .populate('subcategory', '_id name')
      .populate('postedBy', '_id name')
      .exec();

  res.json(products)
};

exports.searchFilters = async (req, res) => {
    const { query, price, category, stars, subcategory, shipping, color, brand } = req.body;
    if(query){
        console.log('Query-->: ', query);
        await handleQuery(req, res, query);
    }

    //Filter by price
    if (price !== undefined){
        console.log('Price--> ', price);
        await handlePrice(req,res, price);
    }
    //Filter by category
    if (category) {
        console.log('Category-->', category);
        await handleCategory(req, res, category);
    }
    //Filter by stars
    if (stars) {
        console.log('Stars-->', stars);
        await handleStar(req, res, stars);
    }
    //Filter by subcategory
    if (subcategory) {
        console.log('Subcategory--> ', subcategory);
        await handleSubcategory(req, res, subcategory);
    }
    //Filter by shipping
    if(shipping) {
        console.log('Shipping--> ', shipping);
        await handleShipping(req, res, shipping);
    }
    //Filter by color
    if (color) {
        console.log('Color--> ', color);
        await handleColor(req, res, color);
    }
    //Filter by brand
    if (brand) {
        console.log('Brand--> ', brand);
        await handleBrand(req, res, brand);
    }

};
