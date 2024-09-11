import axios from "axios"

const API = "https://jsonplaceholder.typicode.com";

const getUsersList = () => {
    return axios.get(`${API}/users`);
};

const createUser = (body) => {
    return axios.post(`${API}/users`, body);
};

const updateUser = (id, body) => {
    console.log("id", id, body);

    return axios.put(`${API}/users/${id}`, body);
};

const deleteUser = (id) => {
    return axios.delete(`${API}/users/${id}`);
};

export { getUsersList, createUser, updateUser, deleteUser }