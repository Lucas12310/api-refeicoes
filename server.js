import "dotenv/config";
import app from "./src/app.js";

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', ()=>{
  console.log(`FUNCIONOU, ESTÁ RODANDO NA PORTA: http://localhost:${port}`);
})