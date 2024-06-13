
const LOAD_ALL_SERVERS = "servers/LOAD_ALL_SERVERS";
const ADD_SERVER = "servers/ADD_SERVER"
const DELETE_SERVER = "servers/DELETE_SERVER"
const GET_SERVER = "servers/GET_SERVER"
const LOAD_USER_SERVERS = "servers/LOAD_USER_SERVERS"
const UPDATE_SERVER = 'servers/UPDATE_SERVER';

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

const get_server = (server) => ({
  type: GET_SERVER,
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
  dispatch(get_server(data));
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
export const addServer = (img_url, server_name) => async (dispatch) => {
  const res = await fetch('/api/servers/', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      img_url,
      server_name
    }),
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
      server_id: serverId
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
  userServers: {}
};

const serversReducer = (state = initialState, action) => {

  const newState = {
    allServers: { ...state.allServers },
    userServers: { ...state.userServers }
  };

  switch (action.type) {

    case LOAD_ALL_SERVERS: {
      // normalize the servers array
      action.servers.servers.forEach(server => {
        newState.allServers[server.id] = server;
      });
      return newState;
    }

    case LOAD_USER_SERVERS: {
      // normalize user servers list
      action.userServers.user_server.forEach(server => {
        newState.userServers[server.id] = server;
      })
      return newState;
    }

    case ADD_SERVER: {
      // a new server to the allservers state and userservers state
      newState.allServers[action.server.id] = action.server;
      newState.userServers[action.server.id] = action.server;
      return newState;
    }

    case UPDATE_SERVER: {
      // update the server in both states
      newState.allServers[action.server.id] = action.server;
      newState.userServers[action.server.id] = action.server;
      return newState;
    }

    case DELETE_SERVER: {
      // remove server in both states
      delete newState.allServers[action.server.id];
      delete newState.userServers[action.server.id];
      return newState;
    }

    default:
      return newState;
  }
};

export default serversReducer
