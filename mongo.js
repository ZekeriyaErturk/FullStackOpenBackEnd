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
