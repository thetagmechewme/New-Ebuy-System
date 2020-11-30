const admin = require('../firebase/index.fb');
const User = require('../models/user.model');

exports.authCheck = async (req, res, next) => {
    //console.log(req.headers)// Get the token from react
    try{
        const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);
        //console.log('Firebase User Auth Check: ', firebaseUser);
        req.user = firebaseUser;
        next();
    } catch (err){
        //console.log(err);
        res.status(401).json({Error: 'Invalid or Expired token!'});
    }
};

exports.adminCheck = async (req, res, next) => {
    const { email } = req.user
    const adminUser = await User.findOne({email})
        .exec()
    if(adminUser.role !== 'Admin'){
        res.status(403).json({
            Error: 'Admin Resource. Access Denied!'
        });
    } else{
        next();
    }
};
