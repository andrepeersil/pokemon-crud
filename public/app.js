document.addEventListener('DOMContentLoaded', () => {
    const createForm = document.getElementById('createForm');
    const updateForm = document.getElementById('updateForm');
    const deleteForm = document.getElementById('deleteForm');
    const pokemonList = document.getElementById('pokemonList');

    const loadPokemons = async () => {
        const response = await fetch('http://pokemon-crud-production.up.railway.app/pokemons');
        const pokemons = await response.json();
        
        console.log(pokemons);  // Verifique os dados recebidos da API
        
        pokemonList.innerHTML = pokemons.map(pokemon => `
            <div><strong>${pokemon.id} - ${pokemon.name}</strong> - ${pokemon.type}</div>
        `).join('');
    };
    
    // Adicionar um Pokémon
    createForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const id = document.getElementById('id').value;
        const name = document.getElementById('name').value;
        const type = document.getElementById('type').value;

        const response = await fetch('http://pokemon-crud-production.up.railway.app/pokemons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id, name, type})
        });

        if (response.ok) {
            loadPokemons(); // Atualiza a lista de Pokémons
        }
    });

    // Atualizar um Pokémon
    updateForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('updateName').value;
        const type = document.getElementById('updateType').value;

        const response = await fetch(`http://pokemon-crud-production.up.railway.app/pokemons/${name}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type })
        });

        if (response.ok) {
            loadPokemons(); // Atualiza a lista de Pokémons
        }
    });

    // Deletar um Pokémon
    deleteForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('deleteName').value;

        const response = await fetch(`http://pokemon-crud-production.up.railway.app/pokemons/${name}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            loadPokemons(); // Atualiza a lista de Pokémons
        }
    });

    loadPokemons();

});
