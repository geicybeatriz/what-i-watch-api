import supertest from "supertest";
import app from "../../src/app.js";
import prisma from "../../src/config/database.js";
import intFactory from "./intfactories.js";

const agent = supertest(app);

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`;
});

describe("POST /sign-up, should register a new user", () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`;
    });

    it("should return 201 for valid inputs", async () => {
        const userData = intFactory.userGenerate();
        const result = await agent.post("/sign-up").send({...userData, confirm_password:userData.password});

        const check = await prisma.user.findFirst({
            where: {email: userData.email}
        });

        expect(result.status).toEqual(201);
        expect(check).not.toBeNull();
    });

    it("should return 409 for conflict", async () => {
        const userData = intFactory.userGenerate();
        const newUser1 = await agent.post("/sign-up").send({...userData, confirm_password:userData.password});
        expect(newUser1.status).toEqual(201);

        const newUser2 = await agent.post("/sign-up").send({...userData, confirm_password:userData.password});
        expect(newUser2.status).toEqual(409);
    });

    it("should return 422 for schema validation errors", async () => {
        const userData = intFactory.userGenerate();
        const newUser1 = await agent.post("/sign-up").send({...userData, confirm_password:"senha errada"});
        expect(newUser1.status).toEqual(422);

        const newUser2 = await agent.post("/sign-up").send({...userData, confirm_password:userData.password, email:"1234567"});
        expect(newUser2.status).toEqual(422);

        const newUser3 = await agent.post("/sign-up").send({...userData, confirm_password:"", name:234});
        expect(newUser3.status).toEqual(422);
    });
});

