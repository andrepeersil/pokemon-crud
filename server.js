const express = require('express');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');  
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());  
app.use(express.json());

let pokemons = require('./pokemons.json');
app.use(express.json());

app.get('/pokemons', (req, res) => {
    res.json(pokemons);
});

app.get('/pokemon/:name', async (req, res) => {
    const pokemonName = req.params.name;

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ message: 'Pokémon não encontrado' });
    }
});

// Rota para criar um Pokémon (simulando um banco de dados)
app.post('/pokemons', (req, res) => {
    const newPokemon = req.body;
    pokemons.push(newPokemon);
    try {
        fs.writeFileSync('pokemons.json', JSON.stringify(pokemons, null, 2));
        console.log("Arquivo pokemons.json atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar o arquivo:", error);
    }
    res.status(201).json(newPokemon);
});

// Rota para atualizar um Pokémon
app.put('/pokemons/:name', (req, res) => {
    const name = req.params.name;
    const updatedData = req.body;

    let found = false;
    pokemons = pokemons.map(pokemon => {
        if (pokemon.name === name) {
            found = true;
            return { ...pokemon, ...updatedData };
        }
        return pokemon;
    });

    if (found) {
        res.json({ message: 'Pokémon atualizado!' });
    } else {
        res.status(404).json({ message: 'Pokémon não encontrado!' });
    }
});

// Rota para excluir um Pokémon
app.delete('/pokemons/:name', (req, res) => {
    const name = req.params.name;
    pokemons = pokemons.filter(pokemon => pokemon.name !== name);

    res.json({ message: 'Pokémon excluído!' });
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


