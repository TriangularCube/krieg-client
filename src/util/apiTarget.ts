const localStorageName = 'Krieg-API-Target'
const targets = {
    local: 'http://localhost:8080',
    dev: 'https://dev.krieg.mistfireforge.com/api',
    staging: 'https://staging.krieg.mistfireforge.com/api',
    production: 'https://krieg.mistfireforge.com/api',
}
const saved = localStorage.getItem(localStorageName)

let targetName = saved ?? process.env.DEFAULT_TARGET
let targetUrl = targets[targetName] ?? targets.production

export const getTargetUrl = (): string => {
    return targetUrl
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
