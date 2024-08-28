// CONSTANT URLS
const jobsListURL = "https://www.linkedin.com/jobs/collections";
const jobDetailsURL = "https://www.linkedin.com/jobs/view";

// ATTACHING EVENT TO CHROME TAB UPDATE TO RUN SCRIPT TO EXTRACT JOB DESCRIPTION FROM LINKEDIN
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // CHECKING IF THE TAB IS COMPLETELY LOADED
  if (changeInfo?.status === "complete" && tab?.active) {
    // CHECKING IF THE TAB URLS ARE AS PER OUR MATCHING URL i.e. LINKEDIN JOBS DETAILS PAGE
    if (
      tab.url?.startsWith(jobsListURL) ||
      tab.url?.startsWith(jobDetailsURL)
    ) {
      // EXECUTING SCRIPT TO GRAB LINKEDIN JOB DESCRIPTION GIVING TARGET TAB ID
      // WHERE THE SCRIPT NEEDS TO RUN AND THE FUNCTION THAT WILL BE EXECUTED
      // IN THE TARGET TAD AND STORE IT IN LOCAL STORAGE
      chrome.scripting
        .executeScript({
          target: { tabId: tabId },
          func: getJobDetails,
        })
        .then((queryResult) => {
          chrome.storage.local.set({
            jobTitle: queryResult[0].result?.jobTitle,
          });
          chrome.storage.local.set({
            companyName: queryResult[0].result?.companyName,
          });
          chrome.storage.local.set({ jobDesc: queryResult[0].result?.jobDesc });
        });
    }
  }
});

// FUNCTION TO SELECT JOB DETAILS ELEMENT AND EXTRACT ITS CONTENT
const getJobDetails = () => {
  const jobTitle =
    document.body
      .querySelector(".job-details-jobs-unified-top-card__job-title")
      .textContent.replace(/\s\s+/g, "") ?? null;
  const companyName =
    document.body
      .querySelector(".job-details-jobs-unified-top-card__company-name")
      .textContent.replace(/\s\s+/g, "") ?? null;
  const jobDetailsElement = document.getElementById("job-details") ?? null;

  if (jobDetailsElement) {
    jobDetailsElement.style.border = "3px solid blue";
    jobDetailsElement.style.borderRadius = "5px";
    jobDetailsElement.style.padding = "1.25rem";
    // EXTRACTING JOB DESCRIPTION AND CLEANING ALL EXTRA SPACES
    const jobDesc = jobDetailsElement.textContent.replace(/\s\s+/g, "");

    return { jobDesc, jobTitle, companyName };
  }
};
