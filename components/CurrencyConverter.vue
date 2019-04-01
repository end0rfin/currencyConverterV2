<template>
	<v-container>
	  
		<v-layout row wrap justify-center align-center v-if="!error">
			<v-flex xs12 sm12 md12>
				<div><span class="font-weight-light">1</span> {{ currencyNameList[currency1] }} <span class="font-weight-thin">equal</span></div>
				<div class="display-2"><span class="font-weight-black">{{ currentKoef }}</span> <span class="font-weight-thin">{{ currencyNameList[currency2] }}</span></div>
			</v-flex>

			<v-flex xs12 sm6 md6>
				<v-select
					v-model="currency1"
					:items="currencyLabelList"
		            menu-props="auto"
		            hide-details
		            single-line
				></v-select>
				<v-text-field
					outline
					v-model="operatorLeft"
					clearable
					@keyup="convertLeft"
				></v-text-field>
			</v-flex>


			<v-flex xs12 sm6 md6>
				<v-select
					v-model="currency2"
					:items="currencyLabelList"
		            menu-props="auto"
		            hide-details
		            single-line
				></v-select>
				<v-text-field
					outline
					v-model="operatorRight"
					clearable
					@keyup="convertRight"
				></v-text-field>
			</v-flex>
		</v-layout>

		<v-layout row wrap justify-center align-center v-else>
			<v-flex xs12 sm12 md12>
				<v-alert
			      :value="true"
			      type="error"
			    >
			    	Ошибка в работе конвертера. Попробуйте позже!
			    </v-alert>
			</v-flex>
		</v-layout>

	</v-container>
</template>


<style scoped>

</style>

<script>



import axios from 'axios'



// Текущий разделитель дробной части
const separator = 0.2.toLocaleString().substr(1,1)

export default {

	name: 'CurrencyConverter',

	data() {
		return {
			error:false,

			// Списки валют по умолчанию
			currencyLabelList: ['RUB','USD','EUR'],
			currencyNameList: {RUB:'Ruble',USD:'Dollar',EUR:'Euro'},

			// Значения по умолчанию
			currency1: 'RUB',
			currency2: 'USD',
			defCurrency1: 'RUB',
			defCurrency2: 'USD',

			operatorLeft: 1,
			operatorRight: 1,

			currentKoef:1,

			caretPosition:0
		}
	},
	methods: {
		// Обрезает десятичные значения
		// По умолчанию до 2 знаков
		decimalTrim(v,cnt=3){
			v = String(v)
			let res = (v.indexOf('.')>0)?v.substr(0,v.indexOf('.')+cnt):v
			return res
		},
		// Валидация вводимых данных
		validateInt(value=0) {
		    value = value == ''?'':String(value)
		    
		    // Шаблон ЗАПРЕЩЁННЫХ символов (отличные от разрешённых)
		    let patternDeny = new RegExp("[^0-9\.,]","gi")

		    let res = value
		    		.replace(patternDeny,"")
		    		.replace(",",".")
					.replace(/\./,"##")
					.replace(/\./gi,"")
					.replace("##",".")

			res = this.decimalTrim(res)
		    
		    return res
		},
		// Конвертация, при изменении первой (левой) валюты
		convertLeft(e){
			let operator = this.validateInt(this.operatorLeft)
			let res = this.currentKoef * operator
			
			this.operatorRight = this.decimalTrim(res)
			this.operatorLeft = operator
		},
		// Конвертация, при изменении второй (правой) валюты
		convertRight(){
			let operator = this.validateInt(this.operatorRight)
			let res = operator / this.currentKoef

			this.operatorLeft = this.decimalTrim(res)
			this.operatorRight = operator;
		},

		// Получаем список валют. Формируем списки для элементов
		getCurrencyList() {
			axios
				.get('https://free.currencyconverterapi.com/api/v6/currencies?apiKey=ade161bceab73f2a9571')
				.then(response => {
					let result = response.data.results
					this.currencyLabelList = []
					this.currencyNameList = []
					let curList = []
					for (let i in result) {
						this.currencyLabelList.push(result[i].id)
						this.currencyNameList[result[i].id] = result[i].currencyName
					}
				})
				.catch(error => {
					console.log('getting currency LIST   error')
					console.log(error)
					this.error = true
				})
		},
		// Запрос на получение текущего курса в соответствии с выбранными валютами
		getConverts() {
			let currencys = this.currency1+'_'+this.currency2
			let query = 'https://free.currencyconverterapi.com/api/v6/convert?q='+currencys+'&compact=ultra&apiKey=ade161bceab73f2a9571'
			axios
				.get(query)
				.then(response => {
					this.currentKoef = response.data[currencys]
				})
				.catch(error => {
					console.log('getConverts     ERROR')
					console.log(error)
					this.currentKoef = 1
					this.error = true
				})
		},



/*  
	-----------------------
	Позиционирование каретки в инпуте не реализован до конца
	-----------------------
*/
		// Получает позицию курсора к textarea, input
			// Возвращает
			// out.start
			// out.end
		getCaretPosition(ctrl) {
			// IE < 9
			if (document.selection) {
				ctrl.focus();
				let range = document.selection.createRange();
				let rangelen = range.text.length;
				range.moveStart ('character', -ctrl.value.length);
				let start = range.text.length - rangelen;
				return {'start': start, 'end': start + rangelen };
			}
			// IE >=9
			else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
				return {'start': ctrl.selectionStart, 'end': ctrl.selectionEnd };
			} else {
				return {'start': 0, 'end': 0};
			}
		},
		// Устанавливает позицию курсора к textarea, input
		setCaretPosition(ctrl, start, end) {			
			// IE >= 9
			if(ctrl.setSelectionRange) {
				ctrl.focus()
				ctrl.setSelectionRange(start, end)
			}
			// IE < 9
			else if (ctrl.createTextRange) {
				let range = ctrl.createTextRange()
				range.collapse(true)
				range.moveEnd('character', end)
				range.moveStart('character', start)
				range.select();
			}
		}
	},

	watch: {
		// Ловим СМЕНУ левой валюты
		currency1(){
			if (this.currency1 === this.currency2) { // меняем валюты местами, если совпадают
				this.currency2 = this.defCurrency1;
			}
			this.defCurrency1 = this.currency1
			this.getConverts()
			this.convertLeft();
		},
		// Ловим СМЕНУ левой валюты
		currency2(){
			this.currency2 = (this.currency2 === '')?0:this.currency2
			if (this.currency1 === this.currency2) {
				this.currency1 = this.defCurrency2;
			}
			this.defCurrency2 = this.currency2
			this.getConverts()
			this.convertRight();
		},
		currentKoef() {
			this.operatorRight = this.currentKoef
		}
	},

	created() {
		this.getConverts()
		this.getCurrencyList()
		this.currency1 = this.defCurrency1;
		this.currency2 = this.defCurrency2;
	},

	mounted() {
		this.convertLeft();

		console.log(this.$store)


		/* ОТКЛЮЧЕНО нет ключа
		// Получение данных через API    FIXER.IO


		let currentDate = new Date().toISOString().slice(0,10);
		let query = {
				params: {
					// base: 'USD',
					access_key: '4b99ebcd430569782594aee654fb02c8',
					date: currentDate,
					// from: 'USD',
					// to: 'EUR',
					// amount: 25
				}
			}
		axios
			//.get('http://data.fixer.io/api/convert',query)
			.get('http://data.fixer.io/api/latest',query)
			.then(response => {
				// this.info = response.data.bpi
			})
			.catch(error => {
				console.log('error')
				console.log(error)
			})
		*/
	}
}
</script>

