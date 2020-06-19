import jwt from "jsonwebtoken";
import passport from "passport";

class AuthController {
  static async login(req, res) {
    passport.authenticate("local", { session: false }, (error, user) => {
      if (error || !user) {
        res.status(400).json({ error });
      }

      /** This is what ends up in our JWT */
      const payload = {
        username: req.body.email,
        expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS),
      };

      /** assigns payload to req.user */
      req.login(payload, { session: false }, (error) => {
        if (error) {
          res.status(400).send({ error });
          return;
        } else {
          /** generate a signed json web token and return it in the response */
          const token = jwt.sign(
            JSON.stringify(payload),
            process.env.PASSPORT_SECRET
          );

          /** assign our jwt to the cookie */
          res.cookie("jwt", jwt, { httpOnly: true, secure: true });
          return res.status(200).send({
            token: "Bearer " + token,
            data: {
              email: payload.username,
              createdAt: user.createdAt,
              id: user.id,
              name: user.name,
              updatedAt: user.updatedAt,
            },
          });
        }
      });
    })(req, res);
  }

  static async protected(req, res) {
    passport.authenticate("jwt", { session: false }),
      () => {
        const { user } = req;

        res.status(200).send({ user });
      };
  }
}

export default AuthController;
