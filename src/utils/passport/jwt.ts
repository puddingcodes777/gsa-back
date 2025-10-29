import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { getUser } from "src/modules/user";
import { config } from "src/system";

const opts = {
  jwtFromRequest: ExtractJwt.fromHeader("x-auth-token"),
  secretOrKey: config.jwt.secret,
};

export const getJwtStrategy = () => {
  return new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await getUser(payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  });
};
