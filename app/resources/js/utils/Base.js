import { fetchEndpoint } from './methods'

export class Base {
  constructor(argObj = {}, [s] = [false]) {
    for (const key in argObj) this[key] = argObj[key]

    this.init()
    !s && this.methods()
  }

  methods() {
    this.arrows()
    this.events()
  }

  toSubmit({ cond, url, method }) {
    this.submitCond = cond ?? false
    this.fetchUrl = url ?? ''
    this.fetchMethod = method ?? 'POST'

    this.methods()
  }

  arrows() {
    this.submit = (e) => {
      e.preventDefault()
      Object.values(this.errors).forEach((e) => this.submitCond && (e.value = ''))

      const { raw, json } = this.getBody()

      ;(async () => {
        try {
          const data = await fetchEndpoint(this.fetchUrl, this.fetchMethod, json)
          this.handleData(data, raw)
        } catch (err) {
          console.log(err.message)
        }
      })()
    }
  }
}
