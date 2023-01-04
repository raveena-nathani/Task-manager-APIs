const request = require('supertest');
const app = require('../src/app');
const {testUserId, testUser, setupDatabase} = require('./fixtures/db');
const User = require('../src/models/user');

// make the test database as a clean slate before running test cases
beforeEach(setupDatabase)

test('Should signup the new user', async () => {
   const response = await request(app).post('/users').send({
        name: 'Raveena', 
        email: 'raveena.nathani5@gmail.com',
        password: "legend5677!"
     }).expect(201);

     // Assert that the database was changed correctly
     const user = await User.findById(response.body.user._id);
     expect(user).not.toBeNull();

     // Assertions about the response
     expect(response.body).toMatchObject({
        user: {
            name: 'Raveena',
            email: 'raveena.nathani5@gmail.com',
        },
        token: user.tokens[0].token
     })

     // Assert for password to not be saved as plain text
     expect(user.password).not.toBe("legend5677!")
})

test('Should login existing user', async () => {
   const response = await request(app).post('/users/login').send({
        email: testUser.email,
        password: testUser.password
    }).expect(200);

    // Assert validating for new token is saved

    const user = await User.findById(testUserId);
    expect(response.body.token).toBe(user.tokens[1].token); //second token because 1st token is already saved with dummy data
})

test('Should not lgoin non-existing user', async () => {
    await request(app).post('/users/login').send({
        email: 'test@gmail.com',
        password: 'test'
    }).expect(400);
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)

    // Assert for validating use is removed
    const user = await User.findById(testUserId);
    expect(user).toBeNull();
})

test('Should not delete account for authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    // Assert for checking image buffer is stored

    const user = await User.findById(testUserId);
    expect(user.avatar).toEqual(expect.any(Buffer));
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            name: 'Mike2'
        })
        .expect(200);

    const user = await User.findById(testUserId);
    expect(user.name).toBe('Mike2')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            location: 'Test location'
        })
        .expect(400)
})