import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('mfc_gestao.db');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS cities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    uf TEXT NOT NULL,
    mfcSince TEXT,
    active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    isYouth INTEGER DEFAULT 0,
    createdAt TEXT,
    memberCount INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    nickname TEXT,
    dob TEXT,
    rg TEXT,
    cpf TEXT,
    bloodType TEXT,
    gender TEXT,
    maritalStatus TEXT,
    spouseName TEXT,
    spouseCpf TEXT,
    marriageDate TEXT,
    mfcDate TEXT,
    phone TEXT,
    emergencyPhone TEXT,
    status TEXT,
    teamId TEXT,
    street TEXT,
    number TEXT,
    neighborhood TEXT,
    zip TEXT,
    city TEXT,
    state TEXT,
    condir TEXT,
    naturalness TEXT,
    father TEXT,
    mother TEXT,
    smoker INTEGER DEFAULT 0,
    mobilityIssue TEXT,
    healthPlan TEXT,
    diet TEXT,
    medication TEXT,
    allergy TEXT,
    pcd INTEGER DEFAULT 0,
    pcdDescription TEXT,
    profession TEXT,
    religion TEXT,
    education TEXT,
    movementRoles TEXT,
    createdAt TEXT,
    updatedAt TEXT,
    FOREIGN KEY(teamId) REFERENCES teams(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    cityId TEXT,
    role TEXT NOT NULL,
    teamId TEXT,
    createdAt TEXT,
    updatedAt TEXT,
    FOREIGN KEY(cityId) REFERENCES cities(id),
    FOREIGN KEY(teamId) REFERENCES teams(id)
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    costValue REAL DEFAULT 0,
    goalValue REAL DEFAULT 0,
    cityId TEXT NOT NULL,
    isActive INTEGER DEFAULT 1,
    showOnDashboard INTEGER DEFAULT 1,
    ticketQuantity INTEGER,
    ticketValue REAL,
    FOREIGN KEY(cityId) REFERENCES cities(id)
  );

  CREATE TABLE IF NOT EXISTS event_expenses (
    id TEXT PRIMARY KEY,
    eventId TEXT NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    FOREIGN KEY(eventId) REFERENCES events(id)
  );

  CREATE TABLE IF NOT EXISTS event_team_quotas (
    eventId TEXT NOT NULL,
    teamId TEXT NOT NULL,
    quotaValue REAL NOT NULL,
    PRIMARY KEY(eventId, teamId),
    FOREIGN KEY(eventId) REFERENCES events(id),
    FOREIGN KEY(teamId) REFERENCES teams(id)
  );

  CREATE TABLE IF NOT EXISTS event_sales (
    id TEXT PRIMARY KEY,
    eventId TEXT NOT NULL,
    teamId TEXT NOT NULL,
    memberId TEXT NOT NULL,
    buyerName TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY(eventId) REFERENCES events(id),
    FOREIGN KEY(teamId) REFERENCES teams(id),
    FOREIGN KEY(memberId) REFERENCES members(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    memberId TEXT NOT NULL,
    teamId TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    referenceMonth TEXT NOT NULL,
    status TEXT NOT NULL,
    launchedBy TEXT NOT NULL,
    FOREIGN KEY(memberId) REFERENCES members(id),
    FOREIGN KEY(teamId) REFERENCES teams(id),
    FOREIGN KEY(launchedBy) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS financial_entities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    createdBy TEXT NOT NULL,
    observations TEXT,
    initialBalance REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS financial_launches (
    id TEXT PRIMARY KEY,
    entityId TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    FOREIGN KEY (entityId) REFERENCES financial_entities(id)
  );
`);

// Helper to seed data if empty
const seedData = () => {
  const cityCount = db.prepare('SELECT count(*) as count FROM cities').get() as { count: number };
  if (cityCount.count === 0) {
    console.log('Seeding initial data...');
    
    // Seed Cities
    const insertCity = db.prepare('INSERT INTO cities (id, name, uf, mfcSince, active) VALUES (?, ?, ?, ?, ?)');
    insertCity.run('1', 'Tatuí', 'SP', '1965-07-01', 1);
    insertCity.run('2', 'Pirassununga', 'SP', '1980-05-15', 1);

    // Seed Teams
    const insertTeam = db.prepare('INSERT INTO teams (id, name, city, state, isYouth, createdAt, memberCount) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insertTeam.run('t1', 'São Paulo Apóstolo', 'Tatuí', 'SP', 0, '2021-04-07', 12);
    insertTeam.run('t2', 'Nossa Senhora da Paz', 'Tatuí', 'SP', 1, '2022-01-15', 8);

    // Seed Users
    const insertUser = db.prepare('INSERT INTO users (id, username, email, name, cityId, role, teamId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    insertUser.run('u1', 'admin', 'admin@mfc.org', 'Administrador Geral', '1', 'Administrador', null, '2021-01-01', '2021-01-01');
    insertUser.run('u2', 'alziraloretti', 'farahalziraloretti@gmail.com', 'Alzira Loretti', '1', 'Tesoureiro', 't1', '2021-04-07', '2022-09-22');

    // Seed Members
    const insertMember = db.prepare(`
      INSERT INTO members (
        id, name, nickname, dob, rg, cpf, bloodType, gender, maritalStatus, 
        spouseName, spouseCpf, marriageDate, mfcDate, phone, emergencyPhone, 
        status, teamId, street, number, neighborhood, zip, city, state, 
        condir, naturalness, father, mother, smoker, mobilityIssue, 
        healthPlan, diet, medication, allergy, pcd, pcdDescription, 
        profession, religion, education, movementRoles, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertMember.run(
      'm1', 'Alzira Camargo Farah Loretti', 'Alzira', '1941-03-22', '26674889', '039.XXX.XXX-34', 'A+', 'Feminino', 'Casado(a)', 
      'Hélio Loretti', '039.XXX.XXX-53', '1964-07-11', '1965-07-01', '(15)99751-6268', '(15)99719-6620', 
      'Ativo', 't1', 'Rua Cornélio Vieira Camargo', '104', 'Junqueira', '18270030', 'Tatuí', 'SP', 
      'Sudeste', 'São Paulo', 'Nacif Farah', 'Francisca Vieira Camargo Farah', 0, 'Auditiva', 
      'Não informado', 'Nenhuma', 'Nenhuma', 'Nenhuma', 1, 'Auditiva', 
      'Aposentado', 'Católica', 'Superior completo', JSON.stringify(['Tesoureiro']), '2021-04-07 16:51', '2022-09-22 00:28'
    );
  }
};

seedData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());

  // Auth
  app.post('/api/login', (req, res) => {
    const { username } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: 'Usuário não encontrado' });
    }
  });

  // Cities
  app.get('/api/cities', (req, res) => {
    const cities = db.prepare('SELECT * FROM cities').all();
    res.json(cities);
  });

  app.post('/api/cities', (req, res) => {
    const city = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const stmt = db.prepare('INSERT INTO cities (id, name, uf, mfcSince, active) VALUES (?, ?, ?, ?, ?)');
    stmt.run(id, city.name, city.uf, city.mfcSince, city.active ? 1 : 0);
    res.json({ id, ...city });
  });

  app.put('/api/cities/:id', (req, res) => {
    const { id } = req.params;
    const city = req.body;
    const stmt = db.prepare('UPDATE cities SET name = ?, uf = ?, mfcSince = ?, active = ? WHERE id = ?');
    stmt.run(city.name, city.uf, city.mfcSince, city.active ? 1 : 0, id);
    res.json({ id, ...city });
  });

  app.delete('/api/cities/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM cities WHERE id = ?').run(id);
    res.json({ success: true });
  });

  // Users
  app.get('/api/users', (req, res) => {
    const users = db.prepare('SELECT * FROM users').all();
    res.json(users);
  });

  app.post('/api/users', (req, res) => {
    const user = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const stmt = db.prepare('INSERT INTO users (id, username, email, name, cityId, role, teamId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(
      id, 
      user.username, 
      user.email, 
      user.name, 
      user.cityId, 
      user.role, 
      user.teamId || null, 
      new Date().toISOString(), 
      new Date().toISOString()
    );
    res.json({ id, ...user });
  });

  // Teams
  app.get('/api/teams', (req, res) => {
    const teams = db.prepare('SELECT * FROM teams').all();
    res.json(teams);
  });

  app.get('/api/teams/:id', (req, res) => {
    const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(req.params.id);
    if (team) {
      const members = db.prepare('SELECT * FROM members WHERE teamId = ?').all(req.params.id);
      res.json(Object.assign({}, team, { members }));
    } else {
      res.status(404).json({ error: 'Equipe não encontrada' });
    }
  });

  app.post('/api/teams', (req, res) => {
    const team = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const stmt = db.prepare('INSERT INTO teams (id, name, city, state, isYouth, createdAt, memberCount) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(
      id, 
      team.name, 
      team.city, 
      team.state, 
      team.isYouth ? 1 : 0, 
      new Date().toISOString().split('T')[0],
      0
    );
    res.json({ id, ...team, memberCount: 0, createdAt: new Date().toISOString().split('T')[0] });
  });

  app.put('/api/teams/:id', (req, res) => {
    const { id } = req.params;
    const team = req.body;
    const stmt = db.prepare('UPDATE teams SET name = ?, city = ?, state = ?, isYouth = ? WHERE id = ?');
    stmt.run(team.name, team.city, team.state, team.isYouth ? 1 : 0, id);
    res.json({ id, ...team });
  });

  app.delete('/api/teams/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM teams WHERE id = ?').run(id);
    res.json({ success: true });
  });

  // Members
  app.get('/api/members', (req, res) => {
    const members = db.prepare('SELECT * FROM members').all();
    res.json(members.map((m: any) => ({ ...m, movementRoles: JSON.parse(m.movementRoles || '[]') })));
  });

  app.get('/api/members/:id', (req, res) => {
    const member = db.prepare('SELECT * FROM members WHERE id = ?').get(req.params.id) as any;
    if (member) {
      member.movementRoles = JSON.parse(member.movementRoles || '[]');
      res.json(member);
    } else {
      res.status(404).json({ error: 'Membro não encontrado' });
    }
  });

  app.post('/api/members', (req, res) => {
    const member = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const stmt = db.prepare(`
      INSERT INTO members (
        id, name, nickname, dob, rg, cpf, bloodType, gender, maritalStatus, 
        spouseName, spouseCpf, marriageDate, mfcDate, phone, emergencyPhone, 
        status, teamId, street, number, neighborhood, zip, city, state, 
        condir, naturalness, father, mother, smoker, mobilityIssue, 
        healthPlan, diet, medication, allergy, pcd, pcdDescription, 
        profession, religion, education, movementRoles, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id, member.name, member.nickname, member.dob, member.rg, member.cpf, member.bloodType, member.gender, member.maritalStatus,
      member.spouseName, member.spouseCpf, member.marriageDate, member.mfcDate, member.phone, member.emergencyPhone,
      member.status, member.teamId, member.street, member.number, member.neighborhood, member.zip, member.city, member.state,
      member.condir, member.naturalness, member.father, member.mother, member.smoker ? 1 : 0, member.mobilityIssue,
      member.healthPlan, member.diet, member.medication, member.allergy, member.pcd ? 1 : 0, member.pcdDescription,
      member.profession, member.religion, member.education, JSON.stringify(member.movementRoles || []), 
      new Date().toISOString(), new Date().toISOString()
    );
    res.json({ id, ...member });
  });

  app.put('/api/members/:id', (req, res) => {
    const { id } = req.params;
    const member = req.body;
    const stmt = db.prepare(`
      UPDATE members SET 
        name = ?, nickname = ?, dob = ?, rg = ?, cpf = ?, bloodType = ?, gender = ?, maritalStatus = ?, 
        spouseName = ?, spouseCpf = ?, marriageDate = ?, mfcDate = ?, phone = ?, emergencyPhone = ?, 
        status = ?, teamId = ?, street = ?, number = ?, neighborhood = ?, zip = ?, city = ?, state = ?, 
        condir = ?, naturalness = ?, father = ?, mother = ?, smoker = ?, mobilityIssue = ?, 
        healthPlan = ?, diet = ?, medication = ?, allergy = ?, pcd = ?, pcdDescription = ?, 
        profession = ?, religion = ?, education = ?, movementRoles = ?, updatedAt = ?
      WHERE id = ?
    `);
    
    stmt.run(
      member.name, member.nickname, member.dob, member.rg, member.cpf, member.bloodType, member.gender, member.maritalStatus,
      member.spouseName, member.spouseCpf, member.marriageDate, member.mfcDate, member.phone, member.emergencyPhone,
      member.status, member.teamId, member.street, member.number, member.neighborhood, member.zip, member.city, member.state,
      member.condir, member.naturalness, member.father, member.mother, member.smoker ? 1 : 0, member.mobilityIssue,
      member.healthPlan, member.diet, member.medication, member.allergy, member.pcd ? 1 : 0, member.pcdDescription,
      member.profession, member.religion, member.education, JSON.stringify(member.movementRoles || []), 
      new Date().toISOString(), id
    );
    res.json({ id, ...member });
  });

  app.delete('/api/members/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM members WHERE id = ?').run(id);
    res.json({ success: true });
  });

  // Events
  app.get('/api/events', (req, res) => {
    const events = db.prepare('SELECT * FROM events').all() as any[];
    const result = events.map(event => {
      const expenses = db.prepare('SELECT * FROM event_expenses WHERE eventId = ?').all(event.id);
      const teamQuotas = db.prepare('SELECT * FROM event_team_quotas WHERE eventId = ?').all(event.id);
      return { ...event, expenses, teamQuotas, isActive: !!event.isActive, showOnDashboard: !!event.showOnDashboard };
    });
    res.json(result);
  });

  app.post('/api/events', (req, res) => {
    const event = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    
    db.transaction(() => {
      db.prepare(`
        INSERT INTO events (id, name, date, costValue, goalValue, cityId, isActive, showOnDashboard, ticketQuantity, ticketValue)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, 
        event.name, 
        event.date, 
        event.costValue, 
        event.goalValue, 
        event.cityId, 
        event.isActive ? 1 : 0, 
        event.showOnDashboard ? 1 : 0, 
        event.ticketQuantity, 
        event.ticketValue
      );

      if (event.expenses) {
        const insertExpense = db.prepare('INSERT INTO event_expenses (id, eventId, description, amount) VALUES (?, ?, ?, ?)');
        event.expenses.forEach((exp: any) => {
          insertExpense.run(Math.random().toString(36).substr(2, 9), id, exp.description, exp.amount);
        });
      }

      if (event.teamQuotas) {
        const insertQuota = db.prepare('INSERT INTO event_team_quotas (eventId, teamId, quotaValue) VALUES (?, ?, ?)');
        event.teamQuotas.forEach((quota: any) => {
          insertQuota.run(id, quota.teamId, quota.quotaValue);
        });
      }
    })();

    res.json({ id, ...event });
  });

  app.put('/api/events/:id', (req, res) => {
    const { id } = req.params;
    const event = req.body;
    
    db.transaction(() => {
      db.prepare(`
        UPDATE events SET name = ?, date = ?, costValue = ?, goalValue = ?, cityId = ?, isActive = ?, showOnDashboard = ?, ticketQuantity = ?, ticketValue = ?
        WHERE id = ?
      `).run(
        event.name, 
        event.date, 
        event.costValue, 
        event.goalValue, 
        event.cityId, 
        event.isActive ? 1 : 0, 
        event.showOnDashboard ? 1 : 0, 
        event.ticketQuantity, 
        event.ticketValue,
        id
      );

      // Simple approach: delete and recreate expenses/quotas
      db.prepare('DELETE FROM event_expenses WHERE eventId = ?').run(id);
      if (event.expenses) {
        const insertExpense = db.prepare('INSERT INTO event_expenses (id, eventId, description, amount) VALUES (?, ?, ?, ?)');
        event.expenses.forEach((exp: any) => {
          insertExpense.run(exp.id || Math.random().toString(36).substr(2, 9), id, exp.description, exp.amount);
        });
      }

      db.prepare('DELETE FROM event_team_quotas WHERE eventId = ?').run(id);
      if (event.teamQuotas) {
        const insertQuota = db.prepare('INSERT INTO event_team_quotas (eventId, teamId, quotaValue) VALUES (?, ?, ?)');
        event.teamQuotas.forEach((quota: any) => {
          insertQuota.run(id, quota.teamId, quota.quotaValue);
        });
      }
    })();

    res.json({ id, ...event });
  });

  app.delete('/api/events/:id', (req, res) => {
    const { id } = req.params;
    db.transaction(() => {
      db.prepare('DELETE FROM event_expenses WHERE eventId = ?').run(id);
      db.prepare('DELETE FROM event_team_quotas WHERE eventId = ?').run(id);
      db.prepare('DELETE FROM events WHERE id = ?').run(id);
    })();
    res.json({ success: true });
  });

  // Event Sales
  app.get('/api/event-sales', (req, res) => {
    const sales = db.prepare('SELECT * FROM event_sales').all();
    res.json(sales);
  });

  app.post('/api/event-sales', (req, res) => {
    const sale = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const stmt = db.prepare('INSERT INTO event_sales (id, eventId, teamId, memberId, buyerName, amount, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(id, sale.eventId, sale.teamId, sale.memberId, sale.buyerName, sale.amount, sale.status, sale.date);
    res.json({ id, ...sale });
  });

  // Payments
  app.get('/api/payments', (req, res) => {
    const payments = db.prepare('SELECT * FROM payments').all();
    res.json(payments);
  });

  app.post('/api/payments', (req, res) => {
    const payment = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const stmt = db.prepare('INSERT INTO payments (id, memberId, teamId, amount, date, referenceMonth, status, launchedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(id, payment.memberId, payment.teamId, payment.amount, payment.date, payment.referenceMonth, payment.status, payment.launchedBy);
    res.json({ id, ...payment });
  });

  // Financial Entities
  app.get('/api/financial-entities', (req, res) => {
    const entities = db.prepare('SELECT * FROM financial_entities').all();
    res.json(entities);
  });

  app.post('/api/financial-entities', (req, res) => {
    const entity = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const stmt = db.prepare('INSERT INTO financial_entities (id, name, year, createdBy, observations, initialBalance) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(id, entity.name, entity.year, entity.createdBy, entity.observations, entity.initialBalance);
    res.json({ id, ...entity });
  });

  // Financial Launches
  app.get('/api/financial-launches/:entityId', (req, res) => {
    const { entityId } = req.params;
    const launches = db.prepare('SELECT * FROM financial_launches WHERE entityId = ?').all(entityId);
    res.json(launches);
  });

  app.post('/api/financial-launches', (req, res) => {
    const launch = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const stmt = db.prepare('INSERT INTO financial_launches (id, entityId, type, category, amount, description, month, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(id, launch.entityId, launch.type, launch.category, launch.amount, launch.description, launch.month, launch.year);
    res.json({ id, ...launch });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
