//MIDLEWARES 
export const authorizeAdmin = (req, res, next) => {
      const user = req.user;
    
      if (!user || (user.role !== 'admin' && user.role !== 'premium')) {
        return res.status(403).json({ message: 'No tienes permisos de administrador' });
      }
      next();
    };
    
export const authorizeUser = (req, res, next) => {
      const user = req.user;
    
      if (!user || user.role !== 'user') {
        return res.status(403).json({ message: 'No tienes permisos de usuario' });
      }
      next();
    };