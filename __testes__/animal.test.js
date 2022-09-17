const fs = require('fs');
const request = require('supertest');
const app = require('../src/app');
const animalsData = require('../src/data/animals.json');

describe('Cadastro de animais', () => {
    afterAll(() => {
        while(animalsData.length > 0){
            animalsData.pop(); 
        }

        fs.writeFileSync('src/data/animals.json', JSON.stringify(animalsData));
    });

    it('Deve cadastrar um animal com sucesso', async () => {
        const res = await request(app).post('/animais?nome=Spike&especie=Cachorro&idade=3');
        expect(res.status).toBe(201);
    });

    it('Deve falhar no cadastro de um animal, idade inválida', async () => {
        const res = await request(app).post('/animais?nome=Mimi&especie=Gato&idade=jovem');
        expect(res.status).toBe(400);
    });

    it('Deve falhar no cadastro de um animal, nome inválido', async () => {
        const res = await request(app).post('/animais?nome=J&especie=Hamster&idade=1');
        expect(res.status).toBe(400);
    });
});

describe('Retorno de animais', () => {
    beforeAll(() => {
        animalsData.push({
            'id': 'idteste1',
            'nome': 'Mel',
            'especie': 'Cachorro',
            'idade': 3
        });

        animalsData.push({
            'id': 'idteste2',
            'nome': 'Patrick',
            'especie': 'Cachorro',
            'idade': 2
        });

        animalsData.push({
            'id': 'idteste3',
            'nome': 'Fiona',
            'especie': 'Cachorro',
            'idade': 6
        });

        fs.writeFileSync('src/data/animals.json', JSON.stringify(animalsData));
    });

    afterAll(() => {
        while(animalsData.length > 0){
            animalsData.pop(); 
        }

        fs.writeFileSync('src/data/animals.json', JSON.stringify(animalsData));
    });

    it('Deve retornar uma resposta contendo 3 animais', async () => {
        const res = await request(app).get('/animais');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(3);
    });
});