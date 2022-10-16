/* eslint-disable */

import {getData} from '@/api/data'

export default {
  fetch: function (qType) {
    // 根据不同套题设置不同出题数
    let selectNum = 80
    let multiSelectNum = 20
    let yesNum = 20
    if (qType === '1') {
      selectNum = 30
      multiSelectNum = 14
      yesNum = 20
    } else if (qType === '2') {
      selectNum = 60
      multiSelectNum = 25
    }
    // 临时改成统一单选50，多选20，判断30
    selectNum = 50
    multiSelectNum = 20
    yesNum = 30
    return getData(qType).then(res => {
      return this.selectProblems(res.selectData, res.multiSelectData, res.yesData, selectNum, multiSelectNum, yesNum)
    })
  },
  selectProblems: function (useSelectData, useMultiSelectData, useYesData, selectNum, multiSelectNum, yesNum) {
    let chooseSelectData = []
    let choosedIdx = {}
    while (true) {
      if (useSelectData.length === 0) {
        break
      }
      // 随机选题
      let i = Math.floor((Math.random() * useSelectData.length))
      if (choosedIdx[i] === undefined) {
        chooseSelectData.push(useSelectData[i])
        choosedIdx[i] = true
      }
      if (chooseSelectData.length === selectNum) {
        break
      }
    }
    choosedIdx = {}
    let chooseMultiSelectData = []
    while (true) {
      if (useMultiSelectData.length === 0) {
        break
      }
      // 随机选题
      let i = Math.floor((Math.random() * useMultiSelectData.length))
      if (choosedIdx[i] === undefined) {
        chooseMultiSelectData.push(useMultiSelectData[i])
        choosedIdx[i] = true
      }
      if (chooseMultiSelectData.length === multiSelectNum) {
        break
      }
    }
    choosedIdx = {}
    let chooseYesData = []
    while (true) {
      if (useYesData.length === 0) {
        break
      }
      // 随机选题
      let i = Math.floor((Math.random() * useYesData.length))
      if (choosedIdx[i] === undefined) {
        chooseYesData.push(useYesData[i])
        choosedIdx[i] = true
      }
      if (chooseYesData.length === yesNum) {
        break
      }
    }
    return {
      selectData: chooseSelectData,
      multiSelectData: chooseMultiSelectData,
      yesData: chooseYesData
    }
  }
}
