import { test } from "./booker-fixtures";

// before each
// output 'This is rock'
test('test', async ({ showMeRock }) => {

}); // output: 
    // 'Before each'
    // 'Invoke me anyway'
    // 'This is rock'
    // 'After each'

// even if I don't use fixture, it's applied anyway
test('test auto true', async ({}) => {

}); // output: 
// 'Before each'
// 'Invoke me anyway'
// 'After each'