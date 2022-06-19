import express from 'express';
import { Request, Response } from 'express'; //Here, I import Request and Response from express so that I can use them to get user's request and respond with a response
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // My solution Oluwatobi Emmanuel Babalola
  // declare endpoint /filteredimage i.e GET /filteredimage?image_url={{URL}}
  // declare userReq (User's Request) and userRes (User's Response-response sent to user)
  
  // endpoint to accept image_url query parameter and filter an image from a public url.
  app.get( "/filteredimage", ( userReq: Request, userRes: Response ) => {
    let  {image_url}  = userReq.query; 

// 1. validate the image_url query
    if ( !image_url ) {
      return userRes.status(400)
                .send(`image_url is required`);
    }

//  2. call filterImageFromURL(image_url) to filter the image
 filterImageFromURL(image_url).then(imagePath =>{

//    3. send the resulting file in the response
//check if imagePath is returned after filter 
if (imagePath !=='undefined' && imagePath!=='' ) {
  //send file in user response
 return userRes.status(200).sendFile(imagePath);
}else{ 
  // 4. deletes any files on the server on finish of the response
deleteLocalFiles([imagePath]);
return  userRes.status(400).send(`An error occured, please try again later`);
}

//   
 }
  
  ).catch(errMessage =>{
    return userRes.status(422).send(errMessage);
  })

/*
    return userRes.status(200)
              .send(`Welcome to the Cloud, ${image_url}!`); */
  } );
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();