import Blog from "../models/blog.js";

import auth from "../auth.js";
import httpError from "../error.js";
import {
    blogAuth,
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
    app.post("/blog", auth, async (req, res)=>{
        const site = await blogAuth(req.body.site, res.locals.user._id.toString());
        if(site.error) return httpError(res, site.code, site.message);

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
        res.json(responseBlog(blog));
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

    /*
        PUT: Update blog data
        req.body = {
            site: String (ID)
            url: String (optional)
            content: String (optional)
            title: String (optional)
            thumbnail: String (optional)
        }
     */
    app.put("/blog/:blog", auth, async (req, res)=>{
        let blog;
        try{
            blog = await Blog.findOne({_id: req.params.blog});
        }catch(e){
            console.error(e);
            return httpError(res, 500, "Internal server error (err-005)");
        }

        const site = await blogAuth(blog.site, res.locals.user._id.toString());
        if(site.error) return httpError(res, site.code, site.message);

        if(blog.author.toString() !== res.locals.user._id.toString()){
            return httpError(res, 403, "Only the owner can update this blog");
        }

        if(req.body.url){
            if(!validURL(req.body.url)){
                return httpError(res, 400, "Your URL may only contain letters, numbers or '-'");
            }
            const isUnique = await uniqueURL(blog.site, req.body.url);
            if(isUnique !== true) return httpError(res, isUnique.code, isUnique.message);
            blog.url = req.body.url
        }

        if(req.body.content) blog.content = req.body.content;
        if(req.body.title) blog.title = req.body.title;
        if(req.body.thumbnail) blog.thumbnail = req.body.thumbnail;

        await blog.save();

        res.json(responseBlog(blog));
    });

    /*
        DELETE: Delete a blog
        response = {success: true}
     */
    app.delete("/blog/:blog", auth, async (req, res)=>{
        let blog;
        try{
            blog = await Blog.findOne({_id: req.params.blog});
        }catch(e){
            console.error(e);
            return httpError(res, 500, "Internal server error (err-006)");
        }

        const site = await blogAuth(blog.site, res.locals.user._id.toString());
        if(site.error) return httpError(res, site.code, site.message);

        if(blog.author.toString() !== res.locals.user._id.toString()){
            return httpError(res, 403, "Unauthorized access");
        }

        await Blog.deleteOne({_id: blog._id});

        res.json({success: true});
    });
}

export default blogRoutes;
