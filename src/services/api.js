import { stringify } from 'qs';
import request from '@/utils/request';
//编辑 房源相关item

export async function checkBackreq(params){
  return request('/api/sourcemanage/deleteRent', {
    method: 'post',
    data: params
  });
}

export async function deleteRent(params){
  return request('/api/sourcemanage/deleteRent', {
    method: 'post',
    data: params
  });
}
export async function updateRooms(params){
  return request('/api/sourcemanage/updateroom', {
    method: 'post',
    data: params
  });
}

//添加order
export async function searchData(params){
  return request('/api/sourcemanage/searchData', {
    method: 'post',
    data: params
  });
}

export async function updateOrder(params){
  return request('/api/rentmange/updateOrder', {
    method: 'post',
    data: params
  });
}
export async function getOrder(params){
  return request('/api/rentmange/getOrder', {
    method: 'get',
    params
  });
}
export async function addRenter(params){
  return request('/api/rentmange/addRenter', {
    method: 'post',
    data: params
  });
}
export async function addPreOrder(params){
  return request('/api/rentmange/addPreOrder', {
    method: 'post',
    data: params
  });
}

//文件处理
export async function removeFile(params){
  return request('/api/remove', {
    method: 'post',
    data: params
  });
}

//租赁管理
  export async function getCommunityById(params){
    return request('/api/house/getOne', {
      method: 'get',
      params
    });
  }
  export async function getCommunityAll(){
    return request('/api/house/getAll', {
      method: 'get'
  })
  }

//房源配置
  export async function getCommunity(params){
    return request('/api/sourcemanage/getcommunity', {
      method: 'get',
      data: params,
    });
  }
  export async function getProject(params){
    return request('/api/sourcemanage/getproject', {
      method: 'get',
      data: params,
    });
  }
  export async function addProject(params){
    return request('/api/sourcemanage/addProject', {
      method: 'POST',
      data: params,
    });
  }
  export async function deleteProject(params){
    return request('/api/sourcemanage/deleteProject', {
      method: 'POST',
      data: params,
    });
  }
  export async function addCommunity(params){
    return request('/api/sourcemanage/addCommunity', {
      method: 'POST',
      data: params,
    });
  }
  export async function deleteCommunity(params){
    return request('/api/sourcemanage/deleteCommunity', {
      method: 'POST',
      data: params,
    });
  }
  export async function submitSourceHouse(params){
    return request('/api/sourcemanage/submitSourceHouse', {
      method: 'POST',
      data: params,
    });
  }
//登录注册
  export async function fakeRegister(params) {
    return request('/api/auth/register', {
      method: 'POST',
      data: params,
    });
  }

  export async function getFakeCaptcha(params) {
    return request(`/api/captcha`,{
      method: "GET",
      params
    });
  }
  export async function fakeChangePwd(params){
    return request('/api/resetpwd',{
      method: "POST",
      data: params,
    })
  }
//配置中心
export async function addFeesConfigModel(params){
  return request('/api/config/addFeesConfigModel',{
    method: "POST",
    data: params,
  })
}
export async function updateConfig(params){
  return request('/api/config/updateConfig',{
    method: "POST",
    data: params,
  })
}
export async function deleteConfig(params){
  return request('/api/config/deleteConfig',{
    method: "POST",
    data: params,
  })
}
export async function getCurrentAllData(){
  return request('/api/config/getCurrentAllData',{
    method: "get"
  })
}

//

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}


export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}
