import Blog from "../models/blog.js";

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
    responseBlog,
    validURL,
    uniqueURL
};
