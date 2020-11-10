const ErrorResponse = require("../middlewares/error");
const path = require("path");

const uploadFiles = (rules) => async(req, res, next) => {


    //Check If files are included
    if(!req.files){
        return next(new ErrorResponse("Please upload at least one design files", 400));
    }
    const files = req.files.files;
    let filenames= new Array();

    //Extension Checker Regex
    let fileRegex;
    if(rules.regex){
        fileRegex = new RegExp(rules.regex);
    }

    //Allowed Extensions
    const extenstionsAllowed = [
        "jpg","jpeg","jpe","jfif","png","pdf","doc","docx","xls","tif","tiff","gif","pcx","cdr","cpt","ai","eps","wmf","pct","bmp"
    ]

    //Converting into a String to show
    const extensionString = extenstionsAllowed.join(", ");
    
    //Upload and get file names
    //Check If Single or Multiple Files
    if(files.length){
        //Lopping through files
        files.forEach(file => {
            if(rules.regex){
                if(!file.name.match(fileRegex)){
                    return next(new ErrorResponse({
                        type: `Extension ${path.parse(file.name).ext} is not allowed`,
                        message: `Only ${extensionString} are allowed to upload`
                    }, 400));
                }
            }
            if(rules.size){            
                if(!file.size > rules.size){
                    return next(new ErrorResponse(`Only File Size less than ${rules.size / 10000} MB allowed`, 400));
                }
            }
            let filename = `file_${req.user.id}_${file.name}`;
            file.mv(`${rules.path}/${filename}`, async err => {
                if(err){
                    console.log(err);
                    return next(new ErrorResponse("Problem while uploading files", 500));
                }
            })
            filenames.push(filename);
        });
    }
    else{
        //Single File
        if(rules.regex){
            if(!files.name.match(fileRegex)){
                return next(new ErrorResponse({
                    type: `Extension ${path.parse(files.name).ext} is not allowed`,
                    message: `Only ${extensionString} are allowed to upload`
                }, 400));
            }
        }
        if(rules.size){            
            if(!files.size > rules.size){
                return next(new ErrorResponse(`Only File Size less than ${rules.size / 10000} MB allowed`, 400));
            }
        }
        let filename = `file_${req.user.id}_${files.name}`;
        files.mv(`${rules.path || process.env.FILE_UPLOAD_PATH}/${filename}`, async err => {
            if(err){
                console.log(err);
                return next(new ErrorResponse("Problem while uploading files", 500));
            }
        })
        filenames.push(filename);        
    }

    res.filenames = filenames;
    next();
}

module.exports = uploadFiles;