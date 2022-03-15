import Interactives from "./interactives";

// index
async function getAll() {
    const response = await Interactives.getAll()
    return response.data
}

// store
async function create(data) {
    const response = await Interactives.store(data)
    return response.data
}

// show
async function show(interactiveId) {
    const response = await Interactives.show(interactiveId)
    return response.data
}

// update
async function update(interactiveId, data) {
    const response = await Interactives.update(interactiveId, data)
    return response.data
}

// delete
async function destroy (interactiveId) {
    const response = await Interactives.destroy(interactiveId)
    return response.data
}

module.exports = {
    getAll,
    create,
    show,
    update,
    destroy
};