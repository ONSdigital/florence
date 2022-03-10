import * as types from './actionTypes'
import interactives from "../utilities/api-clients/interactives";

export function setInteractives(interactive)
// export function setInteractives(interactives)
{
    // return {
    //     type: types.FETCH_INTERACTIVES,
    //     interactives
    // }
    let interactives = [
        {
            "id": 1,
            "file": '/docs/file1.pdf',
            "metadata1": "metadata1 id 1",
            "metadata2": "metadata2 id 1",
            "metadata3": "metadata3 id 1",
            "title": "title 1",
            "primary_topic": "businessindustryandtrade-changestobusiness-bankruptcyinsolvency",
        }, {
            "id": 2,
            "file": '/docs/file2.pdf',
            "metadata1": "metadata1 id 2",
            "metadata2": "metadata2 id 2",
            "metadata3": "metadata3 id 2",
            "title": "title 2",
            "primary_topic": "businessindustryandtrade-changestobusiness-bankruptcyinsolvency",
        }, {
            "id": 3,
            "file": '/docs/file3.pdf',
            "metadata1": "metadata1 id 3",
            "metadata2": "metadata2 id 3",
            "metadata3": "metadata3 id 3",
            "title": "title 3",
            "primary_topic": "businessindustryandtrade-changestobusiness-bankruptcyinsolvency",
        }, {
            "id": 4,
            "file": '/docs/file4.pdf',
            "metadata1": "metadata1 id 4",
            "metadata2": "metadata2 id 4",
            "metadata3": "metadata3 id 4",
            "title": "title 4",
            "primary_topic": "peoplepopulationandcommunity-culturalidentity-ethnicity",
        }, {
            "id": 5,
            "file": '/docs/file5.pdf',
            "metadata1": "metadata1 id 5",
            "metadata2": "metadata2 id 5",
            "metadata3": "metadata3 id 5",
            "title": "title 5",
            "primary_topic": "peoplepopulationandcommunity-culturalidentity-ethnicity",
        }, {
            "id": 6,
            "file": '/docs/file6.pdf',
            "metadata1": "metadata1 id 6",
            "metadata2": "metadata2 id 6",
            "metadata3": "metadata3 id 6",
            "title": "title 6",
            "primary_topic": "primary_topic",
        }, {
            "id": 7,
            "file": '/docs/file7.pdf',
            "metadata1": "metadata1 id 7",
            "metadata2": "metadata2 id 7",
            "metadata3": "metadata3 id 7",
            "title": "title 7",
            "primary_topic": "economy-regionalaccounts-grossdisposablehouseholdincome",
        }, {
            "id": 8,
            "file": '/docs/file8.pdf',
            "metadata1": "metadata1 id 8",
            "metadata2": "metadata2 id 8",
            "metadata3": "metadata3 id 8",
            "title": "title 8",
            "primary_topic": "economy-regionalaccounts-grossdisposablehouseholdincome",
        }, {
            "id": 9,
            "file": '/docs/file9.pdf',
            "metadata1": "metadata1 id 9",
            "metadata2": "metadata2 id 9",
            "metadata3": "metadata3 id 9",
            "title": "title 9",
            "primary_topic": "primary_topic",
        }, {
            "id": 10,
            "file": '/docs/file10.pdf',
            "metadata1": "metadata1 id 10",
            "metadata2": "metadata2 id 10",
            "metadata3": "metadata3 id 10",
            "title": "title 10",
            "primary_topic": "primary_topic",
        }
    ]
    return {
        type: types.FETCH_INTERACTIVES,
        interactives
    }
}

// export function setInteractive(interactive)
export function setInteractive(interactives)
{
    const interactive = {
        "id": 3,
        "file": '/docs/file3.pdf',
        "metadata1": "metadata1 id 3",
        "metadata2": "metadata2 id 3",
        "metadata3": "metadata3 id 3",
        "title": "title 3",
        "primary_topic": "businessindustryandtrade-changestobusiness-bankruptcyinsolvency",
        "url": "https://www.figma.com",
    }
    return {
        type: types.GET_INTERACTIVE,
        interactive
    }
}

export function storeInteractive(interactive)
{
    return {
        type: types.STORE_INTERACTIVE,
        interactive
    }
}

export function updateInteractive(interactive)
{
    return {
        type: types.UPDATE_INTERACTIVE,
        interactive
    }
}

export function setInteractiveError(data)
{
    return {
        type: types.INTERACTIVE_ERROR,
        data
    }
}

export function filterInteractives(filters)
{
    return {
        type: types.FILTER_INTERACTIVES,
        filters
    }
}

// get interactives
export function getInteractives()
{
    return dispatch => {
        interactives.getAll()
            .then((res) => {
                dispatch(setInteractives(res))
            })
            .catch((error) => {
                dispatch(setInteractiveError({
                    id: '',
                    errors: error.response.data.error
                }))
            })
    }
}

// get interactive
export function getInteractive(interactiveId)
{
    return dispatch => {
        interactives.show(interactiveId)
            .then((data) => {
                dispatch(setInteractive(data))
            })
            .catch((error) => {
                console.log('error trying to get interactive', error)
                dispatch(setInteractiveError(error))
            })
    }
}

// create interactive
export function createInteractive(data)
{
    return dispatch => {
        interactives.store({
            file: data.file,
            metadata1: data.metadata1,
            metadata2: data.metadata2,
            metadata3: data.metadata3,
        })
            .then((res) => {
                dispatch(storeInteractive({
                    id: res.data.id,
                    file: res.data.file,
                    metadata1: res.data.metadata1,
                    metadata2: res.data.metadata2,
                    metadata3: res.data.metadata3,
                    errors: ''
                }))
            .catch((error) => {
                dispatch(setInteractiveError({
                    id: '',
                    errors: error.response.data.error
                }))
            })
        })
    }
}

// edit interactive
export function editInteractive(interactiveId, data)
{
    return dispatch => {
        interactives.update(interactiveId, {
            file: data.file,
            metadata1: data.metadata1,
            metadata2: data.metadata2,
            metadata3: data.metadata3,
        })
            .then((res) => {
                dispatch(updateInteractive({
                    id: res.data.id,
                    file: res.data.file,
                    metadata1: res.data.metadata1,
                    metadata2: res.data.metadata2,
                    metadata3: res.data.metadata3,
                    errors: ''
                }))
            .catch((error) => {
                dispatch(setInteractiveError({
                    id: '',
                    errors: error.response.data.error
                }))
            })
        })
    }
}

// delete interactive
export function deleteInteractive(interactiveId)
{
    return dispatch => {
        interactives.destroy(interactiveId)
            .then((res) => {
                dispatch(updateInteractive(res))
                    .catch((error) => {
                        dispatch(setInteractiveError(error))
                    })
            })
    }
}