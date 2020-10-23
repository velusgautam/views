const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);
const viewsSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      index: { unique: true },
    },
    count: { type: Number, default: 1 },
  },
  { collection: 'views' }
);

module.exports = mongoose.model('views', viewsSchema);
