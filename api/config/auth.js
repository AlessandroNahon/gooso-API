import bcrypt from "bcrypt";

import db from "../../database/models";

module.exports = function (passport, LocalStrategy, JWTStrategy) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          const userDocument = await db.User.findOne({
            where: { email: username },
          });
          const passwordsMatch = await bcrypt.compare(
            password,
            userDocument.password
          );

          if (passwordsMatch) {
            return done(null, userDocument);
          } else {
            return done("Incorrect email / password");
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: (req) => req.cookies.jwt,
        secretOrKey: process.env.PASSPORT_SECRET,
      },
      (jwtPayload, done) => {
        if (Date.now() > jwtPayload.expires) {
          return done("jwt expired");
        }

        return done(null, jwtPayload);
      }
    )
  );
};
