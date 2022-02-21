import interactives from './interactives'
const fs = require('fs');

test("Should get all interactives and matches the right structure", async () => {
    const response = interactives.getAll()
    expect(response).toBeDefined()
    const firstObject = response[0]
    expect(firstObject.hasOwnProperty('id')).toEqual(true);
    expect(firstObject.hasOwnProperty('file')).toEqual(true);
    expect(firstObject.hasOwnProperty('metadata1')).toEqual(true);
    expect(firstObject.hasOwnProperty('metadata2')).toEqual(true);
    expect(firstObject.hasOwnProperty('metadata3')).toEqual(true);
});

test("Should create an interactive and returns the right structure", async () => {
    const testPdf = fs.readFileSync(__dirname+'/../../../files/test-pdf.pdf').toString()
    const body = {
        "file": testPdf,
        "metadata1": "metadata1 id 11",
        "metadata2": "metadata2 id 11",
        "metadata3": "metadata3 id 11",
    }

    const response = interactives.store(body)
    expect(response).toBeDefined()
    expect(response.hasOwnProperty('id')).toEqual(true);
});

test("Should get an interactive", async () => {
    const response = interactives.show(1)
    expect(response).toBeDefined()
    expect(response.hasOwnProperty('id')).toEqual(true);
    expect(response.id).toEqual(1);
    expect(response.hasOwnProperty('file')).toEqual(true);
    expect(response.hasOwnProperty('metadata1')).toEqual(true);
    expect(response.hasOwnProperty('metadata2')).toEqual(true);
    expect(response.hasOwnProperty('metadata3')).toEqual(true);
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
