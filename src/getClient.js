import axios from 'axios';

export const getClient = (configs, action) => {
  const config = configs[
    (action.payload && action.payload.client) ? action.payload.client : 'default'
  ];

  return axios.create(config.axios);
};
