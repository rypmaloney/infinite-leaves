let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let StanzaSchema = new Schema({
    _id: mongoose.Schema.ObjectId,
    key: { type: String },
    book: { type: String },
    text: { type: String, required: true },
    poem: { type: String },
    order: { type: Number, min: 0, max: 10000, required: true },
    caption: { type: Array },
    prev: { type: String },
    next: { type: String },
});

module.exports = mongoose.model('Stanza', StanzaSchema, 'stanzas');
