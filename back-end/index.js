const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const tarefaRoutes = require('./routes/tarefaRoutes');
const metaRoutes = require('./routes/metaRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const iaRoutes = require('./routes/iaRoutes');
require('dotenv').config();

const app = express();

connectDB();

const allowedOrigins = [
  'https://motiv-ai.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'Acesso CORS negado pela política de segurança.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tarefas', tarefaRoutes);
app.use('/api/metas', metaRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/ia', iaRoutes);

app.get('/', (req, res) => {
  res.send('API do Motiv.AI está no ar!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
