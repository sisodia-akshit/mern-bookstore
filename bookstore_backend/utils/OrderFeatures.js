class OrderFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    filter() {
      const filter = {};
  
      if (this.queryStr.search) {
        filter.$text = { $search: this.queryStr.search };
      }

      if (this.queryStr.status) {
        filter.orderStatus = this.queryStr.status;
      }
      // if (this.queryStr.email) {
      //   filter.email = { $regex: this.queryStr.email };
      // }
  
      this.filterQuery = filter;
  
      this.query = this.query.find(filter);
  
      return this;
    }
  
    sort() {
      if (this.queryStr.sort) {
        const sortBy = this.queryStr.sort.split(",").join(" ");
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort("createdAt");
      }
      return this;
    }
  
    limitFields() {
      if (this.queryStr.fields) {
        const fieldsArray = this.queryStr.fields.split(",").join(" ");
        this.query = this.query.select(fieldsArray);
      } else {
        this.query = this.query.select("-__v");
      }
      return this;
    }
  
    paginate() {
      const pageQuery = this.queryStr.page ? Number(this.queryStr.page) : 1;
      const limitQuery = this.queryStr.limit ? Number(this.queryStr.limit) : 10;
      const skip = (pageQuery - 1) * limitQuery;
      this.query = this.query.skip(skip).limit(limitQuery);
  
      // if(page){
      //   const booksCount = await Book.countDocuments();
      //   if(skip >= booksCount){
      //     throw new Error("This page is not found!")
      //   }
      // }
  
      return this;
    }
  }
  
  module.exports = OrderFeatures;
  