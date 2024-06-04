const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors=require('cors')
const dotenv = require('dotenv')
dotenv.config();
const app = express()
const port = process.env.PORT || 3000;
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@easy-education.2faznqa.mongodb.net/?retryWrites=true&w=majority&appName=easy-education`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
const easyEducationDB=client.db('easyEducation');
const coursesCollection=easyEducationDB.collection('coursesCollection');
const usersCollection=easyEducationDB.collection('usersCollection');

// course data
app.post('/courses',async(req,res)=>{
  const courseData=req.body;
  const result= await coursesCollection.insertOne(courseData);
  res.send(result)  
})

app.get('/courses', async(req,res)=>{
  const courseData=coursesCollection.find();
  const result=await courseData.toArray()
  res.send(result)
})

app.get('/courses/:id', async (req, res) => {
  
    const courseId = req.params.id;
    const courseData = await coursesCollection.findOne({ _id: new ObjectId(courseId) });
    res.send(courseData)
});
app.delete('/courses/:id', async (req, res) => {
  
    const courseId = req.params.id;
    const courseData = await coursesCollection.deleteOne({ _id: new ObjectId(courseId) });
    res.send(courseData)
});

app.patch('/courses/:id', async (req, res) => {
  
    const courseId = req.params.id;
    const updatedData=req.body;
    const courseData = await coursesCollection.updateOne(
      { _id: new ObjectId(courseId) },
      {$set:updatedData}
);
    res.send(courseData)
});

// user data
app.post('/users',async(req,res)=>{
  const user=req.body;
  const isUserExist=await usersCollection.findOne({email:user?.email});
  if(isUserExist?._id){
   return res.send({
    status:'success',
    message:"login success"
   })
  }
  const result=await usersCollection.insertOne(user);
  res.send(result)
  
})
app.get('/users', async(req,res)=>{
  const courseData=usersCollection.find();
  const result=await courseData.toArray()
  res.send(result)
})

app.get('/users/:email',async(req,res)=>{
const email=req.params.email;
console.log(email);
const result=await usersCollection.findOne({email})
res.send(result)
})


    console.log("database is connected");
  } finally {
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/users',(req,res)=>{
 res.send({name:'naiem',
 age:20
 })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
