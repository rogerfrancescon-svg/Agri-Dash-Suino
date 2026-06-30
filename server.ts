import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.ts";
import { users, integrados, visits } from "./src/db/schema.ts";
import { eq, sql } from 'drizzle-orm';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  
  app.get("/api/users", async (req, res) => {
    try {
      const result = await db.select().from(users);
      res.json(result);
    } catch (error) {
      console.error("Database query failed:", error);
      res.status(500).json({ error: "Database query failed. Please try again later." });
    }
  });

  app.get("/api/integrados", async (req, res) => {
    try {
      const result = await db.select().from(integrados);
      res.json(result);
    } catch (error) {
      console.error("Database query failed:", error);
      res.status(500).json({ error: "Database query failed." });
    }
  });

  app.post("/api/integrados", async (req, res) => {
    try {
      const data = req.body;
      await db.insert(integrados).values(data).onConflictDoUpdate({
        target: integrados.id,
        set: data
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Insert failed:", error);
      res.status(500).json({ error: "Insert failed." });
    }
  });

  app.get("/api/visits", async (req, res) => {
    try {
      const result = await db.select().from(visits);
      res.json(result);
    } catch (error) {
      console.error("Database query failed:", error);
      res.status(500).json({ error: "Database query failed." });
    }
  });

  app.post("/api/visits", async (req, res) => {
    try {
      const data = req.body;
      await db.insert(visits).values(data).onConflictDoUpdate({
        target: visits.id,
        set: data
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Insert failed:", error);
      res.status(500).json({ error: "Insert failed." });
    }
  });

  app.delete("/api/clear-data", async (req, res) => {
    try {
      await db.delete(visits);
      await db.delete(integrados);
      res.json({ success: true });
    } catch (error) {
      console.error("Clear failed:", error);
      res.status(500).json({ error: "Clear failed." });
    }
  });

  app.post("/api/bulk-import", async (req, res) => {
    try {
      const { integrados: newIntegrados, visits: newVisits } = req.body;
      
      await db.transaction(async (tx) => {
        // We can do this in batches if needed, but for typical CSVs Drizzle can handle bulk inserts
        if (newIntegrados && newIntegrados.length > 0) {
          await tx.insert(integrados).values(newIntegrados).onConflictDoUpdate({
            target: integrados.id,
            set: {
              name: sql`EXCLUDED.name`,
              alojamentoDate: sql`EXCLUDED.alojamento_date`,
              status: sql`EXCLUDED.status`
            }
          });
        }
        
        if (newVisits && newVisits.length > 0) {
          await tx.insert(visits).values(newVisits).onConflictDoUpdate({
            target: visits.id,
            set: {
              date: sql`EXCLUDED.date`,
              idade: sql`EXCLUDED.idade`,
              consumoAcumuladoReal: sql`EXCLUDED.consumo_acumulado_real`,
              mortalidade: sql`EXCLUDED.mortalidade`
            }
          });
        }
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Bulk import failed:", error);
      res.status(500).json({ error: "Bulk import failed." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
