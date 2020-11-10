const { asyncHandler } = require("../middlewares/asyncHandler")
const ErrorResponse = require("../middlewares/error")
const Mail = require("../models/mails");
//Mailer Helper Functions
var imaps = require('imap-simple');
const _ = require("lodash");
const simpleParser = require('mailparser').simpleParser;
const {decrypt} = require("../utils/crypto");

//@desc     Mailer Login
//@route    POST api/v1/mails/ 
//@scope    Private/Admin
exports.mailLogin = asyncHandler(async (req, res, next) => {
    const {email, password, host, port} = req.body;

    //Check for email and password
    if(!email || !password || !host || !port ){
        return next(new ErrorResponse("Please provide email, password, host and port", 400));
    } 
    var mailData = [];

    //Mailer Config
    var config = {
        imap: {
          user: email,
          password: password,
          host: host,
          port: port,
          tls: true,
          authTimeout: 5000,
          tlsOptions: {
            rejectUnauthorized: false,
          },
        },
      };
      
      try{
        const result = await imaps.connect(config);
        if(!result){
            return next(new ErrorResponse(`Unable to connect to the mail provider`, 500));
        }
        const user = await Mail.create(req.body);
        res.status(200).json({
            success: true,
            data: user
        })
        
        
      }
      catch(error){
            return next(new ErrorResponse(`${error}`, 400));
      }
    
})

//@desc     Read Mails by profile
//@route    GET api/v1/mails/:id
//@scope    Private/Admin

exports.readMails = asyncHandler(async (req, res, next) => {

    const user = await Mail.findById(req.params.id).select('+password');
    if(!user){
        return next(new ErrorResponse(`User with id ${req.params.id} not found`, 404));
    }

    var mailData = [];
    const hash = {
        iv: user.iv,
        content: user.password
    }
    console.log(hash);
    const password = decrypt(hash);

    //Mailer Config
    var config = {
        imap: {
          user: user.email,
          password:password,
          host: user.host,
          port: user.port,
          tls: true,
          authTimeout: 5000,
          tlsOptions: {
            rejectUnauthorized: false,
          },
        },
      };
    
    try{
        const result = await imaps.connect(config);
        const box = await result.openBox('INBOX');
            var searchCriteria = [
               ['FROM', 'gsansoa16@gmail.com']
            ];
        
        var fetchOptions = {
            bodies: ['HEADER', 'TEXT', '']
        };
        const data = await result.search(searchCriteria, fetchOptions);

        let body = [];
        data.forEach(function (item) {
            var all = _.find(item.parts, { "which": "" })
            var id = item.attributes.uid;
            var idHeader = "Imap-Id: "+id+"\r\n";
            body.push(idHeader+all.body);
        });
    
    
        for(let i=0; i< body.length; i++){
            mailData.push(await parser(body[i]))
        }

        let mailBody = [];

        mailData.forEach(element => {
            mailBody.push({
                subject: element.subject,
                from: element.from.value[0].address,
                message: element.html
                
            });
        });
        res.status(200).json({
            success: true,
            data: req.body,
            mailData: mailBody,
        })
    }
    catch(error){
        return next(new ErrorResponse(error, 400));
    }
})




async function parser(body){
    return await simpleParser(body);
}