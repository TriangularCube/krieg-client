const localStorageName = 'Krieg-Client-API-target'
const targets = {
    local: 'http://localhost:8080',
    dev: 'https://dev.mistfireforge.com/krieg/api',
}
const saved = localStorage.getItem(localStorageName)

let targetName = saved ? saved : 'dev' // TODO: Should really be production later
let targetUrl = saved ? targets[targetName] : targets.dev // TODO: Again, should really be production

export const getTargetUrl = (): string => {
    return targetUrl
}

export const getTargetName = (): string => {
    return targetName
}

export const setTarget = (newTarget: string): void => {
    const newTargetUrl = targets[newTarget]
    if (!newTargetUrl) {
        // Not a valid target
        console.error('Not a valid target')
        return
    }

    targetName = newTarget
    targetUrl = newTargetUrl
    localStorage.setItem(localStorageName, newTarget)
}
