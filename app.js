// PART 1: STATE (CLOSURE)
const State = (function () {
  let posts = [];
  let isEditing = false;
  let editingId = null;

  return {
    getPosts: () => posts,

    setPosts: (newPosts) => {
      posts = newPosts;
      localStorage.setItem("posts", JSON.stringify(posts)); 
    },

    addPost: (post) => {
      posts = [post, ...posts];
      localStorage.setItem("posts", JSON.stringify(posts)); 
    },

    updatePost: (updatedPost) => {
      posts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
      localStorage.setItem("posts", JSON.stringify(posts)); 
    },

    deletePost: (id) => {
      posts = posts.filter(p => p.id !== id);
      localStorage.setItem("posts", JSON.stringify(posts)); 
    },

    setEditing: (id) => {
      isEditing = true;
      editingId = id;
    },

    cancelEditing: () => {
      isEditing = false;
      editingId = null;
    },

    getEditing: () => ({
      isEditing,
      editingId
    })
  };
})();

// PART 2: API (FAKE API)
const API = {
  BASE_URL: "https://jsonplaceholder.typicode.com/posts",

  async getPosts() {
    const res = await fetch(this.BASE_URL + "?_limit=10");
    return res.json();
  },

  async createPost(post) {
    const res = await fetch(this.BASE_URL, {
      method: "POST",
      body: JSON.stringify(post),
      headers: { "Content-type": "application/json" }
    });
    return res.json();
  },

  async updatePost(post) {
    const res = await fetch(`${this.BASE_URL}/${post.id}`, {
      method: "PUT",
      body: JSON.stringify(post),
      headers: { "Content-type": "application/json" }
    });

    try {
      return await res.json();
    } catch {
      return post; // fallback for fake API
    }
  },

  async deletePost(id) {
    await fetch(`${this.BASE_URL}/${id}`, {
      method: "DELETE"
    });
  }
};

// PART 3: UI
const UI = {
  renderPosts(posts) {
    const container = document.getElementById("postsContainer");

    container.innerHTML = posts.map(post => `
      <div class="post">
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        <button onclick="App.handleEdit(${post.id})">Edit</button>
        <button onclick="App.handleDelete(${post.id})">Delete</button>
      </div>
    `).join("");
  },

  fillForm(post) {
    document.getElementById("titleInput").value = post.title;
    document.getElementById("bodyInput").value = post.body;
    document.getElementById("postId").value = post.id;

    document.getElementById("formTitle").innerText = "Edit Post";
    document.getElementById("submitBtn").innerText = "Update Post";
    document.getElementById("cancelBtn").classList.remove("hidden");
  },

  resetForm() {
    document.getElementById("postForm").reset();
    document.getElementById("postId").value = "";

    document.getElementById("formTitle").innerText = "Add New Post";
    document.getElementById("submitBtn").innerText = "Add Post";
    document.getElementById("cancelBtn").classList.add("hidden");
  }
};

// PART 4: APP (MAIN LOGIC)
const App = {
  async init() {
    const loading = document.getElementById("loadingMessage");

    try {
      const localPosts = localStorage.getItem("posts");

      if (localPosts) {
        State.setPosts(JSON.parse(localPosts));
      } else {
        const posts = await API.getPosts();
        State.setPosts(posts);
      }

      UI.renderPosts(State.getPosts());

    } catch (err) {
      document.getElementById("errorMessage").classList.remove("hidden");
    } finally {
      loading.style.display = "none";
    }
  },

  async handleSubmit(e) {
    e.preventDefault();

    const title = document.getElementById("titleInput").value;
    const body = document.getElementById("bodyInput").value;

    const { isEditing, editingId } = State.getEditing();

    if (isEditing) {
      const updatedPost = { id: editingId, title, body };

      await API.updatePost(updatedPost);

      State.updatePost(updatedPost); 
      State.cancelEditing();
    } else {
      const newPost = {
        id: Date.now(),
        title,
        body
      };

      await API.createPost(newPost);

      State.addPost(newPost); 
    }

    UI.resetForm();
    UI.renderPosts(State.getPosts());
  },

  handleEdit(id) {
    const post = State.getPosts().find(p => p.id === id);

    State.setEditing(id);
    UI.fillForm(post);
  },

  async handleDelete(id) {
    await API.deletePost(id);

    State.deletePost(id);
    UI.renderPosts(State.getPosts());
  },

  handleSearch(e) {
    const term = e.target.value.toLowerCase();

    const filtered = State.getPosts().filter(post =>
      post.title.toLowerCase().includes(term)
    );

    UI.renderPosts(filtered);
  },

  handleCancel() {
    State.cancelEditing();
    UI.resetForm();
  }
};

// EVENT LISTENERS
document.getElementById("postForm")
  .addEventListener("submit", App.handleSubmit);

document.getElementById("searchInput")
  .addEventListener("input", App.handleSearch);

document.getElementById("cancelBtn")
  .addEventListener("click", App.handleCancel);

// START APP
App.init();
