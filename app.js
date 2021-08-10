const express=require("express");
const app=express();
const https = require("https");
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/weather",function(req,res){
  res.sendFile(__dirname+"/weather.html")
})

app.post("/weather",function(req,res){
  const cityName=req.body.cityname;
  const url=""
  https.get(url,function(response){
    response.on("data",function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const descrip = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageUrl = "http://openweathermap.org/img/wn/"+icon+"@2x.png"
      res.write("<h1>The temperature at "+cityName+" is "+temp+"</h>");
      res.write("<p>the weather is currently "+descrip+"</p>");
      res.write("<img src="+imageUrl+">");
      res.send();
    })
  });
});

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
  const firstName=req.body.firstname;
  const lastName=req.body.lastname;
  const email=req.body.email;
  const data={
    members:[{
      email_address:email,
      status:"subscribed",
      merge_fields:{
        FNAME:firstName,
        LNAME:lastName
      }
    }]
  }
  //console.log(data);// it is in json form structure we have to convert instingfy form
  const jsonData = JSON.stringify(data);
  const url=""
  const options={
    method:"POST",
    auth:""
  }

  const request=https.request(url,options,function(response){
    if(response.statusCode == 200){
      res.sendFile(__dirname+"/successful.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function(data){
      // console.log(JSON.parse(data));
    })
  })

  app.post("/failure",function(req,res){
    res.redirect("/");
  })

  request.write(jsonData);
  request.end();

})



app.listen(process.env.PORT || 3000,function(){
  console.log("server is started at port 3000");
})


