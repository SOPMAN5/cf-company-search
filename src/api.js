const express = require("express");
const serverless = require("serverless-http");
const cors = require('cors');
const app = express();
var axios = require('axios');
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(cors({ origin: true }));
let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
  }
  app.use(allowCrossDomain);

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});
router.post('/token', async (req, res) => {
  try{
   var FormData = require('form-data');
   var data = new FormData();
   //console.log( process.env.email, process.env.password)
   data.append('username', process.env.email );
   data.append('password', process.env.password ) ;
   data.append('scope', 'openid https://rfadevb2c.onmicrosoft.com/rfa-api/api-user offline_access');
   data.append('client_id', process.env.client_id);
   data.append('response_type', 'token');
   data.append('grant_type', 'password');
   
   var config = {
     method: 'post',
     url: 'https://rfadevb2c.b2clogin.com/rfadevb2c.onmicrosoft.com/B2C_1A_ROPC/oauth2/v2.0/token',
     headers: { 
       'Accept': '*/*', 
       'Cookie': 'x-ms-cpim-sso:rfadevb2c.onmicrosoft.com_0=m1.vPVpyh5cpSUudA5C.GLpLsE9eI76mVybRUZQQvA==.0.toSu9vtbJJ8pVzRh9oeVubXYgah5Is/jzEQZLbLDChDvDD0HPiTbhpLVOs62c0ck88mWoZqTKdARqafWf0pO6obsY2caYtbEi999+C9TKSu+PYhW4tjx0nPAleTGk8NBJgBq8Kh3hvRf2DRGN4VKkNf/MrnlYmh/sxVzHEdKJOoGc0qQbWsy+aOF/jjY9PirEVy2MzIcJBGhhyhbJIDuGxYF3SH+', 
       ...data.getHeaders()
     },
     data : data
   };
   
   axios(config)
   .then(function (response) {
   
     //console.log(JSON.stringify(response.data));
     res.status(200).json({'data':response.data})
   })
   .catch(function (error) {
     console.log(error);
     res.status(400).json({'data':'An error occured'})
   });
  }catch(e){
   console.log(e)
   res.status(400).json({'data':'An error occured'})
  } 

 
});
app.use(`/.netlify/functions/api`, router);
const PORT = process.env.port || 3005
app.listen(PORT,()=>console.log('Server is running'));
module.exports = app;
module.exports.handler = serverless(app);
