const localStorageName = 'Krieg-API-Target'
const targets = {
    local: {
        rest: 'http://127.0.0.1:8080',
        ws: 'ws://127.0.0.1:8080/game',
    },
    dev: {
        rest: 'https://dev.krieg.mistfireforge.com/api',
        ws: 'wss://dev.krieg.mistfireforge.com/api/game',
    },
    staging: {
        rest: 'https://staging.krieg.mistfireforge.com/api',
        ws: 'wss://staging.krieg.mistfireforge.com/api/game',
    },
    production: {
        rest: 'https://krieg.mistfireforge.com/api',
        ws: 'wss://krieg.mistfireforge.com/api/game',
    },
}
const saved = localStorage.getItem(localStorageName)

let targetName = saved ?? process.env.DEFAULT_TARGET
let targetUrl = targets[targetName] ?? targets.production

export const getTargetUrl = (): string => {
    return targetUrl.rest
}

export const getTargetWSUrl = (): string => {
    return targetUrl.ws
}

export const getTargetName = (): string => {
    return targetName
}

export const setTarget = (newTarget: string): boolean => {
    const newTargetUrl = targets[newTarget]
    if (!newTargetUrl) {
        // Not a valid target
        console.error('Not a valid target')
        return false
    }

    targetName = newTarget
    targetUrl = newTargetUrl
    localStorage.setItem(localStorageName, newTarget)

    // TODO: Log Out
    return true
}
