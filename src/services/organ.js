import request from '@/utils/request';

const baseUrl = '/wookong';

export async function findLoan(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/getAppSerial`,{
    method:'POST',
    body: str,
  });
}
export async function updateOrgan(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/upDateAppSerial`,{
    method:'POST',
    body: str,
  });
}





