const express=require('express');
const app=express();
const path=require('path');


app.use(express.json()); 
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));


app.get('/',(req,res)=>{   
    res.render('index');
});
const { analysis } = require("./model/model.cjs"); // Adjust the path as necessary

app.use(express.json()); // Middleware to parse JSON request bodies

app.post('/getresult', async (req, res) => {
  const code = req.body.input;

  if (!code) {
    return res.status(400).json({ error: "Code input is missing" });
  }

  try {
    const result = await analysis(code);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

app.listen(3000,()=>{
    console.log('Server is running on localhost:3000');
}); 