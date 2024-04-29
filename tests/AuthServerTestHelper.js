/* istanbul ignore file */
const ServerTestHelper = {
  async getAccessTokenUserIdHelper({ server, username = 'dicoding' }) {
    const userPayload = {
      username: 'dicoding',
      password: 'secret',
    };

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...userPayload,
        fullname: 'dicoding com',
      },
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: userPayload,
    });

    const { id: credentialId } = JSON.parse(responseUser.payload).data.addedUser;
    const { accessToken } = JSON.parse(responseAuth.payload).data;
    return { credentialId, accessToken };
  },
};

module.exports = ServerTestHelper;
