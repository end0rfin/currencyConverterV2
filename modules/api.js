import axios from 'axios'

export default {
	async get (url, query) {
		try {
			let response = await axios.get(url,query)
			let data = response.data;
			let success = data.success;
			if (!success) {
				console.error('API ERROR',url,query)
				return false
			}
			return data
		} catch (error) {
			console.error('API ERROR',url,query,error)
			return false
		}
	}
}