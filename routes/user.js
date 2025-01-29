import auth from "../auth.js";
import {
    createPasswordRoute,
    getTokenRoute,
    getUserRoute
} from "../controllers/user.js";

const userRoutes = (app)=>{
    app.post("/user/:userId/key/:userKey", createPasswordRoute);
    app.post("/user/token", getTokenRoute);
    app.get("/user/:userId", auth, getUserRoute);
}

export default userRoutes;
