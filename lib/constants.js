export const events = {
    root: {
        connection: 'connection',
        disconnect: 'disconnect',
    },

    players: {
        login: 'playerLogin',
        search: 'playerSearch',
        found: 'playerFound',
        ready: 'playerReady'
    },

    words: {
        validate: 'wordValidate'
    },

    matches: {
        grid: {
            new: 'gridNew'
        }
    }
};