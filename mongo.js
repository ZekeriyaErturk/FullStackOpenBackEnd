const mongoose = require("mongoose");

if (process.argv.length < 5 && process.argv.length > 3) {
  console.log("Missing argument: node mongo.js <password> <name> <number>");
  process.exit();
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://admin:${password}@cluster0.zhea0.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

if (name && number) {
  const person = new Person({
    name: name,
    number: +number,
  });

  person.save().then((res) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((res) => {
    console.log("phonebook:");
    res.forEach((p) => {
      console.log(p.name, p.number);
    });

    mongoose.connection.close();
  });
}
