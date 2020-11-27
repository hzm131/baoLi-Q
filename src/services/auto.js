import request from '@/utils/request';

const baseUrl = '/wookong';

export async function queryLargeAmount(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/getAutoCredit`,{
    method:'POST',
    body:str
  })
}

export async function setAutoCredit(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/setAutoCredit`,{
    method:'POST',
    body:str
  })
}
