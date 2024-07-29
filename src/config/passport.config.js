import passport from "passport";
import github from "passport-github2";
import passportjwt from "passport-jwt";
import config from "./config.js";

// función buscaToken jwt
const buscaToken = (req) => {
  let token = null;

  if (req.signedCookies.cookieLogin) {
    token = req.signedCookies.cookieLogin;
  }

  return token;
};

// definir función configuración
const inicializaPassport = () => {
  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let name = profile._json.name;
          let email = profile._json.email;
          let usuario = await userManager.getBy({ email });

          if (!usuario) {
            usuario = await userManager.addUser({
              name,
              email,
              profileGithub: profile,
            });
          }

          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new passportjwt.Strategy(
      {
        secretOrKey: config.SECRET,
        jwtFromRequest: new passportjwt.ExtractJwt.fromExtractors([buscaToken]),
      },
      async (contenidoToken, done) => {
        try {
          return done(null, contenidoToken);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default inicializaPassport;
