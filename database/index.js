const bcrypt = require('bcrypt');

const Order = require('./order');
const AdminUser = require('./admin-user');

const canModify = ({ currentAdmin }) =>
  currentAdmin && currentAdmin.role === 'admin';

const resources = [
  {
    resource: AdminUser,
    options: {
      listProperties: ['email', 'role', 'createdAt'],
      properties: {
        _id: {
          isVisible: false,
        },
        createdAt: {
          isVisible: false,
        },
        updatedAt: {
          isVisible: false,
        },
        encryptedPassword: {
          isVisible: false,
        },
        password: {
          type: 'string',
          isVisible: {
            list: false,
            edit: true,
            filter: false,
            show: false,
          },
        },
      },
      actions: {
        new: {
          isAccessible: canModify,
          before: async (request) => {
            if (request.payload.password) {
              request.payload = {
                ...request.payload,
                encryptedPassword: await bcrypt.hash(
                  request.payload.password,
                  10,
                ),
                password: undefined,
              };
            }
            return request;
          },
        },
        list: { isAccessible: canModify },
        edit: { isAccessible: canModify },
        delete: { isAccessible: canModify },
      },
    },
  },
  {
    resource: Order,
    options: {
      listProperties: ['code', 'status', 'createdAt'],
      properties: {
        _id: {
          isVisible: false,
        },
        createdAt: {
          isVisible: false,
        },
        updatedAt: {
          isVisible: false,
        },
      },
      actions: {
        list: { isAccessible: canModify },
        edit: { isAccessible: canModify },
        delete: { isAccessible: canModify },
        new: { isAccessible: canModify },
      },
      sort: { direction: 'desc', sortBy: 'createdAt' },
    },
  },
];

module.exports = resources;
