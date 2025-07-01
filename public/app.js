// Importaciones (usando ESModules)
import express from 'express';
import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env
dotenv.config();

// Inicializar express
const app = express();
const PORT = process.env.PORT || 8000;

// Configurar conexión a MySQL
const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middlewares
app.use(cors({
    origin: 'http://localhost:8000',
    methods: ['GET']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta API: obtener productos
app.get('/api/products', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM products');
        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron productos."
            });
        }
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error en /api/products:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener productos',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        if (connection) connection.release();
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error('Error global:', err);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


process.on('SIGINT', () => {
    server.close(() => {
        pool.end();
        console.log('Servidor cerrado');
        process.exit(0);
    });
});