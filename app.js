import express from 'express';
import os from 'os';
import axios from 'axios';
import { networkInterfaces } from 'os';
import path from 'path';
let ip;
const app = express();
const PORT = 3000;
const serviceId = os.hostname(); // Unique container hostname

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



function getContainerIP() {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return '127.0.0.1'; // fallback
}

async function registerService() {
    try {
        ip = getContainerIP();
        console.log("Container IP:", ip);

        const body = {
            Name: "express-service",
            ID: serviceId,
            Address: ip,
            Port: 3000,
            Check: {
                HTTP: `http://${ip}:3000/health`,
                Interval: "10s",
                Timeout: "1s",
                DeregisterCriticalServiceAfter: "30s"
            }
        };

        await axios.put('http://consul-agent:8500/v1/agent/service/register', body, {
            headers: { 'Content-Type': 'application/json' }
        })

        console.log(`Registered service: ${serviceId}`);
    } catch (err) {
        console.error("Service registration failed:", err.response?.data || err.message);
    }
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    const hostname = os.hostname();
    const DIR = path.join(__dirname, 'index.html');
    res.render('index', { ip, hostname });
    console.log(`Request served by app:${hostname}`)
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await registerService();
});
