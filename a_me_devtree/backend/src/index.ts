import colors from 'colors'
import server from './server'

const port = process.env.PORT || 4000

server.listen(port, () => {
  console.log(colors.blue.bold(`Servidor funcionando en el puerto: ${port}`))
})

let productName = 'Tablet'
let isAuth = false
let price = 30

type Product = {
  id: number
  price: number
  name: string
}

/*
type ProductID = {
  id: Product['id']
}
*/
//type ProductID = Omit<Product, 'id'>
//type ProductID = Omit<Product, 'id' | 'name'>
//type ProductID = Pick<Product, 'id' | 'name'>
type ProductID = Pick<Product, 'id'>

let product3: ProductID = {
  id: 1,
}

let product: Product = {
  id: 1,
  price: 30,
  name: 'tablet',
}

let product2: Product = {
  id: 2,
  price: 30,
  name: 'tablet 11 pulgadas',
}

const numbers = [10, 20, 30]
