
const LOAD = "servers/LOAD";
const ADD_SERVER = "servers/ADD_SERVER"
const DELETE_SERVER = "servers/DELETE_SERVER"
const GET_SERVER = "servers/GET_SERVER"

const load = (servers) => ({
  type: LOAD,
  servers,
});

const add_server = (server) => ({
  type: ADD_SERVER,
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

// GET - all servers that exist
export const getServers = () => async (dispatch) => {
  const response = await fetch("/api/servers/", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const usersServers = await response.json();
    dispatch(load(usersServers));
  }
};

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
  return ;
}

export const deleteServer = (id) => async (dispatch) => {
  const res = await fetch(`/api/servers/${id}`, {
    method: "DELETE",
  })
  const data = await res.json();
  dispatch(delete_server(data));
  return;
}

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

const initialState = {
  servers: {},
  current: {}
};

const serversReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD: {
      return {
        ...state,
        servers: action.server,
      };
    }

    case ADD_SERVER: {
      const newState = {...state}
      newState.servers[action.server.id] = action.server;
      return newState;
    }

    case DELETE_SERVER: {
      delete state[action.server.id]
      return {
        ...state,
      }
    }

    case GET_SERVER: {
      return {
        ...state,
        current: action.server
      }
    }

    default:
      return state;
  }
};

export default serversReducer
