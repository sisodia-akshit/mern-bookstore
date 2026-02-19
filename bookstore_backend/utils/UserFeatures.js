class UserFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const filter = {};

    if (this.queryStr.search) {
      filter.$or = [
        { name: { $regex: this.queryStr.search, $options: "i" } },
        { email: { $regex: this.queryStr.search, $options: "i" } },
      ];
    }

    this.filterQuery = filter;
    this.query = this.query.find(filter);

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fieldsArray = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fieldsArray);
    } else {
      this.query = this.query.select("-__v -password");
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryStr.page) || 1;
    const limit = Number(this.queryStr.limit) || 10;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = UserFeatures;
