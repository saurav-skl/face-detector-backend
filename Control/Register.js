const handleRegister = (req,res,db,bcrypt) => {
  const { email, name, password } = req.body;
  console.log(password);
  const hash = bcrypt.hashSync(password, 10);
  // console.log(email,hash);
  db.transaction((trx) => {
    trx
      .insert(
        {
          hash: hash,
          email: email,
        },
        "id"
      )
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        // console.log(loginEmail[0]);
        return trx("person")
          .returning("*")
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date(),
          })
          .then((user) => {
            console.log(user);
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json(err + "   unable to register"));
};


module.exports = {
    handleRegister:handleRegister
}