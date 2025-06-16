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

// Conectar ao banco
connectDB();

// CORS configurado para aceitar apenas do front hospedado na Vercel
const allowedOrigins = [
  'https://motiv-ai.vercel.app',  // front deployado
  'http://localhost:3000'          // front local React
];

app.use(cors({
  origin: function(origin, callback){
    // Permite requests sem origem (como Postman, CURL)
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

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/tarefas', tarefaRoutes);
app.use('/api/metas', metaRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/ia', iaRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.send('API do Motiv.AI está no ar!');
});

// Porta
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
