let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let StanzaSchema = new Schema({
    text: { type: String, required: true },
    poem: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    order: { type: Number, min: 0, max: 10000, required: true },
});

module.exports = mongoose.model('Stanza', StanzaSchema);
