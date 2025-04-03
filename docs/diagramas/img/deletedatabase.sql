DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Deshabilitar temporalmente las restricciones de clave foránea
    EXECUTE 'SET session_replication_role = replica';

    -- Recorrer todas las tablas en el esquema público y eliminarlas
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;

    -- Restaurar las restricciones de clave foránea
    EXECUTE 'SET session_replication_role = DEFAULT';
END $$;
