

const advancedResults = (model, populate) => async(req, res, next) => {
    console.log(req.query);
    let reqQuery = {...req.query};

    
    let removeFields = ["select", "sort", "limit", "page"];

    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    console.log(queryStr);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    let query = model.find(JSON.parse(queryStr));


    //Select Only Fields
    if(req.query.select){
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    //Sort By Fields
    if(req.query.sort){
        query = query.sort(req.query.sort);
    }else{
        query = query.sort("-createdAt");
    }


    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    query = query.skip(startIndex).limit(limit);

    //Pagination Result 
    const pagination = {};
    if(endIndex < total){
        pagination.next = {
            page : page + 1,
            limit
        }
    }
    if(startIndex > 0){
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    if(populate){
        query = query.populate(populate);
    }

    const results = await query;
    res.advancedResults = {
        success: true,
        pagination,
        data: results
    }
    next();
}

module.exports = advancedResults;