/**
 * membership access
 */
export default {
  // 用户权限
  user: {
    page: 'user.page',
    create: 'user.create',
    delete: 'user.delete',
    update: 'user.update',
    authorize: 'user.authorize',
    authorize_tree: 'user.authorize_tree',
    query: 'user.query'
  },
  // 角色权限
  role: {
    page: 'role.page',
    create: 'role.create',
    delete: 'role.delete',
    update: 'role.update',
    list: 'role.list',
    authorize: 'role.authorize',
    authorize_tree: 'role.authorize_tree',
    query: 'role.query'
  },
  // 资源权限
  resource: {
    tree_list: 'resource.tree_list',
    create: 'resource.create',
    delete: 'resource.delete',
    update: 'resource.update',
    query: 'resource.query',
    permission: 'resource.permission'
  },
  // 权限
  permission: {
    page: 'permission.page',
    create: 'permission.create',
    delete: 'permission.delete',
    update: 'permission.update',
    query: 'permission.query'
  },
  // 登录尝试权限
  login_attempts: {
    page: 'login_attempts.page',
    clear: 'login_attempts.clear',
    export: 'login_attempts.export'
  },
  // 登录日志权限
  login_logs: {
    page: 'login_logs.page',
    clear: 'login_logs.clear',
    export: 'login_logs.export'
  },
  // 字典类型
  dictionaryType: {
    page: 'dictionary_type.page',
    create: 'dictionary_type.create',
    update: 'dictionary_type.update',
    delete: 'dictionary_type.delete',
    query: 'dictionary_type.query',
    list: 'dictionary_type.list'
  },
  // 字典
  dictionary: {
    page: 'dictionary.page',
    create: 'dictionary.create',
    update: 'dictionary.update',
    delete: 'dictionary.delete',
    query: 'dictionary.query'
  }
}
