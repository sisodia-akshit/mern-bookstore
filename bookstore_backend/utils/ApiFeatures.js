class   ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const filter = {};
    if (this.queryStr.price) {
      filter.price = { $lte: this.queryStr.price };
    }
    if (this.queryStr.pages) {
      filter.pages = { $gte: this.queryStr.pages };
    }
    if (this.queryStr.title) {
      filter.title = { $regex: this.queryStr.title };
    }
    if (this.queryStr.ratings) {
      filter.ratings = { $gte: this.queryStr.ratings };
    }
    if (this.queryStr.language) {
      filter.language = this.queryStr.language;
    }

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

module.exports = ApiFeatures;
