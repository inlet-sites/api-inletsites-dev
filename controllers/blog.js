const responseBlog = (blog)=>{
    return {
        content: blog.content,
        title: blog.title,
        thumbnail: blog.thumbnail,
        date: blog.date
    };
}

export {
    responseBlog
};
