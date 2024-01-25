import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import {createHash, isValidPassword} from '../utils.js'
import passport from "passport";
const router = Router();
import Cart from '../dao/models/cart.model.js';

//Para loguear una persona
router.post("/sessions/login",passport.authenticate('login', {failureRedirect: '/login'}) , async (req, res) => {
      try {
        // Verificar si el usuario tiene un carrito asociado
        if (!req.user.cart) {
          // Si el usuario no tiene un carrito, crea uno automáticamente
          const newCart = await Cart.create({ productos: [] });
    
          // Asigna el ID del nuevo carrito al usuario
          req.user.cart = newCart._id;
    
          // Guarda los cambios en el usuario para agregar la referencia al carrito
          await req.user.save();
        }
        req.session.userRole = req.user.role;
        const userRole = req.user.role;

    // Redirecciona de acuerdo al rol del usuario
    if (userRole === 'admin') {
      res.redirect("/admin");
    } else if (userRole === 'user') {
      res.redirect("/profile");
    } else {
      // Puedes manejar otros roles o situaciones según sea necesario
      res.status(403).send("Acceso no autorizado");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).send("Error interno del servidor");
  }
    });
    

//Para registrar una persona
router.post("/sessions/register", passport.authenticate('register', {failureRedirect: '/register'}) ,async (req, res) => {
      req.session.user = req.user;
      // Redirecciono a login
      res.redirect("/login");
});

//Recuperar contraseña
router.post('/sessions/recovery-password', async (req, res) =>{
      const {
            body: { email, password },
      } = req;
      if (!email || !password) {
            return res.render("error", {
                  title: "Login ✅",
                  messageError: "Todos los campos son requeridos.",
            });
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
            //Validamos el usuario segun el mail
            return res.render("error", {
                  title: "Login ✅",
                  messageError: "Email o Contraseña Invalida.",
            });
      }
      user.password = createHash(password);
      await UserModel.updateOne({ email }, user);
      res.redirect('/login');
})

//Para ver el perfil de una persona
router.get("/sessions/profile", async (req, res) => {
      if (!req.session.user) {
            res.status(401).json({ message: "No estas autenticado" });
      }
      res.status(200).json(req.session.user);
});

//Logout de la cuenta
router.get("/session/logout", async (req, res) => {
      req.session.destroy((error) => {
            if (error) {
                  return res.render("error", {
                        title: "Error ❌",
                        messageError: error.message,
                  });
            }
            res.redirect("/");
      });
});

router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email']}));

router.get('/sessions/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/profile');
});


export default router;
