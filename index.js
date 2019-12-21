import express from 'express'
// import bodyParser from 'body-parser'

// import hubs from './data/hubs-model';
import { hubs } from './data/simulatedDB';
const {
    find,
    findById,
    add,
    remove,
    update
  } = hubs;

  
const server = express();
// server.use(bodyParser.json());
server.use(express.json());// does the same thing as body-parser

server.get('/', async (req, res) => {
    console.log('...inside the get request');
    // res.send('<h2>Hello world</h2>');
    const result = await find();
    res.send(result);
});

server.get('/hubs', async (req, res) => {
    // find()
    //     .then(allHubs => {
    //         res.send(allHubs);
    //     })
    //     .catch(err => {
    //         res.status(500).send(err);
    //     });
    
    find()
        .then(allHubs => {
            res.json(allHubs);
        })
        .catch(({code, message}) => {
            res.status(code).json({err: message});
        });
});

server.get('/now', (req, res) => {
    const now = new Date();
    res.send(`<h2>${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`)
});

server.post('/hubs', (req, res) => {
    const newHub = req.body;
    add(newHub)
        .then(addHub => {
            res.status(201).json(addHub);
        })
        .catch(({ code, messae }) => {
            res.status(code).json({ err: message });
        });
});

// Destroy - remove a hub
server.delete('/hubs/:id', (req, res) => {
    const { id } = req.params;
    remove(id)
        .then(removedHub => {
            res.json(removedHub);
        })
        .catch(({code, message}) => {
            res.status(code).json({ err: message });
        });
});


// Update - alter a hub
server.put('/hubs/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    hubs.update(id, changes)
        .then(updatedHub => {
            if (updatedHub) {
                res.json(updatedHub);
            } else {
                res.status(404).json({ err: 'Hub not found' });
            }
        })
        .catch(({ code, message }) => {
            res.status(code).json({ err: message });
        });
});


server.get('/hubs/:id', (req, res) => {
    const { id } = req.params;
    findById(id)
        .then(hub => {
            res.json(hub);
        })
        .catch(({ code, message }) => {
            res.status(code).json({ err: message });
        });
});

server.listen(9090, () => {
    console.log('server learning on port 9090');
});