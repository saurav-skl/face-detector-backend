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
    handleImage:handleImage
}