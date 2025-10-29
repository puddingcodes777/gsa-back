import passport from "passport";
import { getJwtStrategy } from "./jwt";

const strategies = [{ name: "jwt", strategyFcn: getJwtStrategy }];

export const getPassport = () => {
  for (const { name, strategyFcn } of strategies) {
    passport.use(name, strategyFcn());
  }

  return passport;
};
