class apifeat{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    search(){
        const keyword= this.queryStr.keyword ? {
            name:{
                $regex: this.queryStr.keyword,
                $options: "i"
            },
        }:{}

        this.query= this.query.find({ ...keyword});
        return this;
    }

    filter(){
        const queryCopy= {...this.queryStr} //creates shallow copy
        //console.log(queryCopy);


        //removing some fields for category
        const removeFields= ["keyword","page","limit"];
        removeFields.forEach(key=>delete queryCopy[key])
        
        //filter for price and rating
            //converting object into string
            let queryStr= JSON.stringify(queryCopy); //converting js object to json string, in order to apply the replcaement operation
                                                    //because we want to put $ sign before the keywords gt,gte,lt,lte
            queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key => `$${key}`);
            // \b is for beggining and ending of chgaracter shayad, and g is for global, and two dollars because firstdollar we wanna put, second is for the word itself ${key}
        
        
        // we added dollar because mongodb understands only through that 
        this.query= this.query.find(JSON.parse(queryStr));
        //converting string back to object using .parse() function
        
        return this;
    }
    pagination(resultsPerPage){
        const currentPage = Number(this.queryStr.page)? Number(this.queryStr.page) : 1;
        
        const skip = resultsPerPage * (currentPage -1);  //skip these many products before displaying

        this.query = this.query.limit(resultsPerPage).skip(skip);

        return this;
    }
}

module.exports = apifeat