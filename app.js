const express = require("express");
const { ERROR } = require("sqlite3");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("parent_star_names.db",sqlite3.OPEN_READWRITE,(ERROR)=>{
    if(ERROR){
    console.log(ERROR);
    return
    }
    console.log("Connecting!!!"); 
}
);
const app =  express();
//read json requests
app.use(express.json());
//must investigate joi library for validation 
// db.run("drop table parent_stars;");
// db.run("drop table parent_stars_details;");
db.run("create table if not exists parent_stars(name);");
db.run("create table if not exists parent_stars_details(type,temperature);");
const insert_query = 'INSERT INTO parent_stars(name) VALUES(?);'
const insert_query_details = 'INSERT INTO parent_stars_details(type,temperature) VALUES(?,?);'
//weird but okay
const select_query ="select * from parent_stars;"
const select_query_details ="select * from parent_stars_details;"
db.run(insert_query_details,["Yellow Dwarf","5000"])
db.run(insert_query,["Helio Lunaris"],(ERROR)=>{
    if(ERROR){
        console.log(ERROR);
        return
        }
        console.log("Initializing table "); 
});

db.all(select_query,[],(ERROR,rows)=>{

    rows.forEach((row)=>{
        console.log(row)
        if(!names.includes(row)){
        names.push(row)
        }
    });

});

db.all(select_query_details,[],(ERROR,rows)=>{

    rows.forEach((row)=>{
        console.log(row)
        if(!details.includes(row)){
        details.push(row)
        }
    });
  
});


const names =[]
const details =[]


app.get("/", (request,response) =>{
    response.send('this is a valid parent star name');
});

//creating an endpoint with filtered results
app.get("/api/names/filter",(request,response)=>{
    //returns all id values less than the request id value
    //you can use the 
    const idnum = names.filter(c => c.id < parseInt(request.body.id));
    //this value is based on results if the request has an id of 1 when there 
    //are three entries , idnum is still zero
    if(idnum==0){
    response.status(404).send("There is no ID less than the value provided")
        return
    }
    response.send(idnum)

});
//find exactID Value
app.get("/api/names/exact",(request,response)=>{
    //returns all id values less than the request id value
    //you can use the 
    const idnum = names.find(c => c.id === parseInt(request.body.id));
    //this value is based on results if the request has an id of 1 when there 
    //are three entries , idnum is still zero
    if(idnum==null){
    response.status(404).send("There is no ID less than the value provided")
        return
    }
    response.send(idnum)

});



//better than if when using structure compared to using ifs
app.get('/api/names/:prefix', (request,response) =>{
   const nameprefix = names.find(c => c.name === request.params.prefix);
   if(!nameprefix) response.status(404).send("That is not a valid star name");
   response.send(nameprefix);
});

app.post('/api/names', (request,response) =>{

    if(!request.body.name || request.body.name.length < 4){
        //four is inclusive 
        response.status(400).send("The requested star name is invalid ")
        return
        //stop the execution of the rest of the program
    }
    const name={
 id: names.length+1,
 name: request.body.name
    }
    names.push(name);
    response.send(name)
});

app.get('/api/names', (request,response) =>{
    response.send(names);
});

app.get('/api/star/details/:type', (request,response) =>{
    const type = details.find(c => c.type === request.params.type);
    if(!type) response.status(404).send("That is not a valid star type");
    response.send(type)
});

app.put('/api/names', (request,response) =>{
    const nameprefix = names.find(c => c.id === parseInt(request.body.id));
    if(!nameprefix) response.status(404).send("That is not a valid star name");

    nameprefix.name = request.body.name;
    response.send(names);
    print(request)
 });

//Post-create
//get-read
//put-update
//Delete=delete
 function print(text){
    console.log(text)
 }

 function createtable(){
    return names;
 }




//use this for dynamic ports 
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('listening on port '+port));


