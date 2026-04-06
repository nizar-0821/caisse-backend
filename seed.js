const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

// L-Menu dyal l-monada li ghat-zad f l-database
const seedProducts = [
    { name: 'Salaam Cola', price: 22, stock: 100 },
    { name: 'Salaam Cola Zero', price: 22, stock: 100 },
    { name: 'Chocomel', price: 22, stock: 100 },
    { name: 'Cassis', price: 25, stock: 100 },
    { name: 'Ginger Ale', price: 27, stock: 100 },
    { name: 'Fritz Kola Normal', price: 30, stock: 100 },
    { name: 'Fritz Kola Zero', price: 30, stock: 100 },
    { name: 'Fritz Kola Orange', price: 30, stock: 100 }
];

const seedDB = async () => {
    try {
        // 1. T-connecta m3a l-database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB for seeding...');

        // 2. Mseh l-produits l-qdam (bash may-t3awdosh ila drtiha 2 marrat)
        await Product.deleteMany({});
        console.log('🗑️  Database nqiya daba.');

        // 3. Dkhel l-menu jdid
        await Product.insertMany(seedProducts);
        console.log('📦 L-Monada dkhlat l-database b naja7!');

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        // 4. Sed l-connection mnin tsali
        mongoose.connection.close();
        console.log('🚪 Connection msdouda.');
    }
};

// Lancer l-fonction
seedDB();