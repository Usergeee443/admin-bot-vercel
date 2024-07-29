const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/burgers', async (req, res) => {
    try {
        const data = await fs.readFile('burgers.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Error reading burger data' });
    }
});

app.post('/api/burgers', async (req, res) => {
    try {
        const currentData = await fs.readFile('burgers.json', 'utf8');
        const burgers = JSON.parse(currentData);
        burgers.push(req.body);
        await fs.writeFile('burgers.json', JSON.stringify(burgers, null, 2));
        res.json({ message: 'Burger added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving burger data' });
    }
});

app.delete('/api/burgers/:index', async (req, res) => {
    try {
        const currentData = await fs.readFile('burgers.json', 'utf8');
        let burgers = JSON.parse(currentData);
        const index = parseInt(req.params.index);
        burgers.splice(index, 1);
        await fs.writeFile('burgers.json', JSON.stringify(burgers, null, 2));
        res.json({ message: 'Burger deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting burger' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});