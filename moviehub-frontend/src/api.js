import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});


export const signup = (data) => axios.post(`${BASE_URL}/signup`, data).then(res => res.data);
export const login = (data) => axios.post(`${BASE_URL}/login`, data).then(res => res.data);


export const getMovies = () => axios.get(`${BASE_URL}/movies`, { headers: headers() }).then(res => res.data);
export const addMovie = (data) => axios.post(`${BASE_URL}/movies`, data, { headers: headers() }).then(res => res.data);
export const deleteMovie = (movieId) => axios.delete(`${BASE_URL}/movies/${movieId}`, { headers: headers() }).then(res => res.data);
export const voteMovie = (movieId, voteType) => axios.post(`${BASE_URL}/movies/${movieId}/vote`, { vote_type: voteType }, { headers: headers() }).then(res => res.data);


export const getComments = (movieId) => axios.get(`${BASE_URL}/movies/${movieId}/comments`, { headers: headers() }).then(res => res.data);
export const addComment = (movieId, body) => axios.post(`${BASE_URL}/movies/${movieId}/comments`, { body }, { headers: headers() }).then(res => res.data);
export const deleteComment = async (commentId) =>  await axios.delete(`${BASE_URL}/comments/${commentId}`,{ headers: headers() }).then(res => res.data);
export const editComment = async (commentId,body) =>  await axios.post(`${BASE_URL}/editcomments/${commentId}`,{body},{ headers: headers() }).then(res => res.data);



export const getMovieById = (id) => axios.get(`${BASE_URL}/movies/${id}`, { headers: headers() }).then(res => res.data);

export const searchMovies = (query) =>  axios.get(`${BASE_URL}/movies/search`, {params: { q: query },}, { headers: headers() }).then(res => res.data);
export const getMoviesTrending = () => axios.get(`${BASE_URL}/movies/trending`, { headers: headers() }).then(res => res.data);
export const getMoviesWorst = () => axios.get(`${BASE_URL}/movies/worst`, { headers: headers() }).then(res => res.data);


