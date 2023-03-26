const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    stanza: { type: Schema.Types.ObjectId, ref: 'Stanza', required: true },
    img: {
        data: Buffer,
        contentType: String,
    },
});
ImageSchema.set('timestamps', true);

module.exports = new mongoose.model('Image', ImageSchema);
