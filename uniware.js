const uniwareAuthUrl = `https://physicswallah.unicommerce.com/oauth/token?grant_type=password&client_id=my-trusted-client&username=rishish.shukla@pw.live&password=Rishish@77`;
let uniwareAccessToken = "35aeb7de-4b5c-490e-898f-3e90338ed4e6";
let uniwareRefreshToken = "4de369ad-38db-420d-9184-cea5f3eaadac";

const getAuthentication = (req, res, next)=>{
    axios({
        method: 'GET',
        baseURL: "https://physicswallah.unicommerce.com",
        url: uniwareAuthUrl,
        headers: {'Content-Type': 'application/json'},
    }).then((res)=>{
        // console.log(res);
        uniwareAccessToken = res.data.access_token;
        next();
    })
} 

app.get("/",getAuthentication  , async (req,res,next)=>{

    axios({
        method: 'POST',
        baseURL: "https://physicswallah.unicommerce.com",
        url: "/services/rest/v1/product/itemType/search",
        headers: {'Content-Type': 'application/json', 'Authorization': `bearer ${uniwareAccessToken}`},
        data: {"getInventorySnapshot": true,}
    }).then((resp)=>{
        // console.log(resp.data)
        res.send(resp.data)
        // res.render("index.ejs",{elements: resp.data.elements})
    }).catch((err)=>{
        res.send(err)
        console.log(err)
    })

    // res.send("axios2")
})



