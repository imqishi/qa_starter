<template>
  <div id="app">
    <router-view></router-view>
    <group>
      <checklist title="出题类型" :label-position="'right'" required
        :max="showProblemOpts.length" :min="1" :options="showProblemOpts" v-model="showProblemSetting">
      </checklist>
    </group>
    <div v-show="showTypeProblem(showProblemSetting, '1')">
      <group>
        <cell title="单选题" :value="'每个题目仅一个选项正确，每题'+selectScore+'分，共'+selectScore*form.selectAns.length+'分'"></cell>
      </group>
      <div v-for="(ans, idx) in form.selectAns" :key="'sa' + idx">
        <checklist :title="'问题'+ (idx + 1) +'：' + selectData[idx].Problem" :label-position="'right'" required :max="1"
          :min="1" :options="selectData[idx].Opts" v-model="ans.value"></checklist>
          <!--
        <group>
          <cell v-show="hasSubmit"
            :title="singleAnsRight(ans.value, selectData[idx].Ans[0]) ? '恭喜您答对了':'回答错误，答案应为'+selectData[idx].Ans[0]"
            :style="{color: singleAnsRight(ans.value, selectData[idx].Ans[0])? 'green':'red'}">
          </cell>
        </group>
          -->
      </div>
    </div>
    <div v-show="showTypeProblem(showProblemSetting, '2')">
      <group>
        <cell title="多选题" :value="'每个题目有一个或多个选项正确，每题'+multiSelectScore+'分，共'+multiSelectScore*form.multiSelectAns.length+'分'"></cell>
      </group>
      <div v-for="(ans, idx) in form.multiSelectAns" :key="'msa' + idx">
        <checklist :title="'问题'+ (idx + 1) +'：' + multiSelectData[idx].Problem" :label-position="'right'" required
          :max="multiSelectData[idx].Opts.length" :min="1" :options="multiSelectData[idx].Opts" v-model="ans.value">
        </checklist>
          <!--
        <group>
          <cell v-show="hasSubmit"
            :title="multiAnsRight(ans.value, multiSelectData[idx].Ans) ? '恭喜您答对了':'回答错误，答案应为'+getMultiAnsStr(multiSelectData[idx].Ans)"
            :style="{color: multiAnsRight(ans.value, multiSelectData[idx].Ans)? 'green':'red'}">
          </cell>
        </group>
          -->
      </div>
    </div>
    <div v-show="showTypeProblem(showProblemSetting, '3')">
      <group v-if="form.yesAns.length > 0">
        <cell title="判断题" :value="'请选择正确或错误，每题'+yesScore+'分，共'+yesScore*form.yesAns.length+'分'"></cell>
      </group>
      <div v-for="(ans, idx) in form.yesAns" :key="'ya' + idx">
        <checklist :title="'问题'+ (idx + 1) +'：' + yesData[idx].Problem"
          :label-position="'right'" required :max="1" :min="1" :options="yesData[idx].Opts" v-model="ans.value"></checklist>
        <!--
        <group>
          <cell v-show="hasSubmit"
            :title="singleAnsRight(ans.value[0], yesData[idx].RightAns[0]) ? '恭喜您答对了':'回答错误，答案应为'+(yesData[idx].RightAns[0] === 1 ? '正确': '错误')"
            :style="{color: singleAnsRight(ans.value[0], yesData[idx].RightAns[0]) ? 'green':'red'}">
          </cell>
        </group>
        -->
      </div>
    </div>
    <x-button type="primary" @click.native="submitQuestion">提交作答</x-button>
    <div v-show="hasSubmit">
      <group>
        <cell title="您的最终得分:" :value="totalScore+'分'"></cell>
      </group>
      <group>
        <cell title="错题回顾"></cell>
      </group>
      <div v-show="showTypeProblem(showProblemSetting, '1') && selErrIdx.length != 0">
        <group>
          <cell title="单选题" value=""></cell>
        </group>
        <div v-for="(ans, idx) in selErrIdx" :key="'sea' + idx">
          <checklist :title="'问题'+ (ans + 1) +'：' + selectData[ans].Problem" :label-position="'right'" required :max="1"
            :min="1" :options="selectData[ans].Opts" v-model="form.selectAns[ans].value" disabled></checklist>
          <group>
            <cell
              :title="'回答错误，答案应为'+selectData[ans].Ans[0]"
              :style="{color: 'red'}">
            </cell>
          </group>
        </div>
      </div>
      <div v-show="showTypeProblem(showProblemSetting, '2') && multiSelErrIdx.length != 0">
        <group>
          <cell title="多选题"></cell>
        </group>
        <div v-for="(ans, idx) in multiSelErrIdx" :key="'msea' + idx">
          <checklist :title="'问题'+ (ans + 1) +'：' + multiSelectData[ans].Problem" :label-position="'right'" required
            :max="multiSelectData[ans].Opts.length" :min="1" :options="multiSelectData[ans].Opts"
            v-model="form.multiSelectAns[ans].value" disabled></checklist>
          <group>
            <cell 
              :title="'回答错误，答案应为'+getMultiAnsStr(multiSelectData[ans].Ans)"
              :style="{color: 'red'}">
            </cell>
          </group>
        </div>
      </div>
      <div v-show="showTypeProblem(showProblemSetting, '3') && yesErrIdx.length != 0">
        <group>
          <cell title="判断题" value=""></cell>
        </group>
        <div v-for="(ans, idx) in yesErrIdx" :key="'yaa' + idx">
          <checklist :title="'问题'+ (ans + 1) +'：' + yesData[ans].Problem" :label-position="'right'" required :max="1"
            :min="1" :options="yesData[ans].Opts" v-model="form.yesAns[ans].value" disabled></checklist>
          <group>
            <cell
              :title="'回答错误，答案应为'+(yesData[ans].Ans[0] === '1' ? '正确': '错误')"
              :style="{color: 'red'}">
            </cell>
          </group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QData from './data'
