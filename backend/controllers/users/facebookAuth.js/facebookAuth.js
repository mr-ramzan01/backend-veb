const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const Users = require("../../../models/users.schema");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}auth/facebook/callback`,
      profileFields: ["id", "name", "displayName", "gender", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log("profile", profile.emails[0].value);
      const totalUsers = await Users.findOne().limit(1).sort({ orgNo: -1 });
      console.log(totalUsers);
      const findExistingUser = await Users.findOne({
        email: profile.emails[0].value,
      });
      console.log(findExistingUser);

      if (!findExistingUser) {
        const user = new Users({
          email: profile.emails[0].value,
          name: profile.displayName,
          password: uuidv4(),
          organisation: "",
          industry: "",
          phone: 0,
          radio: true,
          orgNo: totalUsers ? totalUsers.orgNo + 1 : 1,
          signupBy: "Facebook",
          expiryplan: "",
          verified : false
        });
        await user.save();

        const data = {
          user,
          message: "signup and login successfully",
          token: jwt.sign(
            {
              id: user._id,
              email: user.email,
              name: user.name,
              verified: false,
              orgNo : user.orgNo,
              signupBy : "Facebook",
            },
            process.env.SECRETKEY
          ),
        };
        console.log(user);
        return done(null, data);
      } else {
        const user = {
          message: "Loggin",
          token: jwt.sign(
            {
              id: findExistingUser._id,
              email: findExistingUser.email,
              name: findExistingUser.name,
              orgNo : findExistingUser.orgNo,
              verified : true,
              signupBy : "Facebook",
              phone : findExistingUser.phone
            },
            process.env.SECRETKEY
          ),
        };
        return done(null, user);
      }
    }
  )
);
module.exports = passport;
