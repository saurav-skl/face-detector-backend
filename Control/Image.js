const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "a556aa67827941a7a19ea02c39ab88f6",
});

const handleApi = (req, res) => {
    console.log("api url : "+ req.body);
  
      // Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
      // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
      // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
      // If that isn't working, then that means you will have to wait until their servers are back up. Another solution
      // is to use a different version of their model that works like: `c0c0ac362b03416da06ab3fa36fb58e3`
      // so you would change from:
      // .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      // to:
      // .predict('c0c0ac362b03416da06ab3fa36fb58e3', this.state.input)
      app.models
      // .predict('c0c0ac362b03416da06ab3fa36fb58e3', req.body.input)
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch(err => res.status(400).json(err + " Unable to work with api"))
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("person")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("unable to take entries"));
};

module.exports = {
  handleImage: handleImage,
  handleApi: handleApi,
};
