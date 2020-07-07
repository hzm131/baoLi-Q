import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchCA(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectcloseout/onaudit/query`,{
    method:'POST',
    body: str,
  });
}

export async function fetchBL(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/getCredit`,{
    method:'POST',
    body: str,
  });
}
export async function addcre(params) {
  const str = JSON.stringify(params);
  console.log('请求',str)
  return request(`${baseUrl}/baoLi/personal`,{
    method:'POST',
    body: str,
  });
}



