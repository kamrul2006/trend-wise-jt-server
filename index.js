const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser')
require('dotenv').config()

const port = process.env.PORT || 5000

const app = express();



// -----------middleware-----
app.use(cors(
    {
        origin: ['http://localhost:3000',
            'http://localhost:3000',
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
))
app.use(express.json())
app.use(cookieParser());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8jqou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        // ----------------collection------------------
        const PostsCollection = client.db("kblogify").collection('posts')


        // ----------------------------------------------------------------------------------------
        //------all POSTS ---------
        // ----------------------------------------------------------------------------------------

        // ---------------get all POSTS----------------
        app.get("/Posts", async (req, res) => {
            const result = await PostsCollection.find().toArray();
            res.send(result)
        })

        // ----------------------get POSTS by id -----------------------------
        app.get("/POSTS/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }

            const result = await PostsCollection.findOne(query)
            res.send(result)
        })



        //----------add POSTS--------
        app.post('/Posts', async (req, res) => {
            const review = req.body
            const result = await PostsCollection.insertOne(review)
            res.send(result)
        })

        //---------- DELETE POSTSs by id----------------
        app.delete("/POSTS/:id", async (req, res) => {
            const { id } = req.params;
            try {
                const result = await PostsCollection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount === 1) {
                    res.status(200).json({ message: "POSTS deleted successfully." });
                } else {
                    res.status(404).json({ message: "POSTS not found." });
                }
            } catch (err) {
                console.error("Delete Error:", err);
                res.status(500).json({ message: "Server error." });
            }
        });



    }
    finally {
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('The blogs are here')
})

app.listen(port)



// git init
// git add .
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/kamrul2006/trend-wise-jt-server.git
// git push -u origin main