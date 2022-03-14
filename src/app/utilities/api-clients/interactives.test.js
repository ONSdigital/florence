import InteractivesTest from './interactives-test'
const fs = require('fs');

test("Should get all interactives and matches the right structure", async () => {
    const response = await InteractivesTest.getAll()
    expect(response).toBeDefined()
    const items = response.data.items
    const firstObject = items[0]
    expect(firstObject.hasOwnProperty('id')).toEqual(true);
    const { metadata } = firstObject
    expect(metadata.hasOwnProperty('title')).toEqual(true);
    expect(metadata.hasOwnProperty('primary_topic')).toEqual(true);
    expect(metadata.hasOwnProperty('topics')).toEqual(true);
    expect(metadata.hasOwnProperty('surveys')).toEqual(true);
    expect(metadata.hasOwnProperty('release_date')).toEqual(true);
    expect(metadata.hasOwnProperty('uri')).toEqual(true);
    expect(metadata.hasOwnProperty('slug')).toEqual(true);
    expect(metadata.hasOwnProperty('edition')).toEqual(true);
    expect(metadata.hasOwnProperty('meta_description')).toEqual(true);
});

test("Should create an interactive and returns the right structure", async () => {
    const testPdf = fs.createReadStream(__dirname+'/../../../files/test-pdf.pdf').toString()
    const testZip = fs.createReadStream(__dirname+'/../../../files/test.zip').toString()
    const formData = new FormData();
    formData.append("file", testZip);
    formData.append("update", JSON.stringify({
        interactive: {
            metadata: {
                edition: "exercitation aute consectetur irure",
                meta_description: "ullamco incididunt eu",
                title: 'Test title',
                uri: 'https://testuri.com',
                primary_topic: 'primary_topic'
            }
        }
    }));

    try{
        const response = await InteractivesTest.store(formData)
        expect(response).toBeDefined()
        expect(response.hasOwnProperty('id')).toEqual(true);
    }catch(e){
        console.log('e', e)
    }
});

test("Should get an interactive", async () => {
    const res = await InteractivesTest.getAll()
    const items = res.data.items
    const firstObject = items[0]

    const response = await InteractivesTest.show(firstObject.id)
    const { data } = response
    expect(data).toBeDefined()
    expect(data.hasOwnProperty('id')).toEqual(true);
    expect(data.id).toEqual(firstObject.id);
    const { metadata } = data
    expect(metadata.hasOwnProperty('title')).toEqual(true);
    expect(metadata.hasOwnProperty('primary_topic')).toEqual(true);
    expect(metadata.hasOwnProperty('topics')).toEqual(true);
    expect(metadata.hasOwnProperty('surveys')).toEqual(true);
    expect(metadata.hasOwnProperty('release_date')).toEqual(true);
    expect(metadata.hasOwnProperty('uri')).toEqual(true);
    expect(metadata.hasOwnProperty('slug')).toEqual(true);
    expect(metadata.hasOwnProperty('edition')).toEqual(true);
    expect(metadata.hasOwnProperty('meta_description')).toEqual(true);
});

test("Should update an interactive", async () => {
    const interactiveId = 1;
    const testPdf = fs.readFileSync(__dirname+'/../../../files/test-pdf.pdf').toString()
    const body = {
        "file": testPdf,
        "metadata1": "metadata1 id 11",
        "metadata2": "metadata2 id 11",
        "metadata3": "metadata3 id 11",
    }

    const response = interactives.update(interactiveId, body)
    expect(response).toBeDefined()
    expect(response.hasOwnProperty('id')).toEqual(true);
    expect(response.id).toEqual(interactiveId);
    expect(response.hasOwnProperty('file')).toEqual(true);
    expect(response.file).toMatch(/.pdf/i);
    expect(response.hasOwnProperty('metadata1')).toEqual(true);
    expect(response.metadata1).toEqual(body.metadata1);
    expect(response.hasOwnProperty('metadata2')).toEqual(true);
    expect(response.metadata2).toEqual(body.metadata2);
    expect(response.hasOwnProperty('metadata3')).toEqual(true);
    expect(response.metadata3).toEqual(body.metadata3);
});

test("Should delete an interactive", async () => {
    const res = await InteractivesTest.getAll()
    const items = res.data.items
    const firstObject = items[0]

    const destroyResponse = await InteractivesTest.destroy(firstObject.id)
    expect(destroyResponse.status).toEqual(200);
    const { data } = destroyResponse
    expect(data).toBeDefined()
    try{
        await InteractivesTest.show(firstObject.id)
    }catch(e){
        expect(e.response.status).toEqual(404);
    }
});
