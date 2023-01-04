const request = require('supertest'); 
 const app = require('../src/app');
const Task = require("../src/models/task");
const {
    testUserId, 
    testUser, 
    taskOne, 
    taskTwo, 
    taskThree, 
    setupDatabase,
    testUserTwo} = require('./fixtures/db');

// make the test database as a clean slate before running test cases
beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
            .send({
                description: "from the test"
            })
            .expect(201)

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
})

test('Should fetch user tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)
})

test('Should not delete other user tasks', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${testUserTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
})