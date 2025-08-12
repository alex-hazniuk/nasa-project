import { test, expect } from '@playwright/test';

const API_KEY = 'JzaeM8dMrWZzUG3ZdpLQa2epUNbO13aSFosayUY4';

test('start-end dates', async ({ request }) => {
    const response = await request.get(`?start_date=2025-01-01&end_date=2025-02-01&api_key=${API_KEY}`);
    expect(response.status()).toBe(200);
    expect(response.headers()['x-ratelimit-limit']).toBe('4000');
    const body = await response.json();
    body.forEach(element => {
        expect(element).toHaveProperty('url');
    });
});

test('stat date thumbs', async ({ request }) => {
    const response = await request.get(`?thumbs=true&start_date=2025-01-01&api_key=${API_KEY}`);
    expect(response.status()).toBe(200);
    expect(parseInt(response.headers()['x-ratelimit-remaining'])).toBeLessThan(4000);
    const body = await response.json();
    expect(body.length).toBeGreaterThan(0);
});

test('count', async ({ request }) => {
    const response = await request.get(`?count=5&api_key=${API_KEY}`);
    expect(response.status()).toBe(200);
    expect(response.headers()).toHaveProperty('x-ratelimit-limit');
    const body = await response.json();
    expect(body.length).toBe(5);
});

test('start date', async ({ request }) => {
    const response = await request.get(`?start_date=2025-01-01&api_key=${API_KEY}`);
    expect(response.status()).toBe(200);
    expect(response.headers()).toHaveProperty('x-ratelimit-remaining');
    const body = await response.json();
    expect(body.length).toBeGreaterThan(0);
});

test('exact date', async ({ request }) => {
    const response = await request.get(`?date=2025-01-10&api_key=${API_KEY}`);
    expect(response.status()).toBe(200);
    expect(parseInt(response.headers()['x-ratelimit-remaining'])).toBeLessThan(4000);
    const body = await response.json();
    expect(body.date).toEqual("2025-01-10");
});

test('count thumbs', async ({ request }) => {
    const response = await request.get(`?count=20&thumbs=true&api_key=${API_KEY}`);
    expect(response.status()).toBe(200);
    expect(response.headers()).toHaveProperty('x-ratelimit-remaining');
    const body = await response.json();
    expect(body.length).toBe(20);
});

test('start-end dates thumbs', async ({ request }) => {
    const response = await request.get(`?start_date=2000-01-01&end_date=2000-01-10&thumbs=true&api_key=${API_KEY}`);
    expect(response.status()).toBe(200);
    expect(response.headers()).toHaveProperty('x-ratelimit-limit');
    const body = await response.json();
    expect(body.length).toBeGreaterThan(0);
});

test('thumbs', async ({ request }) => {
    const response = await request.get(`?thumbs=true&thumbs=true&api_key=${API_KEY}`);
    expect(response.status()).toBe(200);
    expect(response.headers()["x-ratelimit-limit"]).toEqual('4000');
    const body = await response.json();
    expect(body).toHaveProperty("hdurl");
});