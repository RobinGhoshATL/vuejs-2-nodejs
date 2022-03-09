<template>
  <div id="app">
    <section class="hero is-bold">
      <div class="hero-body">
        <h1 class="title"><img src="./assets/vuelogo.png" alt="logo" class="ml-4" />Vue Demo (MSAL connect to Azure)</h1>
      </div>
      <span class="gitlink is-2 title">
        <a href="https://github.com/benc-uk/msal-graph-vue">
          <i class="fab fa-github fa-fw" />
        </a>
      </span>
    </section>

    <div class="container is-fluid">
      <div v-if="error" class="notification is-danger is-4 title">
        {{ error }}
      </div>

      <Login v-if="!user && !error" @loginComplete="updateUser" />

      <div v-if="user && !error" class="columns is-multiline">
        <div class="column">
          <div class="title is-5 underline">
            Account &amp; Tokens
          </div>
          <p><b>Name:</b> {{ user.name }}</p>
          <p><b>Username:</b> {{ user.username }}</p>
          <br />
           <button class="button is-orange is-fullwidth mt-2" @click="getProducts()">
            <span class="icon">
              <i class="fas fa-shopping-cart fa-fw" />
            </span>
            <span>Products</span>
          </button>
          <button class="button is-orange is-fullwidth mt-2" @click="getBlobs()">
            <span class="icon">
              <i class="fas fa-file-alt fa-fw" />
            </span>
            <span>Files</span>
          </button>
          <button class="button is-orange is-fullwidth mt-2" @click="getSchoolDetails()">
            <span class="icon">
              <i class="fas fa-graduation-cap fa-fw" />
            </span>
            <span>School</span>
          </button>
          <button class="button is-orange is-fullwidth mt-2" @click="showUserDetails = true">
            <span class="icon">
              <i class="fas fa-user fa-fw" />
            </span>
            <span>ID Token &amp; Account</span>
          </button>
          <button class="button is-orange is-fullwidth mt-2" @click="showTokenDetails = true">
            <span class="icon">
              <i class="fas fa-code fa-fw" />
            </span>
            <span>Access Token</span>
          </button>

          <div class="columns mt-2">
            <div class="column">
              <button class="button is-darkblue is-fullwidth" @click="shallowLogout">
                <span class="icon">
                  <i class="fas fa-sign-out-alt fa-fw" />
                </span>
                <span>Logout (Local)</span>
              </button>
            </div>
            <div class="column">
              <button class="button is-darkblue is-fullwidth" @click="fullLogout">
                <span class="icon">
                  <i class="fas fa-door-open fa-fw" />
                </span>
                <span>Logout (Full)</span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="graphDetails" class="column">
          <div class="title is-5 underline">
            Graph Details
          </div>
          <p><b>UPN:</b> {{ graphDetails.userPrincipalName }}</p>
          <p><b>ID:</b> {{ graphDetails.id }}</p>
          <p><b>Job Title:</b> {{ graphDetails.jobTitle }}</p>
          <p><b>Location:</b> {{ graphDetails.officeLocation }}</p>
          <p><b>Mobile:</b> {{ graphDetails.mobilePhone }}</p>
          <p><b>Department:</b> {{ graphDetails.department }}</p>
          <button class="button is-darkblue is-fullwidth mt-2" @click="showGraphDetails = true">
            <span class="icon">
              <i class="fas fa-address-card fa-fw" />
            </span>
            <span>Full Graph Result</span>
          </button>
        </div>

        <div v-if="graphPhoto" class="column">
          <div class="title is-5 underline">
            Photo
          </div>
          <p><img class="graphphoto" :src="graphPhoto" alt="user" /></p>
        </div>

        <div class="column is-full">
          <Search :user="user" :access-token="accessToken" />
        </div>
      </div>
    </div>

    <ProductList
      :content="products"
      title="Products"
      :shown="showProductList"
      @close="showProductList = false"
    />

    <FileList
      :content="blobs"
      title="Files"
      :shown="showBlobList"
      @close="showBlobList = false"
    />

    <DetailsModal
      :content="JSON.stringify(school, null, 2)"
      title="School"
      :shown="showSchoolDetails"
      @close="showSchoolDetails = false"
    />

    <DetailsModal
      :content="JSON.stringify(user, null, 2)"
      title="Account &amp; ID Token Details"
      :shown="showUserDetails"
      @close="showUserDetails = false"
    />

    <DetailsModal
      :content="JSON.stringify(graphDetails, null, 2)"
      title="Full Graph Details"
      :shown="showGraphDetails"
      @close="showGraphDetails = false"
    />

    <DetailsModal
      :content="accessToken"
      title="Access Token Raw Value"
      :wrap="true"
      link="https://jwt.ms"
      :shown="showTokenDetails"
      @close="showTokenDetails = false"
    />
  </div>
