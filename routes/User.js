// const authPath = process.env.NODE_ENV === 'production' ? "../services/auth" : "../../services/auth"
// const { auth } = require(authPath);
const userController = require("../controllers/User")


exports.init = (app) => {
    // app.post("/api/user/login", userController.login);
    // app.get('/', (req, res)=> res.send('<h1>Hello</h1>'))
    app.post("/api/user/create", userController.create);
    // app.post("/api/user/get", auth, userController.get);
    // app.post("/api/user/edit/:id", auth, userController.update);
    // app.post("/api/user/search", auth, userController.search);
}