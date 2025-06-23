class ApiFeatures {
  constructor(
    query,
    queryStr
  ) {
    this.query = query
    this.queryStr = queryStr
  }

  // for search features
  search() {
    const keyword = this.queryStr.keyword ? {
      name: {
        $regex: this.queryStr.keyword,
        $options: "i"
      }
    } : {}

    this.query = this.query.find({...keyword})
    return this;
  }

  // for filter features
 filter() {
  const queryCopy = { ...this.queryStr };

  // Removing unnecessary fields
  const removeFields = ["keyword", "page", "limit"];
  removeFields.forEach((key) => delete queryCopy[key]);

  const mongoQuery = {};

  for (let key in queryCopy) {
    if (key.includes('[')) {
      const [field, operatorWrapped] = key.split('[');
      const operator = operatorWrapped.replace(']', '');
      const value = queryCopy[key];

      // 🛡️ Skip invalid values (e.g., 'undefined' string or non-numeric)
      if (
        value !== undefined &&
        value !== 'undefined' &&
        !isNaN(Number(value))
      ) {
        if (!mongoQuery[field]) mongoQuery[field] = {};
        mongoQuery[field][`$${operator}`] = Number(value);
      }
    } else {
      mongoQuery[key] = queryCopy[key];
    }
  }

  this.query = this.query.find(mongoQuery);
  return this;
}


  // pagination
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1)

    this.query = this.query.limit(resultPerPage).skip(skip)

    return this;
  }
}

export { ApiFeatures }