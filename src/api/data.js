import axios from 'axios'

export function getData (number) {
  return axios.all([
    axios.get('/static/data/data' + number + '-select.json'),
    axios.get('/static/data/data' + number + '-multi-select.json'),
    axios.get('/static/data/data' + number + '-yes.json')
  ]).then(axios.spread((selectRes, multiSelectRes, yesRes) => {
    let selectData = []
    let multiSelectData = []
    let yesData = []
    if (selectRes.status === 200) {
      selectData = selectRes.data
    }
    if (multiSelectRes.status === 200) {
      multiSelectData = multiSelectRes.data
    }
    if (yesRes.status === 200) {
      yesData = yesRes.data
    }
    return {selectData, multiSelectData, yesData}
  }))
}
