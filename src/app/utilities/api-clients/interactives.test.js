import interactives from './interactives'

test("Should get all interactives", async () => {
    let response = await interactives.getAll()
    expect(response).toBeDefined()
    expect(response[0]).toMatchObject({
        "id": 1,
        "title": "Ante egestas ligula ultricies sed lacinia ipsum mauris tincidunt egestas.",
        "userId": 1,
        "content": "Elit vehicula adipiscing ut dolor quam amet augue mattis congue a tincidunt praesent lorem egestas viverra ut congue lectus sed ante lorem donec mattis nec donec mollis vitae lectus consectetur porta ante enim consectetur congue tortor sit ut amet ipsum adipiscing consectetur sed eget adipiscing libero a consectetur augue donec.",
        "likes": 2,
        "hits": 345,
        "categoryId": 4,
        "imageUrl": "https://i.picsum.photos/id/348/600/300.jpg"
    })
});

test("Should create an interactives", async () => {
    const body = {
        "id": 1,
        "title": "Ante egestas ligula ultricies sed lacinia ipsum mauris tincidunt egestas.",
        "userId": 1,
        "content": "Elit vehicula adipiscing ut dolor quam amet augue mattis congue a tincidunt praesent lorem egestas viverra ut congue lectus sed ante lorem donec mattis nec donec mollis vitae lectus consectetur porta ante enim consectetur congue tortor sit ut amet ipsum adipiscing consectetur sed eget adipiscing libero a consectetur augue donec.",
        "likes": 2,
        "hits": 345,
        "categoryId": 4,
        "imageUrl": "https://i.picsum.photos/id/348/600/300.jpg"
    }

    let response = await interactives.create(1)
    expect(response).toBeDefined()
    expect(response.title).toEqual('Ante egestas ligula ultricies sed lacinia ipsum mauris tincidunt egestas.')
    expect(response.hits).toEqual(345)
});

test("Should delete an interactive", async () => {
    let response = await interactives.remove(1)
    expect(response).toBeDefined()
    expect(response.success).toEqual(true)
});
