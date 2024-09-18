import Blog from "../models/blog.js";

import auth from "../auth.js";
import {
    responseBlog
} from "../controllers/blog.js";

const blogRoutes = (app)=>{
    /*
        POST: create a new blog for user website
        req.body = {
            content: String (HTML)
            title: String,
            thumbnail: String (URL)
            urlString: String
        }
     */
    app.post("/blog", auth("blog"), async (req, res)=>{
        const blog = new Blog({
            owner: res.locals.user._id,
            content: req.body.content,
            site: res.locals.user.site,
            urlString: req.body.urlString,
            title: req.body.title,
            thumbnail: req.body.thumbnail,
            date: new Date()
        });

        await blog.save();

        res.json(responseBlog(blog));
    });
}

export default blogRoutes;
