const express=require("express")
const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const rateLimit=require("express-rate-limit")
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 100, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
})

const app=express();
app.use(limiter);
const constr=process.env.MONGSTR
app.use(express.json())
const schema=new mongoose.Schema({id:Number,username:String,password:String,notes:[String]})
const Usernote=mongoose.model("Usernote",schema)
const port=3000;
const jwtpwd=process.env.JWTPWD



app.post("/api/auth/signup",async (req,res)=>{
    const users=await Usernote.find();
    const username=req.body.username;
    const password=req.body.password;
    
    if( await userpresence(username,password))
    {
       
        res.status(403).json({msg:"User already present....please sign in "})
       
        return;
    }
    else
    {
        await Usernote.create({id:users.length+1,username:username,password:password,notes:[]})
        
        res.status(200).json({msg:"New user id created"})
        
    }
})

async function userpresence(name,pwd)
{
    const f=await Usernote.findOne({username:name,password:pwd})
    if(f)
    return true;
    else
    return false;
}

app.post("/api/auth/login",async (req,res)=>{
    
    const ispresent=await userpresence(req.body.username,req.body.password)
    if(ispresent)
    {
        const token=jwt.sign({username:req.body.username},jwtpwd)

        res.status(200).json({token,})
    }
    else
    {
        res.status(403).json({msg:"User Not Found"})
    }
   
})



app.get("/api/notes",async (req,res)=>{
    const token=req.headers.token;
    try{
        const decoded=jwt.verify(token,jwtpwd)
        let a=await Usernote.findOne({username:decoded.username})
        res.json({notes:a.notes});
    }
    catch(err)
    {
        res.status(403).json({msg:"User not authenticated"})
    }
})
app.post("/api/notes",async (req,res)=>{
    const token=req.headers.token;
    const note=req.body.note;
    try{
        const decoded=jwt.verify(token,jwtpwd)
        console.log(decoded.username)
        let a=await Usernote.findOne({username:decoded.username})
        a.notes.push(note)
        await Usernote.updateOne({username:decoded.username},{notes:a.notes})
        console.log(a.notes)
        res.status(200).json({msg:"Notes added..."})
    }
    catch(err)
    {
        res.status(403).json({msg:"User not authenticated"})
    }
})
app.get("/api/notes/:id",async (req,res)=>{
    const id=(Number)(req.params.id);
    try{
        let v=jwt.verify(req.headers.token,jwtpwd)
        const a=await Usernote.find({username:v.username});
        res.status(200).json({msg:a[0].notes[id-1]})
    }
    catch(err)
    {
        res.status(403).json({msg:"User does not exists"})
    }
})
app.put("/api/notes/:id",async (req,res)=>{
    const id=(Number)(req.params.id)
    const note=req.body.note
    try{
        let v=jwt.verify(req.headers.token,jwtpwd)
        const a=await Usernote.findOne({username:v.username})
        console.log(a.notes[id-1]);
        a.notes[id-1]=note;
        console.log(a.notes[id-1]);
        await Usernote.updateOne({username : v.username},{notes : a.notes});
        res.status(200).json({msg:"Notes updated"})
    }
    catch(err)
    {
        res.status(403).json({msg:"User does not exists"})
    } 
})
app.delete("/api/notes/:id",async (req,res)=>{
    const id=(Number)(req.params.id)
    try{
        let v=jwt.verify(req.headers.token,jwtpwd)
        const a=await Usernote.findOne({username:v.username})
        a.notes.splice(id-1,1)
        await Usernote.updateOne({username:v.username},{notes:a.notes})
        res.status(200).json({msg:"Note deleted"})
    }
    catch(err)
    {
        res.status(403).json({msg:"User does not exists"})
    } 
})
app.post("/api/notes/:id/share",async (req,res)=>{
    const id=req.params.id;
    const sharename= req.body.username;
    try{
        const decoded=jwt.verify(req.headers.token,jwtpwd)
        const a=await Usernote.findOne({username:decoded.username})
        const b=await Usernote.findOne({username:sharename})
        b.notes.push(a.notes[id-1])
        await Usernote.updateOne({username:sharename},{notes:b.notes})
        res.json({msg:"Updated successfully"})
    }
    catch(err)
    {
        res.status(403).json({msg:"Error"})
    }
})
app.get("/api/search",async (req,res)=>{
    const fil=req.query.q;
    try{
        const decoded=jwt.verify(req.headers.token,jwtpwd);
        const a=await Usernote.findOne({username:decoded.username})
        let b=a.notes.filter((note)=> note.includes(fil) )
        res.status(200).json({notes:b})
    }
    catch(err)
    {
        res.status(403).json({msg:"User not found..."})
    }
})

app.get("/",(req,res)=>{
    res.status(200).json("hii");
})

module.exports=app
