<template>
	<v-container>
		<v-layout row wrap justify-center align-center v-if="!loadedRates">
			<v-flex xs12 sm12 md12>
				<v-alert
			      :value="true"
			      type="success"
			    >
			    	Загрузка конвертера
			    </v-alert>
			</v-flex>
		</v-layout>
		<v-layout row wrap justify-center align-center v-else-if="!error">
			<v-flex xs12 sm12 md12>
				<div><span class="font-weight-light">{{ converter.oLeft }}</span> {{ converter.symbols[converter.cLeft] }} <span class="font-weight-thin">equal</span></div>
				<div class="display-2"><span class="font-weight-black">{{ converter.oRight }}</span> <span class="font-weight-thin">{{ converter.symbols[converter.cRight] }}</span></div>
			</v-flex>

			<v-flex xs12 sm5 md5>
				<v-select
					v-model="converter.cLeft"
					:items="converter.symbolsText"
		            menu-props="auto"
		            hide-details
		            single-line
				></v-select>
				<v-text-field
					outline
					clearable
					@keyup="convertLeft"
		            @blur="convertLeft"
		            v-model.number.lazy="converter.oLeft"
		            min="0"
		            max="100000000"
		            type="number"
				></v-text-field>
			</v-flex>
			<v-flex xs12 sm2 md2>
			</v-flex>
			<v-flex xs12 sm5 md5>
				<v-select
					v-model="converter.cRight"
					:items="converter.symbolsText"
		            menu-props="auto"
		            hide-details
		            single-line
				></v-select>
				<v-text-field
					outline
					clearable
					@keyup="convertRight"
		            @blur="convertRight"
		            v-model.number.lazy="converter.oRight"
		            min="0"
		            max="100000000"
		            type="number"
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



<style>
	input[type='number'] {
	    -moz-appearance:textfield;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
	    -webkit-appearance: none;
	}
</style>

<script>



import model from './model'


export default {

	name: 'CurrencyConverter',

	data() {
		return {
			// Ошибка при обращении к запросу API
			error:false,

			// Загружен ли курс. Если нет, то ошибка
			loadedRates: false,

			// Объект по умолчанию
			converter: {
				oLeft:0,
				oRight:0,
				cLeft:'',
				cRight:'',
				symbols:{},
				symbolsText:{}
			}
		}
	},
	methods: {
		// Конвертация, при изменении первой (левой) валюты
		convertLeft(){
			this.convert(this.converter.cLeft,this.converter.cRight)
		},
		// Конвертация, при изменении второй (правой) валюты
		convertRight(){
			this.convert(this.converter.cRight,this.converter.cLeft)
		},
		// Конвертация курсов полей
		convert(from,to){			
			this.converter.oLeft = (typeof this.converter.oLeft == 'undefined')?1:this.converter.oLeft
			this.converter.oRight = (typeof this.converter.oRight == 'undefined')?1:this.converter.oRight

			this.converter.oLeft = ((this.converter.oLeft == '') || (this.converter.oLeft == null) || (this.converter.oLeft == 'undefined'))?0:this.converter.oLeft
			this.converter.oRight = ((this.converter.oRight == '') || (this.converter.oRight == null) || (this.converter.oRight == 'undefined'))?0:this.converter.oRight


			let cLi = this.converter.rates[from]
			let cRi = this.converter.rates[to]
			let oLi = this.converter.oLeft
			let oRi = this.converter.oRight
			
			// Если вводится правое поле
			if (from != this.converter.cLeft) {
				this.converter.oLeft = (cRi * oRi) / cLi
				return true
			}
			this.converter.oRight = (cRi / cLi) * oLi
			return true
		}
	},


	mounted() {
		model.getLatestRates().then(r => {
			let sText = []

			for(let k in r.symbols) {
				sText.push(k)
			}
			this.converter = {
				cLeft:'RUB',
				cRight:r.base,
				oLeft: r.rates['RUB'],
				oRight:r.rates[r.base],
				rates:r.rates,
				symbols:r.symbols,
				symbolsText:sText
			}
			this.loadedRates = true
		})
	},


	watch: {
		// Ловим СМЕНУ левой валюты
		"converter.cLeft"(newVal,oldNew){
			if (newVal === this.converter.cRight) { // меняем валюты местами, если совпадают
				this.converter.cRight = oldNew;
			}
			this.convertLeft();
		},
		// Ловим СМЕНУ правой валюты
		"converter.cRight"(newVal,oldNew){
			if (newVal === this.converter.cLeft) { // меняем валюты местами, если совпадают
				this.converter.cLeft = oldNew;
			}
			this.convertRight();
		}
	}
}
</script>

