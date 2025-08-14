import { test, expect } from '@playwright/test';

// fixture
// request

test('get post by id', async ({ request }) => {
    const response = await request.get('/todos/1');
    expect(response.status()).toBe(200);
});

test('create post', async ({ request }) => {
    const response = await request.post('/posts', {
        data: {
            "title": "foo",
            "body": "bar",
            "userId": 1
        }
    });
    expect(response.status()).toBe(201);
});

test('update post', async ({ request }) => {
    const response = await request.put('/posts/1', {
        data: {
            "title": "cool",
            "body": "bar",
            "userId": 1
        }
    });
    expect(response.status()).toBe(200);
});

test('update part of the post', async ({ request }) => {
    const response = await request.patch('/posts/1', {
        data: {
            "body": "cafe",
        }
    });
    expect(response.status()).toBe(200);
});

test('delete post', async ({ request }) => {
    const response = await request.delete('/todos/1');
    expect(response.status()).toBe(200);
});