import { Checklist, Cell, Group, XButton } from 'vux'
export default {
  name: 'app',
  components: {
    Checklist,
    Cell,
    Group,
    XButton
  },
  mounted () {
    let qType = this.$route.query.type
    if (qType !== '1' && qType !== '2' && qType !== '11' && qType !== '12' && qType !== '13' && qType !== '3') {
      qType = '0'
    }
    QData.fetch(qType).then(qData => {
      let selectAns = []
      for (let i = 0; i < qData.selectData.length; i++) {
        selectAns.push({ value: [] })
      }
      let multiSelectAns = []
      for (let i = 0; i < qData.multiSelectData.length; i++) {
        multiSelectAns.push({ value: [] })
      }
      let yesAns = []
      for (let i = 0; i < qData.yesData.length; i++) {
        yesAns.push({ value: [] })
      }
      // 临时改成统一单选20*1.5，多选20*2，判断20*1.5
      let selectScore = 1.5
      let multiSelectScore = 2
      let yesScore = 1.5
      if (qType === '3') {
        selectScore = 1
        multiSelectScore = 2
        yesScore = 1
      }
      this.form = {
        selectAns: selectAns,
        multiSelectAns: multiSelectAns,
        yesAns: yesAns
      }
      this.selectData = qData.selectData
      this.multiSelectData = qData.multiSelectData
      this.yesData = qData.yesData
      this.selectScore = selectScore
      this.multiSelectScore = multiSelectScore
      this.yesScore = yesScore
    })
  },
  data () {
    return {
      form: {
        selectAns: [],
        multiSelectAns: [],
        yesAns: []
      },
      selectData: [],
      multiSelectData: [],
      yesData: [],
      hasSubmit: false,
      totalScore: 0,
      selErrIdx: [],
      multiSelErrIdx: [],
      yesErrIdx: [],
      selectScore: 1,
      multiSelectScore: 1,
      yesScore: 1,
      showProblemSetting: [],
      showProblemOpts: [
        {key: '1', value: '单选'},
        {key: '2', value: '多选'},
        {key: '3', value: '判断'}
      ]
    }
  },
  methods: {
    submitQuestion () {
      this.hasSubmit = true
      this.selErrIdx = []
      this.multiSelErrIdx = []
      this.yesErrIdx = []
      let score = 0
      let selectScore = this.selectScore
      let multiSelectScore = this.multiSelectScore
      let yesScore = this.yesScore
      for (let i = 0; i < this.form.selectAns.length; i++) {
        if (this.singleAnsRight(this.form.selectAns[i].value, this.selectData[i].Ans[0])) {
          score += selectScore
        } else {
          this.selErrIdx.push(i)
        }
      }
      for (let i = 0; i < this.form.multiSelectAns.length; i++) {
        if (this.multiAnsRight(this.form.multiSelectAns[i].value, this.multiSelectData[i].Ans)) {
          score += multiSelectScore
        } else {
          this.multiSelErrIdx.push(i)
        }
      }
      for (let i = 0; i < this.form.yesAns.length; i++) {
        if (this.singleAnsRight(this.form.yesAns[i].value, this.yesData[i].Ans[0])) {
          score += yesScore
        } else {
          this.yesErrIdx.push(i)
        }
      }
      this.totalScore = score
    },
    singleAnsRight (ans, rightAns) {
      if (ans === null) {
        return false
      }
      if (ans.length === 0) {
        return false
      }
      return ans[0] === rightAns
    },
    multiAnsRight (ans, rightAns) {
      if (ans.length !== rightAns.length) {
        return false
      }
      let tAns = []
      for (let i = 0; i < ans.length; i++) {
        tAns.push(ans[i])
      }
      tAns.sort()
      for (let i = 0; i < ans.length; i++) {
        if (tAns[i] !== rightAns[i]) {
          return false
        }
      }
      return true
    },
    getMultiAnsStr (ans) {
      return ans.join('')
    },
    showTypeProblem (ans, pType) {
      if (ans === null) {
        return false
      }
      if (ans.length === 0) {
        return false
      }
      for (let i = 0; i < ans.length; i++) {
        if (ans[i] === pType) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;
}
</style>
