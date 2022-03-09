import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import graph from './graph'

/**
 * Service to call HTTP request via Axios
 */
const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    // Vue.axios.defaults.baseURL = "http://localhost";
    Vue.axios.defaults.baseURL = process.env.VUE_APP_REDIRECT_URL;
  },

  /**
   * Set the default HTTP request headers
   */
  setHeader() {
    Vue.axios.defaults.headers.common[
      "Authorization"
    // ] = "Bearer neha";
    ] = `Bearer ${graph.getAccessToken()}`;
  },

  query(resource, params) {
    this.setHeader();
    return Vue.axios.get(resource, params).catch((error) => {
      // console.log(error);
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @returns {*}
   */
  get(resource) {
    this.setHeader();
    return Vue.axios.get(`${resource}`).catch((error) => {
      // console.log(error);
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */
  post(resource, params) {
    this.setHeader();
    return Vue.axios.post(`${resource}`, params);
  },

  /**
   * Send the UPDATE HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  update(resource, slug, params) {
    this.setHeader();
    return Vue.axios.put(`${resource}/${slug}`, params);
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params) {
    this.setHeader();
    return Vue.axios.put(`${resource}`, params);
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */
  delete(resource) {
    this.setHeader();
    return Vue.axios.delete(resource).catch((error) => {
      // console.log(error);
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },
};

export default ApiService;
