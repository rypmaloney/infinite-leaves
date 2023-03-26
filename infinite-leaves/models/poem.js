let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PoemSchema = new Schema({
    title: { type: String, required: true },
    book: { type: String, required: false },
    order: { type: Number, min: 0, max: 10000, required: true },
});

module.exports = mongoose.model('Poem', PoemSchema);
