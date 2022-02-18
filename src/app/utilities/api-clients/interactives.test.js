import interactives from './interactives'

test("Should get all interactives", async () => {
    let response = await interactives.getAll()
    console.log('response', response)
});
