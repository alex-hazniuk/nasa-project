import { test, expect } from '@playwright/test';

const API_KEY = 'JzaeM8dMrWZzUG3ZdpLQa2epUNbO13aSFosayUY4';

// fixture
// request
// TMS - test management system
// JIRA ticket id
// add tags. For launch - npx playwright test --grep=@smoke,
// all tests with tag @smoke will be launched
// we can add annotation with description to tests. The will be in report as well

test(
    'JIRA-001 start-end dates',
    { 
        tag: ['@smoke'],
        annotation: {
            type: 'description',
            description: 'Some annotation for test'
        }
    },
    async ({ request }) => {
        const startDate = '2025-01-01';
        const endDate = '2025-02-01';
        const response = await request.get(`?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`);
        expect(response.status()).toBe(200);
        expect(response.headers()['x-ratelimit-limit']).toBe('4000');
        const body = await response.json();
        body.forEach(element => {
            expect(element).toHaveProperty('url');
    });
});

const testDataStartDateThumbs = [
    {
        testId: 'JIRA-002.1',
        parameters: {
            thumbs: true,
            start_date: '2025-01-01',
            api_key: API_KEY
        }
    },
    {
        testId: 'JIRA-002.2',
        parameters: {
            thumbs: false,
            start_date: '2025-03-01',
            api_key: API_KEY
        }
    }
];

for(const { testId, parameters } of testDataStartDateThumbs) {
    test(`${testId} start date thumbs`, { tag: ['@smoke', '@regression'] }, async ({ request }) => {
        // const response = await request.get(`?thumbs=true&start_date=2025-01-01&api_key=${API_KEY}`);
        const response = await request.get('', { params: parameters});
        expect(response.status()).toBe(200);
        expect(parseInt(response.headers()['x-ratelimit-remaining'])).toBeLessThan(4000);
        const body = await response.json();
        expect(body.length).toBeGreaterThan(0);
    });
}

const testDataCount = [
    {
        testId: 'JIRA-003.1',
        parameters: {
            count: 5,
            api_key: API_KEY
        }
    },
    {
        testId: 'JIRA-003.2',
        parameters: {
            count: 6,
            api_key: API_KEY
        }
    }
];

for(const { testId, parameters } of testDataCount) {
    test(`${testId} count`, { tag: ['@regression'] }, async ({ request }) => {
        // const response = await request.get(`?count=5&api_key=${API_KEY}`);
        const response = await request.get('', { params: parameters });
        expect(response.status()).toBe(200);
        expect(response.headers()).toHaveProperty('x-ratelimit-limit');
        const body = await response.json();
        expect(body.length).toBe(parameters.count);
    });
}

const testDataStartDate = [
    {
        testId: 'JIRA-004.1',
        parameters: {
            start_date: '2025-01-01',
            api_key: API_KEY
        }
    },
    {
        testId: 'JIRA-004.2',
        parameters: {
            start_date: '2025-02-01',
            api_key: API_KEY
        }
    }
];

for(const { testId, parameters } of testDataStartDate) {
    test(`${testId} start date`, { tag: ['@smoke'] }, async ({ request }) => {
        // const response = await request.get(`?start_date=2025-01-01&api_key=${API_KEY}`);
        const response = await request.get('', { params: parameters });
        expect(response.status()).toBe(200);
        expect(response.headers()).toHaveProperty('x-ratelimit-remaining');
        const body = await response.json();
        expect(body.length).toBeGreaterThan(0);
    });
}

const testDataExactDate = [
    {
        testId: 'JIRA-005.1',
        parameters: {
            date: '2025-01-10',
            api_key: API_KEY
        }
    },
    {
        testId: 'JIRA-005.2',
        parameters: {
            date: '2025-02-10',
            api_key: API_KEY
        }
    }
];

for(const { testId, parameters } of testDataExactDate) {
    test(`${testId} exact date`, { tag: ['@smoke', '@regression'] }, async ({ request }) => {
        // const response = await request.get(`?date=2025-01-10&api_key=${API_KEY}`);
        const response = await request.get(
            '', 
            { params: parameters }
        );
        expect(response.status()).toBe(200);
        expect(parseInt(response.headers()['x-ratelimit-remaining'])).toBeLessThan(4000);
        const body = await response.json();
        expect(body.date).toEqual(parameters.date);
    });
}

// we can parametrize our tests
const testDataCountThumbs = [
    {
        testId: 'JIRA-006.1',
        parameters: {
            count: 20,
            thumbs: true,
            api_key: API_KEY
        }
    },
    {
        testId: 'JIRA-006.2',
        parameters: {
            count: 10,
            thumbs: true,
            api_key: API_KEY
        }
    }
];
    
for(const { testId, parameters } of testDataCountThumbs) {
    test(`${testId} count thumbs`, { tag: ['@smoke', '@regression'] }, async ({ request }) => {
        //const response = await request.get(`?count=20&thumbs=true&api_key=${API_KEY}`,
        const response = await request.get(
            '',
            { params: parameters }
        );
        expect(response.status()).toBe(200);
        expect(response.headers()).toHaveProperty('x-ratelimit-remaining');
        const body = await response.json();
        expect(body.length).toBe(parameters.count);
    });
}

// add params
test('JIRA-007 start-end dates thumbs', { tag: ['@regression'] }, async ({ request }) => {
    // const startDate = '2025-01-01';
    // const endDate = '2025-02-01';
    // const thumbs = true;
    const params = {
            start_date: '2025-01-01',
            end_date: '2025-02-01',
            thumbs: true,
            api_key: API_KEY
        }
    const response = await request.get(
        // `?start_date=2000-01-01&end_date=2000-01-10&thumbs=true&api_key=${API_KEY}`,
        '',
        // {
        //     params: {
        //         start_date: startDate,
        //         end_date: endDate,
        //         thumbs: thumbs,
        //         api_key: API_KEY
        //     }
        // }
        { params: params }
    );
    expect(response.status()).toBe(200);
    expect(response.headers()).toHaveProperty('x-ratelimit-limit');
    const body = await response.json();
    expect(body.length).toBeGreaterThan(0);
});

test('JIRA-008 thumbs', { tag: ['@smoke'] }, async ({ request }) => {
    const response = await request.get(`?thumbs=true&api_key=${API_KEY}`);
    expect(response.status()).toBe(200);
    expect(response.headers()["x-ratelimit-limit"]).toEqual('4000');
    const body = await response.json();
    expect(body).toHaveProperty("hdurl");
});


// added expected result in test parameters
const statusTest = [
    {
        testId: 'JIRA-004.1.1',
        parameters: {
            start_date: '2025-01-01',
            api_key: API_KEY
        },
        expected: async response => {
            expect(response.status()).toBe(200);
            expect(response.headers()).toHaveProperty('x-ratelimit-remaining');
            const body = await response.json();
            expect(body.length).toBeGreaterThan(0);
        }
    },
    {
        testId: 'JIRA-004.1.2',
        parameters: {
            start_date: '2025',
            api_key: API_KEY
        },
        expected: response => {
            expect(response.status()).toBe(400);
        }
    }
];

for(const { testId, parameters, expected } of statusTest) {
    test(`${testId} start date, expected result is in parameters`, { tag: ['@smoke'] }, async ({ request }) => {
        // const response = await request.get(`?start_date=2025-01-01&api_key=${API_KEY}`);
        const response = await request.get('', { params: parameters });
        expected(response);
    });
}