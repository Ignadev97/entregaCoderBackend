const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  } else if (!Array.isArray(roles)) {
    console.log(
      "El rol del usuario está mal implementado. Por favor verifique."
    );
    roles = [];
  }

  return (req, res, next) => {
    //está autenticado?
    if (!req.user) {
      return res.status(401).json({ mensaje: "No autenticado" });
    }

    //está autorizado?
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ mensaje: "No autorizado" });
    }

    next();
  };
};

export default authorize;
