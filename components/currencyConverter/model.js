import api from '~/modules/api'

const apiUrlSymbols = 'http://data.fixer.io/api/symbols'
const apiUrlLatest = 'http://data.fixer.io/api/latest'
const apiParams = {
		params: {
			access_key: '4b99ebcd430569782594aee654fb02c8',
			date: new Date().toISOString().slice(0,10),
			// base: 'USD',
			// from: 'USD',
			// to: 'EUR',
			// amount: 25
		}
	}
		


export default {

	async getCurrencySymbols() {
		let result = await api.get(apiUrlSymbols,apiParams).then(r => {
			this.updateLocalStorage(JSON.stringify(r.symbols),'currencySymbols')
			return r.symbols
		})
		return result
	},


	isCurrencyActual() {
		let ls = window.localStorage.getItem('currencyConverter') || false

		if (ls) {
			let list = JSON.parse(ls)

			if ((list.timestamp + 3600) < (new Date().getTime() / 1000)) {
				return false
			}
			return true
		} else {
			return false
		}
	},
	validateData(data) {
		let result = { base:'',rates:{} }
		if (typeof data.timestamp == 'number') {
			result.timestamp = data.timestamp
		} else {
			return 'Error in api.timestamp'
		}
		if (typeof data.base != 'undefined') {
			result.base = data.base
		} else {
			return 'Error in api.timestamp'
		}
		for(let k in data.rates) {
			result.rates[k] = data.rates[k]
		}

		return result
	},
	// Обновление данных в localStorage
		// Вынес в отдельную функцию на случай, если будет обновление в нескольких местах, то будет надо будет только 
	updateLocalStorage(data,name) {
		window.localStorage.setItem(name,data)
	},
	loadFromStorage(name) {
		let result = window.localStorage.getItem(name)
		return JSON.parse(result)
	},
	async getLatestRates() {
		let isActual = this.isCurrencyActual()
		if (!isActual) {
			let result = await api.get(apiUrlLatest,apiParams).then(r => {
				this.loadedRates = true
				if (!r) {
					console.error('ERROR')
					return false
				}
				let list = this.validateData(r)
				this.updateLocalStorage(JSON.stringify(list),'currencyConverter')
				return list
			})
			let symbols = await this.getCurrencySymbols().then(r => {
				return r
			})
			result.symbols = symbols
			return result
		} else {
			let currencyList = await this.loadFromStorage('currencyConverter')
			currencyList.symbols = await this.loadFromStorage('currencySymbols')
			return currencyList
		}
	}

}
