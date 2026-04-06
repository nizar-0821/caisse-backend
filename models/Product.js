const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    history: [{
        actionType: { type: String, enum: ['IN', 'OUT'] }, // Entrée wla Sortie
        quantity: Number,
        revenue: Number, // Shhal dakhlat dyal l-flous f had l-action
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Product', productSchema);