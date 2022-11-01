const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

// To get the static files to server use express.static
app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
    const f_name = req.body.firstName;
    const l_name = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: f_name,
                    LNAME: l_name
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = 'https://us14.api.mailchimp.com/3.0/lists/d2cc2b5d14';
    const options = {
        method: "POST",
        auth: "manju:seb37c20427d6bc2fc47ef08564c2d56e-us14"
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode == 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});
app.post("/failure", function(req,res){
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(){
    console.log("Listening to port 3000....");
});


// api key
// eb37c20427d6bc2fc47ef08564c2d56e-us14

//list id
// d2cc2b5d14