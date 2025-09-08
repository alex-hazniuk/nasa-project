import { expect, test } from "@playwright/test";
//import { test } from "./fixtures";

const client_id = '063366f7e9864c248171f3efa7b8827c';
const client_secret = 'eecc8e57cd9f4d23ba00f58bfbcf5606';

/*
var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    };
*/

// test('get token, should be valid', async ({ request, token }) => {
test('get token, should be valid', async ({ request }) => {
    const response = await request.get('https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg'
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // }
    );

    expect(response.status()).toBe(200);
    const json = await response.json();
});

// test('get show by name, should be in a list', async ({ request, token }) => {
test('get show by name, should be in a list', async ({ request }) => {
    const response = await request.get('https://api.spotify.com/v1/search',
      {
        // headers: {
        //   Authorization: `Bearer ${token}`
        // },
        params: {
          q: 'qa балачки',
          type: 'show'
        }
      }
    );

    expect(response.status()).toBe(200);
    const json = await response.json();

    console.log(json);

    console.log(json.shows.items[0].id);
});

test('get spotify user_id, should be in response', async ({ request }) => {
    const response = await request.get('https://api.spotify.com/v1/me');

    expect(response.status()).toBe(200);
    const json = await response.json();

    console.log(json.id);

    expect(json.id).toBeDefined();
});