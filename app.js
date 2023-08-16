import express from "express"
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

const app = express()
const port = 8200

app.listen(port, () => {
    console.log(`Server is up and running on port:${port}`);
})

const users = [{id: uuid(), email: '1@a', password: '123'}, {id: uuid(), email: '2@b', password: '456'}, {id: uuid(), email: '3@c', password: '789'}]

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server Working!')
    });

app.get('/users', (req, res) => {
    const allUsers = users.map(element => ({
        id: element.id,
        email: element.email,
        password: element.password
    }));
    res.send(allUsers);
});

app.get('/users/:id', (req, res) => {
    const user = users.find(element => String(req.params.id) === element.id);
    if (user) {
        const userId = `id: ${user.id}, email: ${user.email}, password: ${user.password}`;
        res.send(userId);
    } else {
        res.status(404).send('User not found');
    }
});

app.post('/users', (req, res) => {
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if (err) {
        res.send('The password is not sufficiently encrypted');
    } else {
    }
    const user = req.body
    user.password = hash
    user.id = uuid();
    users.push(user)
    res.send('The user added successfully');
});
});

app.put('/users/:id', (req, res) => {
    const user = users.findIndex(element => String(req.params.id) === element.id);
    if (user !== -1) {
        delete users[user]
        users[user] = req.body
        res.send('User update successfully')
    }
});

app.post('/login', (req, res) => {
    const user = users.find(element => req.body.email === element.email)
    if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                res.status(500).send('Internal Server Error');
            } else if (result) {
            res.send('User is connected');
            } else {
            res.send('Wrong credentials');
            }
        });
    } else {
        res.send('User not found');
    }
});
