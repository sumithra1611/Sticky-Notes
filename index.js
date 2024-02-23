import express from 'express';

import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.static('public'));
app.use(express.json());

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
     host: PGHOST,
     database: PGDATABASE,
     username: PGUSER,
     password: PGPASSWORD,
     port: 5432,
     ssl: 'require',
     connection: {
          options: `project=${ENDPOINT_ID}`,
     },
});

app.post('/api/sync', async (req, res) => {

     const localNotes = req.body.notes;

     const dbNotes = await sql`select * from notes`;

     dbNotes.forEach(async (dbNote) => {
          const exist = localNotes.find((localNote) => localNote.id === +dbNote.id);
          if (!exist) {
               await sql`delete from notes where id=${dbNote.id}`
          }
     });

     localNotes.forEach(async (note) => {
          const existing = dbNotes.find(n => +n.id === note.id);
          if (!existing) {
               await sql`insert into notes(id, text) values (${note.id}, ${note.text})`
          } else {
               await sql`update notes set text=${note.text} where id=${note.id}`
          }
     });

     res.json({ status: 'ok' });
});

app.listen(3000, () => console.log('Server is running'));
