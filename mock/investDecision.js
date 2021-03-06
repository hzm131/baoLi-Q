import { parse } from 'url';

// mock investDecision
let investDecisionDataSource = [];
for (let i = 0; i < 46; i += 1) {
  investDecisionDataSource.push({
    key: i,
    name: `项目名称 ${i}`,
    manager: `投资经理${i}`,
    stage: `阶段${i}`,
  });
}


function getInvestDecision(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = investDecisionDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}

function postInvestDecision(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      investDecisionDataSource = partnerDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      investDecisionDataSource.unshift({
        key: i,
        name: `项目名称 ${i}`,
        manager: `投资经理${i}`,
        stage: `阶段${i}`,
      });
      break;
    case 'update':
      investDecisionDataSource = investDecisionDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { desc, name });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    list: investDecisionDataSource,
    pagination: {
      total: investDecisionDataSource.length,
    },
  };

  return res.json(result);
}

export default {
  'GET /api/investDecision': getInvestDecision,
  'POST /api/investDecision': postInvestDecision,
};
