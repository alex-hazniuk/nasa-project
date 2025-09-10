// 1)import { test } from '@playwright/test';
// 2)import { test } from '@playwright/test';
import { test as base, request as newRequest } from '@playwright/test'; // use alias
import { log } from 'console';
import fs from 'fs';
import { BookingBuilder } from './BookingBuilder';

// 'test' function is an object, when we can invoke methods on it = 'test.beforeAll'
// and can be by function like 'test(params.....)' function

// additional functionalities of test - are fixtures
// 1)export const base = test.extend({ });
// 2)export const spec = test.extend({ });

// type Fixtures = {
//     myName: string
// }
// export const test = base.extend<Fixtures>({  // properties of this object are our fixtures
//     myName: "Oleksandr",
//     request: async ({ request, myName }, use) => {
//         // implementation before test running
//         console.log('--- test started ---');
//         console.log(`My name ${myName}`);
//         await use(request); // use = return
//         // implementation after test running
//         console.log('--- test ended ---');
//     }
// });

// type Fixtures = {
//     token: string
// }
// export const test = base.extend<Fixtures>({  // properties of this object are our fixtures

type Fixtures = {
    showMeRock: void,
    invokeMeAnyway: void,
    bookerBuilder: BookingBuilder
}

export const test = base.extend<Fixtures>({  // properties of this object are our fixtures
    //token: "Oleksandr",
    request: async ({ request }, use) => {
        let token;
        if(!fs.existsSync('tests/restfull-booker/.token')) {
            console.log('creating token');
    
            const result = await request.post('/auth', {
                data: {
                    username: "admin",
                    password: "password123"
                }
            });
            const json = await result.json();
            console.log('getting token');
            token = json.token;
    
            fs.writeFileSync('tests/restfull-booker/.token', token);
        } else {
            console.log('getting token');
            token = fs.readFileSync('tests/restfull-booker/.token', {
                encoding: 'utf-8'
            });
        }
        
        console.log(`obtained token ${token}`);
        console.log('--- creating new context ---');
        

        const requestWithToken = await newRequest.newContext({
            extraHTTPHeaders: {
                Cookie: `token=${token}`
            }
        });

        console.log('--- created new context ---');
        
        await use(requestWithToken); // return

        console.log('--- test ended ---');
    },

    // auto fixtura and it works like before each
    showMeRock: async ({}, use) => {
        console.log('This is rock');
        await use();
    },

    // auto fixtura work even without passing fixture in params
    // before each, after each
    invokeMeAnyway: [async ({}, use) => {
        console.log('Before each'); // before each logic
        
        console.log('Invoke me anyway');
        await use();
        console.log('After each'); // after each logic
        
    }, { auto: true }],

    bookerBuilder: async ({}, use) => {
        const builder = new BookingBuilder();
        use(builder);
    }
});