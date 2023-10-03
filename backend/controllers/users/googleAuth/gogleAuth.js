var GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken")
const Users = require("../../../models/users.schema")

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}auth/google/callback`,
    },
    async function (accessToken, refreshToken,profile, cb) {
      // console.log(profile._json.email);
      const totalUsers = await Users.findOne().limit(1).sort({orgNo : -1})
      const findExistingUser = await Users.findOne({ email: profile._json.email });
      console.log(findExistingUser);
      if (!findExistingUser) {
        const user = new Users({
          email: profile._json.email,
          name: profile._json.name,
          password: uuidv4(),
          organisation : "",
          industry : "",
          phone : 0,
          radio : true,
          orgNo : (totalUsers ?(totalUsers.orgNo + 1) : 1),
          signupBy : "Google" ,
          expiryplan : ""
        });
        await user.save();
        const data = {
          user,
          message : "signup and login successfully",
          token : jwt.sign(
            {
              id: user._id,
              email: user.email,
              name: user.name,
              verified : false,
              orgNo : user.orgNo,
              signupBy : "Google"
            },
            process.env.SECRETKEY
          ),
        }
        return cb(null, data);
      } else {
        const user =  {
          user : findExistingUser,
          message: "Loggin",
          token: jwt.sign(
            {
              id: findExistingUser._id,
              email: findExistingUser.email,
              name: findExistingUser.name,
              verified : true,
              orgNo : findExistingUser.orgNo,
              signupBy : "Google",
              phone : findExistingUser.phone
            },
            process.env.SECRETKEY
          ),
        }
        return cb(
          null,
          user
        );
      }
    }
  )
);
module.exports = passport;
