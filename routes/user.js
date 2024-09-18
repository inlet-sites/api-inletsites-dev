const userRoutes = (app)=>{
    app.get("/", (req, res)=>{res.send("Something")});
}

export default userRoutes;