describe("POST /sign-in, should to realize user login", () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`;
    });

    it("should return 200 and token", async () => {
        const userData = intFactory.userGenerate();

        const result = await agent.post("/sign-up").send({...userData, confirm_password:userData.password});
        expect(result.status).toEqual(201);

        const login = await agent.post("/sign-in").send({email:userData.email, password:userData.password});
        expect(login.status).toEqual(200);
        expect(login.text).not.toBeNull();
    });

    it("should return 401 for wrong password", async () => {
        const userData = intFactory.userGenerate();

        const result = await agent.post("/sign-up").send({...userData, confirm_password:userData.password});
        expect(result.status).toEqual(201);

        const login = await agent.post("/sign-in").send({email:userData.email, password:"senha errada"});
        expect(login.status).toEqual(401);
    });

    it("should return 404 for user not found", async () => {
        const login = await agent.post("/sign-in").send({email:"userNotFound@gmail.com", password:"senha errada"});
        expect(login.status).toEqual(404);
    });

    it("should return 422 for submit errors", async () => {
        const userData = intFactory.userGenerate();

        const result = await agent.post("/sign-up").send({...userData, confirm_password:userData.password});
        expect(result.status).toEqual(201);

        const login = await agent.post("/sign-in").send({email:123, password:""});
        expect(login.status).toEqual(422);
    });
});

describe("POST /mylist, should to create a movies list", () => {
    let tokenGlobal = "";

    const userData = {
        name:"bia teste", email:"biatest@gmail.com", password:"teste344", confirm_password:"teste344"
    }

    it("should return statusCode 201 and create movies list", async () => {  
        const signUp = await agent.post("/sign-up").send({...userData});
        expect(signUp.status).toEqual(201);

        const login = await agent.post("/sign-in").send({email:userData.email, password:userData.password});
        expect(login.status).toEqual(200);
        tokenGlobal = login.text

        const newList = await agent.post("/mylist").send({name:"Lista 1"}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(newList.status).toEqual(201);
    });

    it("should return statusCode 409 for conflict errors", async () => {
        const signUp = await agent.post("/sign-up").send({...userData});
        expect(signUp.status).toEqual(201);

        const login = await agent.post("/sign-in").send({email:userData.email, password:userData.password});
        expect(login.status).toEqual(200);
        tokenGlobal = login.text;

        const list = await agent.post("/mylist").send({name:"Lista 1"}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(list.status).toEqual(201); 
        
        const conflict = await agent.post("/mylist").send({name:"Lista 1"}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(conflict.status).toEqual(409);
    });

    it("should return statusCode 422 for inputs errors", async () => {
        const signUp = await agent.post("/sign-up").send({...userData});
        expect(signUp.status).toEqual(201);

        const login = await agent.post("/sign-in").send({email:userData.email, password:userData.password});
        expect(login.status).toEqual(200);
        tokenGlobal = login.text;

        const list = await agent.post("/mylist").send({name:123}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(list.status).toEqual(422); 
    });

    it("should return statusCode 401 for invalid token", async () => {        
        const list = await agent.post("/mylist").send({name:"Lista 1"});
        expect(list.status).toEqual(401); 
    });

    it("should return statusCode 404 for user not found", async () => {        
        const list = await agent.post("/mylist").send({name:"Lista 1"}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(list.status).toEqual(404); 
    });
});

describe("GET /mylist, should to find all movies list", () => {
    let tokenGlobal = "";

    const userData = {
        name:"bia teste", email:"biatest@gmail.com", password:"teste344", confirm_password:"teste344"
    }

    it("should return statusCode 200 and find all movies list", async () => {  
        const signUp = await agent.post("/sign-up").send({...userData});
        expect(signUp.status).toEqual(201);

        const login = await agent.post("/sign-in").send({email:userData.email, password:userData.password});
        expect(login.status).toEqual(200);
        tokenGlobal = login.text

        const allList = await agent.get("/mylist").set("Authorization", `Bearer ${tokenGlobal}`);
        expect(allList.status).toEqual(200);
        expect(allList.text).not.toBeNull();
    });

    it("should return statusCode 401 for invalid token", async () => {  
        const list = await agent.get("/mylist");
        expect(list.status).toEqual(401);
    });

    it("should return statusCode 404 for user not found", async () => {  
        const list = await agent.get("/mylist").set("Authorization", `Bearer ${tokenGlobal}`);
        expect(list.status).toEqual(404);
    });
});

describe("GET /mylist/:listId, should to find a movies list by id", () => {
    let tokenGlobal = "";

    const userData = {
        name:"bia teste", email:"biatest@gmail.com", password:"teste344", confirm_password:"teste344"
    }

    it("should return statusCode 200 and find a movies list", async () => {  
        const signUp = await agent.post("/sign-up").send({...userData});
        expect(signUp.status).toEqual(201);

        const login = await agent.post("/sign-in").send({email:userData.email, password:userData.password});
        expect(login.status).toEqual(200);
        tokenGlobal = login.text;

        const newList = await agent.post("/mylist").send({name:"Lista 1"}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(newList.status).toEqual(201);

        const allList = await agent.get("/mylist").set("Authorization", `Bearer ${tokenGlobal}`);
        expect(allList.status).toEqual(200);
        expect(allList.body).not.toBeNull();

        const listId = allList.body[0].id
        const myList = await agent.get(`/mylist/${listId}`).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(myList.status).toEqual(200);
        expect(myList.body).not.toBeNull();
    });

    it("should return statusCode 401 for invalid token", async () => {  
        const list = await agent.get("/mylist/4");
        expect(list.status).toEqual(401);
    });

    it("should return statusCode 404 for user not found", async () => {  
        const list = await agent.get("/mylist/4").set("Authorization", `Bearer ${tokenGlobal}`);
        expect(list.status).toEqual(404);
    });
});

describe("POST /movies/:listId, should to add a movie to the list ", () => {
    let tokenGlobal = "";

    const userData = {
        name:"bia teste", email:"biatest@gmail.com", password:"teste344", confirm_password:"teste344"
    }

    const movieData = {
        title:"Filme 1", 
        image:"https://images.unsplash.com/photo-1660632031387-760ced651717?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=6", 
        tmdbId:"123465"
    }

    it("should return statusCode 201 and add a movie to the list", async () => {  
        const signUp = await agent.post("/sign-up").send({...userData});
        expect(signUp.status).toEqual(201);

        const login = await agent.post("/sign-in").send({email:userData.email, password:userData.password});
        expect(login.status).toEqual(200);
        tokenGlobal = login.text

        const newList = await agent.post("/mylist").send({name:"Lista 1"}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(newList.status).toEqual(201);

        const mylists = await agent.get("/mylist").set("Authorization", `Bearer ${tokenGlobal}`);
        expect(mylists.status).toEqual(200);

        const addMovie = await agent.post(`/movies/${mylists.body[0].id}`).send({...movieData}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(addMovie.status).toEqual(201);
    });

    it("should return statusCode 422 for inputs errors", async () => {  
        const signUp = await agent.post("/sign-up").send({...userData});
        expect(signUp.status).toEqual(201);

        const login = await agent.post("/sign-in").send({email:userData.email, password:userData.password});
        expect(login.status).toEqual(200);
        tokenGlobal = login.text

        const newList = await agent.post("/mylist").send({name:"Lista 1"}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(newList.status).toEqual(201);

        const mylists = await agent.get("/mylist").set("Authorization", `Bearer ${tokenGlobal}`);
        expect(mylists.status).toEqual(200);

        const addMovie = await agent.post(`/movies/${mylists.body[0].id}`).send({...movieData, title:1234}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(addMovie.status).toEqual(422);
    });

    it("should return statusCode 401 for invalid token", async () => {  
        const addMovie = await agent.post(`/movies/4`).send({...movieData});
        expect(addMovie.status).toEqual(401);
    });

    it("should return statusCode 404 for user not found", async () => {  
        const addMovie = await agent.post(`/movies/2`).send({...movieData}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(addMovie.status).toEqual(404);
    });

    it("should return statusCode 404 for movies list not found", async () => {  
        const signUp = await agent.post("/sign-up").send({...userData});
        expect(signUp.status).toEqual(201);

        const login = await agent.post("/sign-in").send({email:userData.email, password:userData.password});
        expect(login.status).toEqual(200);
        tokenGlobal = login.text

        const addMovie = await agent.post(`/movies/3`).send({...movieData}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(addMovie.status).toEqual(404);
    });
});

describe("GET /movies/:listId, should to get all movies by list id", () => {
    let tokenGlobal = "";

    const userData = {
        name:"bia teste", email:"biatest@gmail.com", password:"teste344", confirm_password:"teste344"
    }

    const movieData = {
        title:"Filme 1", 
        image:"https://images.unsplash.com/photo-1660632031387-760ced651717?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=6", 
        tmdbId:"123465"
    }

    it("should return statusCode 200 and get movies", async () => {  
        const signUp = await agent.post("/sign-up").send({...userData});
        expect(signUp.status).toEqual(201);

        const login = await agent.post("/sign-in").send({email:userData.email, password:userData.password});
        expect(login.status).toEqual(200);
        tokenGlobal = login.text

        const newList = await agent.post("/mylist").send({name:"Lista 1"}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(newList.status).toEqual(201);

        const mylists = await agent.get("/mylist").set("Authorization", `Bearer ${tokenGlobal}`);
        expect(mylists.status).toEqual(200);

        const addMovie = await agent.post(`/movies/${mylists.body[0].id}`).send({...movieData}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(addMovie.status).toEqual(201);

        const myMovies = await agent.get(`/movies/${mylists.body[0].id}`).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(myMovies.status).toEqual(200);
        expect(myMovies.body).not.toBeNull();
    });

    it("should return statusCode 401 for invalid token", async () => {  
        const getMovie = await agent.get(`/movies/4`);
        expect(getMovie.status).toEqual(401);
    });

    it("should return statusCode 404 for user not found", async () => {  
        const getMovie = await agent.get(`/movies/2`).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(getMovie.status).toEqual(404);
    });

    it("should return statusCode 404 for movies list not found", async () => {  
        const signUp = await agent.post("/sign-up").send({...userData});
        expect(signUp.status).toEqual(201);

        const login = await agent.post("/sign-in").send({email:userData.email, password:userData.password});
        expect(login.status).toEqual(200);
        tokenGlobal = login.text

        const movies = await agent.get(`/movies/3`).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(movies.status).toEqual(404);
    });
});

describe("DELETE /:listId/:movieId, should delete movie by id", () => {
    let tokenGlobal = "";

    const userData = {
        name:"bia teste", email:"biatest@gmail.com", password:"teste344", confirm_password:"teste344"
    }

    const movieData = {
        title:"Filme 1", 
        image:"https://images.unsplash.com/photo-1660632031387-760ced651717?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=6", 
        tmdbId:"123465"
    }

    it("should return status 200 and delete movie", async () => {
        const signUp = await agent.post("/sign-up").send({...userData});
        expect(signUp.status).toEqual(201);

        const login = await agent.post("/sign-in").send({email:userData.email, password:userData.password});
        expect(login.status).toEqual(200);
        tokenGlobal = login.text

        const newList = await agent.post("/mylist").send({name:"Lista 1"}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(newList.status).toEqual(201);

        const mylists = await agent.get("/mylist").set("Authorization", `Bearer ${tokenGlobal}`);
        expect(mylists.status).toEqual(200);

        const addMovie = await agent.post(`/movies/${mylists.body[0].id}`).send({...movieData}).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(addMovie.status).toEqual(201);

        const myMovies = await agent.get(`/movies/${mylists.body[0].id}`).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(myMovies.status).toEqual(200);
        expect(myMovies.body).not.toBeNull();

        const deleteMovie = await agent.delete(`/${myMovies.body[0].listId}/${myMovies.body[0].id}`).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(deleteMovie.status).toEqual(200);
    });

    it("should return status 404 for list not found or movie not found", async () => {
        const signUp = await agent.post("/sign-up").send({...userData});
        expect(signUp.status).toEqual(201);

        const login = await agent.post("/sign-in").send({email:userData.email, password:userData.password});
        expect(login.status).toEqual(200);
        tokenGlobal = login.text

        const deleteMovie = await agent.delete(`/3/3`).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(deleteMovie.status).toEqual(404);
    });

    it("should return statusCode 404 for user not found", async () => {  
        const deleteMovie = await agent.delete(`/2/4`).set("Authorization", `Bearer ${tokenGlobal}`);
        expect(deleteMovie.status).toEqual(404);
    });

    it("should return statusCode 401 for invalid token", async () => {  
        const deleteMovie = await agent.delete(`/2/4`);
        expect(deleteMovie.status).toEqual(401);
    });
});

afterAll(async () => {
    await prisma.$disconnect()
});