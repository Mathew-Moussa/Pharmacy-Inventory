const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
global.crypto = require('node:crypto');
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_URL || 'mongodb://db:27017/pharmacy')
    .then(() => console.log('✅ DB Connected'))
    .catch(err => console.error('❌ DB Error:', err));

const medicineSchema = new mongoose.Schema({
    name: String,
    quantity: Number
});
const Medicine = mongoose.model('Medicine', medicineSchema);

app.get('/api/medicines', async (req, res) => {
    const medicines = await Medicine.find();
    res.json(medicines);
});

app.post('/api/medicines', async (req, res) => {
    const newMed = new Medicine(req.body);
    await newMed.save();
    res.status(201).json(newMed);
});

app.put('/api/medicines/:id', async (req, res) => {
    const updated = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

app.delete('/api/medicines/:id', async (req, res) => {
    await Medicine.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

app.listen(5000, '0.0.0.0', () => console.log('Server on 5000'));