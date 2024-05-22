let reposPerPage = 10; // Default value
let currentPage = 1; // Default page number
let currentUsername = "lokeshmule3639"; // Default username

function fetchUserData(username, page) {
  // Start of showing loading indicator
  const loadingElement = document.getElementById("loading");
  loadingElement.style.display = "block";

  // Updating the currentUsername and currentPage only if new values are provided
  if (username) {
    currentUsername = username;
  }
  if (page) {
    currentPage = page;
  }

  // Fetch GitHub user data
  fetch(`https://api.github.com/users/${currentUsername}`)
    .then((response) => response.json())
    .then((data) => {
      // Updating profile section
      document.querySelector(".avatar").src = data.avatar_url;
      document.querySelector(".github-link").href = data.html_url;
      document.querySelector("h1").textContent = data.name;
      document.querySelectorAll(".intro-div p")[0].textContent = data.bio;
      document.querySelectorAll(".intro-div p")[1].textContent =
        "Location: " + data.location;
      document.getElementById("twitter").textContent =
        "Twitter: " + data.twitter_username;
      document.getElementById("public-repos").textContent =
        "Public Repositories: " + data.public_repos;

      // Fetching user repositories based on page and reposPerPage
      fetch(
        `https://api.github.com/users/${currentUsername}/repos?page=${currentPage}&per_page=${reposPerPage}`
      )
        .then((reposResponse) => reposResponse.json())
        .then((reposData) => {
          // Updateing repos section
          const reposContainer = document.querySelector(".repo-container");

          // Clearing existing repos in the card
          reposContainer.innerHTML = "";

          reposData.forEach((repo) => {
            const repoCardBlockDiv = document.createElement("div");
            repoCardBlockDiv.className = "block";

            const repoCard = document.createElement("div");
            repoCard.className = "card";

            const repoHeading = document.createElement("h2");
            repoHeading.className = "card-heading";
            repoHeading.textContent = repo.name;

            const repoParagraph = document.createElement("p");
            repoParagraph.className = "card-paragraph";
            repoParagraph.textContent =
              repo.description || "No description available.";

            // Fetching topics for each repo
            const topicsSection = document.createElement("div");
            topicsSection.className = "topics-section";

            //  fetch topics that are coming in an array and updating the DOM
            repo.topics.forEach((topic) => {
              const tag = document.createElement("span");
              tag.className = "topic";
              tag.textContent = topic;
              topicsSection.appendChild(tag);
            });

            repoCard.appendChild(repoHeading);
            repoCard.appendChild(repoParagraph);
            repoCard.appendChild(topicsSection);
            repoCardBlockDiv.appendChild(repoCard);

            reposContainer.appendChild(repoCardBlockDiv);

            // Ending/hiding loading indicator
            loadingElement.style.display = "none";
          });
        })
        .catch((reposError) => {
          console.error("Error fetching repositories data:", reposError);

          // Ending/hiding loading indicator
          loadingElement.style.display = "none";
        });
    })
    .catch((error) => {
      console.error("Error fetching GitHub user data:", error);
      // Ending/hiding loading indicator
      loadingElement.style.display = "none";
    });
}

// Initial GitHub user data fetch
fetchUserData(currentUsername, currentPage);

// Event listener for reposPerPage change
document.getElementById("reposPerPage").addEventListener("change", function () {
  reposPerPage = parseInt(this.value, 10);
  // Fetching user data with the updated reposPerPage value
  fetchUserData(); //When not giving a new username or page to keep the currentUsername and currentPage
});

// Event listener for page change
document.getElementById("page").addEventListener("change", function () {
  currentPage = parseInt(this.value, 10);
  // Fetching user data with the updated page value
  fetchUserData(); // When not giving any new username or reposPerPage to keep the currentUsername and reposPerPage
});

// Function to fetch GitHub user data based on username
window.searchUser = function () {
  const username = document.getElementById("githubUsername").value;
  fetchUserData(username, currentPage);
};
