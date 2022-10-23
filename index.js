const express  = require('express');
const app =express()
const port =3000;
const mongoose = require("mongoose")
const handlebars = require('express-handlebars')
const bodyparser = require('body-parser')
const Admin = require("./models/admin.js")
const Flight = require("./models/flight.js")
const session = require('express-session')

var sess;
var booked=[];

app.set('view engine', 'handlebars');
app.engine('handlebars',handlebars.engine ({
    layoutsDir :  `${__dirname}/views/layout`
}))

app.use(session({
    secret:'key for security',
    resave:false,
    saveUninitialized: false
}))
app.use(express.json())
app.use(express.static('public'))
app.use(bodyparser({extended:false}))
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });

mongoose.connect('mongodb+srv://harsh_1209:Hcverma%401209@cluster0.i8ss2lw.mongodb.net/?retryWrites=true&w=majority').then(()=>{
  console.log("database connected");
})


app.get('/',(req,res)=>{
 sess = req.session
 console.log(sess);
    if(sess.email){
        res.redirect('/admin')
        // res.render('oth',{layout:'if'})
    } else{
        res.render('main',{layout:'index'});
    }

})


app.get('/admin',(req,res)=>{

sess = req.session
    if(!sess.email){
        res.redirect('/')
    } else{
        res.render('oth',{layout:'if'})
    }
})

app.get('/logout',(req,res)=>{
    req.session.destroy(function(err){  
        if(err){  
            console.log(err);  
        }  
        else  
        {  
            res.redirect('/admin')
        }  
    });  })

app.get('/booked',async(req,res)=>{
    try{
        booked = await Flight.find({booked:true}).lean()
        res.render('bookedFlights', { layout: 'Booked',bookedFlights:booked })
    }catch{
        res.jsonp("oops something went wrong")
    }
})

app.post('/',async(req,res)=>{
    const data = await Admin.findOne({$and :[{password:req.body.Password},{email:req.body.Email}]})
 
    if(data){
     sess = req.session
     sess.email = req.body.Email
     res.redirect('/admin')      
     console.log(sess);
    }else{
     res.jsonp('wrong password or email')
 
    }
 })

app.post('/admin',async(req,res)=>{
      try{

        const flightNew = new Flight(req.body)
         await flightNew.save()
         res.render('oth',{layout:'if'})
        }catch{
       res.jsonp('OOps something went wrong')
      }

      
      
})



app.listen(port,()=>{
    console.log('connection successfull');
})


