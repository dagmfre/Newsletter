const express = require ("express");
const https = require("https");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Public"));

app.post("/", (req,res)=>{
    const members = {       // the data we should sent to mailchimp(user's information)
        members: [
            {
                email_address: req.body.Email,
                status: "subscribed",
                merge_fields: {
                    FNAME: req.body.FirstName,
                    LNAME: req.body.SecondName
                }
            }
        ]
    }
    
    let data = JSON.stringify(members);     //  changing the data above to a JSON format

    const url = "https://us21.api.mailchimp.com/3.0/Lists/adf85ccdb3";  // the url endpoint(with the audience/list id and us# added)  
    const options = {     // the option(with a post req.method and authentication) that we should sent to mailchimp
        method: "POST",
        auth: "user:fca07216d2f698d193f6ff245a8167bd-us21"
    }

    const request = https.request(url, options, (response)=>{ // - sending a post request to mailchimp and assigning the http request to a variable called "request"
        response.on("data", (fdata)=>{    
            console.log(JSON.parse(fdata)) 
            if ((response.statusCode === 200) && (JSON.parse(fdata).error_count === 0)) {
                res.sendFile(__dirname + "/success.html")
            }
            else{
                res.sendFile(__dirname + "/failer.html")
            } 
            }
        )
    })
    
    request.write(data);    // - this method is used to send the "data" as the request body
    request.end();          // - the second method is used to indicate that the request is complete 
                            // and should be sent to the server
})

app.post("/failer", (req,res)=>{  // to let users e redirected to the root route("/") when they click the button
    res.redirect("/")
})

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html")
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log("server is running on port 3000");
})