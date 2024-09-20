import Blog from "../models/blog.js";
import Site from "../models/site.js";

const blogAuth = async (siteId, user)=>{
    let site;
    try{
        site = await Site.findOne({_id: siteId});
    }catch(e){
        console.error(e);
        return {
            error: true,
            code: 500,
            message: "Internal server error"
        };
    }

    //Check if site exists
    if(!site){
        return {
            error: true,
            code: 400,
            message: "Requested site doesn't exist"
        }
    }

    //Check if site includes blog permissions
    if(!site.permissions.includes("blog")){
        return {
            error: true,
            code: 403,
            message: "Site does not include blog permissions"
        }
    }

    //Check that current user is an owner of the site
    let isOwner = false;
    for(let i = 0; i < site.owners.length; i++){
        if(site.owners[i].toString() === user){
            isOwner = true;
            break;
        }
    }
    if(!isOwner){
        return {
            error: true,
            code: 403,
            message: "You don't have permissions on this site"
        }
    }

    return site;
}

const responseBlog = (blog)=>{
    return {
        site: blog.site,
        author: blog.author,
        url: blog.url,
        content: blog.content,
        title: blog.title,
        thumbnail: blog.thumbnail,
        date: blog.date
    };
}

const validURL = (url)=>{
    return url.match(/^[0-9a-z\-]+$/);
}

const uniqueURL = async (site, url)=>{
    let blog;
    try{
        blog = await Blog.findOne({site: site, url: url});
    }catch(e){
        console.error(e);
        return {
            code: 500,
            message: "Internal server error"
        };
    }

    if(blog !== null) return {
        code: 400,
        message: "Blog with this URL string already exists"
    };
    return true;
}

export {
    blogAuth,
    responseBlog,
    validURL,
    uniqueURL
};
