"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectPg = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
// Configuración equivalente a tu Pool de pg
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "db.ayvouzycmojxlbcxhquy.supabase.co", // Host de Supabase
    port: 5432,
    username: "postgres",
    password: "AYD1_G8_1S2025",
    database: 'postgres',
    entities: [
        // Ruta a tus entidades TypeORM (ej: './src/models/*.ts')
        'src/models/**/*.ts'
    ],
    // Crear tablas automaticamente (solo desarrollo)
    synchronize: false,
    // Obligatorio para Supabase
    ssl: true,
    extra: {
        ssl: {
            // Para conexión segura con Supabase
            rejectUnauthorized: false
        }
    }
});
// Versión TypeORM de tu función connectPg
const connectPg = async () => {
    try {
        await exports.AppDataSource.initialize();
        const result = await exports.AppDataSource.query('SELECT NOW()');
        console.log('Conectado a PostgreSQL:', result[0].now);
    }
    catch (err) {
        console.error('Error de conexión:', err);
    }
};
exports.connectPg = connectPg;
