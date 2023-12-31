// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count // Генеруємо унікальний id для товару
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)

    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    // Фільтруєсо товари, щоб вилучити той, з яким порівнюємо id
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    // Відсотуємо за допомогою Math.random() та перемішаємо масив
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    // Повертаємо перші 3 елементи з перемішаного масивуs
    return shuffledList.slice(0, 3)
  }
}

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming (1234X1) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6-4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ і тд...`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Super Gaming (375Q1) Intel i9-14300/`,
  `Intel i9-14300 (3.8-4.5 ГГц) / RAM 17 ГБ / HDD 1 ТБ + SSD 480 ГБ і тд...`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  20000,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Power Gaming (11155A3) Intel xeon-3/`,
  `Intel xeon-3(...) / RAM 24 ГБ / HDD 500 ГБ + SSD 120 ГБ і тд...`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  30000,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)

    const currentBalance = Purchase.getBonusBalance(email)

    const updateBalance = currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updateBalance)

    console.log(email, updateBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null
    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)

    return newPurchase
  }

  static getList = () => {
    return Purchase.#list.reverse()
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    // const purchase = Purchase.#list.filter(
    //   (item) => item.id === id,
    // )

    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email

      return true
    } else {
      return false
    }

    // Повертаємо перші 3 елементи з перемішаного масивуs
    return shuffledList.slice(0, 3)
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('test1', 0.9)
Promocode.add('test2', 0.5)
Promocode.add('test3', 0.75)

//==============

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки`

router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',

    data: {
      list: Product.getList(),
      //   img: 'https://picsum.photos/200/300',
      //   title: `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
      //   description: `AMD Ryzen 5 3600 (3.6-4.2 Ггц) / RAM 16 ГБ/ HDD 1 ГБ + SSD 480 ГБ /`,
      //   category: [
      //     { id: 1, text: `Готовий до відправки` },
      //     { id: 2, text: `Топ продажів` },
      //   ],
      //   price: 27000,

      //   message: 'Щперація успішна',
      //   info: 'Товар створений',
      //   linl: '/test-path',
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',

    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Некоректа кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  //   console.log(id, amount)

  const product = Product.getById(id)

  if (product.amount < 1) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такої кількості товарів немає в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-create',

    data: {
      id: product.id,

      cart: [
        {
          text: `${product.title} (${amount}) шт)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// router.post('/purchase-create', function (req, res) {
//   console.log(req.query)
//   console.log(req.body)

//   res.render('alert', {
//     style: 'alert',

//     data: {
//       message: 'Успішно',
//       info: 'Замовлення створено',
//       link: `/purchase-list`,
//     },
//   })
// })

router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: `/purchase-list`,
      },
    })
  }

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товар не має в потрібній кількості',
        link: `/purchase-list`,
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Некоректні дані',
        link: `/purchase-list`,
      },
    })
  }

  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: `Заповніть обов'язкові поля`,
        info: 'Некоректні дані',
        link: `/purchase-list`,
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)
    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,

      promocode,
      comment,
    },
    product,
  )

  console.log(purchase)

  res.render('alert', {
    style: 'alert',
    data: {
      message: `Успішно`,
      info: 'Замовлення створено',
      link: `/purchase-list`,
    },
  })
})

router.get('/purchase-list', function (req, res) {
  //   const { id } = req.query
  //   const product = Product.getById(Number(id))
  //   const bon = Purchase.getById(Number(id))
  //   res.render('purchase-list', {
  //     style: 'purchase-list',
  //     data: {
  //       title: product.title,
  //       price: product.price,
  //       id: product.id,
  //       bonus: bon.bonus,
  //     },
  //   })

  // res.render генерує нам HTML сторінку
  // console.log(bonus)

  const list = Purchase.getList()
  console.log('purchase-list:', list)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-list',
    component: ['heading', 'purchase-item', 'divider'],
    title: 'Мої замовлення',

    data: {
      purchases: {
        list,
      },
      // bonus, // Отримати bonusAmount з параметрів URL
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/purchase-info', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)

  console.log('purchase-info:', purchase)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-info',

    title: 'Інформація про замовлення',

    data: {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
      product: purchase.product.title,
      productPrice: purchase.productPrice,
      deliveryPrice: purchase.deliveryPrice,
      totalPrice: purchase.totalPrice,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/purchase-red', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)

  console.log('purchase-red:', purchase)

  if (!purchase) {
    res.render('alert', {
      style: 'alert',

      isError: true,
      tiitle: 'Помилка',
      info: 'Замовлення з таким ID не найдено',
    })
  } else {
    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('purchase-red', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'purchase-red',

      title: 'Зміна даних',

      data: {
        firstname: purchase.firstname,
        lastname: purchase.lastname,
        id: purchase.id,
        email: purchase.email,
        phone: purchase.phone,
        delivery: purchase.delivery,
      },
    })
  }
  // ↑↑ сюди вводимо JSON дані
})

router.post('/purchase-red', function (req, res) {
  // ↑↑ сюди вводимо JSON дані

  //   const { id, firstname, lastname, email, phone } = req.body
  //   const list = Purchase.updateById(Number(id), {
  //     firstname,
  //     lastname,
  //     email,
  //     phone,
  //   })

  //   console.log(id)
  //   console.log(list)

  //   if (list) {
  //     res.render('alert', {
  //       style: 'alert',
  //       info: 'Інформація про товар оновлена',
  //     })
  //   } else {
  //     res.render('alert', {
  //       style: 'alert',
  //       info: 'Сталася помилка',
  //     })
  //   }

  const id = Number(req.query.id)
  let { firstname, lastname, phone, email, delivery } =
    req.body

  const purchase = Purchase.getById(id)

  console.log(purchase)

  if (purchase) {
    const newPurchase = Purchase.updateById(id, {
      firstname,
      lastname,
      phone,
      email,
      delivery,
    })

    console.log(newPurchase)

    if (newPurchase) {
      res.render('alert', {
        style: 'alert',

        data: {
          link: '/purchase-list',
          title: 'Успішне виконання дії',
          info: 'Товар успішно оновлено',
        },
      })
    } else {
      res.render('alert', {
        style: 'alert',
        component: ['button', 'heading'],

        data: {
          link: '/purchase-list',
          title: 'Помилка',
          info: 'Не вдалося оновити товар',
        },
      })
    }
  } else {
    res.render('alert', {
      style: 'alert',

      data: {
        link: '/purchase-list',
        title: 'Помилка',
        info: 'Не вдалося оновити товар',
      },
    })
  }
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
