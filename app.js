// ======================================================
// WHAT ARE YOU BUILDING?
// ======================================================
//
// You are building a simple "Posts App"
//
// The user can:
// - See posts
// - Add a post
// - Edit a post
// - Delete a post
// - Search posts
//
// ------------------------------------------------------
// VERY IMPORTANT (READ THIS CAREFULLY)
// ------------------------------------------------------
// We are using a FAKE API.
//
// That means:
// - The server DOES NOT save your changes
// - If you refresh, all changes are gone
//
// So YOU must:
// - Store data in your own state
// - Update it manually
// - Re-render the UI
//
// RULE (MOST IMPORTANT):
// After ANY action:
// 1. Update STATE
// 2. Re-render UI
// ------------------------------------------------------



// ======================================================
// HOW THE APP IS BUILT
// ======================================================
//
// The app is split into 4 parts:
//
// 1. STATE  → stores data
// 2. API    → sends requests
// 3. UI     → displays data
// 4. APP    → connects everything
//
// Think of it like:
//
// STATE = data
// API   = communication
// UI    = display
// APP   = control flow
//
// ------------------------------------------------------



// ======================================================
// PART 1: STATE (CLOSURE)
// ======================================================
//
// This stores your data privately.
//
// You must:
// - Store posts in an array
// - Add new post
// - Update post
// - Delete post
// - Track if editing
//
// IMPORTANT:
// Only STATE controls the data.
// UI must NOT store data.



// ======================================================
// PART 2: API
// ======================================================
//
// This ONLY sends requests.
//
// You must:
// - GET posts
// - POST new post
// - PUT update post
// - DELETE post
//
// IMPORTANT:
// API does NOT update your UI
// API does NOT store real data
//
// YOU must update STATE yourself.



// ======================================================
// PART 3: UI
// ======================================================
//
// This ONLY controls what user sees.
//
// You must:
// - Show posts
// - Create Edit button
// - Create Delete button
// - Fill form when editing
//
// IMPORTANT:
// UI should NOT store posts
// It ONLY displays what STATE gives it



// ======================================================
// PART 4: APP (MAIN LOGIC)
// ======================================================
//
// This connects everything.
//
// You must:
// - Load posts when app starts
// - Call API
// - Update STATE
// - Re-render UI
//
// This is where everything comes together



// ======================================================
// EXACT STEPS YOU MUST FOLLOW
// ======================================================
//
// STEP 1: LOAD POSTS
// - Call API to get posts
// - Save them in STATE
// - Render them
//
// --------------------------------------
//
// STEP 2: SHOW POSTS
// - Loop through posts
// - Show title and body
// - Add Edit button
// - Add Delete button
//
// --------------------------------------
//
// STEP 3: CREATE POST
// - Call API (POST)
// - Add post to STATE
// - Re-render UI
//
// --------------------------------------
//
// STEP 4: EDIT POST
// - Fill form with post data
// - Set editing mode = true
//
// --------------------------------------
//
// STEP 5: UPDATE POST
// - Call API (PUT)
// - Update post in STATE
// - Re-render UI
//
// --------------------------------------
//
// STEP 6: DELETE POST
// - Call API (DELETE)
// - Remove post from STATE
// - Re-render UI
//
// --------------------------------------
//
// STEP 7: SEARCH
// - Filter posts from STATE
// - Re-render UI
//
// --------------------------------------



// ======================================================
// MOST COMMON MISTAKES (AVOID THESE)
// ======================================================
//
// - Expecting API to save data
// - Not updating STATE after API call
// - Not re-rendering UI
// - Storing data inside UI
//
// ------------------------------------------------------



// ======================================================
// FINAL RULE (REMEMBER THIS)
// ======================================================
//
// STATE controls everything
//
// If UI is wrong → STATE is wrong
//
// ALWAYS:
// change STATE → then render UI
//
// ======================================================

const App = (function () {
  const container = document.getElementById("postsContainer");
  const loadingMessage = document.getElementById("loadingMessage");
  const errorMessage = document.getElementById("errorMessage");

  let posts = []; 

  async function fetchPosts() {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10");
      posts = await res.json();

      loadingMessage.style.display = "none";

      renderPosts();
    } catch (error) {
      loadingMessage.style.display = "none";
      errorMessage.classList.remove("hidden");
    }
  }

  function renderPosts() {
    container.innerHTML = posts.map(post => `
      <div class="post">
        <h3>${post.title}</h3>
        <p>${post.body}</p>
      </div>
    `).join("");
  }

  return {
    init: fetchPosts
  };

})();

App.init();