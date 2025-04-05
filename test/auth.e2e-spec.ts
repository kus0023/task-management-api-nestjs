import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { describe } from 'node:test';

describe('Auth Controller (e2e)', () => {
    let app: INestApplication<App>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        const dbService = app.get(DatabaseService);
        await dbService.user.delete({ where: { email: "a@b.com" } });
        await app.close();
    });

    it("should return test db from .env.test", () => {

        const config: ConfigService = app.get<ConfigService>(ConfigService);

        const dbUrl = "mongodb://localhost:27017/task-management-api-db-test";

        expect(config.get('DATABASE_URL')).toBe(dbUrl);

    })

    describe("POST /auth/register", () => {
        it("should return bad response if no data sent", () => {

            const expectedResponse = {
                message: [
                    'email should not be empty',
                    'email must be an email',
                    'name should not be empty',
                    'name must be a string',
                    'password should not be empty',
                    'password should contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol'
                ],
                error: 'Bad Request',
                statusCode: 400
            };
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({})
                .set('Accept', 'application/json')
                .expect(400)
                .then((response) => {
                    expect(response.body).toStrictEqual(expectedResponse);
                })

        })

        it("should return 201 created for valid data", () => {

            const data = {
                email: "a@b.com",
                name: "test",
                password: "Password1!"
            }
                ;
            return request(app.getHttpServer())
                .post('/auth/register')
                .send(data)
                .set('Accept', 'application/json')
                .expect(201)
                .then((response) => {
                    expect(response.body.email).toBe(data.email);
                    expect(response.body.name).toBe(data.name);
                    expect(response.body.password).not.toBe(data.password);
                    expect(response.body.id).toBeDefined();
                })

        })
    })

    describe("POST /auth/login", () => {

        it("should return 200 and token", () => {

            const data = {
                email: "a@b.com",
                password: "Password1!"
            }

            return request(app.getHttpServer())
                .post('/auth/login')
                .send(data)
                .set('Accept', 'application/json')
                .expect(201)
                .then((response) => {
                    expect(response.body.access_token).toBeDefined();
                })
        })

        it("should return 401 unauthorized", () => {

            const data = {
                email: "a@b.com",
                password: "WrongPassword"
            }

            return request(app.getHttpServer())
                .post('/auth/login')
                .send(data)
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    expect(response.body.message).toBe("Unauthorized");
                })
        })
    })

    describe("GET /auth/profile", () => {
        it("should return 200 ok", async () => {

            const data = {
                email: "a@b.com",
                password: "Password1!"
            }


            const loginReq = request(app.getHttpServer())
                .post('/auth/login')
                .send(data)
                .set('Accept', 'application/json')
                .expect(201);
            const loginRes = await loginReq.then();
            const { access_token } = loginRes.body


            return request(app.getHttpServer())
                .get('/auth/profile')
                .auth(access_token, {
                    type: "bearer"
                })
                .set('Accept', 'application/json')
                .expect(200)
                .then((response) => {
                    expect(response.body.email).toBe(data.email);
                })


        })

        it("should return 401 Unauthorized", async () => {



            return request(app.getHttpServer())
                .get('/auth/profile')
                .auth("Empty_or_Incorrect_Token", {
                    type: "bearer"
                })
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    expect(response.body.message).toBe("Unauthorized");
                })


        })
    })


});
