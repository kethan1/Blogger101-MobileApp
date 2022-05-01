let globalState = {};

function setGlobalState(key, value) {
    globalState[key] = value;
}

function getGlobalState(key) {
    return globalState[key];
}

export {globalState, setGlobalState, getGlobalState};
