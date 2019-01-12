const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

// middleware which logs to a file page requests
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('path_requests.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append  to server.log')
        }
    });
    next();
});

// bypasses all other routes
// app.use((req, res, next) => {
//     res.render('maintenance.hbs')
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});
  
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website'
    });
});

app.get('/about',(req, res)=>{
    res.render('about.hbs', {
        pageTitle: 'About',
        currentYear: new Date().getFullYear()
    })
});

app.get('/projects',(req, res)=>{
    res.render('projects.hbs', {
        pageTitle: 'Projects',
    })
});

app.get('/error',(req, res)=>{
    res.send({
        error: 'page not found',
        GoTo: [
            'home',
            'back'
        ]
    });
});


app.listen(port, () => {
    console.log(`app is runnnig on PORT:${port}`)
});
