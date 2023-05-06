const http = require('http')
const url = require('url')
const fs = require('fs')

const tempCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	'utf-8'
)
const tempOverview = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	'utf-8'
)
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	'utf-8'
)
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const replaceTemp = (temp, product) => {
	let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
	output = output.replace(/{%IMAGE%}/g, product.image)
	output = output.replace(/{%PRICE%}/g, product.price)
	output = output.replace(/{%FROM%}/g, product.from)
	output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
	output = output.replace(/{%QUANTITY%}/g, product.quantity)
	output = output.replace(/{%DESCRIPTION%}/g, product.description)
	output = output.replace(/{%ID%}/g, product.id)
	output = output.replace(/{%FROM%}/g, product.from)
	output = output.replace(/{%PRODUCTNUTRIENTSNAME%}/g, product.nutrients)

	if (!product.organic)
		output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
	return output
}

//   replaceTemp(tempCard)

const server = http.createServer((req, res) => {
	const { query, pathname } = url.parse(req.url, true)
	console.log(query.id)

	if (pathname === '/') {
		res.writeHead(200, { 'Content-type': 'text/html' })
		const cardHTML = dataObj.map((el) => replaceTemp(tempCard, el))
		const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHTML)

		res.end(output)
	} else if (pathname === '/product') {
		res.writeHead(200, { 'Content-type': 'text/html' })
		const product = dataObj[query.id]
		const output = replaceTemp(tempProduct, product)

		res.end(output)
	} else if (pathname === '/api') {
		res.writeHead(200, { 'Content-type': 'application/json' })
		res.end(data)
	} else {
		res.writeHead(404, { 'Content-type': 'text/html' })
		res.end('Ups, no se encontro la pagina!')
	}
})

server.listen(8000, '127.0.0.1', () => {
	console.log('Servidor levantado en puerto 8000! 💻')
})
