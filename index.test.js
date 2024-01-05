const app=require("./index.js")
const request = require("supertest");
const mongoose=require("mongoose")
const url="mongodb+srv://Anirban:123@cluster0.wpm5aqp.mongodb.net/steerTech"
describe("Test app.ts", () => {
  test("Catch-all route", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});

describe("POST Signup Req",()=>{
  test("if both username and password are exists" , async()=>{
    const res = await request(app).post("/api/auth/signup").send({username : "newUser" , password : "password"});
    expect(res.statusCode).toBe(200);
    
  });
});

let token = null;
describe("POST login Req",()=>{
  test("if both username and password are exists" , async()=>{
    const res = await request(app).post("/api/auth/login").send({username : "newUser" , password : "password"});
    token = res.body.token;
    expect(res.statusCode).toBe(200);
    
  });
}); 

describe("POST create Note" , ()=>{
  test("if new note created or not ?!" , async()=>{
    const res = await request(app).post("/api/notes").set("token", `${token}`).send({note : "Sample for test"});
    expect(res.statusCode).toBe(200);
  })
})

describe("Get all note", ()=>{
  test("GET all notes created" , async()=>{
    const res = await request(app).get("/api/notes").set("token", `${token}`);
    expect(res.statusCode).toBe(200);
  })
})

describe("GET all note for specific ID", ()=>{
  test("Get the note with a specific ID" , async()=>{
    const res = await request(app).get("/api/notes/1").set("token", ` ${token}`);
    expect(res.statusCode).toBe(200);
  })
});


describe("PUT new updates note", ()=>{
  test("Update the Note ,given the id" , async()=>{
    const res = await request(app).put("/api/notes/1").set("token", ` ${token}`).send({content : "Updated for test"});
    expect(res.statusCode).toBe(200);
  })
});

describe("DELETE a Note" , ()=>{
  test("Delete the Note" , async()=>{
    const res = await request(app).delete("/api/notes/1").set("token", ` ${token}`);
    const res2 = await request(app).post("/api/notes").set("token", `${token}`).send({content : "Sample for Sharing"});
    expect(res.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);
  })
});

describe("Share a note", ()=>{
  test("Share the note to a User" , async()=>{
    const res2 = await request(app).post("/api/auth/signup").send({username : "TesterForShare" , password : "password"});
    const res = await request(app).post("/api/notes/2/share").set("token", ` ${token}`).send({shareToUser : 2});
    expect(res2.statusCode).toBe(200);
    expect(res.statusCode).toBe(200);
  })
});

describe("GET all note for specific Search Query", ()=>{
  test("Get the note that contains the required word" , async()=>{
    const res = await request(app).get("/api/search?q=sample").set("token",  `${token}`);
    expect(res.statusCode).toBe(200);
  })
});
