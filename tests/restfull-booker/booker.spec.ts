// 1)import { base } from './booker-fixtures';
import { expect } from '@playwright/test';
import { test } from './booker-fixtures'; // import already from './booker-fixtures'

// ^ in case we want to use test which contains fixtures we need import 'base'
// 'base' play a role of our test
// but best practice use another name for test: we can use 'spec' or 'test'
// but it is demanded to adjust imports
// 1)base('get booking', async ({}) => {});
test('create booking', async ({ request }) => {
    console.log('request started');
    const response = await request.post('/booking', {
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

    const json = await response.json();
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
            // instead of 'expect(result.status()).toBe(200)' we can add this check
            failOnStatusCode: true
        });

    console.log('request finished');   
});