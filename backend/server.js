const express=require('express');
const bodyparser=require('body-parser');
const app=express();
const ports=process.env.PORT||3000;

const authRoutes=require('./routes/auth');

const errorController=require('./controllers/error');

app.use(bodyparser.json());

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
  res.setHeader('Access-Allow-Headers','Content-Type,Authorization');
  next();
});

app.use('/auth',authRoutes);

app.use(errorController.get404);
app.use(errorController.get500);

app.listen(ports,()=>console.log(`Listening on ${ports}`));
