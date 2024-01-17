import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());




//connect to db
import pg from "pg";

const dbConnectionString = process.env.DATABASE_URL;
export const db = new pg.Pool({
    connectionString: dbConnectionString,
});

//start server
app.listen(8080, () => {console.log('Server running on port 8080!');})
// root route
app.get("/",(req,res) => {
    {res.json('Looking at root route, how rude!')}
})
// get all rows
app.get("/rows", async (req,res) =>{
const result = await db.query("SELECT * FROM testtable");
return res.json(result.rows);
})
//get all names
app.get("/names", async (req,res) => {
    const result = await db.query("SELECT * FROM testtable");
    const names = result.rows.map(row => ({name:row.name}));
    return res.json(names);
})
//get row by param id
app.get("/row:id", async (req,res) => {
    const id = req.params.id;
    const result = await db.query("SELECT * FROM testtable WHERE id = $1", [id]);
    return res.json(result.rows[0]);
})
//inserting new row (postman)
app.post("/insert", async (req, res) => {
    const { name, age } = req.body;

    const result = await db.query(
        "INSERT INTO testtable (name, age) VALUES ($1, $2) RETURNING *",
        [name, age]
    );

    return res.json(result.rows[0]);
});
//updating row (postman)
app.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const { name, age } = req.body;

    const result = await db.query(
        "UPDATE testtable SET name = $1, age = $2 WHERE id = $3 RETURNING *",
        [name, age , id]
    );

    return res.json(result.rows[0]);
});
//deleting a row (postman)
app.delete("/delete/:id", async (req,res) => {
    const id = req.params.id;
    
    const result = await db.query("DELETE FROM testtable WHERE id = $1 RETURNING *", [id]);
    return res.json(result.rows[0]);
})
