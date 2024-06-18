import convertBase64 from "../services/helperFunctions";

const LOAD_ALL_SERVERS = "servers/LOAD_ALL_SERVERS";
const ADD_SERVER = "servers/ADD_SERVER"
const DELETE_SERVER = "servers/DELETE_SERVER"
const LOAD_CURRENT_SERVER = "servers/LOAD_CURRENT_SERVER"
const LOAD_USER_SERVERS = "servers/LOAD_USER_SERVERS"
const UPDATE_SERVER = 'servers/UPDATE_SERVER';

const loadCurrentServer = (server) => ({
  type: LOAD_CURRENT_SERVER,
  server
})

const load = (servers) => ({
  type: LOAD_ALL_SERVERS,
  servers,
});

const loadUserServers = (userServers) => ({
  type: LOAD_USER_SERVERS,
  userServers
})

const add_server = (server) => ({
  type: ADD_SERVER,
  server
});

const update_server = (server) => ({
  type: UPDATE_SERVER,
  server
});

const delete_server = (server) => ({
  type: DELETE_SERVER,
  server
})

// GET - get a single server
export const getServer = (id) => async (dispatch) => {
  const res = await fetch(`/api/servers/${id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const data = await res.json();
  dispatch(loadCurrentServer(data));
}

// GET - all servers that exist
export const getServers = () => async (dispatch) => {
  const response = await fetch("/api/servers/", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const servers = await response.json();
    dispatch(load(servers));
  }
};

// GET - all servers that the user owns
export const allServersByUserId = () => async (dispatch) => {
  const response = await fetch(`/api/usersservers/`);
  const data = await response.json();
  if (data.errors) {
    return;
  }
  dispatch(loadUserServers(data));
}

//POST a new server
export const addServer = (image, name) => async (dispatch) => {

  const formData = new FormData();
  formData.append('image', image);
  formData.append('name', name);

  const res = await fetch('/api/servers/', {
    method: "POST",
    body: formData
  })

  const data = await res.json();
  dispatch(add_server(data));
  return;
}

//UPDATE - update a server
export const updateServer = (serverId, imgUrl, serverName) => async (dispatch) => {
  const res = await fetch(`/api/servers/${serverId}/`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      img_url: imgUrl,
      server_name: serverName,
    })
  })
  const data = await res.json();
  dispatch(update_server(data));
}

// DELETE - delete a server
export const deleteServer = (id) => async (dispatch) => {
  const res = await fetch(`/api/servers/${id}`, {
    method: "DELETE",
  })
  const data = await res.json();
  dispatch(delete_server(data));
  return;
}

const initialState = {
  allServers: {},
  userServers: {},
  currentServer: {},
};

const serversReducer = (state = initialState, action) => {

  const newState = {
    allServers: { ...state.allServers },
    userServers: { ...state.userServers },
    currentServer: { ...state.currentServer},
  };

  switch (action.type) {

    case LOAD_ALL_SERVERS: {
      // normalize the servers array
      action.servers.servers.forEach(server => {
        server.img_url = convertBase64(server.img_url);
        newState.allServers[server.id] = server;
      });
      return newState;
    }

    case LOAD_USER_SERVERS: {
      // normalize user servers list
      action.userServers.user_server.forEach(server => {
        server.img_url = convertBase64(server.img_url);
        newState.userServers[server.id] = server;
      })
      return newState;
    }

    case LOAD_CURRENT_SERVER: {
      // save current server that the user clicked on
      newState.currentServer = action.server.server;
      newState.currentServer.img_url = convertBase64(newState.currentServer.img_url);
      return newState;
    }

    case ADD_SERVER: {
      // a new server to the allservers state and userservers state
      newState.allServers[action.server.id] = action.server;
      newState.userServers[action.server.id] = action.server;

      newState.allServers[action.server.id].img_url = convertBase64(newState.allServers[action.server.id].img_url);
      newState.userServers[action.server.id].img_url = convertBase64(newState.userServers[action.server.id].img_url);
      return newState;
    }

    case UPDATE_SERVER: {
      newState.allServers[action.server.id] = action.server;
      newState.userServers[action.server.id] = action.server;
      newState.currentServer = action.server;

      newState.allServers[action.server.id].img_url = convertBase64(newState.allServers[action.server.id].img_url);
      newState.userServers[action.server.id].img_url = convertBase64(newState.userServers[action.server.id].img_url);
      newState.currentServer.img_url = convertBase64(newState.currentServer.img_url);
      return newState;
    }

    case DELETE_SERVER: {
      // delete server in all three states
      delete newState.allServers[action.server.id];
      delete newState.userServers[action.server.id];
      newState.currentServer = {};
      return newState;
    }

    default:
      return newState;
  }
};

export default serversReducer
