import { test, request, expect } from '@playwright/test';
import Joi, { number } from 'joi';

let token;
// 'beforeAll' is performed one time before implementation of all tests,
// but in case of fail some of the test, 'beforeAll' is performed one more time in addition
test.beforeAll(async ({ request }) => {
    const result = await request.post('/auth', {
        data: {
            username: "admin",
            password: "password123"
        }
    });

    const json = await result.json();
    token = json.token;
});

/*
Creates a new auth token to use for access to the PUT and DELETE /booking

post
https://restful-booker.herokuapp.com/auth
Example 1:
curl -X POST \
  https://restful-booker.herokuapp.com/auth \
  -H 'Content-Type: application/json' \
  -d '{
    "username" : "admin",
    "password" : "password123"
}'
*/

// this request is different - APIRequest and has only method 'newContext'
test('RB-001 get auth token', { tag: ['@smoke'] }, async () => {
    // client will apply all these adjustments during implementation of HTTP requests
    const context = await request.newContext({   // identical to 'request' fixture from playwright
        baseURL: 'https://restful-booker.herokuapp.com'
    });

    const result = await context.post('/auth', {
        data: {
            username: "admin",
            password: "password123"
        }
    });
    expect(result.status()).toBe(200);

    const json = await result.json();
    const token = json.token;

    // check token is not empty
    expect(token).toBeDefined();
});

test('RB-002 create booking, json schema should be valid', { tag: ['@regression'] }, async ({ request }) => {
    const result = await request.post('/booking', {
        data: {
            firstname: "Jim",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        },
        // instead of 'expect(result.status()).toBe(200)' we can add this check
        failOnStatusCode: true
    });

    const json = await result.json();
    const bookingSchema = Joi.object({
        additionalneeds: Joi.string().required(),
        totalprice: Joi.number().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        depositpaid: Joi.boolean().required(),
        bookingdates: Joi.object({
            checkin: Joi.date().required(),
            checkout: Joi.date().required()
        })
    });
    const schema = Joi.object({
        bookingid: Joi.number().required(),
        booking: bookingSchema
    });
    const validationResult = schema.validate(json);
    expect(validationResult.error).toBeUndefined();
});

test('RB-003 create booking', { tag: ['@smoke'] }, async ({ request }) => {
    const result = await request.post('/booking', {
        data: {
            firstname: "Jim",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        },
        // instead of 'expect(result.status()).toBe(200)' we can add this check
        failOnStatusCode: true
    });

    const expectedHeaders = {
        "content-length": "197",
        "content-type": "application/json; charset=utf-8",
        date: "Fri, 15 Aug 2025 19:43:18 GMT",
        etag: "W/\"c5-vJURftXTKeYUUWYPgLc6/qJvNnY\"",
        nel: "{\"report_to\":\"heroku-nel\",\"response_headers\":[\"Via\"],\"max_age\":3600,\"success_fraction\":0.01,\"failure_fraction\":0.1}",
        "report-to": "{\"group\":\"heroku-nel\",\"endpoints\":[{\"url\":\"https://nel.heroku.com/reports?s=BEKFfVBog%2B7QxdgCBxxJcCeP5Q4ZKExjOPTGzLy83XM%3D\\u0026sid=c46efe9b-d3d2-4a0c-8c76-bfafa16c5add\\u0026ts=1755286998\"}],\"max_age\":3600}",
        "reporting-endpoints": "heroku-nel=\"https://nel.heroku.com/reports?s=BEKFfVBog%2B7QxdgCBxxJcCeP5Q4ZKExjOPTGzLy83XM%3D&sid=c46efe9b-d3d2-4a0c-8c76-bfafa16c5add&ts=1755286998\"",
        server: "Heroku",
        via: "1.1 heroku-router",
        "x-powered-by": "Express",
    }
    //  const headersArr = result.headersArray();
    const headers = result.headers();

    for(const key in expectedHeaders) {
        expect(headers[key]).toBeDefined();
    }
});

/*
post
https://restful-booker.herokuapp.com/booking
JSON example usage:
XML example usage:
URLencoded example usage:
curl -X POST \
  https://restful-booker.herokuapp.com/booking \
  -H 'Content-Type: application/json' \
  -d '{
    "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"
}'
*/

/*
put
https://restful-booker.herokuapp.com/booking/:id
JSON example usage:
XML example usage:
URLencoded example usage:
curl -X PUT \
  https://restful-booker.herokuapp.com/booking/1 \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Cookie: token=abc123' \
  -d '{
    "firstname" : "James",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"
}'
*/

