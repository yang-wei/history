import expect from 'expect'
import { REPLACE, POP } from '../Actions'
import execSteps from './execSteps'

function describeReplace(createHistory) {
  describe('replace', function () {
    let history, unlisten
    beforeEach(function () {
      history = createHistory()
    })

    afterEach(function () {
      if (unlisten)
        unlisten()
    })

    it('calls change listeners with the new location', function (done) {
      let steps = [
        function (location) {
          expect(location.pathname).toEqual('/')
          expect(location.search).toEqual('')
          expect(location.state).toEqual(null)
          expect(location.action).toEqual(POP)

          history.replace('/home?the=query')
        },
        function (location) {
          expect(location.pathname).toEqual('/home')
          expect(location.search).toEqual('?the=query')
          expect(location.state).toEqual()
          expect(location.action).toEqual(REPLACE)
        }
      ]

      unlisten = history.listen(execSteps(steps, done))
    })
  })
}

export default describeReplace
