require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');  
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());  
app.use(express.json());

// Conexão com o banco de dados PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
 });

app.use(express.static('public'));

// Função para pegar todos os pokémons
app.get('/pokemons', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM pokemons');
      res.json(result.rows); // Retorna os Pokémons do banco de dados
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar Pokémons', error });
    }
  });
  
  // Função para pegar um Pokémon específico
  app.get('/pokemon/:name', async (req, res) => {
    const pokemonName = req.params.name;
    try {
      const result = await pool.query('SELECT * FROM pokemons WHERE name = $1', [pokemonName]);
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Pokémon não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar Pokémon', error });
    }
  });
  
  // Função para adicionar um Pokémon
  app.post('/pokemons', async (req, res) => {
    const { name, type } = req.body;
    try {
      const result = await pool.query('INSERT INTO pokemons (name, type) VALUES ($1, $2) RETURNING *', [name, type]);
      res.status(201).json(result.rows[0]); // Retorna o Pokémon adicionado
    } catch (error) {
      res.status(500).json({ message: 'Erro ao adicionar Pokémon', error });
    }
  });
  
  // Função para atualizar um Pokémon
  app.put('/pokemons/:name', async (req, res) => {
    const name = req.params.name;
    const { type } = req.body;
    try {
      const result = await pool.query('UPDATE pokemons SET type = $1 WHERE name = $2 RETURNING *', [type, name]);
      if (result.rows.length > 0) {
        res.json({ message: 'Pokémon atualizado', pokemon: result.rows[0] });
      } else {
        res.status(404).json({ message: 'Pokémon não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar Pokémon', error });
    }
  });
  
  // Função para excluir um Pokémon
  app.delete('/pokemons/:name', async (req, res) => {
    const name = req.params.name;
    try {
      const result = await pool.query('DELETE FROM pokemons WHERE name = $1 RETURNING *', [name]);
      if (result.rows.length > 0) {
        res.json({ message: 'Pokémon excluído', pokemon: result.rows[0] });
      } else {
        res.status(404).json({ message: 'Pokémon não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir Pokémon', error });
    }
  });
  


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


