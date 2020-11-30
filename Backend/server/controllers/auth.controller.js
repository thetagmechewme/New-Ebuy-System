const User = require('../models/user.model');

exports.userCreateUpdate = async (req, res) => {
    const {name, picture, email} = req.user;

    //Update existing User
    const user = await User.findOneAndUpdate(
        {email},
        {name: email.split('@')[0], picture},
        {new: true});

    //If user not exists then create
    if(user){
        console.log('Updated User: ',user);
        res.status(200).json(user);
    } else{
        const newUser = await new User({
            email,
            name: email.split('@')[0],
            picture,
        }).save();
        console.log('New User: ',newUser);
        res.status(200).json(newUser);
    }
};

exports.currentUser = async (req, res) => {
    User.findOne({email: req.user.email})
        .exec((err, user) => {
           if(err) throw new Error(err);

           res.status(200).json(user);
        });
};