test('RB-004 create booking, headers should exist', { tag: ['@regression'] }, async ({ request }) => {
    const result = await request.post('/booking', {
        data: {
            firstname: "Jim",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        },
        // instead of 'expect(result.status()).toBe(200)' we can add this check
        failOnStatusCode: true
    });

    // expect(result.status()).toBe(200);

    // check if body empty or not
    // const stringBody = await result.text();
    // expect(stringBody).toBeTruthy(); // fail if body empty
    // expect(stringBody.length).toBe(0);

    // if we don't have body in response on post request, method 'result.json()' will fail with error
    const json = await result.json();
    const bookingid = json.bookingid;
    expect(bookingid).toBeDefined();

    const updateResult = await request.put(`/booking/${bookingid}`, {
        data: {
            firstname: "Jim",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        },
        headers: {
            Cookie: `token=${token}`
        }
    });
    expect(updateResult.status()).toBe(200);
});

// fixture - object or data which are prepared and used when it's necessary in any test
// default fixtures in playwright - page, context, browser, request

test('RB-005 create booking, headers json schema should be valid', { tag: ['@regression'] }, async ({ request }) => {
    const result = await request.post('/booking', {
        data: {
            firstname: "Jim",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        },
        // instead of 'expect(result.status()).toBe(200)' we can add this check
        failOnStatusCode: true
    });

    const headers = result.headers();
    const headersSchema = Joi.object({
        "content-length": Joi.required(),
        "content-type": Joi.required().equal('application/json; charset=utf-8'),
        date: Joi.date().required(),
        etag: Joi.required(),
        nel: Joi.required(),
        "report-to": Joi.required(),
        "reporting-endpoints": Joi.required(),
        server: Joi.required().equal("Heroku"),
        via: Joi.required().equal("1.1 heroku-router"),
        "x-powered-by": Joi.required().equal("Express")
    });
    const validationResult = headersSchema.validate(headers);
    expect(validationResult.error).toBeUndefined();
});

test('RB-006 booking ids should be present', { tag: ['@smoke', '@regression'] }, async ({ request }) => {
    await request.post('/booking', {
        data: {
            firstname: "Kate",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        },
        // instead of 'expect(result.status()).toBe(200)' we can add this check
        failOnStatusCode: true
    });
    const response = await request.get('/booking');
    expect(response.status()).toBe(200);

    const result = await response.json();
    expect(result.length).toBeGreaterThan(0);
    result.forEach(element => {
        expect(typeof element.bookingid).toBe('number');
    });
});

test('RB-007 booking ids by params should be present', { tag: ['@regression'] }, async ({ request }) => {
    await request.post('/booking', {
        data: {
            firstname: "Kate",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        },
        // instead of 'expect(result.status()).toBe(200)' we can add this check
        failOnStatusCode: true
    });

    const response = await request.get('/booking', { 
        params: {
        firstname: "Kate",
        lastname: "Brown"
    } });
    const ids = await response.json();
    
    expect(response.status()).toBe(200);    
    expect(ids.length).toBeGreaterThan(0);
    expect(typeof ids[0].bookingid).toBe('number');
});

test('RB-008 booking by id should be present', { tag: ['@smoke'] }, async ({ request }) => {
    const response = await request.post('/booking', {
        data: {
            firstname: "Kate",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        },
        // instead of 'expect(result.status()).toBe(200)' we can add this check
        failOnStatusCode: true
    });
    const json = await response.json();
    const bookingId = json.bookingid;
    expect(bookingId).toBeDefined();

    const responseByGet = await request.get(`/booking/${bookingId}`);
    expect(responseByGet.status()).toBe(200);

    const expected = {
            firstname: "Kate",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        };
    const result = await responseByGet.json();
    expect(expected).toEqual(result);
});

test('RB-009 name and lastname of booking object should coincide with partial update', 
    { tag: ['@smoke'] }, 
    async ({ request }) => {
    const response = await request.post('/booking', {
        data: {
            firstname: "Kate",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        },
        // instead of 'expect(result.status()).toBe(200)' we can add this check
        failOnStatusCode: true
    });
    const json = await response.json();
    const bookingId = json.bookingid;
    expect(bookingId).toBeDefined();

    const responseByPatch = await request.patch(`/booking/${bookingId}`, {
        data: {
            firstname: 'James',
            lastname: 'Brown'
        },
        headers: {
            Cookie: `token=${token}`
        },
        // instead of 'expect(result.status()).toBe(200)' we can add this check
        failOnStatusCode: true
    });

    const expected = {
            firstname: "James",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        };
    const result = await responseByPatch.json();
    expect(expected).toEqual(result);
});

test('RB-010 deleted booking object does not exist any more', { tag: ['@smoke', '@regression'] }, async ({ request }) => {
    const response = await request.post('/booking', {
        data: {
            firstname: "Kate",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        },
        // instead of 'expect(result.status()).toBe(200)' we can add this check
        failOnStatusCode: true
    });
    const json = await response.json();
    const bookingId = json.bookingid;
    expect(bookingId).toBeDefined();

    const responseByPatch = await request.delete(`/booking/${bookingId}`, {
        headers: {
            Cookie: `token=${token}`
        },
        // instead of 'expect(result.status()).toBe(200)' we can add this check
        failOnStatusCode: true
    });

    const responseByGet = await request.get(`/booking/${bookingId}`);

    expect(responseByGet.status()).toBe(404);
});