</template>

<script>
import auth from './services/auth'
import graph from './services/graph'
import Login from './components/Login'
import DetailsModal from './components/DetailsModal'
import ProductList from './components/ProductList'
import FileList from './components/FileList'
import Search from './components/Search'
import ApiService from './services/api.service'

const BASE_URL = process.env.VUE_APP_BACKEND_BASE_URL;

export default {
  name: 'App',

  components: { Login, DetailsModal, ProductList, FileList, Search },

  data: function() {
    return {
      // User account object synced with MSAL getAccount()
      user: {},
      // Access token fetched via MSAL for calling Graph API
      accessToken: '',

      // Details fetched from Graph API, user object and photo
      graphDetails: null,
      graphPhoto: null,

      // Visibility toggles for the three details modal popups
      showProductList: false,
      showBlobList: false,
      showSchoolDetails: false,
      showUserDetails: false,
      showGraphDetails: false,
      showTokenDetails: false,

      products: {},
      blobs: {},
      school: {},

      // Any errors
      error: ''
    }
  },

  watch: {
    // If user changes, make calls to Graph API
    user: async function() {
      this.fetchGraphDetails()
    }
  },

  async created() {
    // Basic setup of MSAL helper with client id, or give up
    if (process.env.VUE_APP_CLIENT_ID) {
      auth.configure(process.env.VUE_APP_CLIENT_ID, false)

      // Restore any cached or saved local user
      this.user = auth.user()
      console.log(`confgied ${auth.isConfigured()}`)
    } else {
      this.error = 'VUE_APP_CLIENT_ID is not set, the app will not function! 😥'
    }
  },

  methods: {
    // Update user from MSAL
    updateUser() {
      this.user = auth.user()
    },

    // Remove locally held user details, is same as logout
    shallowLogout() {
      this.user = null
      this.graphDetails = null
      this.userDetails = null
      this.graphPhoto = null
      auth.clearLocal()
    },

    // Full logout local & server side
    fullLogout() {
      auth.logout()
    },

    // Get an access token and call graphGetSelf & graphGetPhoto
    async fetchGraphDetails() {
      if (!this.user || this.user.username == 'demo@example.net') {
        return
      }

      try {
        this.graphDetails = await graph.getSelf()
        // this.graphPhoto = await graph.getPhoto()
        this.accessToken = graph.getAccessToken()
      } catch (err) {
        this.error = err
      }
    },

    // Get products list
    getProducts() {
      this.showProductList = true;
      ApiService.get(BASE_URL + "product/all")
        .then(({ data }) => {
          // console.log("Here what get returns", data);
          this.products = data;
        })
        .catch(({ response }) => {
          console.log("error", response);
        });
    },

    // Get blob list
    getBlobs() {
      this.showBlobList = true;
      ApiService.get(BASE_URL + "blob/all")
        .then(({ data }) => {
          // console.log("Here what get returns", data);
          this.blobs = data;
        })
        .catch(({ response }) => {
          console.log("error", response);
        });
    },

  // Get products list
    getSchoolDetails() {
      let tenant_id = this.user.tenantId; 
      this.showSchoolDetails = true;
      ApiService.get(BASE_URL + "school/" + tenant_id)
      // ApiService.get(BASE_URL + "school/3")
        .then(({ data }) => {
          // console.log("Here what get returns", data);
          this.school = data;
        })
        .catch( response  => {
          this.school = "This tenant id not exist with us"
          console.log("error", response);
        });
      
    },
  }
}
</script>

<style>
.hero-body img {
  width: 80px;
  vertical-align: middle;
  padding-right: 1rem;
}

.hero-body {
  padding: 0.5rem;
}

.hero-body h1 {
  color: #fff;
}

.hero {
  margin-bottom: 1rem;
  background-color: #0C203D;
}

.graphphoto {
  border-radius: 15px;
}

.underline {
  border-bottom: 3px solid #bbb;
}

.gitlink,
.gitlink a:visited {
  position: absolute;
  top: 0.8rem;
  right: 1rem;
  color: #333436;
}

.container .is-orange {
  background-color: #EF6C00;
}

.container button span {
  color: white;
}

.is-darkblue {
  background-color: #0C203D;
}
</style>
