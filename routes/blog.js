import Blog from "../models/blog.js";

import auth from "../auth.js";
import httpError from "../error.js";
import {
    responseBlog,
    validURL,
    uniqueURL
} from "../controllers/blog.js";

const blogRoutes = (app)=>{
    /*
        POST: create a new blog for user website
        req.body = {
            site: String (ID)
            content: String (HTML)
            title: String
            thumbnail: String (URL)
            url: String (optional)
        }
     */
    app.post("/blog", auth("blog"), async (req, res)=>{
        if(req.body.url){
            if(!validURL(req.body.url)){
                return httpError(res, 400, "Your URL may only contain letters, numbers or '-'");
            }
            const isUnique = await uniqueURL(req.body.site, req.body.url);
            if(isUnique !== true) return httpError(res, isUnique.code, isUnique.message);
        }

        const blog = new Blog({
            site: req.body.site,
            author: res.locals.user._id,
            content: req.body.content,
            title: req.body.title,
            thumbnail: req.body.thumbnail,
            date: new Date()
        });
        blog.url= req.body.url? req.body.url : blog._id;

        await blog.save();

        res.json(responseBlog(blog));
    });

    /*
        GET: retrieve a single blog
        response = Blog
     */
    app.get("/blog/:url/site/:site", async (req, res)=>{
        const blog = await Blog.findOne({site: req.params.site, url: req.params.url});
        res.json(blog);
    });

    /*
        GET: retrieve a list of blogs for a site
        response = [Blog]
     */
    app.get("/blog/site/:site", async (req, res)=>{
        const blogs = await Blog.find(
            {site: req.params.site},
            {
                site: 1,
                url: 1,
                title: 1,
                thumbnail: 1,
                date: 1
            }
        );
        res.json(blogs);
    });
}

export default blogRoutes;
