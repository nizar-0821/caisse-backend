const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Product = require('./models/Product');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connection m3a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

// ================= ROUTES =================

// 2. Jbed ga3 l-Produits w l-Recette Totale (Dashboard)
app.get('/api/dashboard', async (req, res) => {
    try {
        const products = await Product.find();
        let totalRevenue = 0;

        // Hsab l-flous (Recette Totale) mn l-historique dyal l-mabi3at (OUT)
        products.forEach(p => {
            p.history.forEach(h => {
                if (h.actionType === 'OUT') totalRevenue += h.revenue;
            });
        });

        res.json({ totalRevenue, products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Ajouter Produit Jdid
app.post('/api/products', async (req, res) => {
    try {
        const { name, price, stock } = req.body;
        const newProduct = new Product({ name, price, stock });
        await newProduct.save();
        res.status(201).json({ message: 'Produit tzadd!', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Mouvement dyal l-Stock (Entrée wla Sortie)
app.post('/api/action', async (req, res) => {
    try {
        const { productId, actionType, quantity } = req.body;
        const product = await Product.findById(productId);

        if (!product) return res.status(404).json({ message: "Produit malqaynahsh" });

        if (actionType === 'OUT' && product.stock < quantity) {
            return res.status(400).json({ message: "L-Stock ma kafish!" });
        }

        // Logic dyal l-Hsab
        let revenue = 0;
        if (actionType === 'IN') {
            product.stock += quantity;
        } else if (actionType === 'OUT') {
            product.stock -= quantity;
            revenue = quantity * product.price; // Hseb l-flous
        }

        // Sajjl f l-historique
        product.history.push({ actionType, quantity, revenue });
        
        await product.save();
        res.json({ message: `Action ${actionType} daret b naja7`, product });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lancer l-Serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur m-lanci f l-port ${PORT}`));
// Route dyal l-Login
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        // Kriyat Token fih l-salahiya (ki-tsala mor 24 sa3a)
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: 'Mot de passe ghalat!' });
    }
});

// Middleware bash y-protegé l-routes (Security Check)
const verifierToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: "Khassak ddir Login!" });
    
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next(); // Token s7i7, khelik ddoz
    } catch (err) {
        res.status(401).json({ message: "Token machi s7i7 wla sala l-weqt dyalo!" });
    }
};