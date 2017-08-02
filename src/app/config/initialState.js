export const initialState = {
    user: {
        isAuthenticated: false,
        email: '',
        userType: '',
        isAdmin: false
    },
    rootPath: "/florence",
    teams: {
        active: {},
        all: [],
        users: []
    },
    datasets: {
        active: {
            alias: "",
            recipeID: "",
            jobID: "",
            files: [
                // Example of what a file object would look like
                /*
                {
                    alias_name: "", // The label and identifier of what file to upload
                    url: "" // Empty if no file has been uploaded or an S3 url if it has 
                } 
                */
            ],
            status: "", // One of 'created' | 'submitted' | 'completed' | 'error'
            format: ""
        },
        all: [],
        jobs: []
    },
    notifications: []
};