const { summarise } = require("./summarise");

const result = await summarise(
  "Joel: We should go watch a movie.\nPaul: Oppenheimer?\nJoel: Yeah!!\nPaul: NO WAY ITS SO COOL :D"
);

console.log(result);
