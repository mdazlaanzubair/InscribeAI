// FUNCTION TO CHECK IF THE CODE IS RUNNING IN CHROME EXTENSION ENVIRONMENT IS
function isChromeExtension() {
  return typeof chrome !== "undefined" && !!chrome.storage;
}

// FUNCTION TO SAVE USER DATA IN LOCAL STORAGE
export const saveDataLocally = (key, value) => {
  console.log("Saving these key/value pairs", key, ":", value);

  if (isChromeExtension()) {
    try {
      chrome.storage.local.set({ [key]: value });
    } catch (error) {
      console.error("Unexpected error occurred while saving data: ", error);
    }
  } else {
    return Promise.resolve(localStorage.setItem(key, JSON.stringify(value)));
  }
};

// FUNCTION TO EXTRACT USER DATA IN LOCAL STORAGE
export const getLocalData = async (key) => {
  if (isChromeExtension()) {
    try {
      // Load data from Chrome extension storage
      return chrome.storage.local.get(key).then((data) => data[key]);
    } catch (error) {
      console.error("Error loading from local state");
      console.error(error);
    }
  } else {
    return Promise.resolve(JSON.parse(localStorage.getItem(key)));
  }
};

// FUNCTION TO REMOVE DATA FROM LOCAL STORAGE
export const removeLocalData = async (keys = ["apiKey", "resume"]) => {
  if (isChromeExtension()) {
    try {
      // Remove data from Chrome extension storage
      await chrome.storage.local.remove(keys);
      return;
    } catch (error) {
      console.error("Error removing data from Chrome storage:", error);
    }
  } else {
    // Remove data from browser localStorage
    keys.forEach((key) => {
      localStorage.removeItem(key);
    });
    return;
  }
};
