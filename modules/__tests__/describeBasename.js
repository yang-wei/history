import expect from 'expect'
import { PUSH, REPLACE, POP } from '../Actions'
import useBasename from '../useBasename'
import execSteps from './execSteps'

function stripHash(path) {
  return path.replace(/^#/, '')
}

function describeBasename(createHistory) {
  describe('basename handling', function () {
    let history, unlisten
    beforeEach(function () {
      history = useBasename(createHistory)({
        basename: '/base/url'
      })
    })

    afterEach(function () {
      if (unlisten)
        unlisten()
    })

    describe('in pushState', function () {
      it('works', function (done) {
        let steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)
            expect(location.basename).toEqual('')

            history.pushState({ the: 'state' }, '/home')
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(PUSH)
            expect(location.basename).toEqual('/base/url')
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    describe('in push', function () {
      it('works', function (done) {
        let steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)
            expect(location.basename).toEqual('')

            history.push('/home')
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(PUSH)
            expect(location.basename).toEqual('/base/url')
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    describe('in replaceState', function () {
      it('works', function (done) {
        let steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)
            expect(location.basename).toEqual('')

            history.replaceState({ the: 'state' }, '/home')
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(REPLACE)
            expect(location.basename).toEqual('/base/url')
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    describe('in replace', function () {
      it('works', function (done) {
        let steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)
            expect(location.basename).toEqual('')

            history.replace('/home')
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(REPLACE)
            expect(location.basename).toEqual('/base/url')
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    describe('in createPath', function () {
      it('works', function () {
        expect(
          history.createPath('/the/path')
        ).toEqual('/base/url/the/path')
      })
    })

    describe('in createHref', function () {
      it('works', function () {
        expect(
          stripHash(history.createHref('/the/path'))
        ).toEqual('/base/url/the/path')
      })
    })
  })

  describe('basename through <base href>', () => {
    let history, unlisten, base

    before('add base element', () => {
      base = document.createElement('base')
      base.href = '/base/url'
      document.head.appendChild(base)
    })

    beforeEach(() => {
      history = useBasename(createHistory)()
    })

    describe('in createPath', () => {
      it('works', function () {
        expect(
          history.createPath('/the/path')
        ).toEqual('/base/url/the/path')
      })
    })

    describe('in createHref', () => {
      it('works', function () {
        expect(
          stripHash(history.createHref('/the/path'))
        ).toEqual('/base/url/the/path')
      })
    })

    describe('in pushState', () => {
      it('works', function (done) {
        let steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)
            expect(location.basename).toEqual('')

            history.pushState({ the: 'state' }, '/home')
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(PUSH)
            expect(location.basename).toEqual('/base/url')
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    afterEach(() => {
      if (unlisten)
        unlisten()
    })

    after(() => {
      document.head.removeChild(base)
    })

  })
}

export default describeBasename
