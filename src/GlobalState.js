let globalState = {
  username: null,
  email: null,
  password: null,
};

function setGlobalState(key, value) {
  globalState[key] = value;
}

function getGlobalState(key) {
  return globalState[key];
}

export { globalState, setGlobalState, getGlobalState };
