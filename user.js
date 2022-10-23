const express = require('express')
const app = express()
const port = 3001;
const hbs = require('express-handlebars');
const mongoose = require("mongoose")
const User = require("./models/userSchema.js")
const bodyparser = require("body-parser")
const Flight = require("./models/flight.js")
const userFlight = require("./models/userFlights.js")
const session = require('express-session')

var flights = [];
var bookings = [];
var sess;

app.set('view engine', 'handlebars');
app.engine('handlebars', hbs.engine({
    layoutsDir: `${__dirname}/views/layout`
}))
app.use(express.json())
app.use(bodyparser({ extended: false }))
app.use(session({
    secret: 'key for security',
    resave: false,
    saveUninitialized: false
}))
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});
mongoose.connect('mongodb+srv://harsh_1209:Hcverma%401209@cluster0.i8ss2lw.mongodb.net/?retryWrites=true&w=majority').then(() => {
    console.log("database connected");
})

app.get('/', (req, res) => {

    res.render('signup', { layout: 'UserSignup' })
})
app.get('/login', (req, res) => {
    sess = req.session
    if (sess.email) {
        res.redirect('/searchFlight')
        // res.render('oth',{layout:'if'})
    } else {
        res.render('login', { layout: 'UserLogin' })
    }
})

app.get('/searchFlight', (req, res) => {
    sess = req.session;
    if (sess.email) {
        res.render('flights', { layout: 'searchFlight' })
    } else {
        res.redirect('/login')
    }
})
app.get('/flightsList', (req, res) => {
    res.render('flightList', { layout: 'FlightData', customers: flights })

})
app.get('/booking', async (req, res) => {

    try {
        bookings = await userFlight.find({ email: req.session.email }).lean()
        res.render('bookingsList', { layout: 'Bookings', bookedFlights: bookings })

    } catch {
        console.log("error");
    }

})
app.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/searchFlight')
        }
    });
})

app.post('/login', async (req, res) => {

    const data = await User.findOne({ $and: [{ password: req.body.Password }, { email: req.body.Email }] })
    if (data) {
        console.log();
        sess = req.session
        sess.email = req.body.Email
        res.redirect('/searchFlight')
    } else {
        res.jsonp('wrong password or email')

    }
})
app.post('/', async (req, res) => {

    try {
        if (req.body.password == req.body.confirmPassword) {
            const UserNew = new User(req.body)
            await UserNew.save()
            res.redirect('/login')
        } else {
            res.jsonp('confirm password doesnt match')
        }
    } catch {
        res.jsonp('user already exist')
    }
})

app.post('/searchFlight', async (req, res) => {
    try {
        flights = await Flight.find({ $or: [{ from: req.body.from }, { to: req.body.to }, { date: req.body.date }] }).lean()
        res.redirect('/flightsList')
    } catch {
        res.jsonp("NO FLIGHTS FOUND")
    }
})

app.post('/flightsList', async (req, res) => {
    Flight.findByIdAndUpdate(req.body.id, { booked: 'true' },
       async function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                const Userflight = new userFlight({
                    flightName: req.body.flightName,
                    seats: req.body.seats,
                    from: req.body.from,
                    to: req.body.to,
                    email: req.session.email,
                    date: req.body.date
                })
                await Userflight.save()
                res.redirect('/booking')
            }
        })
})
app.listen(port, () => {
    console.log("server connected on port 3001");
})