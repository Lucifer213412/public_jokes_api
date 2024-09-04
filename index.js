import express, { response } from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app=express();
const port= 3000;
const base="https://sv443.net/jokeapi/v2"

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.render("index.ejs",{content:"Welcome! Submit the form to get a joke."});
    console.log(req.body);

});

app.post("/submit",async (req,res)=>{
    const name = req.body.name;
    const categories=Array.isArray(req.body.cat) ? req.body.cat.join(',') : req.body.cat || '';
    const categorySelect = req.body.categoryselect==="multi"? categories:req.body.categorySelect||"Any";
   // const categories = req.body.cat || []; // array of selected categories
   
   // const flags = req.body.flag || []; // array of selected flags
    //const flags = req.body.flag?req.body.flag.join(','):'';

    const flags = Array.isArray(req.body.flag) ? req.body.flag.join(',') : req.body.flag || '';

   // const jokeTypes = req.body.type || []; // array of selected joke types
   //const jokeTypes = req.body.type?req.body.type.join(','):'';

   const jokeTypes = Array.isArray(req.body.type) ? req.body.type.join(',') : req.body.type || '';


   // const searchString = req.body.search;
    const searchString = req.body.search||name||'';



    console.log('Category Select:', categorySelect);
    console.log('Categories:', categories);     
    console.log('Flags:', flags);
    console.log('Joke Types:', jokeTypes);
    console.log('Search String:', searchString);
    console.log('Name:', name);

    try{
       // const response = await axios.get(`${base}/joke/${categorySelect}?
           // flags=${flags.join(',')}&type=${jokeTypes.join(',')}&contains=${searchString}`);

           const response = await axios.get(`${base}/joke/${categorySelect}`, {
            params: {
                blacklistFlags: flags,
                type: jokeTypes,
                contains: searchString,
            }
        });

            console.log(response.data);
            res.render("index.ejs",{
                content:JSON.stringify(response.data),
                joke:response.data.joke?response.data.joke:response.data.setup,
                delivery:response.data.delivery?response.data.delivery:''
            });

    }catch(error){
       //res.render("index.ejs",{content:error.response.data});
        res.statusCode;

    }
   
});

/*app.get("/",async(req,res)=>{
    const category=req.body.categoryselect

    try{
   response= await axios.get(base +"/joke");
}
catch(error){
    console.error(error);
}
});*/





app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});